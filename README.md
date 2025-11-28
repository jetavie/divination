## Divination Bot

A slash-command Discord bot that delivers daily fortune readings, tracks streaks, and awards achievements. This repo is scrubbed for public sharing so others can fork, configure their own credentials, and host a copy.

### Features
- `/reading` daily fortune with cooldown tracking
- `/leaderboard`, `/stats`, `/tiers`, `/achinfo`
- Maintenance and announcement utilities for the bot owner
- File-based persistence for cooldowns and player stats

### Prerequisites
- Node.js 18+
- A Discord application with a bot token and the `applications.commands` scope

### Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Copy `example.env` to `.env` and fill in your credentials:
   - `DISCORD_TOKEN`: Bot token from the Discord Developer Portal
   - `DISCORD_CLIENT_ID`: Application (bot) client ID
   - `DISCORD_OWNER_ID`: Your personal Discord user ID (controls owner-only commands)
3. (Optional) Keep personal data private by ensuring `cooldowns.json` and `userstats.json` remain untracked; they are already listed in `.gitignore`.

### Deploying Slash Commands
Register the slash commands globally (or adjust to guild routes if desired):
```
npm run deploy
```

### Running the Bot
```
npm start
```

The bot persists cooldowns and user stats to `cooldowns.json` and `userstats.json` at the project root. The files are created automatically on first write; removing them will reset stored data.

### Contributing / Forking
- Fork the repository and configure your own `.env`.
- Avoid committing generated data or secrets -- `.gitignore` already covers the sensitive files.
- Feel free to open pull requests with new commands or improvements.

