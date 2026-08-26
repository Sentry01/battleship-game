# GitHub MCP Server Setup Instructions

## What is GitHub MCP Server?

The GitHub MCP server allows Devin to interact with GitHub's API directly, enabling:

- Creating and managing repositories
- Managing issues and pull requests
- Automating GitHub workflows
- Accessing repository data

## Setup Steps

### 1. Create a GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Configure the token:
   - **Note**: "Devin CLI - Battleship Game"
   - **Expiration**: 90 days (or No expiration)
   - **Scopes** (select these):
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `read:org` (Read org data)
     - ✅ `admin:org` (Admin org data - if needed)
     - ✅ `user` (Read user data)
4. Click "Generate token"
5. **Important**: Copy the token immediately - you won't see it again!

### 2. Configure MCP Server

Once you have your token, you need to configure the MCP server. Since the configuration file contains sensitive data, it's gitignored, so you'll need to configure it locally.

#### Option A: Using the MCP Config File (Recommended)

Edit the file `.devin/mcp_config.local.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "YOUR_ACTUAL_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

Replace `YOUR_ACTUAL_GITHUB_TOKEN_HERE` with the token you created in step 1.

#### Option B: Using Environment Variable

You can also set the GitHub token as an environment variable:

```bash
export GITHUB_TOKEN="your_actual_github_token_here"
```

### 3. Test the Configuration

After configuring, you can test if the MCP server is working by starting a new Devin session and asking it to list your repositories or perform a GitHub action.

### 4. What Devin Can Do With GitHub MCP

Once configured, Devin will be able to:

- Create the `battleship-game` repository
- Configure repository settings
- Set up GitHub Advanced Security features
- Create GitHub Actions workflows
- Configure Dependabot
- Manage issues and pull requests
- And much more...

## Security Notes

- Your GitHub token is stored locally in `.devin/mcp_config.local.json` which is gitignored
- Never commit your GitHub token to version control
- You can revoke the token at any time from GitHub Settings
- Consider using a fine-grained personal access token for better security

## Troubleshooting

### MCP Server Not Starting

- Ensure Node.js and npm are installed
- Try running `npx -y @modelcontextprotocol/server-github` manually
- Check that your GitHub token is valid

### Permission Errors

- Verify your token has the required scopes
- Check that the token hasn't expired
- Ensure you have permission to create repositories in your GitHub account

### Configuration Not Working

- Make sure the configuration file is in the correct location (`.devin/mcp_config.local.json`)
- Verify the JSON syntax is correct
- Try restarting your Devin session

## Next Steps

Once you've configured the GitHub MCP server with your token, let me know and I'll:

1. Create the public GitHub repository
2. Configure all the GitHub Advanced Security features
3. Set up Dependabot and CodeQL
4. Push the local repository to GitHub
5. Create all the necessary GitHub Actions workflows

This will give you a fully configured, secure repository ready for battleship game development!
