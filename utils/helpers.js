const { getTodayDateString } = require('./statsManager');
const { saveCooldownsDebounced, saveCooldowns } = require('./fileHandler');

// Date helper functions
function getTomorrowUTC() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
}

// Calculate time until next UTC midnight
function getTimeUntilReset() {
    const now = new Date();
    const tomorrow = getTomorrowUTC();
    const diff = tomorrow - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m until reset`;
}

// Cache date calculations for performance
let cachedResetTime = getTimeUntilReset();
let lastResetTimeUpdate = Date.now();

function getCachedResetTime() {
    const now = Date.now();
    if (now - lastResetTimeUpdate > 60000) { // Update every minute
        cachedResetTime = getTimeUntilReset();
        lastResetTimeUpdate = now;
    }
    return cachedResetTime;
}

// Check if user can get reading
function canGetReading(userId, userCooldowns) {
    const today = getTodayDateString();
    return !userCooldowns[userId] || userCooldowns[userId] !== today;
}

// Set user cooldown
function setUserCooldown(userId, userCooldowns) {
    const today = getTodayDateString();
    userCooldowns[userId] = today;
    saveCooldownsDebounced(userCooldowns);
}

// Clean up old cooldowns
async function cleanOldCooldowns(userCooldowns) {
    const today = getTodayDateString();
    let cleaned = false;
    
    for (const userId in userCooldowns) {
        if (userCooldowns[userId] !== today) {
            delete userCooldowns[userId];
            cleaned = true;
        }
    }
    
    if (cleaned) {
        await saveCooldowns(userCooldowns);
    }
}

module.exports = {
    getTomorrowUTC,
    getTimeUntilReset,
    getCachedResetTime,
    canGetReading,
    setUserCooldown,
    cleanOldCooldowns
};

