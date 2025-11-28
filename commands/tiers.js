const { EmbedBuilder } = require('discord.js');
const { tierDescriptions } = require('../utils/fortuneData');

async function handleTiers(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#9370DB')
        .setTitle('🎴 Fortune Tier Guide')
        .setDescription('Here are the six tiers of fortune and what they mean:')
        .addFields(
            { name: '☀️ Supreme Fortune', value: tierDescriptions['Supreme Fortune'], inline: false },
            { name: '⭐ Greater Fortune', value: tierDescriptions['Greater Fortune'], inline: false },
            { name: '🌟 Fortune', value: tierDescriptions['Fortune'], inline: false },
            { name: '🌙 Lesser Fortune', value: tierDescriptions['Lesser Fortune'], inline: false },
            { name: '💫 Success', value: tierDescriptions['Success'], inline: false },
            { name: '🌑 Neutral', value: tierDescriptions['Neutral'], inline: false }
        )
        .setFooter({ text: 'Use /reading to receive your daily fortune!' });
    
    await interaction.reply({ embeds: [embed] });
}

module.exports = { handleTiers };

