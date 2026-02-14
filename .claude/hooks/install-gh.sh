#!/bin/bash
# Session-start hook: Install GitHub CLI if not present
# WHY: gh CLI is required for PR operations (create, review, merge)
# Reference: docs/CONSTITUTION.md - tooling should be available for governance workflows

GH_VERSION="2.43.1"
GH_PATH="$HOME/.local/bin/gh"

# Check if gh is already installed and accessible
if command -v gh &> /dev/null; then
    echo "[hook] gh CLI already available: $(gh --version | head -1)"
    exit 0
fi

# Check if installed in ~/.local/bin
if [ -x "$GH_PATH" ]; then
    echo "[hook] gh CLI found at $GH_PATH"
    exit 0
fi

echo "[hook] Installing gh CLI v${GH_VERSION}..."

# Create local bin directory
mkdir -p "$HOME/.local/bin"

# Download and extract gh CLI
curl -sL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_amd64.tar.gz" | \
    tar xz -C /tmp

# Move binary to local bin
mv "/tmp/gh_${GH_VERSION}_linux_amd64/bin/gh" "$GH_PATH"
chmod +x "$GH_PATH"

# Clean up
rm -rf "/tmp/gh_${GH_VERSION}_linux_amd64"

# Verify installation
if [ -x "$GH_PATH" ]; then
    echo "[hook] gh CLI installed successfully: $($GH_PATH --version | head -1)"
else
    echo "[hook] WARNING: gh CLI installation may have failed"
    exit 1
fi
