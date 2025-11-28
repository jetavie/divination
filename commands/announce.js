async function handleAnnounce(interaction, isOwner) {
    // Check if user is owner
    if (!isOwner(interaction.user.id)) {
        await interaction.reply({
            content: '❌ Insufficient Permissions.',
            ephemeral: true
        });
        return;
    }
    
    // Check if command is used in a server
    if (!interaction.guild) {
        await interaction.reply({
            content: '❌ This command can only be used in a Server.',
            ephemeral: true
        });
        return;
    }
    
    const message = interaction.options.getString('message');
    const channel = interaction.channel;
    const formattedMessage = `[📢Announcement] ${message}`;
    
    try {
        await channel.send(formattedMessage);
        await interaction.reply({
            content: `✅ Announcement sent to ${channel.toString()}!`,
            ephemeral: true
        });
    } catch (error) {
        await interaction.reply({
            content: `❌ Error sending announcement: ${error.message}`,
            ephemeral: true
        });
    }
}

module.exports = { handleAnnounce };

