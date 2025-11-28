async function handleMaintenance(interaction, maintenanceMode, updateStatus, isOwner) {
    // Check if user is owner
    if (!isOwner(interaction.user.id)) {
        await interaction.reply({
            content: '❌ Insufficient Permissions.',
            ephemeral: true
        });
        return;
    }

    const reason = interaction.options.getString('reason');
    maintenanceMode.active = true;
    maintenanceMode.reason = reason;
    
    updateStatus();
    
    await interaction.reply({
        content: `✅ Maintenance Started. Reason: ${reason}`,
        ephemeral: true
    });
}

module.exports = { handleMaintenance };

