#!/usr/bin/env node

/**
 * Code Captain Token Analysis Script
 *
 * Analyzes token counts across all command files using approximation methods.
 * Scans cursor, copilot, and claude-code command files.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Token approximation methods
const TokenApproximator = {
  /**
   * Simple character-based approximation (chars / 4)
   * Most basic but works for all text
   */
  characters: (text) => Math.ceil(text.length / 4),

  /**
   * Word-based approximation (words * 1.3)
   * Better for natural language content
   */
  words: (text) => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return Math.ceil(words.length * 1.3);
  },

  /**
   * Enhanced approximation considering markdown and code
   * Accounts for formatting tokens
   */
  enhanced: (text) => {
    // Count basic words
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    let tokens = words.length;

    // Add extra tokens for markdown formatting
    tokens += (text.match(/[#*`_\[\]()]/g) || []).length * 0.2;

    // Add extra tokens for code blocks
    tokens += (text.match(/```/g) || []).length * 2;

    // Add extra tokens for longer words (technical terms)
    const longWords = words.filter((word) => word.length > 8);
    tokens += longWords.length * 0.5;

    return Math.ceil(tokens * 1.25);
  },
};

class CommandAnalyzer {
  constructor() {
    this.results = {
      platforms: {},
      totals: {
        files: 0,
        characters: 0,
        approximateTokens: 0,
      },
      summary: [],
    };
  }

  /**
   * Analyze all command files across platforms
   */
  async analyze() {
    console.log("🔍 Analyzing Code Captain command token counts...\n");

    const platforms = [
      { name: "cursor", path: "cursor/commands", pattern: "*.md" },
      { name: "copilot", path: "copilot/prompts", pattern: "*.prompt.md" },
      { name: "claude-code", path: "claude-code/commands", pattern: "*.md" },
    ];

    for (const platform of platforms) {
      await this.analyzePlatform(platform);
    }

    this.generateSummary();
    this.displayResults();
  }

  /**
   * Analyze files for a specific platform
   */
  async analyzePlatform(platform) {
    const projectRoot = path.dirname(__dirname);
    const fullPath = path.join(projectRoot, platform.path);

    if (!fs.existsSync(fullPath)) {
      console.log(
        `⚠️  Platform ${platform.name} path not found: ${platform.path}`
      );
      return;
    }

    const files = this.getFiles(fullPath, platform.pattern);

    this.results.platforms[platform.name] = {
      path: platform.path,
      files: [],
      totals: {
        files: files.length,
        characters: 0,
        tokens: {
          characters: 0,
          words: 0,
          enhanced: 0,
        },
      },
    };

    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const content = fs.readFileSync(filePath, "utf8");

      const fileAnalysis = {
        name: file,
        size: content.length,
        tokens: {
          characters: TokenApproximator.characters(content),
          words: TokenApproximator.words(content),
          enhanced: TokenApproximator.enhanced(content),
        },
      };

      this.results.platforms[platform.name].files.push(fileAnalysis);
      this.results.platforms[platform.name].totals.characters += content.length;
      this.results.platforms[platform.name].totals.tokens.characters +=
        fileAnalysis.tokens.characters;
      this.results.platforms[platform.name].totals.tokens.words +=
        fileAnalysis.tokens.words;
      this.results.platforms[platform.name].totals.tokens.enhanced +=
        fileAnalysis.tokens.enhanced;
    }
  }

  /**
   * Get files matching pattern in directory (recursive)
   */
  getFiles(dir, pattern) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      return entries
        .flatMap((entry) => {
          if (entry.isDirectory()) {
            // Recursively scan subdirectories
            return this.getFiles(path.join(dir, entry.name), pattern).map(
              (file) => path.join(entry.name, file)
            );
          } else if (entry.isFile()) {
            // Apply pattern filtering to files
            const name = entry.name;
            if (pattern === "*.md" && name.endsWith(".md")) return [name];
            if (pattern === "*.prompt.md" && name.endsWith(".prompt.md"))
              return [name];
            if (pattern !== "*.md" && pattern !== "*.prompt.md") return [name];
            return [];
          }
          return [];
        })
        .sort();
    } catch (error) {
      console.log(`⚠️  Error reading directory ${dir}: ${error.message}`);
      return [];
    }
  }

  /**
   * Generate summary statistics
   */
  generateSummary() {
    let totalFiles = 0;
    let totalCharacters = 0;
    let totalTokensEnhanced = 0;

    for (const [platformName, platform] of Object.entries(
      this.results.platforms
    )) {
      totalFiles += platform.totals.files;
      totalCharacters += platform.totals.characters;
      totalTokensEnhanced += platform.totals.tokens.enhanced;

      this.results.summary.push({
        platform: platformName,
        files: platform.totals.files,
        characters: platform.totals.characters,
        tokens: platform.totals.tokens.enhanced,
        avgTokensPerFile:
          platform.totals.files > 0
            ? Math.round(
                platform.totals.tokens.enhanced / platform.totals.files
              )
            : 0,
      });
    }

    this.results.totals = {
      files: totalFiles,
      characters: totalCharacters,
      approximateTokens: totalTokensEnhanced,
    };
  }

  /**
   * Display comprehensive results
   */
  displayResults() {
    console.log("📊 CODE CAPTAIN TOKEN ANALYSIS RESULTS\n");
    console.log("=".repeat(50));

    // Platform summary
    console.log("\n🏗️  PLATFORM SUMMARY");
    console.log("-".repeat(70));
    console.log(
      sprintf(
        "%-20s %8s %12s %12s %12s",
        "Platform",
        "Files",
        "Characters",
        "Tokens",
        "Avg/File"
      )
    );
    console.log("-".repeat(70));

    this.results.summary
      .sort((a, b) => b.tokens - a.tokens)
      .forEach((platform) => {
        console.log(
          sprintf(
            "%-20s %8d %12s %12s %12d",
            platform.platform,
            platform.files,
            this.formatNumber(platform.characters),
            this.formatNumber(platform.tokens),
            platform.avgTokensPerFile
          )
        );
      });

    // Grand totals
    console.log("-".repeat(70));
    console.log(
      sprintf(
        "%-20s %8d %12s %12s %12s",
        "TOTAL",
        this.results.totals.files,
        this.formatNumber(this.results.totals.characters),
        this.formatNumber(this.results.totals.approximateTokens),
        Math.round(
          this.results.totals.approximateTokens / this.results.totals.files
        )
      )
    );

    // Detailed breakdown for largest platforms
    console.log("\n📋 DETAILED BREAKDOWN (Top 3 Platforms)\n");

    const topPlatforms = this.results.summary
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 3);

    topPlatforms.forEach((platformSummary) => {
      const platform = this.results.platforms[platformSummary.platform];
      console.log(
        `\n${platformSummary.platform.toUpperCase()} (${platform.path})`
      );
      console.log("-".repeat(50));

      platform.files
        .sort((a, b) => b.tokens.enhanced - a.tokens.enhanced)
        .forEach((file) => {
          console.log(
            sprintf(
              "  %-30s %8s tokens (%s chars)",
              file.name,
              this.formatNumber(file.tokens.enhanced),
              this.formatNumber(file.size)
            )
          );
        });
    });

    // Cost estimation
    console.log("\n💰 ESTIMATED COSTS (Approximation)");
    console.log("-".repeat(50));
    console.log(
      `Total tokens: ~${this.formatNumber(
        this.results.totals.approximateTokens
      )}`
    );
    console.log(
      `OpenAI GPT-4: ~$${(
        this.results.totals.approximateTokens * 0.00003
      ).toFixed(2)}`
    );
    console.log(
      `Anthropic Claude: ~$${(
        this.results.totals.approximateTokens * 0.000015
      ).toFixed(2)}`
    );
    console.log(
      `\n⚠️  Note: These are approximations only. Actual token counts may vary significantly.`
    );

    // Recommendations
    console.log("\n🎯 RECOMMENDATIONS");
    console.log("-".repeat(50));
    if (this.results.totals.approximateTokens > 50000) {
      console.log("• Consider command optimization for high-token files");
      console.log("• Monitor actual usage costs vs these estimates");
    }
    if (this.results.summary.some((p) => p.avgTokensPerFile > 2000)) {
      console.log(
        "• Some commands are quite large - consider breaking into smaller components"
      );
    }
    console.log(
      "• These approximations are suitable for planning and comparison purposes"
    );
    console.log(
      "• For production billing, use actual tokenizer APIs when available"
    );
  }

  /**
   * Format numbers with commas
   */
  formatNumber(num) {
    return num.toLocaleString();
  }

  /**
   * Generate comprehensive markdown report
   */
  generateMarkdownReport() {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toLocaleTimeString();

    let markdown = `# Code Captain Token Analysis Report

**Generated:** ${dateStr} at ${timeStr}  
**Total Files Analyzed:** ${this.results.totals.files}  
**Total Characters:** ${this.formatNumber(this.results.totals.characters)}  
**Estimated Tokens:** ${this.formatNumber(
      this.results.totals.approximateTokens
    )}  

---

## 📊 Executive Summary

This report analyzes token counts across all Code Captain command files using enhanced approximation methods that account for markdown formatting, code blocks, and technical terminology.

**Key Metrics:**
- **${this.results.totals.files} total command files** across ${
      Object.keys(this.results.platforms).length
    } platforms
- **~${this.formatNumber(
      this.results.totals.approximateTokens
    )} estimated tokens** total
- **${Math.round(
      this.results.totals.approximateTokens / this.results.totals.files
    )} average tokens per file**

**Cost Estimates:**
- OpenAI GPT-4: ~$${(this.results.totals.approximateTokens * 0.00003).toFixed(
      2
    )}
- Anthropic Claude: ~$${(
      this.results.totals.approximateTokens * 0.000015
    ).toFixed(2)}

---

## 🏗️ Platform Summary

| Platform | Files | Characters | Estimated Tokens | Avg Tokens/File |
|----------|-------|------------|------------------|-----------------|
`;

    // Add platform summary rows sorted by token count
    this.results.summary
      .sort((a, b) => b.tokens - a.tokens)
      .forEach((platform) => {
        markdown += `| ${platform.platform} | ${
          platform.files
        } | ${this.formatNumber(platform.characters)} | ${this.formatNumber(
          platform.tokens
        )} | ${platform.avgTokensPerFile} |\n`;
      });

    markdown += `| **TOTAL** | **${
      this.results.totals.files
    }** | **${this.formatNumber(
      this.results.totals.characters
    )}** | **${this.formatNumber(
      this.results.totals.approximateTokens
    )}** | **${Math.round(
      this.results.totals.approximateTokens / this.results.totals.files
    )}** |

---

## 📋 Detailed Platform Breakdown

`;

    // Add detailed breakdown for each platform
    const sortedPlatforms = this.results.summary.sort(
      (a, b) => b.tokens - a.tokens
    );

    sortedPlatforms.forEach((platformSummary) => {
      const platform = this.results.platforms[platformSummary.platform];
      markdown += `### ${
        platformSummary.platform.charAt(0).toUpperCase() +
        platformSummary.platform.slice(1)
      }

**Path:** \`${platform.path}\`  
**Files:** ${platform.totals.files}  
**Total Tokens:** ${this.formatNumber(platform.totals.tokens.enhanced)}  

| File | Size (chars) | Estimated Tokens |
|------|--------------|------------------|
`;

      platform.files
        .sort((a, b) => b.tokens.enhanced - a.tokens.enhanced)
        .forEach((file) => {
          markdown += `| \`${file.name}\` | ${this.formatNumber(
            file.size
          )} | ${this.formatNumber(file.tokens.enhanced)} |\n`;
        });

      markdown += "\n";
    });

    markdown += `---

## 💰 Cost Analysis

### Token Distribution
`;

    // Add a simple text chart showing token distribution
    const maxTokens = Math.max(...this.results.summary.map((p) => p.tokens));

    this.results.summary
      .sort((a, b) => b.tokens - a.tokens)
      .forEach((platform) => {
        const barLength = Math.round((platform.tokens / maxTokens) * 40);
        const bar = "█".repeat(barLength) + "░".repeat(40 - barLength);
        markdown += `**${platform.platform.padEnd(
          18
        )}** \`${bar}\` ${this.formatNumber(platform.tokens)} tokens\n`;
      });

    markdown += `
### Estimated Costs per Platform

| Platform | Tokens | GPT-4 Cost | Claude Cost |
|----------|--------|------------|-------------|
`;

    this.results.summary
      .sort((a, b) => b.tokens - a.tokens)
      .forEach((platform) => {
        const gpt4Cost = (platform.tokens * 0.00003).toFixed(2);
        const claudeCost = (platform.tokens * 0.000015).toFixed(2);
        markdown += `| ${platform.platform} | ${this.formatNumber(
          platform.tokens
        )} | $${gpt4Cost} | $${claudeCost} |\n`;
      });

    markdown += `
---

## 🎯 Analysis & Recommendations

### File Size Distribution
`;

    // Categorize files by size
    const allFiles = [];
    Object.values(this.results.platforms).forEach((platform) => {
      platform.files.forEach((file) => {
        allFiles.push({
          name: file.name,
          platform: platform.path,
          tokens: file.tokens.enhanced,
        });
      });
    });

    const large = allFiles.filter((f) => f.tokens > 3000);
    const medium = allFiles.filter((f) => f.tokens >= 1500 && f.tokens <= 3000);
    const small = allFiles.filter((f) => f.tokens < 1500);

    markdown += `
- **Large files (>3000 tokens):** ${large.length} files
- **Medium files (1500-3000 tokens):** ${medium.length} files  
- **Small files (<1500 tokens):** ${small.length} files

### Top 10 Largest Files

| Rank | File | Platform | Tokens |
|------|------|----------|--------|
`;

    allFiles
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 10)
      .forEach((file, index) => {
        markdown += `| ${index + 1} | \`${file.name}\` | ${
          file.platform
        } | ${this.formatNumber(file.tokens)} |\n`;
      });

    markdown += `
### Recommendations

`;

    if (this.results.totals.approximateTokens > 50000) {
      markdown += `- ⚠️ **High token count detected** - Consider optimizing larger command files
- 💰 **Monitor costs** - With ${this.formatNumber(
        this.results.totals.approximateTokens
      )} tokens, usage costs should be tracked
`;
    }

    if (large.length > 5) {
      markdown += `- 📝 **Large file optimization** - ${large.length} files exceed 3000 tokens, consider breaking into smaller components
`;
    }

    if (this.results.summary.some((p) => p.avgTokensPerFile > 2500)) {
      markdown += `- 🔧 **Platform optimization** - Some platforms have high average tokens per file, review for consolidation opportunities
`;
    }

    markdown += `- ✅ **Approximation accuracy** - These estimates are suitable for planning and comparison purposes
- 🔄 **Regular monitoring** - Re-run this analysis when adding new commands to track growth
- 📊 **Usage tracking** - For production billing, supplement with actual tokenizer APIs when available

---

## 📖 Methodology

**Token Approximation Method:** Enhanced word counting with adjustments for:
- Markdown formatting tokens (\`#\`, \`*\`, \`\`\`\`, etc.)
- Code block overhead
- Technical terminology (longer words)
- Base multiplier of 1.25x for LLM-specific formatting

**Platforms Analyzed:**
${Object.entries(this.results.platforms)
  .map(([name, platform]) => `- **${name}**: \`${platform.path}\``)
  .join("\n")}

**Files Scanned:** ${
      this.results.totals.files
    } total markdown files across all platforms

---

*Generated by Code Captain Token Analysis Script v1.0*
`;

    return markdown;
  }
}

/**
 * Simple sprintf implementation for formatting
 */
function sprintf(format, ...args) {
  let i = 0;
  return format.replace(/%-?(\d+)?[sd]/g, (match) => {
    const arg = args[i++];
    const isLeftAligned = match.includes("-");
    const widthMatch = match.match(/(\d+)/);
    const width = widthMatch ? parseInt(widthMatch[1]) : 0;

    let result;
    if (match.includes("s")) {
      result = String(arg);
    } else if (match.includes("d")) {
      result = String(parseInt(arg) || 0);
    } else {
      result = String(arg);
    }

    if (width > 0) {
      if (isLeftAligned) {
        result = result.padEnd(width);
      } else {
        result = result.padStart(width);
      }
    }

    return result;
  });
}

// Main execution
async function main() {
  try {
    const analyzer = new CommandAnalyzer();
    await analyzer.analyze();

    // Save results to markdown file
    const projectRoot = path.dirname(__dirname);
    const outputFile = path.join(
      projectRoot,
      ".code-captain",
      "docs",
      "token-analysis.md"
    );
    const outputDir = path.dirname(outputFile);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const markdownReport = analyzer.generateMarkdownReport();
    fs.writeFileSync(outputFile, markdownReport);
    console.log(`\n💾 Detailed markdown report saved to: ${outputFile}`);
  } catch (error) {
    console.error("❌ Error during analysis:", error.message);
    process.exit(1);
  }
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { CommandAnalyzer, TokenApproximator };
