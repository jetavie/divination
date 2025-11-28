const fsPromises = require('fs').promises;
const path = require('path');

const COOLDOWNS_FILE = path.join(__dirname, '..', 'cooldowns.json');
const USERSTATS_FILE = path.join(__dirname, '..', 'userstats.json');

// Load cooldowns from file
async function loadCooldowns() {
    try {
        const data = await fsPromises.readFile(COOLDOWNS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Error loading cooldowns:', error);
        }
        return {};
    }
}

// Save cooldowns to file
async function saveCooldowns(cooldowns) {
    try {
        await fsPromises.writeFile(COOLDOWNS_FILE, JSON.stringify(cooldowns, null, 2));
    } catch (error) {
        console.error('Error saving cooldowns:', error);
    }
}

// Debounced save cooldowns
let saveCooldownsTimeout;
function saveCooldownsDebounced(cooldowns) {
    clearTimeout(saveCooldownsTimeout);
    saveCooldownsTimeout = setTimeout(() => saveCooldowns(cooldowns), 1000);
}

// Load user stats from file
async function loadUserStats() {
    try {
        const data = await fsPromises.readFile(USERSTATS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Error loading user stats:', error);
        }
        return {};
    }
}

// Save user stats to file
async function saveUserStats(userStats) {
    try {
        await fsPromises.writeFile(USERSTATS_FILE, JSON.stringify(userStats, null, 2));
    } catch (error) {
        console.error('Error saving user stats:', error);
    }
}

// Debounced save user stats
let saveUserStatsTimeout;
function saveUserStatsDebounced(userStats) {
    clearTimeout(saveUserStatsTimeout);
    saveUserStatsTimeout = setTimeout(() => saveUserStats(userStats), 1000);
}

module.exports = {
    loadCooldowns,
    saveCooldowns,
    saveCooldownsDebounced,
    loadUserStats,
    saveUserStats,
    saveUserStatsDebounced
};

