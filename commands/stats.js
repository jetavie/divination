const { EmbedBuilder } = require('discord.js');
const { getUserStats, achievements, checkWayseeker, checkAchievementsRetroactive } = require('../utils/statsManager');
const { saveUserStatsDebounced } = require('../utils/fileHandler');

async function handleStats(interaction, userStats, getUserDisplayName, ownerId) {
    const userId = interaction.user.id;
    const stats = getUserStats(userId, userStats);
    

    checkWayseeker(userId, stats, ownerId, userStats);
    
    // Retroactively check and grant any achievements the user qualifies for
    const unlocked = checkAchievementsRetroactive(userId, stats);
    if (unlocked.length > 0) {
        userStats[userId] = stats;
        saveUserStatsDebounced(userStats);
    }
    
    // Get display name
    const displayName = await getUserDisplayName(userId, interaction.guild);
    
    // Get most common tier
    let mostCommonTier = 'None';
    let maxCount = 0;
    if (stats.tierCounts) {
        for (const [tier, count] of Object.entries(stats.tierCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommonTier = tier;
            }
        }
    }
    

    let achievementsList = 'None';
    if (stats.achievements && stats.achievements.length > 0) {
        achievementsList = stats.achievements.map(achId => {
            const ach = achievements[achId];
            return ach ? `${ach.emoji} ${ach.name}` : achId;
        }).join('\n');
    }
    
    const embed = new EmbedBuilder()
        .setColor('#9370DB')
        .setTitle(`📊 ${displayName}'s Statistics`)
        .addFields(
            { name: '📖 Total Readings', value: `${stats.totalReadings || 0}`, inline: true },
            { name: '🔥 Current Streak', value: `${stats.currentStreak || 0} days`, inline: true },
            { name: '⭐ Longest Streak', value: `${stats.longestStreak || 0} days`, inline: true },
            { name: '☀️ Supreme Fortunes', value: `${stats.supremeFortuneCount || 0}`, inline: true },
            { name: '🎯 Most Common Tier', value: mostCommonTier, inline: true },
            { name: '🏆 Achievements', value: achievementsList, inline: false }
        )
        .setFooter({ text: 'Keep reading daily to unlock more Achievements!' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}

module.exports = { handleStats };

