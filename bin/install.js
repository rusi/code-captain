#!/usr/bin/env node

import boxen from "boxen";
import chalk from "chalk";
import { spawn } from "cross-spawn";
import fs from "fs-extra";
import inquirer from "inquirer";
import fetch from "node-fetch";
import ora from "ora";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CodeCaptainInstaller {
  constructor() {
    // Determine if we're running from npm package or development
    const packageRoot = path.resolve(__dirname, "..");
    const isNpmPackage = fs.existsSync(path.join(packageRoot, "package.json"));

    this.config = {
      repoUrl: "https://github.com/devobsessed/code-captain",
      baseUrl:
        "https://raw.githubusercontent.com/devobsessed/code-captain/main",
      version: "main",
      // Default to local source when running from npm package
      localSource:
        process.env.CC_LOCAL_SOURCE || (isNpmPackage ? packageRoot : null),
    };

    this.ides = {
      cursor: {
        name: "Cursor",
        description: "AI-first code editor with built-in AI agent capabilities",
        details: "Uses .cursor/commands/ + .cursor/rules/cc.mdc",
      },
      copilot: {
        name: "Copilot",
        description: "Visual Studio Code with Copilot extension",
        details:
          "Uses .github/chatmodes/ + .github/prompts/ + .code-captain/docs/",
      },
      claude: {
        name: "Claude Code",
        description: "Direct integration with Claude for development workflows",
        details:
          "Uses .claude/ for agents and commands (+ .code-captain/ for shared docs)",
      },
    };
  }

  // Display welcome banner
  async showWelcome() {
    const version = await this.getPackageVersion();
    const banner = boxen(
      chalk.bold.green(`Code Captain ${version}`) +
        "\n" +
        chalk.gray("AI Development Agent System") +
        "\n" +
        chalk.dim("brought to you by DevObsessed") +
        "\n" +
        chalk.dim.blue("https://www.devobsessed.com/") +
        "\n\n" +
        chalk.blue("⚓ Interactive Installation Wizard"),
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "green",
        textAlignment: "center",
      }
    );

    console.log(banner);
  }

  // Check system compatibility
  async checkCompatibility() {
    const spinner = ora("Checking system compatibility...").start();

    try {
      // Check Node.js version
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

      if (majorVersion < 16) {
        spinner.fail(
          `Node.js ${nodeVersion} detected. Requires Node.js 16 or higher.`
        );
        console.log(chalk.yellow("\n📦 Please update Node.js:"));
        console.log(chalk.blue("   Visit: https://nodejs.org/"));
        process.exit(1);
      }

      // Check if we're in a Git repository
      const isGitRepo = await fs.pathExists(".git");

      // Check for existing Code Captain installations
      const existingInstallations = await this.detectExistingInstallations();

      spinner.succeed("System compatibility check passed");

      return {
        nodeVersion,
        isGitRepo,
        existingInstallations,
      };
    } catch (error) {
      spinner.fail("Compatibility check failed");
      console.error(chalk.red("Error:"), error.message);
      process.exit(1);
    }
  }

  // Detect existing Code Captain installations
  async detectExistingInstallations() {
    const installations = [];

    // Define all possible Code Captain paths
    const pathsToCheck = {
      "Code Captain Core": [".code-captain/"],
      "Cursor Integration": [
        ".cursor/commands/",
        ".cursor/rules/cc.mdc",
        ".cursor/rules/",
      ],
      "Copilot Integration": [".github/chatmodes/", ".github/prompts/"],
      "Claude Integration": [
        ".code-captain/claude/",
        "claude-code/",
        ".claude/",
      ],
      "Legacy Structure": ["cursor/", "copilot/"],
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
        const packageJsonPath = path.join(
          this.config.localSource,
          "package.json"
        );
        if (await fs.pathExists(packageJsonPath)) {
          const packageJson = await fs.readJson(packageJsonPath);
          return packageJson.version || "unknown";
        }
      }
      return "unknown";
    } catch (error) {
      return "unknown";
    }
  }

  // Calculate SHA256 hash of a file
  async calculateFileHash(filePath) {
    try {
      const crypto = await import("crypto");
      const content = await fs.readFile(filePath); // Buffer
      return crypto.default.createHash("sha256").update(content).digest("hex");
    } catch (error) {
      return null;
    }
  }

  // Fetch with timeout using AbortController
  async fetchWithTimeout(url, init = {}, timeoutMs = 15000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  // Get remote manifest with file versions/hashes
  async getRemoteManifest() {
    try {
      const manifestUrl = `${this.config.baseUrl}/manifest.json`;

      if (this.config.localSource) {
        const localManifestPath = path.join(
          this.config.localSource,
          "manifest.json"
        );
        if (await fs.pathExists(localManifestPath)) {
          const content = await fs.readFile(localManifestPath, "utf8");
          const manifest = JSON.parse(content);
          return { manifest, isFallback: false };
        }
      } else {
        const response = await this.fetchWithTimeout(manifestUrl, {}, 15000);
        if (response.ok) {
          const manifest = await response.json();
          return { manifest, isFallback: false };
        }
      }

      // Fallback: generate manifest from current commit
      const fallbackManifest = await this.generateFallbackManifest();
      return { manifest: fallbackManifest, isFallback: true };
    } catch (error) {
      console.warn(
        chalk.yellow("Warning: Could not fetch remote manifest, using fallback")
      );
      const fallbackManifest = await this.generateFallbackManifest();
      return { manifest: fallbackManifest, isFallback: true };
    }
  }

  // Generate fallback manifest if remote manifest doesn't exist
  async generateFallbackManifest() {
    const timestamp = new Date().toISOString();
    return {
      version: this.config.version,
      timestamp,
      commit: "unknown",
      files: {}, // Will be populated as files are downloaded
    };
  }

  // Compare current files with remote manifest to detect changes
  async detectChanges(selectedIDE) {
    const spinner = ora("Analyzing file changes...").start();

    try {
      const { manifest: remoteManifest, isFallback: manifestIsFallback } =
        await this.getRemoteManifest();
      const files = this.getIDEFiles(selectedIDE);

      // Check if this looks like a first install (no existing files)
      const existingFiles = [];
      for (const file of files) {
        if (await fs.pathExists(file.target)) {
          existingFiles.push(file.target);
        }
      }

      if (existingFiles.length === 0) {
        if (manifestIsFallback) {
          spinner.succeed(
            "No existing files found - treating as fresh installation (offline mode)"
          );
        } else {
          spinner.succeed(
            "No existing files found - treating as fresh installation"
          );
        }

        const availableVersion = remoteManifest.version;
        return {
          isFirstInstall: true,
          remoteVersion: availableVersion,
          changes: [],
          newFiles: [],
          recommendations: ["Full installation recommended"],
          manifestIsFallback,
        };
      }

      // Analyze existing files for changes
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
            reason: "File does not exist locally",
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
            reason: "Unable to read local file",
          });
          continue;
        }

        // Compare with remote hash
        if (remoteFileInfo && remoteFileInfo.hash) {
          const remoteHash = remoteFileInfo.hash.replace("sha256:", "");

          if (localFileHash !== remoteHash) {
            changes.push({
              file: remotePath,
              component: file.component,
              remoteVersion: remoteFileInfo.version || "latest",
              reason: "File content has changed",
              localHash: localFileHash.substring(0, 8),
              remoteHash: remoteHash.substring(0, 8),
            });
          }
        } else {
          // No remote file info - check if we're in fallback mode
          if (manifestIsFallback) {
            // In fallback mode, we can't determine if files are new
            // Skip these files from change detection
            continue;
          } else {
            // Not in fallback mode - truly new file in remote
            newFiles.push({
              file: remotePath,
              component: file.component,
              reason: "New file in remote repository",
            });
          }
        }
      }

      const recommendations = this.generateUpdateRecommendations(
        changes,
        newFiles,
        manifestIsFallback
      );

      if (manifestIsFallback) {
        spinner.succeed(
          `Found ${changes.length} updated files, ${newFiles.length} new files (offline mode - limited change detection)`
        );
      } else {
        spinner.succeed(
          `Found ${changes.length} updated files, ${newFiles.length} new files`
        );
      }

      const availableVersion = remoteManifest.version;

      return {
        isFirstInstall: false,
        remoteVersion: availableVersion,
        changes,
        newFiles,
        recommendations,
        manifestIsFallback,
      };
    } catch (error) {
      spinner.fail("Could not analyze changes");
      return {
        isFirstInstall: false,
        changes: [],
        newFiles: [],
        recommendations: ["Unable to detect changes - consider full update"],
        manifestIsFallback: true, // Assume fallback mode on error
        error: error.message,
      };
    }
  }

  // Generate smart update recommendations
  generateUpdateRecommendations(changes, newFiles, manifestIsFallback = false) {
    const recommendations = [];
    const changedComponents = new Set();

    // Collect components with changes
    [...changes, ...newFiles].forEach((item) => {
      if (item.component) {
        changedComponents.add(item.component);
      }
    });

    if (manifestIsFallback) {
      recommendations.push(
        "⚠️  Operating in offline/fallback mode - limited change detection"
      );
      recommendations.push(
        "📶 Consider checking internet connection for full update analysis"
      );

      if (changedComponents.size === 0) {
        recommendations.push(
          "📦 No local file changes detected - full reinstall recommended for latest updates"
        );
      } else {
        recommendations.push(
          `📦 Local changes detected in: ${Array.from(changedComponents).join(
            ", "
          )}`
        );
      }
    } else {
      if (changedComponents.size === 0) {
        recommendations.push("✅ All files are up to date!");
      } else {
        recommendations.push(
          `📦 Recommended updates: ${Array.from(changedComponents).join(", ")}`
        );

        // Specific recommendations
        if (changedComponents.has("commands")) {
          recommendations.push(
            "🚀 Commands updated - new features or bug fixes available"
          );
        }
        if (changedComponents.has("rules")) {
          recommendations.push("⚙️ Rules updated - improved AI agent behavior");
        }
        if (changedComponents.has("docs")) {
          recommendations.push(
            "📚 Documentation updated - check for new best practices"
          );
        }
      }
    }

    return recommendations;
  }

  // Auto-detect IDE preference
  detectIDE() {
    const detections = [];

    // Check for Cursor
    if (fs.pathExistsSync(".cursor") || this.commandExists("cursor")) {
      detections.push("cursor");
    }

    // Check for VS Code
    if (this.commandExists("code")) {
      detections.push("copilot");
    }

    // Check for Claude Code
    if (
      fs.pathExistsSync("claude-code") ||
      fs.pathExistsSync(".code-captain/claude") ||
      fs.pathExistsSync(".claude")
    ) {
      detections.push("claude");
    }

    return detections;
  }

  // Check if command exists
  commandExists(command) {
    try {
      const result = spawn.sync(command, ["--version"], {
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 5000,
        windowsHide: true,
      });
      return result.status === 0;
    } catch {
      return false;
    }
  }

  // IDE selection prompt
  async selectIDE() {
    const detected = this.detectIDE();

    console.log("\n" + chalk.bold.blue("🎯 IDE Selection"));
    console.log(chalk.gray("═".repeat(50)));

    if (detected.length > 0) {
      console.log(
        chalk.green(
          `\n✨ Auto-detected: ${detected
            .map((id) => this.ides[id].name)
            .join(", ")}`
        )
      );
    }

    const choices = Object.entries(this.ides).map(([key, ide]) => ({
      name: ide.name,
      value: key,
      short: ide.name,
    }));

    const { selectedIDE } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedIDE",
        message: "Which IDE/environment are you using?",
        choices: choices,
        pageSize: 6,
        default: detected.length > 0 ? detected[0] : "cursor",
      },
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
        changeInfo,
      };
    }

    console.log("\n" + chalk.bold.blue("🔍 Change Analysis"));
    console.log(chalk.gray("═".repeat(50)));

    // Show fallback mode warning if applicable
    if (changeInfo.manifestIsFallback) {
      console.log(
        chalk.yellow(
          "⚠️  Operating in offline/fallback mode - limited change detection capabilities"
        )
      );
      console.log(
        chalk.gray(
          "   Remote manifest unavailable - cannot detect all new files or verify latest versions"
        )
      );
    }

    // Show version information
    if (changeInfo.remoteVersion) {
      const versionLabel = changeInfo.manifestIsFallback
        ? "Local/fallback version:"
        : "Available version:";
      console.log(chalk.blue(versionLabel), changeInfo.remoteVersion);
    }

    // Show what's changed
    if (changeInfo.changes.length > 0) {
      console.log(chalk.yellow("\n📝 Updated Files:"));
      changeInfo.changes.forEach((change) => {
        console.log(chalk.gray(`  • ${change.file} (${change.component})`));
        console.log(chalk.gray(`    ${change.reason}`));
        if (change.localHash && change.remoteHash) {
          console.log(
            chalk.gray(
              `    Local: ${change.localHash}... → Remote: ${change.remoteHash}...`
            )
          );
        }
      });
    }

    if (changeInfo.newFiles.length > 0) {
      console.log(chalk.green("\n🆕 New Files:"));
      changeInfo.newFiles.forEach((file) => {
        console.log(chalk.gray(`  • ${file.file} (${file.component})`));
        console.log(chalk.gray(`    ${file.reason}`));
      });
    }

    // Show recommendations
    console.log(chalk.bold.cyan("\n💡 Recommendations:"));
    changeInfo.recommendations.forEach((rec) => {
      console.log(chalk.gray(`  ${rec}`));
    });

    if (changeInfo.changes.length === 0 && changeInfo.newFiles.length === 0) {
      console.log(chalk.green("\n✨ All files are up to date!"));

      const { forceUpdate } = await inquirer.prompt([
        {
          type: "confirm",
          name: "forceUpdate",
          message: "All files are current. Force reinstall anyway?",
          default: false,
        },
      ]);

      if (!forceUpdate) {
        return {
          skipInstall: true,
          changeInfo,
        };
      }
    }

    console.log("\n" + chalk.bold.blue("🔧 Component Selection"));
    console.log(chalk.gray("═".repeat(50)));

    const componentChoices = this.getComponentChoices(selectedIDE);

    // Pre-select components that have changes
    const changedComponents = new Set();
    [...changeInfo.changes, ...changeInfo.newFiles].forEach((item) => {
      if (item.component) {
        changedComponents.add(item.component);
      }
    });

    // Update choices to pre-select changed components
    componentChoices.forEach((choice) => {
      if (changedComponents.has(choice.value)) {
        choice.checked = true;
        choice.name += chalk.yellow(" (has updates)");
      }
    });

    const { components } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "components",
        message: "Select components to install/update:",
        choices: componentChoices,
        pageSize: 10,
        validate: (answer) => {
          if (answer.length === 0) {
            return "Please select at least one component to install.";
          }
          return true;
        },
      },
    ]);

    const { createBackups } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createBackups",
        message: "Create backups of existing files before overwriting?",
        default: true,
      },
    ]);

    return {
      selectedComponents: components,
      createBackups,
      installAll: false,
      changeInfo,
    };
  }

  // Get component choices based on IDE
  getComponentChoices(selectedIDE) {
    const baseChoices = [
      { name: "Core Commands", value: "commands", checked: true },
      { name: "Documentation & Best Practices", value: "docs", checked: true },
    ];

    switch (selectedIDE) {
      case "cursor":
        return [
          ...baseChoices,
          {
            name: "Cursor Rules (.cursor/rules/cc.mdc)",
            value: "rules",
            checked: true,
          },
        ];

      case "copilot":
        return [
          ...baseChoices,
          { name: "Copilot Chatmodes", value: "chatmodes", checked: true },
          { name: "Copilot Prompts", value: "prompts", checked: true },
        ];

      case "claude":
        return [
          ...baseChoices,
          { name: "Claude Agents", value: "agents", checked: true },
          { name: "Claude Commands", value: "claude-commands", checked: true },
        ];

      default:
        return baseChoices;
    }
  }

  // Confirmation prompt
  async confirmInstallation(selectedIDE, systemInfo, installOptions) {
    console.log("\n" + chalk.bold.yellow("📋 Installation Summary"));
    console.log(chalk.gray("═".repeat(50)));

    const ide = this.ides[selectedIDE];
    console.log(chalk.blue("Selected IDE:"), chalk.bold(ide.name));
    console.log(chalk.blue("Description:"), ide.description);
    console.log(chalk.blue("Installation:"), ide.details);
    console.log(chalk.blue("Node.js:"), systemInfo.nodeVersion);
    console.log(
      chalk.blue("Git Repository:"),
      systemInfo.isGitRepo ? "Yes" : "No"
    );

    if (systemInfo.existingInstallations.length > 0) {
      console.log(
        chalk.yellow("Existing installations:"),
        systemInfo.existingInstallations.join(", ")
      );
    }

    if (!installOptions.installAll) {
      console.log(
        chalk.blue("Components to install:"),
        installOptions.selectedComponents.join(", ")
      );
      console.log(
        chalk.blue("Create backups:"),
        installOptions.createBackups ? "Yes" : "No"
      );

      // Show change summary
      const { changeInfo } = installOptions;
      if (
        changeInfo &&
        (changeInfo.changes.length > 0 || changeInfo.newFiles.length > 0)
      ) {
        const modeIndicator = changeInfo.manifestIsFallback
          ? " (offline mode)"
          : "";
        console.log(
          chalk.blue("Files to update:"),
          `${changeInfo.changes.length} changed, ${changeInfo.newFiles.length} new${modeIndicator}`
        );
      } else if (changeInfo && changeInfo.manifestIsFallback) {
        console.log(
          chalk.blue("Installation mode:"),
          "Offline/fallback mode - limited change detection"
        );
      }
    } else {
      console.log(
        chalk.blue("Installation type:"),
        "Full installation (new setup)"
      );
    }

    const { confirmed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: "Proceed with installation?",
        default: true,
      },
    ]);

    return confirmed;
  }

  // Create directory-level backup of target directories
  async createDirectoryBackups(files, shouldBackup = true) {
    if (!shouldBackup) {
      return [];
    }

    // Extract unique target directories from file list
    const targetDirs = new Set();
    files.forEach((file) => {
      const targetPath = file.target;
      const normalizedTarget = path.normalize(targetPath);
      const segments = normalizedTarget.split(path.sep).filter(Boolean);
      const rootDir = segments[0]; // e.g., ".code-captain", ".cursor", ".github"
      if (rootDir && rootDir.startsWith(".")) {
        targetDirs.add(rootDir);
      }
    });

    const backupPaths = [];

    for (const dir of targetDirs) {
      if (await fs.pathExists(dir)) {
        const backupPath = `${dir}.backup`;

        try {
          // Remove existing backup if it exists
          if (await fs.pathExists(backupPath)) {
            await fs.remove(backupPath);
          }

          // Create directory backup
          await fs.copy(dir, backupPath);
          backupPaths.push(backupPath);
        } catch (error) {
          console.warn(
            chalk.yellow(`Warning: Could not backup ${dir}: ${error.message}`)
          );
        }
      }
    }

    return backupPaths;
  }

  // Download file from URL or local source
  async downloadFile(relativePath, targetPath) {
    try {
      let content;

      if (this.config.localSource) {
        // Local source mode
        const localPath = path.join(this.config.localSource, relativePath);
        content = await fs.readFile(localPath, "utf8");
      } else {
        // Remote download mode
        const url = `${this.config.baseUrl}/${relativePath}`;
        const response = await this.fetchWithTimeout(url, {}, 20000);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        content = await response.text();
      }

      // Ensure target directory exists
      await fs.ensureDir(path.dirname(targetPath));

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
      case "cursor":
        // Cursor rules
        if (includeAll || selectedComponents.includes("rules")) {
          files.push({
            source: "cursor/cc.mdc",
            target: ".cursor/rules/cc.mdc",
            component: "rules",
          });
        }

        // Core commands and docs
        if (includeAll || selectedComponents.includes("commands")) {
          const cursorCommands = [
            "create-adr.md",
            "create-spec.md",
            "edit-spec.md",
            "execute-task.md",
            "explain-code.md",
            "initialize.md",
            "new-command.md",
            "plan-product.md",
            "research.md",
            "status.md",
            "swab.md",
          ];

          cursorCommands.forEach((cmd) => {
            files.push({
              source: `cursor/commands/${cmd}`,
              target: `.cursor/commands/${cmd}`,
              component: "commands",
            });
          });
        }

        // Documentation
        if (includeAll || selectedComponents.includes("docs")) {
          files.push({
            source: "cursor/docs/best-practices.md",
            target: ".code-captain/docs/best-practices.md",
            component: "docs",
          });
        }

        break;

      case "copilot":
        // Chatmodes
        if (includeAll || selectedComponents.includes("chatmodes")) {
          files.push({
            source: "copilot/chatmodes/Code Captain.chatmode.md",
            target: ".github/chatmodes/Code Captain.chatmode.md",
            component: "chatmodes",
          });
        }

        // Prompts
        if (includeAll || selectedComponents.includes("prompts")) {
          const copilotPrompts = [
            "create-adr.prompt.md",
            "create-spec.prompt.md",
            "edit-spec.prompt.md",
            "execute-task.prompt.md",
            "explain-code.prompt.md",
            "initialize.prompt.md",
            "new-command.prompt.md",
            "plan-product.prompt.md",
            "research.prompt.md",
            "status.prompt.md",
            "swab.prompt.md",
          ];

          copilotPrompts.forEach((prompt) => {
            files.push({
              source: `copilot/prompts/${prompt}`,
              target: `.github/prompts/${prompt}`,
              component: "prompts",
            });
          });
        }

        // Documentation
        if (includeAll || selectedComponents.includes("docs")) {
          files.push({
            source: "copilot/docs/best-practices.md",
            target: ".code-captain/docs/best-practices.md",
            component: "docs",
          });
        }

        break;

      case "claude":
        // Claude agents
        if (includeAll || selectedComponents.includes("agents")) {
          const claudeAgents = [
            "code-captain.md",
            "spec-generator.md",
            "story-creator.md",
            "tech-spec.md",
          ];

          claudeAgents.forEach((agent) => {
            files.push({
              source: `claude-code/agents/${agent}`,
              target: `.claude/agents/${agent}`,
              component: "agents",
            });
          });
        }

        // Claude commands
        if (includeAll || selectedComponents.includes("claude-commands")) {
          const claudeCommands = ["cc-create-spec.md", "cc-initialize.md"];

          claudeCommands.forEach((command) => {
            files.push({
              source: `claude-code/commands/${command}`,
              target: `.claude/commands/${command}`,
              component: "claude-commands",
            });
          });
        }

        break;
    }

    return files;
  }

  // Install files for selected IDE
  async installFiles(selectedIDE, installOptions) {
    const selectedComponents = installOptions.installAll
      ? null
      : installOptions.selectedComponents;
    const files = this.getIDEFiles(selectedIDE, selectedComponents);
    const spinner = ora(
      `Installing ${this.ides[selectedIDE].name} integration...`
    ).start();

    try {
      // Create directory-level backups upfront if requested
      const shouldBackup = installOptions.createBackups !== false; // Default to true if not specified
      const backupPaths = await this.createDirectoryBackups(
        files,
        shouldBackup
      );

      if (backupPaths.length > 0) {
        spinner.text = `Created ${backupPaths.length} directory backup(s), installing files...`;
      }

      // Install all files
      let completed = 0;
      for (const file of files) {
        await this.downloadFile(file.source, file.target);
        completed++;
        spinner.text = `Installing files... (${completed}/${files.length})`;
      }

      spinner.succeed(
        `${this.ides[selectedIDE].name} integration installed successfully!`
      );

      return {
        totalFiles: files.length,
        targetDir:
          selectedIDE === "copilot"
            ? ".github + .code-captain/docs"
            : selectedIDE === "claude"
            ? ".claude"
            : ".cursor/",
        components: installOptions.installAll
          ? "All components"
          : installOptions.selectedComponents.join(", "),
        changesDetected:
          installOptions.changeInfo &&
          (installOptions.changeInfo.changes.length > 0 ||
            installOptions.changeInfo.newFiles.length > 0),
        backupsCreated: backupPaths.length > 0,
        backupPaths: backupPaths,
      };
    } catch (error) {
      spinner.fail("Installation failed");
      throw error;
    }
  }

  // Show post-installation instructions
  showInstructions(selectedIDE, installResult) {
    const ide = this.ides[selectedIDE];

    console.log(
      "\n" +
        boxen(
          chalk.bold.green("🎉 Installation Complete!") +
            "\n\n" +
            chalk.blue("IDE:") +
            ` ${ide.name}\n` +
            chalk.blue("Files installed:") +
            ` ${installResult.totalFiles}\n` +
            chalk.blue("Location:") +
            ` ${installResult.targetDir}/\n` +
            chalk.blue("Components:") +
            ` ${installResult.components}`,
          {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "green",
          }
        )
    );

    console.log(chalk.bold.yellow("\n📚 Next Steps:"));
    console.log(chalk.gray("═".repeat(50)));

    switch (selectedIDE) {
      case "cursor":
        console.log(
          chalk.blue("1.") +
            " Restart Cursor to load the new rule from " +
            chalk.cyan(".cursor/rules/cc.mdc")
        );
        console.log(
          chalk.blue("2.") +
            " Access commands via " +
            chalk.cyan("/") +
            " in chat (e.g., " +
            chalk.cyan("/initialize") +
            ", " +
            chalk.cyan("/create-spec") +
            ")"
        );
        console.log(
          chalk.blue("3.") +
            " Try " +
            chalk.cyan("/initialize") +
            " to set up your project"
        );
        console.log(
          chalk.blue("4.") +
            " Use " +
            chalk.cyan("/create-spec") +
            " for feature specifications"
        );
        break;

      case "copilot":
        console.log(
          chalk.blue("1.") +
            " Restart VS Code to load chatmodes from " +
            chalk.cyan(".github/chatmodes/")
        );
        console.log(chalk.blue("2.") + " Open Copilot Chat in VS Code");
        console.log(
          chalk.blue("3.") +
            " Type " +
            chalk.cyan("@Code Captain") +
            " to access the chatmode"
        );
        console.log(
          chalk.blue("4.") +
            " Use prompts from " +
            chalk.cyan(".github/prompts/") +
            " for workflows"
        );
        break;

      case "claude":
        console.log(
          chalk.blue("1.") +
            " Claude agents and commands are installed in " +
            chalk.cyan(".claude/")
        );
        console.log(
          chalk.blue("2.") +
            " Reference the agents in " +
            chalk.cyan(".claude/agents/") +
            " for specialized workflows"
        );
        console.log(
          chalk.blue("3.") +
            " Use command templates from " +
            chalk.cyan(".claude/commands/")
        );
        console.log(
          chalk.blue("4.") +
            " Import agent contexts directly into Claude conversations"
        );
        break;
    }

    console.log(
      "\n" + chalk.green("🚀 Ready to start building with Code Captain!")
    );
    console.log(
      chalk.gray("Documentation: https://github.com/devobsessed/code-captain")
    );

    // Show backup information if backups were created
    if (installResult.backupsCreated) {
      console.log("\n" + chalk.yellow("💾 Backup Information:"));
      console.log(chalk.gray("The following directories were backed up:"));
      installResult.backupPaths.forEach((backupPath) => {
        console.log(chalk.gray(`  • ${backupPath}/`));
      });
      console.log(
        chalk.gray(
          "You can safely delete these backup directories once you're satisfied with the installation."
        )
      );
    }
  }

  // Handle installation errors
  handleError(error, selectedIDE) {
    console.error("\n" + chalk.red("❌ Installation failed"));
    console.error(chalk.red("Error:"), error.message);

    console.log("\n" + chalk.yellow("🔧 Troubleshooting:"));
    console.log(chalk.blue("1.") + " Check your internet connection");
    console.log(
      chalk.blue("2.") + " Ensure you have write permissions in this directory"
    );
    console.log(
      chalk.blue("3.") +
        " Try running with " +
        chalk.cyan("CC_LOCAL_SOURCE=path npx @devobsessed/code-captain")
    );

    if (selectedIDE) {
      console.log(chalk.blue("4.") + ` Try a different IDE option`);
    }

    console.log(
      "\n" +
        chalk.gray(
          "For help: https://github.com/devobsessed/code-captain/issues"
        )
    );
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
      const installOptions = await this.selectInstallationComponents(
        selectedIDE,
        systemInfo.existingInstallations
      );

      if (installOptions.skipInstall) {
        console.log(
          chalk.yellow(
            "\n👋 Installation cancelled due to no changes detected."
          )
        );
        process.exit(0);
      }

      // Confirm installation
      const confirmed = await this.confirmInstallation(
        selectedIDE,
        systemInfo,
        installOptions
      );

      if (!confirmed) {
        console.log(chalk.yellow("\n👋 Installation cancelled"));
        process.exit(0);
      }

      // Install files
      const installResult = await this.installFiles(
        selectedIDE,
        installOptions
      );

      // Show instructions
      this.showInstructions(selectedIDE, installResult);
    } catch (error) {
      this.handleError(error);
      process.exit(1);
    }
  }
}

// Handle subcommands
const args = process.argv.slice(2);

if (args.length > 0 && args[0] === "date") {
  // Return current date in YYYY-MM-DD format
  console.log(new Date().toISOString().split("T")[0]);
  process.exit(0);
}

// Run installer if called directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] && process.argv[1].includes("code-captain")) ||
  process.argv[1] === undefined;

if (isMainModule) {
  const installer = new CodeCaptainInstaller();
  installer.run();
}

export default CodeCaptainInstaller;
