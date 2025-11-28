const { EmbedBuilder } = require('discord.js');
const { getRandomTier, getRandomFortune, getTierColor } = require('../utils/fortuneData');
const { getCachedResetTime, canGetReading, setUserCooldown, getTomorrowUTC } = require('../utils/helpers');
const { updateUserStats, checkWayseeker, getUserStats } = require('../utils/statsManager');

async function handleReading(interaction, userCooldowns, userStats, ownerId) {
    const userId = interaction.user.id;
    

    const stats = getUserStats(userId, userStats);
    checkWayseeker(userId, stats, ownerId, userStats);
    
    if (!canGetReading(userId, userCooldowns)) {
        const now = new Date();
        const tomorrow = getTomorrowUTC();
        const diff = tomorrow - now;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        await interaction.reply({
            content: `You have already received your daily fortune reading. Your next reading will be available in **${hours}h ${minutes}m**.`,
            ephemeral: true
        });
        return;
    }
    
    const tier = getRandomTier();
    const fortune = getRandomFortune(tier);
    
    // Update user stats and check achievements
    const unlockedAchievements = updateUserStats(userId, tier, userStats);
    
    const embed = new EmbedBuilder()
        .setColor(getTierColor(tier))
        .setTitle(`🔮 Your Daily Fortune`)
        .setDescription(`**[${tier}]**\n${fortune.emojis} **${fortune.name}**\n\n*${fortune.reading}*\n\n⚠️ Divination is for entertainment only and should not be taken as real advice. Keep it fun and casual!`)
        .setFooter({ text: `Next reading: ${getCachedResetTime()}` })
        .setTimestamp();
    
    // Add achievement notification if any were unlocked
    if (unlockedAchievements.length > 0) {
        const achievementText = unlockedAchievements.map(ach => `${ach.emoji} **${ach.name}**`).join('\n');
        embed.addFields({ 
            name: '🎉 Achievement Unlocked!', 
            value: achievementText, 
            inline: false 
        });
    }
    
    await interaction.reply({ embeds: [embed] });
    setUserCooldown(userId, userCooldowns);
}

module.exports = { handleReading };

