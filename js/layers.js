addLayer("p", {
    name: "cuddy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "A: Reset for amoebas!!!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            title: "Pride Month",
            description: "2x Rainbows",
            cost: new Decimal(5),
        },
        12: {
            title: "Single Celled",
            description: "Rainbows scale based on your Amoebas.",
            cost: new Decimal(10),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Procrastination",
            description: "0.1x Rainbows\nRainbow gain now increases over time.",
            cost: new Decimal(50),
            effect() {
                return Math.min(Math.pow(player[this.layer].resetTime*2+1,1.7)/10, 100)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "More Rainbow",
            description: "Rainbows scale based on your Rainbows.",
            cost: new Decimal(200),
            effect() {
                return player.points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        15: {
            title: "Stability Zest",
            description: "1.777x Rainbows",
            cost: new Decimal(500),
        },
        16: {
            title: "Activity Check",
            description: "Symbols now appear on the screen.\nClicking them gives temporary Rainbow multiplier.",
            cost: new Decimal(2000),
            effect() {
                return player.clickingMult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        17: {
            title: "Mitosis",
            description: "2x Amoebas",
            cost: new Decimal(25000),
        },
        18: {
            title: "Anomaly Annihilating",
            description: "Clicking symbols is 4x as effective.\n1.5x Rainbows",
            cost: new Decimal(100000),
        },
        19: {
            title: "Clickity Clack",
            description: "Your Rainbow multiplier from clicking symbols can't drop below triple the total # of symbols you've clicked.",
            cost: new Decimal(1234567),
        },
        21: {
            title: "This Is Overpowered",
            description: "Clicking symbols is more effective based on your Amoebas and current click-related Rainbow multiplier.",
            cost: new Decimal(10000000),
            effect() {
                return player[this.layer].points.add(1).pow(0.25*(1+Math.pow(player.clickingMult,0.3)/100))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
})
