async function handleMaintFinish(interaction, maintenanceMode, updateStatus, isOwner) {
 
    if (!isOwner(interaction.user.id)) {
        await interaction.reply({
            content: '❌ Insufficient Permissions.',
            ephemeral: true
        });
        return;
    }

    maintenanceMode.active = false;
    maintenanceMode.reason = '';
    
    updateStatus();
    
    await interaction.reply({
        content: '✅ Maintenance ended.',
        ephemeral: true
    });
}

module.exports = { handleMaintFinish };

