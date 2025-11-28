const { saveUserStatsDebounced } = require('./fileHandler');

// Default user stats structure
const DEFAULT_USER_STATS = {
    totalReadings: 0,
    currentStreak: 0,
    longestStreak: 0,
    supremeFortuneCount: 0,
    lastReadingDate: null,
    firstReadingDate: null,
    achievements: [],
    tierCounts: {
        'Supreme Fortune': 0,
        'Greater Fortune': 0,
        'Fortune': 0,
        'Lesser Fortune': 0,
        'Success': 0,
        'Neutral': 0
    },
    consecutiveSupreme: 0,
    lastTier: null
};

// Achievement definitions
const achievements = {
    'first_reading': { name: 'First Reading', emoji: '🔮', description: 'Receive your first fortune reading.' },
    'week_warrior': { name: 'Week Warrior', emoji: '⚔️', description: 'Maintain a 7-day reading streak.' },
    'month_master': { name: 'Month Master', emoji: '👑', description: 'Maintain a 30-day reading streak' },
    'supreme_seeker': { name: 'Supreme Seeker', emoji: '☀️', description: 'Receive a Supreme Fortune reading.' },
    'supreme_collector': { name: 'Supreme Collector', emoji: '⭐', description: 'Receive 5 Supreme Fortune readings.' },
    'neutral_navigator': { name: 'Neutral Navigator', emoji: '🌑', description: 'Receive 5 Neutral readings.' },
    'dedicated_diviner': { name: 'Dedicated Diviner', emoji: '✨', description: 'Receive 100 total readings.' },

    'early_bird': { name: 'Early Bird', emoji: '🐦', description: 'Get a reading within your first 3 days.' },
    'fortune_favor': { name: 'Fortune Favor', emoji: '🌟', description: 'Receive 3 Greater Fortune readings.' },
    'balanced': { name: 'Balanced', emoji: '⚖️', description: 'Receive at least one reading of each tier.' },
    'lucky_streak': { name: 'Lucky Streak', emoji: '🍀', description: 'Get 2 Supreme Fortunes in a row.' },
    'persistent': { name: 'Persistent', emoji: '💪', description: 'Maintain a 14-day reading streak.' },
    // Hard achievements
    'supreme_master': { name: 'Supreme Master', emoji: '👑', description: 'Unveil more to achieve this.' },
    'centurion': { name: 'Centurion', emoji: '🏛️', description: 'Unveil more to achieve this.' },
    'unbreakable': { name: 'Unbreakable', emoji: '💎', description: 'Unveil more to achieve this.' },
    'perfect_balance': { name: 'Perfect Balance', emoji: '🎯', description: 'Unveil more to achieve this.' },
    'neutral_champion': { name: 'Neutral Champion', emoji: '🌑', description: 'Unveil more to achieve this.' },
    'fortunes_chosen': { name: "Fortune's Chosen", emoji: '⭐', description: 'Unveil more to achieve this.' },

    'wayseeker': { name: 'Wayseeker', emoji: '🥠', description: 'Given to whom first saught what thy future held, beyond realms and transcending fate. (You must be the developer to achieve this.)' }
};


function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}


function getUserStats(userId, userStats) {
    if (!userStats[userId]) {
        userStats[userId] = JSON.parse(JSON.stringify(DEFAULT_USER_STATS));
    }
    return userStats[userId];
}

// Check and unlock achievements retroactively (without requiring a new reading)
function checkAchievementsRetroactive(userId, stats) {
    const unlocked = [];
    const userAchievements = stats.achievements || [];
    
    // Ensure tierCounts exists
    if (!stats.tierCounts) {
        stats.tierCounts = JSON.parse(JSON.stringify(DEFAULT_USER_STATS.tierCounts));
    }
    
    // First Reading
    if (stats.totalReadings >= 1 && !userAchievements.includes('first_reading')) {
        userAchievements.push('first_reading');
        unlocked.push(achievements['first_reading']);
    }
    
    // Week Warrior (7-day streak) - check both current and longest streak
    if ((stats.currentStreak >= 7 || stats.longestStreak >= 7) && !userAchievements.includes('week_warrior')) {
        userAchievements.push('week_warrior');
        unlocked.push(achievements['week_warrior']);
    }
    
    // Month Master (30-day streak) - check both current and longest streak
    if ((stats.currentStreak >= 30 || stats.longestStreak >= 30) && !userAchievements.includes('month_master')) {
        userAchievements.push('month_master');
        unlocked.push(achievements['month_master']);
    }
    
    // Supreme Seeker (first Supreme Fortune) - check if they have any Supreme Fortunes
    if (stats.supremeFortuneCount >= 1 && !userAchievements.includes('supreme_seeker')) {
        userAchievements.push('supreme_seeker');
        unlocked.push(achievements['supreme_seeker']);
    }
    
    // Supreme Collector (5 Supreme Fortunes)
    if (stats.supremeFortuneCount >= 5 && !userAchievements.includes('supreme_collector')) {
        userAchievements.push('supreme_collector');
        unlocked.push(achievements['supreme_collector']);
    }
    
    // Neutral Navigator (5 Neutral readings)
    if (stats.tierCounts['Neutral'] >= 5 && !userAchievements.includes('neutral_navigator')) {
        userAchievements.push('neutral_navigator');
        unlocked.push(achievements['neutral_navigator']);
    }
    
    // Dedicated Diviner (100 total readings)
    if (stats.totalReadings >= 100 && !userAchievements.includes('dedicated_diviner')) {
        userAchievements.push('dedicated_diviner');
        unlocked.push(achievements['dedicated_diviner']);
    }
    
    // Easy Achievements
    // Early Bird (reading within first 3 days)
    // If firstReadingDate is missing, estimate it from lastReadingDate and streak
    if (!stats.firstReadingDate && stats.lastReadingDate && stats.currentStreak) {
        // Estimate first reading date: lastReadingDate - (currentStreak - 1) days
        const lastDate = new Date(stats.lastReadingDate);
        const estimatedFirstDate = new Date(lastDate);
        estimatedFirstDate.setDate(estimatedFirstDate.getDate() - (stats.currentStreak - 1));
        stats.firstReadingDate = estimatedFirstDate.toISOString().split('T')[0];
    }
    
    if (stats.firstReadingDate && !userAchievements.includes('early_bird')) {
        const firstDate = new Date(stats.firstReadingDate);
        const today = new Date();
        const daysSinceFirst = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24));
        if (daysSinceFirst <= 3 && stats.totalReadings >= 1) {
            userAchievements.push('early_bird');
            unlocked.push(achievements['early_bird']);
        }
    }
    
    // Fortune Favor (3 Greater Fortune readings)
    if (stats.tierCounts['Greater Fortune'] >= 3 && !userAchievements.includes('fortune_favor')) {
        userAchievements.push('fortune_favor');
        unlocked.push(achievements['fortune_favor']);
    }
    
    // Balanced (at least one of each tier)
    if (!userAchievements.includes('balanced')) {
        const tiers = ['Supreme Fortune', 'Greater Fortune', 'Fortune', 'Lesser Fortune', 'Success', 'Neutral'];
        const hasAll = tiers.every(tier => (stats.tierCounts[tier] || 0) >= 1);
        if (hasAll) {
            userAchievements.push('balanced');
            unlocked.push(achievements['balanced']);
        }
    }
    
    // Lucky Streak (2 Supreme Fortunes in a row) - check consecutiveSupreme
    if (stats.consecutiveSupreme >= 2 && !userAchievements.includes('lucky_streak')) {
        userAchievements.push('lucky_streak');
        unlocked.push(achievements['lucky_streak']);
    }
    
    // Persistent (14-day streak) - check both current and longest streak
    if ((stats.currentStreak >= 14 || stats.longestStreak >= 14) && !userAchievements.includes('persistent')) {
        userAchievements.push('persistent');
        unlocked.push(achievements['persistent']);
    }
    
    // Hard Achievements
    // Supreme Master (25 Supreme Fortunes)
    if (stats.supremeFortuneCount >= 25 && !userAchievements.includes('supreme_master')) {
        userAchievements.push('supreme_master');
        unlocked.push(achievements['supreme_master']);
    }
    
    // Centurion (1000 total readings)
    if (stats.totalReadings >= 1000 && !userAchievements.includes('centurion')) {
        userAchievements.push('centurion');
        unlocked.push(achievements['centurion']);
    }
    
    // Unbreakable (100-day streak) - check both current and longest streak
    if ((stats.currentStreak >= 100 || stats.longestStreak >= 100) && !userAchievements.includes('unbreakable')) {
        userAchievements.push('unbreakable');
        unlocked.push(achievements['unbreakable']);
    }
    
    // Perfect Balance (exactly 10 of each tier)
    if (!userAchievements.includes('perfect_balance')) {
        const tiers = ['Supreme Fortune', 'Greater Fortune', 'Fortune', 'Lesser Fortune', 'Success', 'Neutral'];
        const allTen = tiers.every(tier => (stats.tierCounts[tier] || 0) === 10);
        if (allTen) {
            userAchievements.push('perfect_balance');
            unlocked.push(achievements['perfect_balance']);
        }
    }
    
    // Neutral Champion (50 Neutral readings)
    if (stats.tierCounts['Neutral'] >= 50 && !userAchievements.includes('neutral_champion')) {
        userAchievements.push('neutral_champion');
        unlocked.push(achievements['neutral_champion']);
    }
    
    // Fortune's Chosen (10 Supreme Fortunes in a row)
    if (stats.consecutiveSupreme >= 10 && !userAchievements.includes('fortunes_chosen')) {
        userAchievements.push('fortunes_chosen');
        unlocked.push(achievements['fortunes_chosen']);
    }
    
    stats.achievements = userAchievements;
    return unlocked;
}

// Check and unlock achievements (called when user gets a new reading)
function checkAchievements(userId, stats, tier) {
    const unlocked = [];
    const userAchievements = stats.achievements || [];
    
    // First Reading
    if (stats.totalReadings === 1 && !userAchievements.includes('first_reading')) {
        userAchievements.push('first_reading');
        unlocked.push(achievements['first_reading']);
    }
    
    // Week Warrior (7-day streak)
    if (stats.currentStreak >= 7 && !userAchievements.includes('week_warrior')) {
        userAchievements.push('week_warrior');
        unlocked.push(achievements['week_warrior']);
    }
    
    // Month Master (30-day streak)
    if (stats.currentStreak >= 30 && !userAchievements.includes('month_master')) {
        userAchievements.push('month_master');
        unlocked.push(achievements['month_master']);
    }
    
    // Supreme Seeker (first Supreme Fortune)
    if (tier === 'Supreme Fortune' && !userAchievements.includes('supreme_seeker')) {
        userAchievements.push('supreme_seeker');
        unlocked.push(achievements['supreme_seeker']);
    }
    
    // Supreme Collector (5 Supreme Fortunes)
    if (stats.supremeFortuneCount >= 5 && !userAchievements.includes('supreme_collector')) {
        userAchievements.push('supreme_collector');
        unlocked.push(achievements['supreme_collector']);
    }
    
    // Neutral Navigator (5 Neutral readings)
    if (stats.tierCounts['Neutral'] >= 5 && !userAchievements.includes('neutral_navigator')) {
        userAchievements.push('neutral_navigator');
        unlocked.push(achievements['neutral_navigator']);
    }
    
    // Dedicated Diviner (100 total readings)
    if (stats.totalReadings >= 100 && !userAchievements.includes('dedicated_diviner')) {
        userAchievements.push('dedicated_diviner');
        unlocked.push(achievements['dedicated_diviner']);
    }
    
    // Easy Achievements
    // Early Bird (reading within first 3 days)
    // If firstReadingDate is missing, estimate it from lastReadingDate and streak
    if (!stats.firstReadingDate && stats.lastReadingDate && stats.currentStreak) {

        const lastDate = new Date(stats.lastReadingDate);
        const estimatedFirstDate = new Date(lastDate);
        estimatedFirstDate.setDate(estimatedFirstDate.getDate() - (stats.currentStreak - 1));
        stats.firstReadingDate = estimatedFirstDate.toISOString().split('T')[0];
    }
    
    if (stats.firstReadingDate && !userAchievements.includes('early_bird')) {
        const firstDate = new Date(stats.firstReadingDate);
        const today = new Date();
        const daysSinceFirst = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24));
        if (daysSinceFirst <= 3 && stats.totalReadings >= 1) {
            userAchievements.push('early_bird');
            unlocked.push(achievements['early_bird']);
        }
    }
    
    // Fortune Favor (3 Greater Fortune readings)
    if (stats.tierCounts && stats.tierCounts['Greater Fortune'] >= 3 && !userAchievements.includes('fortune_favor')) {
        userAchievements.push('fortune_favor');
        unlocked.push(achievements['fortune_favor']);
    }
    
    // Balanced (at least one of each tier)
    if (stats.tierCounts && !userAchievements.includes('balanced')) {
        const tiers = ['Supreme Fortune', 'Greater Fortune', 'Fortune', 'Lesser Fortune', 'Success', 'Neutral'];
        const hasAll = tiers.every(tier => (stats.tierCounts[tier] || 0) >= 1);
        if (hasAll) {
            userAchievements.push('balanced');
            unlocked.push(achievements['balanced']);
        }
    }
    
    // Lucky Streak (2 Supreme Fortunes in a row)
    if (stats.consecutiveSupreme >= 2 && !userAchievements.includes('lucky_streak')) {
        userAchievements.push('lucky_streak');
        unlocked.push(achievements['lucky_streak']);
    }
    
    // Persistent (14-day streak)
    if (stats.currentStreak >= 14 && !userAchievements.includes('persistent')) {
        userAchievements.push('persistent');
        unlocked.push(achievements['persistent']);
    }
    
    // Hard Achievements
    // Supreme Master (25 Supreme Fortunes)
    if (stats.supremeFortuneCount >= 25 && !userAchievements.includes('supreme_master')) {
        userAchievements.push('supreme_master');
        unlocked.push(achievements['supreme_master']);
    }
    
    // Centurion (1000 total readings)
    if (stats.totalReadings >= 1000 && !userAchievements.includes('centurion')) {
        userAchievements.push('centurion');
        unlocked.push(achievements['centurion']);
    }
    
    // Unbreakable (100-day streak)
    if (stats.currentStreak >= 100 && !userAchievements.includes('unbreakable')) {
        userAchievements.push('unbreakable');
        unlocked.push(achievements['unbreakable']);
    }
    
    // Perfect Balance (exactly 10 of each tier)
    if (stats.tierCounts && !userAchievements.includes('perfect_balance')) {
        const tiers = ['Supreme Fortune', 'Greater Fortune', 'Fortune', 'Lesser Fortune', 'Success', 'Neutral'];
        const allTen = tiers.every(tier => (stats.tierCounts[tier] || 0) === 10);
        if (allTen) {
            userAchievements.push('perfect_balance');
            unlocked.push(achievements['perfect_balance']);
        }
    }
    
    // Neutral Champion (50 Neutral readings)
    if (stats.tierCounts && stats.tierCounts['Neutral'] >= 50 && !userAchievements.includes('neutral_champion')) {
        userAchievements.push('neutral_champion');
        unlocked.push(achievements['neutral_champion']);
    }
    
    // Fortune's Chosen (10 Supreme Fortunes in a row)
    if (stats.consecutiveSupreme >= 10 && !userAchievements.includes('fortunes_chosen')) {
        userAchievements.push('fortunes_chosen');
        unlocked.push(achievements['fortunes_chosen']);
    }
    
    stats.achievements = userAchievements;
    return unlocked;
}

// Update user stats after reading
function updateUserStats(userId, tier, userStats) {
    const stats = getUserStats(userId, userStats);
    const today = getTodayDateString();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Set first reading date if this is the first reading
    if (!stats.firstReadingDate) {
        stats.firstReadingDate = today;
    }
    
    
    stats.totalReadings = (stats.totalReadings || 0) + 1;
    

    if (stats.lastReadingDate === yesterday) {
        // Continuing streak
        stats.currentStreak = (stats.currentStreak || 0) + 1;
    } else if (stats.lastReadingDate === today) {
        // Already read today, don't update streak
    } else {

        stats.currentStreak = 1;
    }
    
    // Update longest streak
    if (stats.currentStreak > (stats.longestStreak || 0)) {
        stats.longestStreak = stats.currentStreak;
    }
    
    // Update tier counts
    if (!stats.tierCounts) {
        stats.tierCounts = JSON.parse(JSON.stringify(DEFAULT_USER_STATS.tierCounts));
    }
    stats.tierCounts[tier] = (stats.tierCounts[tier] || 0) + 1;
    

    if (tier === 'Supreme Fortune') {
        stats.supremeFortuneCount = (stats.supremeFortuneCount || 0) + 1;
        // If last tier was also Supreme Fortune, increment consecutive
        if (stats.lastTier === 'Supreme Fortune') {
            stats.consecutiveSupreme = (stats.consecutiveSupreme || 0) + 1;
        } else {
            stats.consecutiveSupreme = 1;
        }
    } else {
        // Reset consecutive Supreme Fortune streak
        stats.consecutiveSupreme = 0;
    }
    
    // Update last tier
    stats.lastTier = tier;
    
    // Update last reading date
    stats.lastReadingDate = today;
    
    // Check achievements
    const unlocked = checkAchievements(userId, stats, tier);
    
    userStats[userId] = stats;
    saveUserStatsDebounced(userStats);
    
    return unlocked;
}


function checkWayseeker(userId, stats, ownerId, userStats) {
    if (userId === ownerId && stats && !stats.achievements.includes('wayseeker')) {
        stats.achievements.push('wayseeker');
        if (userStats) {
            userStats[userId] = stats;
            saveUserStatsDebounced(userStats);
        }
        return achievements['wayseeker'];
    }
    return null;
}

module.exports = {
    DEFAULT_USER_STATS,
    achievements,
    getTodayDateString,
    getUserStats,
    checkAchievements,
    checkAchievementsRetroactive,
    updateUserStats,
    checkWayseeker
};

