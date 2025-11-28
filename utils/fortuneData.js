
const fortunes = {
    'Supreme Fortune': [
        { emojis: '☀️☀️☀️', name: 'Radiant Days, Glorious Days', reading: 'The heavens smile upon you with boundless favor. Your path is illuminated by three suns, each casting away shadow and doubt. Great triumphs await in all endeavors—seize this moment, for destiny itself bends to your will.' },
        { emojis: '🔥🔥🔥', name: 'Eternal Flames', reading: 'Three sacred fires burn within your soul, igniting passion, power, and purpose. You are unstoppable, a force of pure transformation. What you touch turns to gold, what you pursue becomes yours. The universe conspires in your favor.' },
        { emojis: '⭐️⭐️⭐️', name: "Heaven's Ladder", reading: 'You stand at the base of a celestial ladder, each star a rung leading to infinite heights. Ascension is guaranteed—your dreams are not mere wishes but prophecies waiting to unfold. Climb without fear, for the cosmos supports every step.' }
    ],
    'Greater Fortune': [
        { emojis: '☀️☀️⭐️', name: 'Sunfire Harmony', reading: 'Two suns and a star dance in perfect balance—warmth and wonder intertwine. Your efforts will be rewarded handsomely, though the path may require both brilliance and grace. Success is certain, but savoring the journey makes it sweeter.' },
        { emojis: '⭐️⭐️☀️', name: "Heaven's Radiance", reading: 'Celestial stars guide you while the sun crowns your achievements. Fortune favors your ambitions, and obstacles crumble before your resolve. Trust in your vision—the universe has already approved your plans.' },
        { emojis: '🔥🔥☀️', name: 'Dual Flame', reading: 'Twin fires merge with solar brilliance, creating a blaze that cannot be extinguished. Your determination and luck combine into an unstoppable force. Expect breakthroughs and victories in matters close to your heart.' },
        { emojis: '☀️🔥⭐️', name: 'Burning Skies', reading: 'The heavens themselves burn with your potential. Sun, flame, and star unite to forge extraordinary opportunities. This is a time of power and possibility—embrace boldness and watch miracles unfold.' }
    ],
    'Fortune': [
        { emojis: '☀️☀️🌙', name: 'Radiant Yang, Embracing Yin', reading: 'Brilliant light meets gentle shadow—balance is your strength. Good fortune comes, but wisdom lies in knowing when to shine and when to rest. Navigate with awareness, and prosperity will flow naturally.' },
        { emojis: '🔥🔥🌙', name: 'Blazing Light, Hidden Shadow', reading: 'Your passion burns bright, yet mystery lingers at the edges. Success is yours, but some things remain hidden for now. Trust the process—what is concealed today will be revealed when the time is right.' },
        { emojis: '⭐️⭐️🌙', name: 'Keeper of Truth in Illusion', reading: 'Stars illuminate while the moon casts shadows. You possess the gift of seeing through deception to find truth. Fortune favors your discernment—trust your intuition and you will navigate any challenge.' },
        { emojis: '☀️⭐️🌙', name: 'Forging Gold, Tempering Jade', reading: 'Light and darkness work in harmony to refine your spirit. Challenges may appear, but they only serve to strengthen what you are building. Your efforts will yield precious results, polished and perfected.' },
        { emojis: '☀️🔥🌙', name: 'Thunder in Daylight', reading: 'Power surges beneath a calm exterior. Your fortune is strong, though unexpected shifts may occur. Stay adaptable—what seems like disruption is actually clearing the way for greater blessings.' },
        { emojis: '⭐️🔥🌙', name: 'Blazing Weave', reading: 'Threads of fire and starlight weave through moonlit nights. Your path is complex but rewarding. Fortune smiles on those who embrace both ambition and patience—you have both.' }
    ],
    'Lesser Fortune': [
        { emojis: '🌙⚡️☀️', name: 'Candlelight in Dark Room', reading: 'A single flame flickers in darkness before dawn breaks. Hope persists despite difficulties. Your luck is modest but present—small victories will accumulate into something meaningful. Keep the faith.' },
        { emojis: '🌙🌠☀️', name: 'Frost Blade in Sunlight', reading: 'Sharp edges meet warmth—tension between opposing forces. Fortune is split, requiring careful navigation. Success is possible, but demands strategy and timing. Choose your battles wisely.' },
        { emojis: '⚡️🌠☀️', name: 'Jiao Bound in Unpassable River', reading: 'Even dragons can find themselves temporarily constrained. Your potential is great, but circumstances limit you for now. Patience is required—when the river parts, you will soar unimpeded.' },
        { emojis: '⚡️⚡️☀️', name: 'Overload Reaction', reading: 'Energy surges chaotically before finding focus. Too much power without direction creates instability. A touch of fortune exists, but you must ground yourself to harness it effectively.' },
        { emojis: '🌠🌠☀️', name: 'Smothering Twin Jades', reading: 'Precious elements clash rather than harmonize. Your blessings feel muted, covered by circumstances beyond your control. The sun will break through eventually—persist through the haze.' },
        { emojis: '🌙🌙☀️', name: 'Sun Inside Darkness', reading: 'Light exists but struggles to shine through. Your fortune is there, buried beneath layers of shadow. Dig deep and do not lose hope—the dawn always follows the darkest night.' }
    ],
    'Success': [
        { emojis: '🌙🌠⚡️', name: 'Frozen Sparks of Moonlight', reading: 'Beauty exists in stillness—quiet victories rather than thunderous triumphs. Your success comes in subtle forms: a kind word, a moment of clarity, a gentle step forward. Appreciate the small gifts.' },
        { emojis: '🌙🌙🌠', name: 'Jade Plate Quake', reading: 'What seemed stable may shift slightly. Success is achievable but requires adaptation. The foundation trembles but does not break—adjust your approach and you will find solid ground again.' },
        { emojis: '🌠🌠🌙', name: 'Dual Essence of Frost', reading: 'Cool determination in a cold world. Your path forward is clear but not easy. Success demands resilience and composure. Face challenges with a steady heart, and you will endure.' },
        { emojis: '⚡️⚡️🌙', name: 'Thunder Shatters Jade', reading: 'Sudden disruptions break through fragile peace. Success may come at a cost or through unexpected means. Embrace change rather than resist it—transformation, though jarring, often brings growth.' }
    ],
    'Neutral': [
        { emojis: '🌠🌠🌠', name: 'Underworld Abyss', reading: 'You stand at the edge of the void, where even starlight falters. Fortune has turned its face away. This is a time for inner strength and perseverance. Trust that even the abyss has a bottom, and what falls must eventually rise.' },
        { emojis: '🌩️🌩️🌩️', name: "Thunder's Wrath", reading: 'The heavens rage with fury, and chaos reigns. Luck has abandoned you temporarily—brace for storms. This is not permanent, but it demands caution. Seek shelter, protect what matters, and wait for the tempest to pass.' },
        { emojis: '🌑🌑🌑', name: 'Moon Devoured', reading: 'Three new moons signal absence and emptiness. Fortune is at its lowest ebb. Do not make major decisions now; instead, reflect and prepare. Even the darkest night eventually gives way to dawn.' }
    ]
};


const tierDescriptions = {
    'Supreme Fortune': 'The absolute pinnacle of cosmic favor. When you receive this, the universe itself celebrates your potential. Everything aligns in your favor.',
    'Greater Fortune': 'Excellent luck with powerful energy flowing your way. Success is nearly guaranteed, though perhaps with a touch of effort required.',
    'Fortune': 'Solid good fortune balanced with wisdom. Things will go well if you navigate with care and awareness.',
    'Lesser Fortune': 'A glimmer of luck exists, but challenges persist. Small blessings can still make a difference if you recognize them.',
    'Success': 'Not grand fortune, but steady progress. Like a clouded night sky, beauty and achievement exist in quieter forms.',
    'Neutral': 'The void of fortune. This is a time to hunker down, build inner strength, and wait for better cosmic tides.'
};


const tierColors = {
    'Supreme Fortune': '#FFD700',
    'Greater Fortune': '#FFA500',
    'Fortune': '#90EE90',
    'Lesser Fortune': '#87CEEB',
    'Success': '#9370DB',
    'Neutral': '#696969'
};

function getTierColor(tier) {
    return tierColors[tier] || '#696969';
}


function getRandomFortune(tier) {
    const tierFortunes = fortunes[tier];
    return tierFortunes[Math.floor(Math.random() * tierFortunes.length)];
}


const TIER_WEIGHTS = [
    { name: 'Supreme Fortune', weight: 5 },
    { name: 'Greater Fortune', weight: 10 },
    { name: 'Fortune', weight: 20 },
    { name: 'Lesser Fortune', weight: 25 },
    { name: 'Success', weight: 25 },
    { name: 'Neutral', weight: 15 }
];
const TOTAL_WEIGHT = TIER_WEIGHTS.reduce((sum, tier) => sum + tier.weight, 0);

function getRandomTier() {
    let random = Math.random() * TOTAL_WEIGHT;
    for (const tier of TIER_WEIGHTS) {
        random -= tier.weight;
        if (random <= 0) return tier.name;
    }
    return 'Neutral';
}

module.exports = {
    fortunes,
    tierDescriptions,
    tierColors,
    getTierColor,
    getRandomFortune,
    getRandomTier
};

