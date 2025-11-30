# Git Setup Guide

## Installing Git on Windows

### Option 1: Download Git for Windows (Recommended)
1. Go to https://git-scm.com/download/win
2. Download the latest version (64-bit installer)
3. Run the installer with default settings
4. Restart your terminal/PowerShell after installation

### Option 2: Using Winget (Windows Package Manager)
If you have winget installed, run:
```powershell
winget install --id Git.Git -e --source winget
```

### Option 3: Using Chocolatey
If you have Chocolatey installed, run:
```powershell
choco install git
```

## After Installation

1. **Restart your terminal/PowerShell** - This is important so the PATH is updated

2. **Verify installation:**
   ```powershell
   git --version
   ```

3. **Configure Git with your information:**
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

4. **Initialize your repository:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Optional: Set default branch name to 'main':**
   ```powershell
   git config --global init.defaultBranch main
   ```

## Quick Setup Commands

After installing Git, run these commands in your project directory:

```powershell
# Configure Git (replace with your details)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: NestJS project with MySQL, Docker, and tests"

# Optional: Add remote repository
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

## Verify Your Configuration

Check your Git configuration:
```powershell
git config --list
```

