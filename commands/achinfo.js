const { EmbedBuilder } = require('discord.js');
const { achievements, getUserStats, checkWayseeker, checkAchievementsRetroactive } = require('../utils/statsManager');
const { saveUserStatsDebounced } = require('../utils/fileHandler');

async function handleAchInfo(interaction, userStats, ownerId) {
    const userId = interaction.user.id;
    const stats = getUserStats(userId, userStats);
    
    // Check and grant Wayseeker if user is owner
    checkWayseeker(userId, stats, ownerId, userStats);
    
    // Retroactively check and grant any achievements the user qualifies for
    const unlocked = checkAchievementsRetroactive(userId, stats);
    if (unlocked.length > 0) {
        userStats[userId] = stats;
        saveUserStatsDebounced(userStats);
    }
    
    const userAchievements = stats.achievements || [];
    
    // Get all achievement IDs
    const allAchievementIds = Object.keys(achievements);
    
    // Separate achievements into categories
    const easyAchievements = [];
    const mediumAchievements = [];
    const hardAchievements = [];
    const specialAchievements = [];
    
    allAchievementIds.forEach(achId => {
        const ach = achievements[achId];
        const hasAchievement = userAchievements.includes(achId);
        const status = hasAchievement ? '✅' : '❌';
        
        const achInfo = {
            id: achId,
            name: ach.name,
            emoji: ach.emoji,
            description: ach.description,
            status: status,
            has: hasAchievement
        };
        
        // Categorize achievements
        if (achId === 'wayseeker') {
            specialAchievements.push(achInfo);
        } else if (ach.description.includes('Unveil more')) {
            hardAchievements.push(achInfo);
        } else if (['first_reading', 'early_bird', 'fortune_favor', 'balanced', 'lucky_streak', 'persistent'].includes(achId)) {
            easyAchievements.push(achInfo);
        } else {
            mediumAchievements.push(achInfo);
        }
    });
    
    // Build embed fields
    const fields = [];
    
    // Special achievements
    if (specialAchievements.length > 0) {
        const specialText = specialAchievements.map(ach => 
            `${ach.status} ${ach.emoji} **${ach.name}**\n   ${ach.description}`
        ).join('\n\n');
        fields.push({ name: '🌟 Special Achievements', value: specialText, inline: false });
    }
    
    // Easy achievements
    if (easyAchievements.length > 0) {
        const easyText = easyAchievements.map(ach => 
            `${ach.status} ${ach.emoji} **${ach.name}**\n   ${ach.description}`
        ).join('\n\n');
        fields.push({ name: '📚 Easy Achievements', value: easyText, inline: false });
    }
    
    // Medium achievements
    if (mediumAchievements.length > 0) {
        const mediumText = mediumAchievements.map(ach => 
            `${ach.status} ${ach.emoji} **${ach.name}**\n   ${ach.description}`
        ).join('\n\n');
        fields.push({ name: '⭐ Medium Achievements', value: mediumText, inline: false });
    }
    
    // Hard achievements
    if (hardAchievements.length > 0) {
        const hardText = hardAchievements.map(ach => 
            `${ach.status} ${ach.emoji} **${ach.name}**\n   ${ach.description}`
        ).join('\n\n');
        fields.push({ name: '💎 Hard Achievements', value: hardText, inline: false });
    }
    
    // Calculate completion stats
    const totalAchievements = allAchievementIds.length;
    const unlockedCount = userAchievements.length;
    const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);
    
    const embed = new EmbedBuilder()
        .setColor('#9370DB')
        .setTitle('🏆 Achievement Guide')
        .setDescription(`**Your Progress:** ${unlockedCount}/${totalAchievements} (${completionPercentage}%)\n\n✅ = Unlocked | ❌ = Locked`)
        .addFields(fields)
        .setFooter({ text: 'Keep reading daily to unlock more achievements!' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}

module.exports = { handleAchInfo };

