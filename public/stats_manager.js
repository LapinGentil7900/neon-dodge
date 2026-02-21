const StatsManager = {
    data: {
        totalTimePlayed: 0,
        deathCount: 0,
        credits: 0,
        highScore: 0,
        username: "Pilote",
        equippedSkin: "#00f3ff",
        unlockedSkins: ["#00f3ff"],
        gamesPlayed: 0,
        bestLevel: "TUTORIAL"
    },

    init() {
        const saved = localStorage.getItem('neon_stats_v17');
        if (saved) this.data = { ...this.data, ...JSON.parse(saved) };
    },

    save() {
        localStorage.setItem('neon_stats_v17', JSON.stringify(this.data));
    },

    // Appelé chaque seconde de jeu
    incrementTime() {
        this.data.totalTimePlayed++;
        if (this.data.totalTimePlayed % 5 === 0) this.save();
    },

    recordDeath() {
        this.data.deathCount++;
        this.data.gamesPlayed++;
        this.save();
    },

    reset() {
        const user = this.data.username;
        this.data = {
            totalTimePlayed: 0,
            deathCount: 0,
            credits: 0,
            highScore: 0,
            username: user,
            equippedSkin: "#00f3ff",
            unlockedSkins: ["#00f3ff"],
            gamesPlayed: 0,
            bestLevel: "TUTORIAL"
        };
        this.save();
    },

    getFormattedTime() {
        const h = Math.floor(this.data.totalTimePlayed / 3600);
        const m = Math.floor((this.data.totalTimePlayed % 3600) / 60);
        const s = this.data.totalTimePlayed % 60;
        return `${h}h ${m}m ${s}s`;
    }
};
