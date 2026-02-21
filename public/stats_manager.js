const StatsManager = {
    data: {
        totalTimePlayed: 0,
        deathCount:      0,
        gamesPlayed:     0,
        credits:         0,
        highScore:       0,
        username:        'Pilote',
        bestLevel:       'TUTORIAL',
        unlockedSkins:   ['#00f3ff'],
        equippedSkin:    '#00f3ff'
    },

    init() {
        const saved = localStorage.getItem('neon_stats_v17');
        if (saved) {
            try { this.data = { ...this.data, ...JSON.parse(saved) }; }
            catch(e) { console.warn('StatsManager: données corrompues, reset.'); }
        }
    },

    save() { localStorage.setItem('neon_stats_v17', JSON.stringify(this.data)); },

    incrementTime() {
        this.data.totalTimePlayed++;
        if (this.data.totalTimePlayed % 5 === 0) this.save();
    },

    recordDeath() { this.data.deathCount++; this.save(); },

    getFormattedTime() {
        const t = this.data.totalTimePlayed;
        const h = Math.floor(t / 3600);
        const m = Math.floor((t % 3600) / 60);
        const s = t % 60;
        return `${h}h ${m}m ${s}s`;
    },

    reset() {
        this.data = {
            totalTimePlayed: 0,
            deathCount:      0,
            gamesPlayed:     0,
            credits:         0,
            highScore:       0,
            username:        'Pilote',
            bestLevel:       'TUTORIAL',
            unlockedSkins:   ['#00f3ff'],
            equippedSkin:    '#00f3ff'
        };
        localStorage.removeItem('neon_stats_v17');
    }
};
