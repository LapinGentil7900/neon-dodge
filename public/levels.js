const LevelSystem = {
    levels: [
        // TIER 1 — DÉBUTANT (0 → 2000)
        { name:"TUTORIAL",     color:"#aaffaa", bgColor:"#000d00", speed:2,  rate:0.02, tracker:false, zigzag:false, burst:false, glitch:false, scoreReq:0,     description:"Apprends à esquiver...",        trackRatio:0 },
        { name:"SÉCURITÉ",     color:"#00f3ff", bgColor:"#000a10", speed:3,  rate:0.03, tracker:false, zigzag:false, burst:false, glitch:false, scoreReq:500,   description:"Zone sécurisée. Pour l'instant.", trackRatio:0 },
        { name:"ÉVEIL",        color:"#44ffcc", bgColor:"#001010", speed:4,  rate:0.04, tracker:false, zigzag:false, burst:false, glitch:false, scoreReq:1000,  description:"Le réseau s'anime.",             trackRatio:0 },

        // TIER 2 — INTERMÉDIAIRE (2000 → 7000)
        { name:"FRONTIÈRE",    color:"#00aaff", bgColor:"#00050f", speed:5,  rate:0.05, tracker:false, zigzag:false, burst:false, glitch:false, scoreReq:2000,  description:"Tu entres dans la zone grise.",  trackRatio:0 },
        { name:"INFILTRATION", color:"#8800ff", bgColor:"#050008", speed:6,  rate:0.06, tracker:false, zigzag:true,  burst:false, glitch:false, scoreReq:3000,  description:"Les ennemis zigzaguent !",        trackRatio:0 },
        { name:"PARASITE",     color:"#ff8800", bgColor:"#0a0500", speed:6,  rate:0.07, tracker:true,  zigzag:false, burst:false, glitch:false, scoreReq:4000,  description:"Ils te traquent maintenant.",    trackRatio:0.2 },
        { name:"CORRUPTED",    color:"#ff4444", bgColor:"#0a0000", speed:7,  rate:0.08, tracker:true,  zigzag:true,  burst:false, glitch:false, scoreReq:5000,  description:"Traqueurs ET zigzag.",           trackRatio:0.25 },
        { name:"ZONE ROUGE",   color:"#ff2222", bgColor:"#0d0000", speed:8,  rate:0.09, tracker:true,  zigzag:false, burst:false, glitch:false, scoreReq:6000,  description:"Danger critique.",               trackRatio:0.3 },

        // TIER 3 — AVANCÉ (7000 → 15000)
        { name:"PANIQUE",      color:"#ff0066", bgColor:"#0d0005", speed:9,  rate:0.10, tracker:true,  zigzag:true,  burst:false, glitch:false, scoreReq:7000,  description:"Tout s'accélère.",               trackRatio:0.3 },
        { name:"OVERDRIVE",    color:"#ff6600", bgColor:"#0d0500", speed:10, rate:0.11, tracker:false, zigzag:false, burst:true,  glitch:false, scoreReq:8000,  description:"Rafales d'ennemis !",            trackRatio:0 },
        { name:"TEMPÊTE",      color:"#ffcc00", bgColor:"#0d0a00", speed:10, rate:0.12, tracker:true,  zigzag:false, burst:true,  glitch:false, scoreReq:9000,  description:"Traqueurs en rafale.",           trackRatio:0.35 },
        { name:"GLITCH",       color:"#ff00ff", bgColor:"#0d000d", speed:11, rate:0.13, tracker:false, zigzag:true,  burst:true,  glitch:true,  scoreReq:10000, description:"La réalité se brise.",          trackRatio:0 },
        { name:"CYBERWAR",     color:"#ff3838", bgColor:"#0a0010", speed:12, rate:0.14, tracker:true,  zigzag:true,  burst:false, glitch:false, scoreReq:11000, description:"Guerre totale sur le réseau.",  trackRatio:0.35 },
        { name:"AVALANCHE",    color:"#ffffff", bgColor:"#050505", speed:12, rate:0.16, tracker:false, zigzag:false, burst:true,  glitch:false, scoreReq:12000, description:"Un déluge de projectiles.",     trackRatio:0 },
        { name:"CHAOS",        color:"#ff0044", bgColor:"#080008", speed:13, rate:0.17, tracker:true,  zigzag:true,  burst:true,  glitch:false, scoreReq:13000, description:"Tout à la fois. Survive.",      trackRatio:0.4 },

        // TIER 4 — EXPERT (15000 → 30000)
        { name:"ABÎME",        color:"#6600ff", bgColor:"#030010", speed:14, rate:0.18, tracker:true,  zigzag:true,  burst:true,  glitch:false, scoreReq:15000, description:"Tu regardes dans l'abîme.",     trackRatio:0.4 },
        { name:"EXÉCUTION",    color:"#ff1100", bgColor:"#100000", speed:15, rate:0.19, tracker:true,  zigzag:false, burst:true,  glitch:false, scoreReq:17000, description:"Condamné à mort numérique.",    trackRatio:0.45 },
        { name:"PURGE",        color:"#ffffff", bgColor:"#000000", speed:15, rate:0.20, tracker:true,  zigzag:true,  burst:false, glitch:true,  scoreReq:19000, description:"Nettoyage en cours...",         trackRatio:0.45 },
        { name:"PSYCHOSE",     color:"#ff00cc", bgColor:"#0a000a", speed:16, rate:0.22, tracker:true,  zigzag:true,  burst:true,  glitch:true,  scoreReq:21000, description:"Résistance cognitive : ZÉRO",   trackRatio:0.5 },
        { name:"ANNIHILATION", color:"#ff4400", bgColor:"#100300", speed:17, rate:0.23, tracker:true,  zigzag:true,  burst:true,  glitch:false, scoreReq:24000, description:"L'effacement total approche.",  trackRatio:0.5 },
        { name:"TERMINUS",     color:"#ff0000", bgColor:"#0d0000", speed:18, rate:0.25, tracker:true,  zigzag:true,  burst:true,  glitch:true,  scoreReq:27000, description:"Fin de ligne.",                 trackRatio:0.55 },

        // TIER 5 — LÉGENDAIRE (30000+)
        { name:"SINGULARITÉ",     color:"#ff8800", bgColor:"#0a0500", speed:19, rate:0.27, tracker:true, zigzag:true, burst:true, glitch:true,  scoreReq:30000, description:"Au-delà du possible humain.",  trackRatio:0.55 },
        { name:"OMEGA",           color:"#ff00ff", bgColor:"#100010", speed:21, rate:0.30, tracker:true, zigzag:true, burst:true, glitch:true,  scoreReq:40000, description:"La fin de tout.",               trackRatio:0.6 },
        { name:"∞ TRANSCENDANCE", color:"#ffffff", bgColor:"#000000", speed:24, rate:0.36, tracker:true, zigzag:true, burst:true, glitch:true,  scoreReq:55000, description:"Tu n'es plus humain.",          trackRatio:0.65 }
    ],

    getCurrentLevel(score) {
        return this.levels.slice().reverse().find(l => score >= l.scoreReq) || this.levels[0];
    },
    getNextLevel(score) {
        return this.levels.find(l => l.scoreReq > score) || null;
    },
    getTierName(score) {
        if (score < 2000)  return "★ DÉBUTANT";
        if (score < 7000)  return "★★ INTERMÉDIAIRE";
        if (score < 15000) return "★★★ AVANCÉ";
        if (score < 30000) return "★★★★ EXPERT";
        return "★★★★★ LÉGENDAIRE";
    }
};
