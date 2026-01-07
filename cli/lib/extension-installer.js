/**
 * TeamSpec Extension Installer
 * 
 * Handles installation of the TeamSpec VS Code extension.
 * Used by the CLI during 'teamspec init --ide vscode' flow.
 */

const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

// =============================================================================
// Constants
// =============================================================================

const EXTENSION_ID = 'teamspec.teamspec';
const EXTENSION_NAME = 'TeamSpec';

// =============================================================================
// Utilities
// =============================================================================

/**
 * Check if VS Code CLI is available
 */
function isVSCodeAvailable() {
  try {
    execSync('code --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if the extension is already installed
 */
function isExtensionInstalled() {
  try {
    const result = execSync('code --list-extensions', { encoding: 'utf-8' });
    return result.toLowerCase().includes(EXTENSION_ID.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Get the path to the bundled VSIX file
 */
function getBundledVsixPath() {
  // Check for VSIX in the CLI package
  const packageDir = path.join(__dirname, '..');
  const vsixCandidates = [
    path.join(packageDir, 'extensions', 'teamspec-0.1.0.vsix'),
    path.join(packageDir, 'teamspec-0.1.0.vsix'),
    path.join(__dirname, '..', '..', 'vscode-extension', 'teamspec-0.1.0.vsix'),
  ];

  for (const candidate of vsixCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Install extension from VSIX file
 */
function installFromVsix(vsixPath) {
  return new Promise((resolve, reject) => {
    exec(`code --install-extension "${vsixPath}"`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Failed to install extension: ${stderr || error.message}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Install extension from marketplace (future support)
 */
function installFromMarketplace() {
  return new Promise((resolve, reject) => {
    exec(`code --install-extension ${EXTENSION_ID}`, (error, stdout, stderr) => {
      if (error) {
        // Marketplace install failed, extension may not be published yet
        reject(new Error(`Failed to install from marketplace: ${stderr || error.message}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

// =============================================================================
// Main Installation Function
// =============================================================================

/**
 * Install the TeamSpec VS Code extension
 * 
 * @param {Object} options Installation options
 * @param {boolean} options.force Force reinstall even if already installed
 * @param {string} options.vsixPath Custom path to VSIX file
 * @param {Function} options.onProgress Progress callback
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function installExtension(options = {}) {
  const { force = false, vsixPath = null, onProgress = () => {} } = options;

  // Check VS Code availability
  onProgress('Checking VS Code installation...');
  if (!isVSCodeAvailable()) {
    return {
      success: false,
      message: 'VS Code CLI not found. Please install VS Code and ensure "code" command is in PATH.',
      hint: 'You can add VS Code to PATH via: Command Palette > "Shell Command: Install code command in PATH"'
    };
  }

  // Check if already installed
  if (!force && isExtensionInstalled()) {
    return {
      success: true,
      message: 'TeamSpec extension is already installed.',
      alreadyInstalled: true
    };
  }

  // Try to find VSIX
  const vsix = vsixPath || getBundledVsixPath();

  if (vsix) {
    // Install from bundled VSIX
    onProgress(`Installing extension from ${path.basename(vsix)}...`);
    try {
      await installFromVsix(vsix);
      return {
        success: true,
        message: 'TeamSpec extension installed successfully from local package.'
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to install from VSIX: ${error.message}`,
        error
      };
    }
  } else {
    // Try marketplace (may not be available yet)
    onProgress('Installing extension from VS Code Marketplace...');
    try {
      await installFromMarketplace();
      return {
        success: true,
        message: 'TeamSpec extension installed successfully from Marketplace.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Extension not found in Marketplace and no local VSIX available.',
        hint: 'Build the extension with: cd vscode-extension && npm run package',
        error
      };
    }
  }
}

/**
 * Copy extension files to workspace for development/testing
 */
function copyExtensionToWorkspace(targetDir, sourceExtensionDir) {
  const vscodeDir = path.join(targetDir, '.vscode');
  fs.mkdirSync(vscodeDir, { recursive: true });

  // Create a settings.json with TeamSpec recommendations
  const settingsPath = path.join(vscodeDir, 'settings.json');
  let settings = {};

  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch {
      // Ignore parse errors, start fresh
    }
  }

  // Add TeamSpec settings
  settings['teamspec.enforceGates'] = true;
  settings['files.associations'] = settings['files.associations'] || {};
  settings['files.associations']['*.teamspec'] = 'yaml';

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

  // Create extensions.json to recommend the extension
  const extensionsPath = path.join(vscodeDir, 'extensions.json');
  const extensions = {
    recommendations: [EXTENSION_ID]
  };

  if (fs.existsSync(extensionsPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(extensionsPath, 'utf-8'));
      if (existing.recommendations && !existing.recommendations.includes(EXTENSION_ID)) {
        existing.recommendations.push(EXTENSION_ID);
      }
      extensions.recommendations = existing.recommendations || [EXTENSION_ID];
    } catch {
      // Ignore parse errors
    }
  }

  fs.writeFileSync(extensionsPath, JSON.stringify(extensions, null, 2));

  return {
    settingsPath,
    extensionsPath
  };
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
  installExtension,
  copyExtensionToWorkspace,
  isVSCodeAvailable,
  isExtensionInstalled,
  EXTENSION_ID,
  EXTENSION_NAME
};
