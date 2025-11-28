require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

// Load config from environment
const config = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    ownerId: process.env.DISCORD_OWNER_ID
};

if (!config.token || !config.clientId || !config.ownerId) {
    throw new Error('DISCORD_TOKEN, DISCORD_CLIENT_ID, and DISCORD_OWNER_ID must be set in your environment.');
}

// Import utilities
const { loadCooldowns, loadUserStats } = require('./utils/fileHandler');
const { getCachedResetTime, getTomorrowUTC, cleanOldCooldowns } = require('./utils/helpers');
const { getTimeUntilReset } = require('./utils/helpers');
const { checkWayseeker } = require('./utils/statsManager');

// Import command handlers
const { handleReading } = require('./commands/reading');
const { handleTiers } = require('./commands/tiers');
const { handleStats } = require('./commands/stats');
const { handleLeaderboard } = require('./commands/leaderboard');
const { handleMaintenance } = require('./commands/maintenance');
const { handleMaintFinish } = require('./commands/maintfinish');
const { handleAnnounce } = require('./commands/announce');
const { handleForceReading } = require('./commands/force-reading');
const { handleAchInfo } = require('./commands/achinfo');

// Helper function to check if user is owner
function isOwner(userId) {
    return userId === config.ownerId;
}

// State
let userCooldowns = {};
let userStats = {};

// Maintenance state
let maintenanceMode = {
    active: false,
    reason: ''
};

// Create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Get user display name helper
async function getUserDisplayName(userId, guild) {
    try {
        const user = await client.users.fetch(userId);
        if (guild) {
            try {
                const member = await guild.members.fetch(userId);
                return member.displayName;
            } catch {
                return user.displayName || user.username;
            }
        }
        return user.displayName || user.username;
    } catch {
        return 'Unknown User';
    }
}

// Update bot status
function updateStatus() {
    if (maintenanceMode.active) {
        client.user.setPresence({
            activities: [{ name: '⚠️Maintenance In Progress.', type: ActivityType.Custom }],
            status: 'online'
        });
    } else {
        client.user.setPresence({
            activities: [{ name: getCachedResetTime(), type: ActivityType.Custom }],
            status: 'online'
        });
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Bot is in ${client.guilds.cache.size} server(s)`);
    
    // Load data from files
    userCooldowns = await loadCooldowns();
    userStats = await loadUserStats();
    
    // Retroactively grant achievements to all existing users
    const { checkAchievementsRetroactive, checkWayseeker, getUserStats } = require('./utils/statsManager');
    const { saveUserStats } = require('./utils/fileHandler');
    let totalUnlocked = 0;
    let hasChanges = false;
    
    for (const userId in userStats) {
        const stats = getUserStats(userId, userStats);
        const beforeCount = (stats.achievements || []).length;
        
        // Check and grant Wayseeker if user is owner
        checkWayseeker(userId, stats, config.ownerId, userStats);
        
        // Retroactively check all achievements
        const unlocked = checkAchievementsRetroactive(userId, stats);
        if (unlocked.length > 0) {
            userStats[userId] = stats;
            totalUnlocked += unlocked.length;
            hasChanges = true;
        } else if ((stats.achievements || []).length > beforeCount) {
            // Wayseeker was granted
            userStats[userId] = stats;
            hasChanges = true;
        }
    }
    
    // Save all changes
    if (hasChanges) {
        await saveUserStats(userStats);
        console.log(`Retroactively granted ${totalUnlocked} achievement(s) to existing users!`);
    }
    
    // Initial status update
    updateStatus();
    
    // Update status every 10 minutes
    setInterval(updateStatus, 10 * 60 * 1000);
    
    // Update cached reset time every minute (handled internally by getCachedResetTime)
    setInterval(() => {
        getCachedResetTime();
    }, 60000);
    
    // Clean old cooldowns daily at UTC midnight
    const now = new Date();
    const tomorrow = getTomorrowUTC();
    const timeUntilMidnight = tomorrow - now;
    
    setTimeout(() => {
        cleanOldCooldowns(userCooldowns);
        setInterval(() => cleanOldCooldowns(userCooldowns), 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // Check maintenance mode (allow maintenance commands to work)
    if (maintenanceMode.active && interaction.commandName !== 'maintenance' && interaction.commandName !== 'maintfinish') {
        await interaction.reply({
            content: `⚠️ Maintenance Ongoing. Reason: ${maintenanceMode.reason}`,
            ephemeral: true
        });
        return;
    }

    // Route commands to handlers
    try {
        switch (interaction.commandName) {
            case 'reading':
                await handleReading(interaction, userCooldowns, userStats, config.ownerId);
                break;
            case 'tiers':
                await handleTiers(interaction);
                break;
            case 'stats':
                await handleStats(interaction, userStats, getUserDisplayName, config.ownerId);
                break;
            case 'leaderboard':
                await handleLeaderboard(interaction, userStats, getUserDisplayName);
                break;
            case 'maintenance':
                await handleMaintenance(interaction, maintenanceMode, updateStatus, isOwner);
                break;
            case 'maintfinish':
                await handleMaintFinish(interaction, maintenanceMode, updateStatus, isOwner);
                break;
            case 'announce':
                await handleAnnounce(interaction, isOwner);
                break;
            case 'force-reading':
                await handleForceReading(interaction, isOwner);
                break;
            case 'achinfo':
                await handleAchInfo(interaction, userStats, config.ownerId);
                break;
        }
    } catch (error) {
        console.error('Error handling command:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ An error occurred while processing your command.',
                ephemeral: true
            }).catch(() => {});
        }
    }
});

client.login(config.token);
