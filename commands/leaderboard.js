const { EmbedBuilder } = require('discord.js');

async function handleLeaderboard(interaction, userStats, getUserDisplayName) {
    const type = interaction.options.getString('type') || 'streak';
    
    // Collect all users with stats (parallelized for better performance)
    const usersWithStatsPromises = Object.entries(userStats).map(async ([userId, stats]) => {
        try {
            const displayName = await getUserDisplayName(userId, interaction.guild);
            
            if (type === 'streak') {
                return {
                    userId,
                    username: displayName,
                    value: stats.longestStreak || 0
                };
            } else if (type === 'supreme') {
                return {
                    userId,
                    username: displayName,
                    value: stats.supremeFortuneCount || 0
                };
            }
            return null;
        } catch (error) {

            return null;
        }
    });
    
    const usersWithStats = (await Promise.all(usersWithStatsPromises)).filter(u => u !== null);
    

    usersWithStats.sort((a, b) => b.value - a.value);
    
    // Get top 10
    const topUsers = usersWithStats.slice(0, 10);
    
    let leaderboardText = '';
    if (topUsers.length === 0) {
        leaderboardText = 'No data available yet. Be the first to get a reading!';
    } else {
        leaderboardText = topUsers.map((user, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            const unit = type === 'streak' ? 'days' : 'readings';
            return `${medal} **${user.username}** - ${user.value} ${unit}`;
        }).join('\n');
    }
    
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle(`🏆 Leaderboard - ${type === 'streak' ? 'Longest Streaks' : 'Most Supreme Fortunes'}`)
        .setDescription(leaderboardText)
        .setFooter({ text: `Want to see your personal statistics? Use /stats!` })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}

module.exports = { handleLeaderboard };

