addLayer("p", {
    name: "cuddy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    image: "resources/Amoeba_Icon.png",
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#006BF7",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "amoebas", // Name of prestige currency
    baseResource: "rainbows", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 17)) {
            mult = mult.times(2)
        }
        if (hasUpgrade('g', 11)) {
            mult = mult.times(7)
        }
        if (hasUpgrade('g', 14)) {
            mult = mult.times(upgradeEffect('g', 14))
        }
        return mult
    },
    autoUpgrade() {
        if (hasUpgrade('g', 17)) {
            return true
        }
        return false
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for amoebas!!!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            title: "Pride Month",
            description: "2x Rainbows",
            cost: new Decimal(5),
            style: {'width':'160px'},
        },
        12: {
            title: "Single Celled",
            description: "Rainbows scale based on your Amoebas.",
            cost: new Decimal(10),
            style: {'width':'160px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Procrastination",
            description: "0.1x Rainbows\nRainbow gain now increases over time.",
            cost: new Decimal(50),
            style: {'width':'160px'},
            effect() {
                return Math.min(Math.pow(player[this.layer].resetTime*2.5+1,1.77)/10, 500)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "More Rainbow",
            description: "Rainbows scale based on your Rainbows.",
            cost: new Decimal(150),
            style: {'width':'160px'},
            effect() {
                return player.points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        15: {
            title: "Stability Zest",
            description: "1.777x Rainbows",
            cost: new Decimal(500),
            style: {'width':'160px'},
        },
        16: {
            title: "Activity Check",
            description: "Symbols now appear on the screen.\nClicking them gives temporary Rainbow multiplier.",
            cost: new Decimal(2000),
            style: {'width':'160px'},
            effect() {
                return player.clickingMult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        17: {
            title: "Mitosis",
            description: "2x Amoebas",
            cost: new Decimal(20000),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade('p', 16)
            },
        },
        18: {
            title: "Anomaly Annihilating",
            description: "Clicking symbols is 4x as effective.\n2.5x Rainbows",
            cost: new Decimal(100000),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade('p', 16)
            },
        },
        19: {
            title: "Fallback",
            description: "Your Rainbow multiplier from clicking symbols can't decrease while below triple the total # of symbols you've EVER clicked.",
            cost: new Decimal(1234567),
            style: {'width':'160px'},
            effect() {
                return player.minimumClickMult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+" total clicks" },
            unlocked() {
                return hasUpgrade('p', 16)
            },
        },
        21: {
            title: "This Is Overpowered",
            description: "Clicking symbols is more effective based on your Amoebas and current click-related Rainbow multiplier.",
            cost: new Decimal(10000000),
            style: {'width':'160px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.2*Math.min((1+Math.pow(player.clickingMult,0.4)/100), 1.5))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade('p', 16)
            },
        },
    },
    infoboxes: {
        clickCounter: {
            title: "Click Counter",
            body() { return "You have clicked " + player.minimumClickMult + " symbols." },
            unlocked() {
                return hasUpgrade('p', 16)
            },
        },
    },
})

addLayer("A", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#F7B100",
    resource: "achievements", 
    row: "side",
    image: "resources/AchievementIcon.png",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    effectDescription() {
        return "which multiplies Rainbow gain by " + format((new Decimal(2)).pow(player['A'].points)) +"x"
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "The Gimmicky Nonsense Begins",
            //image: "discord.png",
            done() {return hasUpgrade('p', 16)},
            onComplete() {addPoints("A",1)},
            tooltip: "Buy the 'Activity Check' upgrade.<br>Award: N/A", 
        },
    },
    midsection: ["grid", "blank"],
})

addLayer("g", {
    name: "chris", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#770000",
    requires: new Decimal(1e20), // Can be a function that takes requirement increases into account
    resource: "cherries", // Name of prestige currency
    baseResource: "rainbows", // Name of resource prestige is based on
    resetDescription: "Gamble for ",
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1+Math.random()*5)
        if (hasUpgrade('g', 14)) {
            mult = mult.times(upgradeEffect('g', 14))
        }
        if (hasUpgrade('g', 18)) {
            mult = mult.times(7)
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Gamble for cherries!!!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        //return true
        if (hasUpgrade('g', 11) || hasUpgrade('p', 21) || player[this.layer].points.gte(new Decimal(1))) {
            return true
        }
        return false
        /*
        if (tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt) || hasUpgrade('g', 11)) {
            return true
        }
        return false
        */
    },
    canReset() {
        return hasUpgrade('p', 21)
        //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
    branches: ["p"],

    upgrades: {
        11: {
            title: "Masochism",
            description: "0.2x Rainbows<br>7x Amoebas",
            cost: new Decimal(1),
            style: {'width':'160px'},
        },
        12: {
            title: "RNG",
            description: "This grants anywhere from 0.1x-10x Rainbows at any given moment.",
            cost: new Decimal(7),
            style: {'width':'160px'},
            effect() {
                return Math.max(Math.random()*10, 0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "I'm Gonna Shit",
            description: "Clicking symbols is 2x as effective. \nSymbols spawn more often and continue spawning without <b>Activity Check</b>.",
            cost: new Decimal(17),
            style: {'width':'160px'},
        },
        14: {
            title: "Click Your Way To Victory",
            description: "This increases by +0.01x multiplier for Rainbows, Amoebas, and Cherries for every symbol clicked.",
            cost: new Decimal(50),
            style: {'width':'160px'},
            effect() {
                return player.cherryUpgrade14
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        15: {
            title: "Lets Go Gambling",
            description: "Clicking symbols has a 1 in 10 chance to instantly grant you Amoebas equal to what you'd earn from reset.",
            cost: new Decimal(500),
            style: {'width':'160px'},
        },
        16: {
            title: "Cherry Tree",
            description: "Rainbows scale based on your Cherries.",
            cost: new Decimal(1000),
            style: {'width':'160px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        17: {
            title: "THE BROTHERS COCK",
            description: "You automatically purchase Amoeba upgrades.",
            cost: new Decimal(5000),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade('g', 16)
            },
        },
        18: {
            title: "I Love Crack",
            description: "7x Cherries<br>Rainbows scale based on your Cherries and RNG.",
            cost: new Decimal(100000),
            style: {'width':'160px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.25).times(Math.max(Math.random()*5, 0.5))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade('g', 16)
            },
        },
        19: {
            title: "Chris Luck",
            description: "Clicking symbols always grants Amoebas.",
            cost: new Decimal(77777777),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade('g', 16)
            },
        },
        21: {
            title: "Rigged Coin",
            description: "Coinflips always grant multiplier and reset nothing.",
            cost: new Decimal(7.777777e12),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade('g', 19)
            },
        },
        23: {
            title: "Adorable",
            description: "^1.1 Rainbows<br>This layer behaves as if you chose it first.<br>Add a picture of Axe Cat to this layer's menu.",
            cost: new Decimal(1e36),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade('g', 19)
            },
        },
    },

    clickables: {
        11: {
            title: "Flip A Coin!",
            display() { // Everything else displayed in the buyable button after the title
                return "Force a Gamble reset without earning Cherries for a 50% chance to earn +1x Cherry multiplier.<br>(Requires 1.00e27 Rainbows)<br>Currently: "+format(player.CoinflipMult)+"x"
            },
            unlocked() { return player[this.layer].unlocked }, 
            canClick() {
                return player.points.gte(new Decimal(1e27))
                //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
            },
            onClick() { 
                if (!hasUpgrade('g', 21)) {
                    doReset(this.layer, true)
                }
                if (Math.random() >= 0.5 || hasUpgrade('g', 21)) {
                    player.CoinflipMult+=1
                }
            },
            style: {'height':'77px', 'width':'177px'},
        }
    }
})
