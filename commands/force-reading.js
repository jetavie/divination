const { EmbedBuilder } = require('discord.js');
const { getRandomTier, getRandomFortune, getTierColor } = require('../utils/fortuneData');

async function handleForceReading(interaction, isOwner) {
    // Check if user is owner
    if (!isOwner(interaction.user.id)) {
        await interaction.reply({
            content: '❌ Insufficient Permissions.',
            ephemeral: true
        });
        return;
    }
    
    const targetUser = interaction.options.getUser('user');
    if (!targetUser) {
        await interaction.reply({
            content: '❌ Please specify a user to force a divination to.',
            ephemeral: true
        });
        return;
    }
    
    const tier = getRandomTier();
    const fortune = getRandomFortune(tier);
    
    // Test reading - does not affect stats, achievements, or cooldowns
    const embed = new EmbedBuilder()
        .setColor(getTierColor(tier))
        .setTitle(`🔮 ${targetUser.username}'s Test Fortune Reading`)
        .setDescription(`**[${tier}]**\n${fortune.emojis} **${fortune.name}**\n\n*${fortune.reading}*\n\n⚠️ Divination is for entertainment only and should not be taken as real advice. Keep it fun and casual!`)
        .setFooter({ text: 'Test reading - does not affect stats or achievements' })
        .setTimestamp();
    
    await interaction.reply({ 
        content: `✅ Test divination generated for ${targetUser.toString()}`,
        embeds: [embed],
        ephemeral: true
    });
}

module.exports = { handleForceReading };

