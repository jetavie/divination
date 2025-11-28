require('dotenv').config();
const { REST, Routes } = require('discord.js');

const config = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    ownerId: process.env.DISCORD_OWNER_ID
};

if (!config.token || !config.clientId) {
    throw new Error('DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in your environment.');
}

const commands = [
    {
        name: 'reading',
        description: 'Receive your daily divination.'
    },
    {
        name: 'tiers',
        description: 'View fortune tiers and their meanings.'
    },
    {
        name: 'stats',
        description: 'View personal Statistics and Achievements'
    },
    {
        name: 'leaderboard',
        description: 'View Leaderboards for streaks and Supreme Fortunes.',
        options: [
            {
                name: 'type',
                type: 3,
                description: 'Type of Leaderboard',
                required: false,
                choices: [
                    {
                        name: 'Longest Streaks',
                        value: 'streak'
                    },
                    {
                        name: 'Most Supreme Fortunes',
                        value: 'supreme'
                    }
                ]
            }
        ]
    },
    {
        name: 'maintenance',
        description: 'Start Maintenance mode (Developer Only)',
        options: [
            {
                name: 'reason',
                type: 3,
                description: 'Reason for Maintenance?',
                required: true
            }
        ]
    },
    {
        name: 'maintfinish',
        description: 'End maintenance mode (Developer Only)'
    },
    {
        name: 'announce',
        description: 'Send an announcement to the current channel. (Developer Only)',
        options: [
            {
                name: 'message',
                type: 3,
                description: 'The announcement message?',
                required: true
            }
        ]
    },
    {
        name: 'force-reading',
        description: 'Force a divination to a user (Developer Only)',
        options: [
            {
                name: 'user',
                type: 6,
                description: 'Who do you want to force a divination to?',
                required: true
            }
        ]
    },
    {
        name: 'achinfo',
        description: 'View all achievements, how to get them, and your progress.'
    }
];

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        console.log('Commands registered:');
        data.forEach(cmd => console.log(`  - /${cmd.name}`));
    } catch (error) {
        console.error('Error deploying commands:', error);
    }
})();