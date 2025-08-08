#!/usr/bin/env node

import boxen from 'boxen';
import chalk from 'chalk';
import { spawn } from 'cross-spawn';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import fetch from 'node-fetch';
import ora from 'ora';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CodeCaptainInstaller {
    constructor() {
        // Determine if we're running from npm package or development
        const packageRoot = path.resolve(__dirname, '..');
        const isNpmPackage = fs.existsSync(path.join(packageRoot, 'package.json'));

        this.config = {
            repoUrl: 'https://github.com/devobsessed/code-captain',
            baseUrl: 'https://raw.githubusercontent.com/devobsessed/code-captain/main',
            version: 'main',
            // Default to local source when running from npm package
            localSource: process.env.CC_LOCAL_SOURCE || (isNpmPackage ? packageRoot : null),
            versionFile: '.code-captain/.version',
            manifestFile: '.code-captain/.manifest.json'
        };

        this.ides = {
            cursor: {
                name: 'Cursor',
                description: 'AI-first code editor with built-in AI agent capabilities',
                details: 'Uses .code-captain/ structure + .cursor/rules/cc.mdc'
            },
            copilot: {
                name: 'VS Code with GitHub Copilot',
                description: 'Visual Studio Code with GitHub Copilot extension',
                details: 'Uses .github/chatmodes/ + .github/prompts/ + .code-captain/docs/'
            },
            windsurf: {
                name: 'Windsurf',
                description: 'Codeium\'s AI-powered development environment',
                details: 'Uses windsurf/rules/ for custom workflows'
            },
            claude: {
                name: 'Claude Code',
                description: 'Direct integration with Claude for development workflows',
                details: 'Uses .code-captain/claude/ structure with agents and commands'
            }
        };
    }

    // Display welcome banner
    async showWelcome() {
        const version = await this.getPackageVersion();
        const banner = boxen(
            chalk.bold.green(`Code Captain ${version}`) + '\n' +
            chalk.gray('AI Development Agent System') + '\n' +
            chalk.dim('brought to you by DevObsessed') + '\n' +
            chalk.dim.blue('https://www.devobsessed.com/') + '\n\n' +
            chalk.blue('⚓ Interactive Installation Wizard'),
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'green',
                textAlignment: 'center'
            }
        );

        console.log(banner);
    }

    // Check system compatibility
    async checkCompatibility() {
        const spinner = ora('Checking system compatibility...').start();

        try {
            // Check Node.js version
            const nodeVersion = process.version;
            const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

            if (majorVersion < 16) {
                spinner.fail(`Node.js ${nodeVersion} detected. Requires Node.js 16 or higher.`);
                console.log(chalk.yellow('\n📦 Please update Node.js:'));
                console.log(chalk.blue('   Visit: https://nodejs.org/'));
                process.exit(1);
            }

            // Check if we're in a Git repository
            const isGitRepo = await fs.pathExists('.git');

            // Check for existing Code Captain installations
            const existingInstallations = await this.detectExistingInstallations();

            spinner.succeed('System compatibility check passed');

            return {
                nodeVersion,
                isGitRepo,
                existingInstallations
            };
        } catch (error) {
            spinner.fail('Compatibility check failed');
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    }

    // Detect existing Code Captain installations
    async detectExistingInstallations() {
        const installations = [];

        // Define all possible Code Captain paths
        const pathsToCheck = {
            'Code Captain Core': ['.code-captain/'],
            'Cursor Integration': ['.cursor/rules/cc.mdc', '.cursor/rules/'],
            'Copilot Integration': ['.github/chatmodes/', '.github/prompts/'],
            'Windsurf Integration': ['windsurf/rules/', 'windsurf/workflows/'],
            'Claude Integration': ['.code-captain/claude/', 'claude-code/', '.claude/'],
            'Legacy Structure': ['cursor/', 'copilot/', 'windsurf/']
        };

        for (const [name, paths] of Object.entries(pathsToCheck)) {
            for (const path of paths) {
                if (await fs.pathExists(path)) {
                    installations.push(name);
                    break; // Only add each installation type once
                }
            }
        }

        return [...new Set(installations)]; // Remove duplicates
    }

    // Get the current package version
    async getPackageVersion() {
        try {
            if (this.config.localSource) {
                const packageJsonPath = path.join(this.config.localSource, 'package.json');
                if (await fs.pathExists(packageJsonPath)) {
                    const packageJson = await fs.readJson(packageJsonPath);
                    return packageJson.version || 'unknown';
                }
            }
            return 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }

    // Calculate SHA256 hash of a file
    async calculateFileHash(filePath) {
        try {
            const crypto = await import('crypto');
            const content = await fs.readFile(filePath, 'utf8');
            return crypto.default.createHash('sha256').update(content).digest('hex');
        } catch (error) {
            return null;
        }
    }

    // Get remote manifest with file versions/hashes
    async getRemoteManifest() {
        try {
            const manifestUrl = `${this.config.baseUrl}/manifest.json`;

            if (this.config.localSource) {
                const localManifestPath = path.join(this.config.localSource, 'manifest.json');
                if (await fs.pathExists(localManifestPath)) {
                    const content = await fs.readFile(localManifestPath, 'utf8');
                    return JSON.parse(content);
                }
            } else {
                const response = await fetch(manifestUrl);
                if (response.ok) {
                    return await response.json();
                }
            }

            // Fallback: generate manifest from current commit
            return await this.generateFallbackManifest();
        } catch (error) {
            console.warn(chalk.yellow('Warning: Could not fetch remote manifest, using fallback'));
            return await this.generateFallbackManifest();
        }
    }

    // Generate fallback manifest if remote manifest doesn't exist
    async generateFallbackManifest() {
        const timestamp = new Date().toISOString();
        return {
            version: this.config.version,
            timestamp,
            commit: 'unknown',
            files: {} // Will be populated as files are downloaded
        };
    }

    // Get local manifest if it exists
    async getLocalManifest() {
        try {
            if (await fs.pathExists(this.config.manifestFile)) {
                const content = await fs.readFile(this.config.manifestFile, 'utf8');
                return JSON.parse(content);
            }
        } catch (error) {
            console.warn(chalk.yellow('Warning: Could not read local manifest'));
        }
        return null;
    }

    // Compare manifests and detect changes
    async detectChanges(selectedIDE) {
        const spinner = ora('Analyzing file changes...').start();

        try {
            const [remoteManifest, localManifest] = await Promise.all([
                this.getRemoteManifest(),
                this.getLocalManifest()
            ]);

            if (!localManifest) {
                spinner.succeed('No previous manifest found - treating as fresh installation');

                // Get proper version information for first install
                const currentVersion = this.config.localSource ? await this.getPackageVersion() : 'unknown';
                const availableVersion = remoteManifest.version;

                return {
                    isFirstInstall: true,
                    localVersion: currentVersion,
                    remoteVersion: availableVersion,
                    changes: [],
                    newFiles: [],
                    recommendations: ['Full installation recommended (no change tracking available)']
                };
            }

            const files = this.getIDEFiles(selectedIDE);
            const changes = [];
            const newFiles = [];
            let filesAnalyzed = 0;

            for (const file of files) {
                const remotePath = file.source;
                const localPath = file.target;

                filesAnalyzed++;
                spinner.text = `Analyzing changes... (${filesAnalyzed}/${files.length})`;

                // Check if file exists locally
                const localExists = await fs.pathExists(localPath);
                const remoteFileInfo = remoteManifest.files?.[remotePath];

                if (!localExists) {
                    newFiles.push({
                        file: remotePath,
                        component: file.component,
                        reason: 'File does not exist locally'
                    });
                    continue;
                }

                // Calculate actual hash of local file
                const localFileHash = await this.calculateFileHash(localPath);

                if (!localFileHash) {
                    // Can't read local file - treat as needs update
                    changes.push({
                        file: remotePath,
                        component: file.component,
                        reason: 'Unable to read local file'
                    });
                    continue;
                }

                // Compare with remote hash
                if (remoteFileInfo && remoteFileInfo.hash) {
                    const remoteHash = remoteFileInfo.hash.replace('sha256:', '');

                    if (localFileHash !== remoteHash) {
                        changes.push({
                            file: remotePath,
                            component: file.component,
                            localVersion: localManifest.files?.[remotePath]?.version || 'unknown',
                            remoteVersion: remoteFileInfo.version || 'latest',
                            reason: 'File content has changed',
                            localHash: localFileHash.substring(0, 8),
                            remoteHash: remoteHash.substring(0, 8)
                        });
                    }
                } else {
                    // No remote file info - treat as new in remote
                    newFiles.push({
                        file: remotePath,
                        component: file.component,
                        reason: 'New file in remote repository'
                    });
                }
            }

            const recommendations = this.generateUpdateRecommendations(changes, newFiles);

            spinner.succeed(`Found ${changes.length} updated files, ${newFiles.length} new files`);

            // Get proper version information
            const currentVersion = this.config.localSource ? await this.getPackageVersion() : 'unknown';
            const availableVersion = remoteManifest.version;

            return {
                isFirstInstall: false,
                localVersion: currentVersion,
                remoteVersion: availableVersion,
                changes,
                newFiles,
                recommendations
            };

        } catch (error) {
            spinner.fail('Could not analyze changes');
            return {
                isFirstInstall: false,
                changes: [],
                newFiles: [],
                recommendations: ['Unable to detect changes - consider full update'],
                error: error.message
            };
        }
    }

    // Generate smart update recommendations
    generateUpdateRecommendations(changes, newFiles) {
        const recommendations = [];
        const changedComponents = new Set();

        // Collect components with changes
        [...changes, ...newFiles].forEach(item => {
            if (item.component) {
                changedComponents.add(item.component);
            }
        });

        if (changedComponents.size === 0) {
            recommendations.push('✅ All files are up to date!');
        } else {
            recommendations.push(`📦 Recommended updates: ${Array.from(changedComponents).join(', ')}`);

            // Specific recommendations
            if (changedComponents.has('commands')) {
                recommendations.push('🚀 Commands updated - new features or bug fixes available');
            }
            if (changedComponents.has('rules')) {
                recommendations.push('⚙️ Rules updated - improved AI agent behavior');
            }
            if (changedComponents.has('docs')) {
                recommendations.push('📚 Documentation updated - check for new best practices');
            }
        }

        return recommendations;
    }

    // Save manifest after successful installation
    async saveManifest(remoteManifest, installedFiles) {
        try {
            const manifest = {
                ...remoteManifest,
                installedAt: new Date().toISOString(),
                files: {}
            };

            // Calculate actual hashes of installed files
            for (const file of installedFiles) {
                const localHash = await this.calculateFileHash(file.target);

                if (localHash) {
                    // Use remote file info as base, but update with actual installed hash
                    const remoteFileInfo = remoteManifest.files?.[file.source] || {};

                    manifest.files[file.source] = {
                        ...remoteFileInfo,
                        hash: `sha256:${localHash}`,
                        installedAt: new Date().toISOString(),
                        actualSize: (await fs.stat(file.target).catch(() => ({ size: 0 }))).size
                    };
                }
            }

            await fs.ensureDir(path.dirname(this.config.manifestFile));
            await fs.writeFile(this.config.manifestFile, JSON.stringify(manifest, null, 2));

            return true;
        } catch (error) {
            console.warn(chalk.yellow(`Warning: Could not save manifest: ${error.message}`));
            return false;
        }
    }

    // Auto-detect IDE preference
    detectIDE() {
        const detections = [];

        // Check for Cursor
        if (fs.pathExistsSync('.cursor') || this.commandExists('cursor')) {
            detections.push('cursor');
        }

        // Check for VS Code
        if (this.commandExists('code')) {
            detections.push('copilot');
        }

        // Check for Windsurf
        if (fs.pathExistsSync('windsurf') || this.commandExists('windsurf')) {
            detections.push('windsurf');
        }

        // Check for Claude Code
        if (fs.pathExistsSync('claude-code') || fs.pathExistsSync('.code-captain/claude') || fs.pathExistsSync('.claude')) {
            detections.push('claude');
        }

        return detections;
    }

    // Check if command exists
    commandExists(command) {
        try {
            const result = spawn.sync(command, ['--version'], {
                stdio: ['pipe', 'pipe', 'pipe'],
                timeout: 5000,
                windowsHide: true
            });
            return result.status === 0;
        } catch {
            return false;
        }
    }

    // IDE selection prompt
    async selectIDE() {
        const detected = this.detectIDE();

        console.log('\n' + chalk.bold.blue('🎯 IDE Selection'));
        console.log(chalk.gray('═'.repeat(50)));

        if (detected.length > 0) {
            console.log(chalk.green(`\n✨ Auto-detected: ${detected.map(id => this.ides[id].name).join(', ')}`));
        }

        const choices = Object.entries(this.ides).map(([key, ide]) => ({
            name: ide.name,
            value: key,
            short: ide.name
        }));

        const { selectedIDE } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedIDE',
                message: 'Which IDE/environment are you using?',
                choices: choices,
                pageSize: 6,
                default: detected.length > 0 ? detected[0] : 'cursor'
            }
        ]);

        return selectedIDE;
    }

    // Select installation components
    async selectInstallationComponents(selectedIDE, existingInstallations) {
        // First, detect what's changed
        const changeInfo = await this.detectChanges(selectedIDE);

        if (changeInfo.isFirstInstall) {
            // Fresh installation - install everything
            return {
                installAll: true,
                changeInfo
            };
        }

        console.log('\n' + chalk.bold.blue('🔍 Change Analysis'));
        console.log(chalk.gray('═'.repeat(50)));

        // Show version information
        if (changeInfo.localVersion && changeInfo.remoteVersion) {
            console.log(chalk.blue('Current version:'), changeInfo.localVersion);
            console.log(chalk.blue('Available version:'), changeInfo.remoteVersion);
        }

        // Show what's changed
        if (changeInfo.changes.length > 0) {
            console.log(chalk.yellow('\n📝 Updated Files:'));
            changeInfo.changes.forEach(change => {
                console.log(chalk.gray(`  • ${change.file} (${change.component})`));
                console.log(chalk.gray(`    ${change.reason}`));
                if (change.localHash && change.remoteHash) {
                    console.log(chalk.gray(`    Local: ${change.localHash}... → Remote: ${change.remoteHash}...`));
                }
            });
        }

        if (changeInfo.newFiles.length > 0) {
            console.log(chalk.green('\n🆕 New Files:'));
            changeInfo.newFiles.forEach(file => {
                console.log(chalk.gray(`  • ${file.file} (${file.component})`));
                console.log(chalk.gray(`    ${file.reason}`));
            });
        }

        // Show recommendations
        console.log(chalk.bold.cyan('\n💡 Recommendations:'));
        changeInfo.recommendations.forEach(rec => {
            console.log(chalk.gray(`  ${rec}`));
        });

        if (changeInfo.changes.length === 0 && changeInfo.newFiles.length === 0) {
            console.log(chalk.green('\n✨ All files are up to date!'));

            const { forceUpdate } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'forceUpdate',
                    message: 'All files are current. Force reinstall anyway?',
                    default: false
                }
            ]);

            if (!forceUpdate) {
                return {
                    skipInstall: true,
                    changeInfo
                };
            }
        }

        console.log('\n' + chalk.bold.blue('🔧 Component Selection'));
        console.log(chalk.gray('═'.repeat(50)));

        const componentChoices = this.getComponentChoices(selectedIDE);

        // Pre-select components that have changes
        const changedComponents = new Set();
        [...changeInfo.changes, ...changeInfo.newFiles].forEach(item => {
            if (item.component) {
                changedComponents.add(item.component);
            }
        });

        // Update choices to pre-select changed components
        componentChoices.forEach(choice => {
            if (changedComponents.has(choice.value)) {
                choice.checked = true;
                choice.name += chalk.yellow(' (has updates)');
            }
        });

        const { components } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'components',
                message: 'Select components to install/update:',
                choices: componentChoices,
                pageSize: 10,
                validate: (answer) => {
                    if (answer.length === 0) {
                        return 'Please select at least one component to install.';
                    }
                    return true;
                }
            }
        ]);

        const { createBackups } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'createBackups',
                message: 'Create backups of existing files before overwriting?',
                default: true
            }
        ]);

        return {
            selectedComponents: components,
            createBackups,
            installAll: false,
            changeInfo
        };
    }

    // Get component choices based on IDE
    getComponentChoices(selectedIDE) {
        const baseChoices = [
            { name: 'Core Commands', value: 'commands', checked: true },
            { name: 'Documentation & Best Practices', value: 'docs', checked: true }
        ];

        switch (selectedIDE) {
            case 'cursor':
                return [
                    ...baseChoices,
                    { name: 'Cursor Rules (.cursor/rules/cc.mdc)', value: 'rules', checked: true },
                    { name: 'GitHub Integration', value: 'github', checked: true },
                    { name: 'Azure DevOps Integration', value: 'azure', checked: true }
                ];

            case 'copilot':
                return [
                    ...baseChoices,
                    { name: 'GitHub Copilot Chatmodes', value: 'chatmodes', checked: true },
                    { name: 'GitHub Copilot Prompts', value: 'prompts', checked: true }
                ];

            case 'windsurf':
                return [
                    ...baseChoices,
                    { name: 'Windsurf Rules', value: 'rules', checked: true },
                    { name: 'Windsurf Workflows', value: 'workflows', checked: true }
                ];

            case 'claude':
                return [
                    ...baseChoices,
                    { name: 'Claude Agents', value: 'agents', checked: true },
                    { name: 'Claude Commands', value: 'claude-commands', checked: true }
                ];

            default:
                return baseChoices;
        }
    }

    // Confirmation prompt
    async confirmInstallation(selectedIDE, systemInfo, installOptions) {
        console.log('\n' + chalk.bold.yellow('📋 Installation Summary'));
        console.log(chalk.gray('═'.repeat(50)));

        const ide = this.ides[selectedIDE];
        console.log(chalk.blue('Selected IDE:'), chalk.bold(ide.name));
        console.log(chalk.blue('Description:'), ide.description);
        console.log(chalk.blue('Installation:'), ide.details);
        console.log(chalk.blue('Node.js:'), systemInfo.nodeVersion);
        console.log(chalk.blue('Git Repository:'), systemInfo.isGitRepo ? 'Yes' : 'No');

        if (systemInfo.existingInstallations.length > 0) {
            console.log(chalk.yellow('Existing installations:'), systemInfo.existingInstallations.join(', '));
        }

        if (!installOptions.installAll) {
            console.log(chalk.blue('Components to install:'), installOptions.selectedComponents.join(', '));
            console.log(chalk.blue('Create backups:'), installOptions.createBackups ? 'Yes' : 'No');

            // Show change summary
            const { changeInfo } = installOptions;
            if (changeInfo && (changeInfo.changes.length > 0 || changeInfo.newFiles.length > 0)) {
                console.log(chalk.blue('Files to update:'), `${changeInfo.changes.length} changed, ${changeInfo.newFiles.length} new`);
            }
        } else {
            console.log(chalk.blue('Installation type:'), 'Full installation (new setup)');
        }

        const { confirmed } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: 'Proceed with installation?',
                default: true
            }
        ]);

        return confirmed;
    }

    // Create backup of existing file
    async createBackup(targetPath, shouldBackup = true) {
        if (!shouldBackup) {
            return null;
        }

        if (await fs.pathExists(targetPath)) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = `${targetPath}.backup.${timestamp}`;

            try {
                await fs.copy(targetPath, backupPath);
                return backupPath;
            } catch (error) {
                console.warn(chalk.yellow(`Warning: Could not backup ${targetPath}: ${error.message}`));
                return null;
            }
        }
        return null;
    }

    // Download file from URL or local source
    async downloadFile(relativePath, targetPath, shouldBackup = true) {
        try {
            let content;

            if (this.config.localSource) {
                // Local source mode
                const localPath = path.join(this.config.localSource, relativePath);
                content = await fs.readFile(localPath, 'utf8');
            } else {
                // Remote download mode
                const url = `${this.config.baseUrl}/${relativePath}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                content = await response.text();
            }

            // Ensure target directory exists
            await fs.ensureDir(path.dirname(targetPath));

            // Create backup if file exists
            await this.createBackup(targetPath, shouldBackup);

            // Write file
            await fs.writeFile(targetPath, content);

            return true;
        } catch (error) {
            throw new Error(`Failed to download ${relativePath}: ${error.message}`);
        }
    }

    // Get IDE-specific file list
    getIDEFiles(selectedIDE, selectedComponents = null) {
        const files = [];

        // If no components specified, include all files (fresh installation)
        const includeAll = !selectedComponents;

        switch (selectedIDE) {
            case 'cursor':
                // Cursor rules
                if (includeAll || selectedComponents.includes('rules')) {
                    files.push(
                        { source: 'cursor/cc.mdc', target: '.cursor/rules/cc.mdc', component: 'rules' }
                    );
                }

                // Core commands and docs
                if (includeAll || selectedComponents.includes('commands')) {
                    files.push(
                        { source: 'cursor/cc.md', target: '.code-captain/cc.md', component: 'commands' }
                    );

                    const cursorCommands = [
                        'create-adr.md', 'create-spec.md', 'edit-spec.md', 'execute-task.md',
                        'explain-code.md', 'initialize.md', 'new-command.md', 'plan-product.md',
                        'research.md', 'status.md', 'swab.md'
                    ];

                    cursorCommands.forEach(cmd => {
                        files.push({
                            source: `cursor/commands/${cmd}`,
                            target: `.code-captain/commands/${cmd}`,
                            component: 'commands'
                        });
                    });
                }

                // GitHub integration
                if (includeAll || selectedComponents.includes('github')) {
                    const githubFiles = [
                        'integrations/github/create-github-issues.md',
                        'integrations/github/sync-github-issues.md',
                        'integrations/github/sync.md'
                    ];

                    githubFiles.forEach(file => {
                        files.push({
                            source: `cursor/${file}`,
                            target: `.code-captain/${file}`,
                            component: 'github'
                        });
                    });
                }

                // Azure DevOps integration
                if (includeAll || selectedComponents.includes('azure')) {
                    const azureFiles = [
                        'integrations/azure-devops/create-azure-work-items.md',
                        'integrations/azure-devops/sync-azure-work-items.md'
                    ];

                    azureFiles.forEach(file => {
                        files.push({
                            source: `cursor/${file}`,
                            target: `.code-captain/${file}`,
                            component: 'azure'
                        });
                    });
                }

                // Documentation
                if (includeAll || selectedComponents.includes('docs')) {
                    files.push({
                        source: 'cursor/docs/best-practices.md',
                        target: '.code-captain/docs/best-practices.md',
                        component: 'docs'
                    });
                }

                break;

            case 'copilot':
                // Chatmodes
                if (includeAll || selectedComponents.includes('chatmodes')) {
                    files.push(
                        { source: 'copilot/chatmodes/Code Captain.chatmode.md', target: '.github/chatmodes/Code Captain.chatmode.md', component: 'chatmodes' }
                    );
                }

                // Prompts
                if (includeAll || selectedComponents.includes('prompts')) {
                    const copilotPrompts = [
                        'create-adr.prompt.md', 'create-spec.prompt.md', 'edit-spec.prompt.md',
                        'execute-task.prompt.md', 'explain-code.prompt.md', 'initialize.prompt.md',
                        'new-command.prompt.md', 'plan-product.prompt.md', 'research.prompt.md',
                        'status.prompt.md', 'swab.prompt.md'
                    ];

                    copilotPrompts.forEach(prompt => {
                        files.push({
                            source: `copilot/prompts/${prompt}`,
                            target: `.github/prompts/${prompt}`,
                            component: 'prompts'
                        });
                    });
                }

                // Documentation
                if (includeAll || selectedComponents.includes('docs')) {
                    files.push({
                        source: 'copilot/docs/best-practices.md',
                        target: '.code-captain/docs/best-practices.md',
                        component: 'docs'
                    });
                }

                break;

            case 'windsurf':
                // Rules
                if (includeAll || selectedComponents.includes('rules')) {
                    files.push(
                        { source: 'windsurf/rules/cc.md', target: 'windsurf/rules/cc.md', component: 'rules' }
                    );
                }

                // Workflows
                if (includeAll || selectedComponents.includes('workflows')) {
                    const windsurfWorkflows = [
                        'create-adr.md', 'create-spec.md', 'edit-spec.md', 'execute-task.md',
                        'explain-code.md', 'initialize.md', 'new-command.md', 'status.md'
                    ];

                    windsurfWorkflows.forEach(workflow => {
                        files.push({
                            source: `windsurf/workflows/${workflow}`,
                            target: `windsurf/workflows/${workflow}`,
                            component: 'workflows'
                        });
                    });
                }

                break;

            case 'claude':
                // Claude agents
                if (includeAll || selectedComponents.includes('agents')) {
                    const claudeAgents = [
                        'code-captain.md', 'spec-generator.md', 'spec-orchestrator.md',
                        'story-creator.md', 'tech-spec.md'
                    ];

                    claudeAgents.forEach(agent => {
                        files.push({
                            source: `claude-code/agents/${agent}`,
                            target: `.code-captain/claude/agents/${agent}`,
                            component: 'agents'
                        });
                    });
                }

                // Claude commands
                if (includeAll || selectedComponents.includes('claude-commands')) {
                    const claudeCommands = [
                        'cc-create-spec.md', 'cc-initialize.md'
                    ];

                    claudeCommands.forEach(command => {
                        files.push({
                            source: `claude-code/commands/${command}`,
                            target: `.code-captain/claude/commands/${command}`,
                            component: 'claude-commands'
                        });
                    });
                }

                break;
        }

        return files;
    }

    // Install files for selected IDE
    async installFiles(selectedIDE, installOptions) {
        const selectedComponents = installOptions.installAll ? null : installOptions.selectedComponents;
        const files = this.getIDEFiles(selectedIDE, selectedComponents);
        const spinner = ora(`Installing ${this.ides[selectedIDE].name} integration...`).start();

        try {
            let completed = 0;
            const backupPaths = [];

            for (const file of files) {
                const shouldBackup = installOptions.createBackups !== false; // Default to true if not specified
                await this.downloadFile(file.source, file.target, shouldBackup);
                completed++;
                spinner.text = `Installing files... (${completed}/${files.length})`;
            }

            // Save manifest for future change detection
            if (installOptions.changeInfo) {
                const remoteManifest = await this.getRemoteManifest();
                await this.saveManifest(remoteManifest, files);
            }

            spinner.succeed(`${this.ides[selectedIDE].name} integration installed successfully!`);

            return {
                totalFiles: files.length,
                targetDir: selectedIDE === 'copilot' ? '.github + .code-captain/docs' :
                    selectedIDE === 'windsurf' ? 'windsurf' :
                        selectedIDE === 'claude' ? '.code-captain/claude' : '.code-captain (+ .cursor/rules)',
                components: installOptions.installAll ? 'All components' : installOptions.selectedComponents.join(', '),
                changesDetected: installOptions.changeInfo && (installOptions.changeInfo.changes.length > 0 || installOptions.changeInfo.newFiles.length > 0)
            };
        } catch (error) {
            spinner.fail('Installation failed');
            throw error;
        }
    }

    // Show post-installation instructions
    showInstructions(selectedIDE, installResult) {
        const ide = this.ides[selectedIDE];

        console.log('\n' + boxen(
            chalk.bold.green('🎉 Installation Complete!') + '\n\n' +
            chalk.blue('IDE:') + ` ${ide.name}\n` +
            chalk.blue('Files installed:') + ` ${installResult.totalFiles}\n` +
            chalk.blue('Location:') + ` ${installResult.targetDir}/\n` +
            chalk.blue('Components:') + ` ${installResult.components}`,
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'green'
            }
        ));

        console.log(chalk.bold.yellow('\n📚 Next Steps:'));
        console.log(chalk.gray('═'.repeat(50)));

        switch (selectedIDE) {
            case 'cursor':
                console.log(chalk.blue('1.') + ' Restart Cursor to load the new rule from ' + chalk.cyan('.cursor/rules/cc.mdc'));
                console.log(chalk.blue('2.') + ' Use ' + chalk.cyan('cc: initialize') + ' to set up your project');
                console.log(chalk.blue('3.') + ' Try ' + chalk.cyan('cc: plan-product') + ' for product planning');
                console.log(chalk.blue('4.') + ' Use ' + chalk.cyan('cc: create-spec') + ' for feature specifications');
                break;

            case 'copilot':
                console.log(chalk.blue('1.') + ' Restart VS Code to load chatmodes from ' + chalk.cyan('.github/chatmodes/'));
                console.log(chalk.blue('2.') + ' Open GitHub Copilot Chat in VS Code');
                console.log(chalk.blue('3.') + ' Type ' + chalk.cyan('@Code Captain') + ' to access the chatmode');
                console.log(chalk.blue('4.') + ' Use prompts from ' + chalk.cyan('.github/prompts/') + ' for workflows');
                break;

            case 'windsurf':
                console.log(chalk.blue('1.') + ' Restart Windsurf to load the new workflows');
                console.log(chalk.blue('2.') + ' Use the AI agent with Code Captain commands');
                console.log(chalk.blue('3.') + ' Try ' + chalk.cyan('cc: initialize') + ' to set up your project');
                break;

            case 'claude':
                console.log(chalk.blue('1.') + ' Claude agents and commands are installed in ' + chalk.cyan('.code-captain/claude/'));
                console.log(chalk.blue('2.') + ' Reference the agents in ' + chalk.cyan('.code-captain/claude/agents/') + ' for specialized workflows');
                console.log(chalk.blue('3.') + ' Use command templates from ' + chalk.cyan('.code-captain/claude/commands/'));
                console.log(chalk.blue('4.') + ' Import agent contexts directly into Claude conversations');
                break;
        }

        console.log('\n' + chalk.green('🚀 Ready to start building with Code Captain!'));
        console.log(chalk.gray('Documentation: https://github.com/devobsessed/code-captain'));

        // Show backup information if backups were created
        if (installResult.totalFiles > 0) {
            console.log('\n' + chalk.yellow('💾 Backup Information:'));
            console.log(chalk.gray('Existing files were backed up with timestamps (e.g., filename.backup.2024-01-01T12-00-00-000Z)'));
            console.log(chalk.gray('You can safely delete backup files once you\'re satisfied with the installation.'));
        }
    }

    // Handle installation errors
    handleError(error, selectedIDE) {
        console.error('\n' + chalk.red('❌ Installation failed'));
        console.error(chalk.red('Error:'), error.message);

        console.log('\n' + chalk.yellow('🔧 Troubleshooting:'));
        console.log(chalk.blue('1.') + ' Check your internet connection');
        console.log(chalk.blue('2.') + ' Ensure you have write permissions in this directory');
        console.log(chalk.blue('3.') + ' Try running with ' + chalk.cyan('CC_LOCAL_SOURCE=path npx @devobsessed/code-captain'));

        if (selectedIDE) {
            console.log(chalk.blue('4.') + ` Try a different IDE option`);
        }

        console.log('\n' + chalk.gray('For help: https://github.com/devobsessed/code-captain/issues'));
    }

    // Main installation flow
    async run() {
        try {
            // Show welcome
            await this.showWelcome();

            // Check compatibility
            const systemInfo = await this.checkCompatibility();

            // Select IDE
            const selectedIDE = await this.selectIDE();

            // Select installation components
            const installOptions = await this.selectInstallationComponents(selectedIDE, systemInfo.existingInstallations);

            if (installOptions.skipInstall) {
                console.log(chalk.yellow('\n👋 Installation cancelled due to no changes detected.'));
                process.exit(0);
            }

            // Confirm installation
            const confirmed = await this.confirmInstallation(selectedIDE, systemInfo, installOptions);

            if (!confirmed) {
                console.log(chalk.yellow('\n👋 Installation cancelled'));
                process.exit(0);
            }

            // Install files
            const installResult = await this.installFiles(selectedIDE, installOptions);

            // Show instructions
            this.showInstructions(selectedIDE, installResult);

        } catch (error) {
            this.handleError(error);
            process.exit(1);
        }
    }
}

// Run installer if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
    (process.argv[1] && process.argv[1].includes('code-captain')) ||
    process.argv[1] === undefined;

if (isMainModule) {
    const installer = new CodeCaptainInstaller();
    installer.run();
}

export default CodeCaptainInstaller; 