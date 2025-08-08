#!/bin/bash

# GitHub Issues Batch Creation Script
# Handles dynamic rate limiting and parallel creation
# Usage: ./create-issues-batch.sh <issues_json_file> <issue_type>

set -euo pipefail

if [ "$#" -lt 2 ]; then
    echo "Usage: $(basename "$0") <issues_json_file> <issue_type>" >&2
    exit 1
fi

ISSUES_FILE="$1"
ISSUE_TYPE="$2"  # user-story, task, subtask

# Rate limiting constants
CONTENT_LIMIT_PER_MINUTE=80
CONTENT_LIMIT_PER_HOUR=500
NORMAL_BATCH_SIZE=20
CONSERVATIVE_BATCH_SIZE=10
CRITICAL_QUOTA_THRESHOLD=100
LOW_QUOTA_THRESHOLD=200

# Logging functions
log_info() { echo "ℹ️  $1" >&2; }
log_success() { echo "✅ $1" >&2; }
log_warning() { echo "⚠️  $1" >&2; }
log_error() { echo "🚨 $1" >&2; }
log_progress() { echo "📦 $1" >&2; }

# Check if required tools are available
check_dependencies() {
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_error "jq is not installed or not in PATH"
        exit 1
    fi
    
    # Verify GitHub CLI authentication
    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI is not authenticated. Run 'gh auth login'"
        exit 1
    fi
}

# Get current rate limit status
get_rate_limit_status() {
    local rate_status
    rate_status=$(gh api rate_limit)
    
    local remaining=$(echo "$rate_status" | jq '.resources.core.remaining')
    local reset_time=$(echo "$rate_status" | jq '.resources.core.reset')
    local current_time=$(date +%s)
    local minutes_until_reset=$(( (reset_time - current_time) / 60 ))
    
    echo "$remaining $reset_time $minutes_until_reset"
}

# Determine batch strategy based on rate limits
calculate_batch_strategy() {
    local remaining=$1
    local total_issues=$2
    
    log_info "Rate Limit Assessment:"
    log_info "  Available quota: $remaining requests"
    log_info "  Issues to create: $total_issues"
    
    if [ "$remaining" -lt "$total_issues" ]; then
        log_error "INSUFFICIENT QUOTA: Need $total_issues, have $remaining"
        log_error "Wait for rate limit reset or reduce issue count"
        return 1
    elif [ "$remaining" -lt "$CRITICAL_QUOTA_THRESHOLD" ]; then
        echo "critical"
    elif [ "$remaining" -lt "$LOW_QUOTA_THRESHOLD" ]; then
        echo "conservative"
    else
        echo "normal"
    fi
}

# Create a single issue with retry logic
create_single_issue() {
    local issue_data="$1"
    local max_retries=3
    local retry_count=0
    
    local title=$(echo "$issue_data" | jq -r '.title')
    local body=$(echo "$issue_data" | jq -r '.body')
    local labels=$(echo "$issue_data" | jq -r '.labels | join(",")')
    
    while [ $retry_count -lt $max_retries ]; do
        local start_time=$(date +%s)
        
        local result
        result=$(gh issue create \
            --title "$title" \
            --body "$body" \
            --label "$labels" 2>&1)
        
        local exit_code=$?
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        if [ $exit_code -eq 0 ]; then
            local issue_number=$(echo "$result" | grep -o '[0-9]*$')
            log_success "Created issue #$issue_number (${duration}s): $title"
            echo "$issue_number"
            return 0
        elif echo "$result" | grep -q "rate limit"; then
            log_warning "Rate limited - waiting before retry..."
            sleep $((60 + RANDOM % 30))  # 60-90 second wait
            retry_count=$((retry_count + 1))
        else
            retry_count=$((retry_count + 1))
            log_warning "Attempt $retry_count failed (${duration}s): $result"
            sleep $((retry_count * 3))  # Exponential backoff
        fi
    done
    
    log_error "FAILED to create issue after $max_retries attempts: $title"
    return 1
}

# Create issues in batches with rate limiting
create_issues_batch() {
    local issues_array=("$@")
    local total_issues=${#issues_array[@]}
    local processed=0
    local created_issues=()
    
    log_progress "Creating $total_issues $ISSUE_TYPE issues with dynamic rate limiting..."
    
    while [ $processed -lt $total_issues ]; do
        # Get current rate limit status
        local rate_info
        rate_info=$(get_rate_limit_status)
        local remaining=$(echo "$rate_info" | cut -d' ' -f1)
        local minutes_until_reset=$(echo "$rate_info" | cut -d' ' -f3)
        
        log_info "Pre-batch check: $remaining remaining, ${minutes_until_reset}m until reset"
        
        # Calculate batch strategy
        local strategy
        strategy=$(calculate_batch_strategy "$remaining" $((total_issues - processed)))
        if [ $? -ne 0 ]; then
            exit 1
        fi
        
        # Determine batch size based on strategy
        local current_batch_size
        case $strategy in
            "critical")
                log_warning "CRITICAL quota - waiting 5 minutes for reset..."
                sleep 300
                continue
                ;;
            "conservative")
                current_batch_size=$CONSERVATIVE_BATCH_SIZE
                log_info "Using conservative batch size: $current_batch_size"
                ;;
            "normal")
                current_batch_size=$NORMAL_BATCH_SIZE
                log_info "Using normal batch size: $current_batch_size"
                ;;
        esac
        
        # Don't exceed remaining issues
        local remaining_issues=$((total_issues - processed))
        if [ $current_batch_size -gt $remaining_issues ]; then
            current_batch_size=$remaining_issues
        fi
        
        log_progress "Creating batch of $current_batch_size issues..."
        log_progress "Progress: $processed/$total_issues ($(( processed * 100 / total_issues ))%)"
        
        # Create batch in parallel
        local batch_start_time=$(date +%s)
        local batch_pids=()
        local batch_results=()
        
        for ((i=0; i<current_batch_size; i++)); do
            local issue_index=$((processed + i))
            local issue_data="${issues_array[$issue_index]}"
            
            {
                local issue_number
                issue_number=$(create_single_issue "$issue_data")
                echo "$issue_number" > "/tmp/issue_result_$$_$i"
            } &
            batch_pids+=($!)
        done
        
        # Wait for batch completion
        local batch_failures=0
        for i in "${!batch_pids[@]}"; do
            local pid=${batch_pids[$i]}
            if wait "$pid"; then
                local issue_number
                issue_number=$(cat "/tmp/issue_result_$$_$i")
                created_issues+=("$issue_number")
                rm -f "/tmp/issue_result_$$_$i"
            else
                batch_failures=$((batch_failures + 1))
                rm -f "/tmp/issue_result_$$_$i"
            fi
        done
        
        local batch_end_time=$(date +%s)
        local batch_duration=$((batch_end_time - batch_start_time))
        
        if [ $batch_failures -gt 0 ]; then
            log_error "$batch_failures issues failed in this batch"
            log_error "STOPPING - Manual intervention required"
            exit 1
        fi
        
        log_success "Batch completed in ${batch_duration}s"
        processed=$((processed + current_batch_size))
        
        # Smart cooldown between batches
        if [ $processed -lt $total_issues ]; then
            if [ "$strategy" = "conservative" ]; then
                log_info "Conservative cooldown (90s)..."
                sleep 90
            else
                log_info "Standard cooldown (45s)..."
                sleep 45
            fi
        fi
    done
    
    log_success "All $total_issues $ISSUE_TYPE issues created successfully"
    
    # Output created issue numbers (one per line)
    printf '%s\n' "${created_issues[@]}"
}

# Main execution
main() {
    check_dependencies
    
    if [ ! -f "$ISSUES_FILE" ]; then
        log_error "Issues file not found: $ISSUES_FILE"
        exit 1
    fi
    
    # Read issues from JSON file
    local issues_json
    issues_json=$(cat "$ISSUES_FILE")
    
    # Convert JSON array to bash array
    local issues_array=()
    local issue_count
    issue_count=$(echo "$issues_json" | jq '. | length')
    
    for ((i=0; i<issue_count; i++)); do
        local issue_data
        issue_data=$(echo "$issues_json" | jq ".[$i]")
        issues_array+=("$issue_data")
    done
    
    # Create issues in batches
    create_issues_batch "${issues_array[@]}"
}

# Run main function
main "$@"