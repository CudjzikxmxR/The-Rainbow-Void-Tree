addLayer("p", {
    name: "cuddy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    image: "resources/Amoeba_Icon.png",
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        feedingAxeCat: false,
        clickingMult: new Decimal(1),
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
        if (hasUpgrade('g', 22)) {
            mult = mult.times(1.777)
        }
        if (hasAchievement('a', 12)) {
            mult = mult.times(1.5)
        }
        if (hasAchievement('a', 19)) {
            mult = mult.times(2)
        }
        if (hasMilestone('k', 11)) {
            mult = mult.times(1.5)
        }
        if (hasUpgrade('k', 12)) {
            mult = mult.times(3)
        }
        if (hasUpgrade('p', 24)) {
            mult = mult.times(upgradeEffect('p', 24))
        }
        if (hasUpgrade('p', 25)) {
            mult = mult.times(upgradeEffect('p', 13))
        }
        if (hasMilestone('k', 15)) {
            mult = mult.times(Math.pow((1.75+Math.max(0, (player['k'].milestones.length-7))*15/100), player['k'].milestones.length))
          // mult = mult.times(Math.pow(Math.pow((1.5+Math.max(0, (player['k'].milestones.length-7))/20), player['k'].milestones.length)))
        }
        if (hasMilestone('k', 17)) {
            mult = mult.times(20)
        }
        if (hasUpgrade('p', 28)) {
            var achieveBase = 2
            mult = mult.times((new Decimal(achieveBase)).pow(player['a'].achievements.length))
        }
        if (hasUpgrade('k', 16)) {
            mult = mult.times(4)
        }
        if (hasMilestone('k', 23)) {
            mult = mult.times(1000)
        }
        if (this.getAxeStatus()) {
            mult = mult.times(0)
        }
        return mult
    },
    autoUpgrade() {
        if (hasUpgrade(this.layer, 35) && !player.AntivirusLevel>0) {
            return false
        }
        if (hasUpgrade('g', 17)) {
            return true
        }
        return false
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasMilestone('k', 21)) {
            exp = exp.times(1.1)
        }
        if (hasUpgrade('p', 33)) {
            exp = exp.times(1.1)
        }
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for amoebas!!!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    
    getAxeStatus() {
        if (player[this.layer].feedingAxeCat && hasMilestone('g', 17)) {
            return true
        }
        return false
    },
    

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
            description: "0.1x Rainbows<br>Rainbow gain now increases over time.",
            cost: new Decimal(50),
            style: {'width':'160px'},
            effect() {
                let scaleSpeed = 2
                let scaleExpo = 1.77
                let scaleCap = new Decimal(1000)
                if (hasUpgrade(this.layer, 32)) {
                    scaleSpeed = player[this.layer].resetTime*7
                    scaleExpo = 77+player[this.layer].resetTime*2
                    scaleCap = getClickPower().add(1)
                }
                if (hasMilestone('k', 14)) {
                    scaleSpeed = 5
                    scaleExpo = 2.47
                    scaleCap = scaleCap.times(5)
                }
                if (hasUpgrade(this.layer, 25)) {
                    scaleCap = scaleCap.times(10)
                }
                if (hasUpgrade('k', 15)) {
                    scaleSpeed *= 3
                    scaleExpo *= 1.47
                }
                if (hasUpgrade(this.layer, 32)) {
                    scaleSpeed *= 77
                    scaleExpo *= 7
                    scaleCap = scaleCap.pow(1.5)
                }
                return (((new Decimal(player[this.layer].resetTime)).times(scaleSpeed+1)).pow(scaleExpo)).min(scaleCap)
                //return Math.min(Math.pow(player[this.layer].resetTime*scaleSpeed+1,scaleExpo)/10, scaleCap)
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
                return player[this.layer].clickingMult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        17: {
            title: "Mitosis",
            description: "2x Amoebas",
            cost: new Decimal(20000),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
        },
        18: {
            title: "Anomaly Annihilating",
            description: "2.5x Rainbows<br>Clicking symbols is 4x as effective.",
            cost: new Decimal(100000),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            onPurchase() {
                resetClickMult()
            },
        },
        19: {
            title: "Fallback",
            description: "Your Rainbow multiplier from clicking symbols can't decrease while below triple the total # of symbols you've ever clicked.",
            cost: new Decimal(1234567),
            style: {'width':'160px'},
            effect() {
                return player.minimumClickMult
            },
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
        },
        21: {
            title: "This Is Overpowered",
            description: "Clicking symbols is 100000x as effective.",
            cost: new Decimal(10000000),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            onPurchase() {
                resetClickMult()
            },
        },
        22: {
            title: "Woke Agenda?",
            description: "10x Rainbows",
            cost: new Decimal(1e12),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        23: {
            title: "Deep Cut",
            description: "Rainbows scale based on your Knives.",
            cost: new Decimal(4e15),
            style: {'width':'160px'},
            effect() {
                return player['k'].points.add(1).pow(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        24: {
            title: "[LITTLE SPONGE]",
            description: "Amoebas lightly scale based on your Rainbows.",
            cost: new Decimal(2e18),
            style: {'width':'160px'},
            effect() {
                return player.points.add(1).max(0).log(5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        25: {
            title: "Army of Amoebas",
            description: "<b>Procrastination</b>'s cap is 10x larger. <b>Procrastination</b> has an effect on Amoebas.",
            cost: new Decimal(5e22),
            style: {'width':'160px'},
            effectDisplay() { return format(upgradeEffect(this.layer, 13))+"x" },
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        26: {
            title: "Pride Year",
            description: "^1.1 Rainbows",
            cost: new Decimal(5e35),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        27: {
            title: "Premeditated",
            description: "Knife requirement scaling is weaker.",
            cost: new Decimal(1e44),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 26) && hasUpgrade('k', 11)
            },
        },
        28: {
            title: "Achieve Big",
            description: "+1 to achievement Rainbow multiplier base.<br>Achievements now give 2x Amoeba multiplier.<br>Knife requirement scaling is weaker.",
            cost: new Decimal(3.25e52),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 26) && hasUpgrade('k', 11)
            },
        },
        29: {
            title: "Bomb Strapped To Your Chest",
            description: "1.00e7x Rainbows<br>After this upgrade is purchased, You have 10 seconds before a Kill reset is forced without awarding Knives.<br>Has no effect if you already have the Cherry layer unlocked.",
            cost: new Decimal(8e55),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 26) && hasUpgrade('k', 11)
            },
            onPurchase() {
                setTimeout(function () {
                    if (!hasMilestone('k', 20) && !hasUpgrade('g', 23)) {
                        doReset('k', true)
                    }
                }, 10000);
            }
        },
        31: {
            title: "Becoming Brave",
            description: "Clicking symbols is 5.55e55x as effective.<br>You feed Axe Cat 3x as much.<br>Axe cat evolves! It now slightly exponentates your Cherry gain.",
            cost: new Decimal("1e39000"),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 26) && hasMilestone('k', 25)
            },
        },
        32: {
            title: "Energy Drink",
            description: "<b>Procrastination</b>'s base cap is now equal to your click power and scales faster over time.<br>Raise <b>Procrastination</b>'s cap ^1.5.",
            cost: new Decimal("1e77000"),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 26) && hasMilestone('k', 25)
            },
        },
        33: {
            title: "Cud Luck",
            description: "^1.1 Amoebas<br>This grants anywhere from ^0.95 to ^1 Rainbows at any given moment.",
            cost: new Decimal("7e80007"),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 26) && hasMilestone('k', 25)
            },
            effect() {
                return 0.9+Math.max(Math.random()/10, 0.05)
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))},
        },
        34: {
            title: "Truly Symbolic",
            description: "<b>Click Your Way To Victory</b> scales 500x faster and multiplies coinflips.<br>Clicking symbols is ^1.05 as effective.<br>1.5x Knives",
            cost: new Decimal("1e150000"),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 26) && hasMilestone('k', 25)
            },
        },
        35: {
            title: "<font color='#ff0000'>MALWARE</font>",
            description: "<font color='#ff0000'>Ameoba upgrades no-longer autobuy.<br>Axe Cat gets hungrier faster.</font>",
            cost: new Decimal("1e150012"),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 34) && hasMilestone('k', 25)
            },
        },
        36: {
            title: "I Literally Clicked It Four Times Dude",
            description: "^1.07 Rainbows<br>You can feed Catfood to Axe Cat by passing over them.<br>More catfood spawns.",
            cost: new Decimal("1e500000"),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 26) && hasMilestone('k', 25)
            },
        },
        37: {
            title: "Eternal Algebra Class",
            description: "Unlock the Math sublayer. This feature is currently uncoded, and you have beaten the game!! Yay",
            cost: new Decimal("ee7"),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 26) && hasMilestone('k', 25)
            },
        },
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        ["display-text",
            function() {
                if (!hasUpgrade('p', 16) && !hasUpgrade('g', 13)) {
                    return ""
                }
                return "You have clicked " + player.minimumClickMult + " symbols."
            }],
        "blank",
        "upgrades"
    ],
    /*
    infoboxes: {
        clickCounter: {
            title: "Click Counter",
            body() { return "You have clicked " + player.minimumClickMult + " symbols." },
            unlocked() {
                return hasUpgrade('p', 16)
            },
        },
    },
    */
})

addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "#F7B100",
    row: "side",
    image: "resources/AchievementIcon.png",
    /*
    effectDescription() {
        return "which multiplies Rainbow gain by " + format((new Decimal(2)).pow(player['A'].points)) +"x"
    },
    */
    tooltip() {
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        //Cud Layer Achievements
        11: {
            name: "The Gimmicky Nonsense Begins",
            image: "resources/Amoeba_Icon.png",
            done() {return hasUpgrade('p', 16)},
            unlocked() {return true},
            tooltip: "Buy the 'Activity Check' upgrade.<br>Award: N/A", 
        },
        12: {
            name: "Mocking My Cucks Mucks",
            image: "resources/Amoeba_Icon.png",
            done() {return player['p'].points.gte(new Decimal(1e12))},
            unlocked() {return true},
            tooltip: "Achieve 1.00e12 amoebas.<br>Award: 1.5x Amoebas", 
        },
        13: {
            name: "A Cudillion Cuds",
            image: "resources/Amoeba_Icon.png",
            done() {return player.p.points.gte(new Decimal(1.18181387e65))},
            unlocked() {return true},
            tooltip: "Achieve a cudillion (7^77) amoebas.<br>Award: ^1.07 Rainbows", 
        },
        14: {
            name: "I Love To Click",
            image: "resources/aaaRune.png",
            done() {return player.minimumClickMult >= 1000},
            unlocked() {return true},
            tooltip: "Click 1000 symbols.<br>Award: Clicking symbols is 3x as effective.", 
            onComplete() {
                resetClickMult()
            },
        },
        15: {
            name: "So Much Clicking",
            image: "resources/aaaRune.png",
            done() {return player.minimumClickMult >= 5000},
            unlocked() {return true},
            tooltip: "Click 5000 symbols.<br>Award: Symbols spawn more often.", 
        },
        16: {
            name: "Carpal Tunnel",
            image: "resources/aaaRune.png",
            done() {return player.minimumClickMult >= 1e6},
            unlocked() {return true},
            tooltip: "Click 1.00e6 symbols.<br>Award: 2x Knives", 
        },
        //Chris Layer Achievements
        17: {
            name: "Let's Go Gambling",
            image: "resources/Cherries_Icon.png",
            done() {return player['g'].points.gte(1)},
            unlocked() {return true},
            tooltip: "Perform a Gamble reset.<br>Award: N/A", 
        },
        18: {
            name: "Coinage",
            image: "resources/Cherries_Icon.png",
            done() {return player.CoinflipMult > 1},
            unlocked() {return true},
            tooltip: "Successfully gain Cherry multiplier from flipping a coin.<br>Award: N/A", 
        },
        19: {
            name: "Crop Farming",
            image: "resources/Cherries_Icon.png",
            done() {return player['g'].points.gte(new Decimal(1e7))},
            unlocked() {return true},
            tooltip: "Achieve 1.00e7 Cherries.<br>Award: 2x Amoebas", 
        },
        21: {
            name: "Crack Addict",
            image: "resources/Cherries_Icon.png",
            done() {return player['g'].points.gte(new Decimal(1e77))},
            unlocked() {return true},
            tooltip: "Achieve 1.00e77 Cherries.<br>Award: 7x Cherries", 
        },
        //Pac Layer Achievements
        22: {
            name: "Murder",
            image: "resources/Knives_Icon.png",
            done() {return player['k'].points.gte(1)},
            unlocked() {return true},
            tooltip: "Perform a Kill reset.<br>Award: N/A", 
        },
        23: {
            name: "Knife Collection",
            image: "resources/Knives_Icon.png",
            done() {return player['k'].points.gte(10)},
            unlocked() {return true},
            tooltip: "Achieve 10 Knives.<br>Award: Symbols spawn more often.", 
        },
        24: {
            name: "Point of No Return",
            image: "resources/Knives_Icon.png",
            done() {return player['k'].points.gte(15)},
            unlocked() {return true},
            tooltip: "Achieve 15 Knives.<br>Award: N/A.", 
        },
        25: {
            name: "The Achieving Achievement",
            image: "resources/Knives_Icon.png",
            done() {return hasUpgrade('p', 28)},
            unlocked() {return true},
            tooltip: "Purchase <b>Achieve Big</b>.<br>Award: N/A.", 
        },
    },
    tabFormat: [
        //"main-display",
        ["display-text", function () {
            var achieveBase = 2
            if (hasUpgrade('p', 28)) {
                achieveBase += 1
            }
            return "You have <font color='#F7B100'>" + player["a"].achievements.length + "</font> achievements, which translates to a " + format(new Decimal(achieveBase).pow(player["a"].achievements.length)) + "x Rainbow multiplier."
        }],
        ["display-text", function () {
            if (!hasUpgrade('p', 28)) {
               return null
            }
            var achieveBase = 2
            return "Your achievements also translates to a " + format(new Decimal(achieveBase).pow(player["a"].achievements.length)) + "x Amoeba multiplier."
        }],
        "blank",
        "blank",
        "achievements",
    ],
    //midsection: ["grid", "blank"],
})

addLayer("g", {
    name: "chris", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    image: "resources/Cherries_Icon.png",
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        unlockOrder: 0,
    }},
    color: "#770000",
    requires() { // Can be a function that takes requirement increases into account
        if (this.getUnlockOrder()==0||player.LayerTwoChoice==this.layer) {
            return new Decimal(1e21)
        }
        return (new Decimal(10)).pow(500)
    },
    resource: "cherries", // Name of prestige currency
    baseResource: "rainbows", // Name of resource prestige is based on
    resetDescription: "Gamble for ",
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        if (this.getUnlockOrder()==0) {
            return 0.5
        }
        return 0.08
    }, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1+Math.random()*4.77)
        if (this.getUnlockOrder()!=0) {
            mult = mult.times(1.7)
            return mult
        }
        if (hasUpgrade('g', 14)) {
            mult = mult.times(upgradeEffect('g', 14))
        }
        if (hasUpgrade('g', 18)) {
            mult = mult.times(7)
        }
        if (hasAchievement('a', 21)) {
            mult = mult.times(7)
        }
        mult = mult.times(player.AxeCatMult)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('p', 31)) {
            exp = exp.times(1+Math.log(player.AxeCatMult)/Math.log(5)/200)
        }
        return exp
    },
    softcap: new Decimal("e7777"), 
    softcapPower: new Decimal(0.1), 
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Gamble for cherries!!!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        //return true
        if (hasUpgrade(this.layer, 11) || hasMilestone("k", 11) || hasUpgrade('p', 21) || player[this.layer].points.gte(new Decimal(1))) {
            return true
        }
        return false
    },
    canReset() {
        return player.points.gte(this.requires())
        //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
    branches: ["p"],
    increaseUnlockOrder: ["k"],
    getUnlockOrder() {
        if (hasUpgrade(this.layer, 23)||player.LayerTwoChoice==this.layer||player.LayerTwoChoice=="!") {
            return 0
        }
        return player[this.layer].unlockOrder
    },
    onPrestige() {
        if (this.getUnlockOrder()!=0 && player.LayerTwoChoice!="!") {
            this.unlockOrder = 0
            player.LayerTwoChoice = "g"
        }
    },
    deactivated() {
        if (player.LayerTwoChoice!=null && player.LayerTwoChoice!=this.layer && player.LayerTwoChoice!="!") {
            return true
        }
        return false
    },

    upgrades: {
        11: {
            title: "Masochism",
            description: "0.2x Rainbows<br>7x Amoebas",
            cost: new Decimal(7),
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
            description: "Clicking symbols is 2x as effective.<br>Symbols spawn more often and continue spawning without <b>Activity Check</b>.",
            cost: new Decimal(17),
            style: {'width':'160px'},
            onPurchase() {
                resetClickMult()
            },
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
            description: "Clicking symbols has a 1 in 7 chance to instantly grant you Amoebas equal to what you'd earn from reset.<br>This effect persists while this layer is disabled.",
            cost: new Decimal(5000),
            style: {'width':'160px'},
            onPurchase() {
                if (player.SymbolQOL==0) {
                    player.SymbolQOL=1
                } else {
                    player.SymbolQOL=3
                }
            }
        },
        16: {
            title: "Cherry Tree",
            description: "Rainbows scale based on your Cherries.",
            cost: new Decimal(1000000),
            style: {'width':'160px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        17: {
            title: "THE BROTHERS COCK",
            description: "You automatically purchase Amoeba upgrades.",
            cost: new Decimal(5000000),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
        },
        18: {
            title: "I Love Crack",
            description: "7x Cherries<br>Rainbows scale based on your Cherries and RNG.",
            cost: new Decimal(1.77e11),
            style: {'width':'160px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.25).times(Math.max(Math.random()*5, 0.5))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
        },
        19: {
            title: "Chris Luck",
            description: "Clicking symbols always grants Amoebas.",
            cost: new Decimal(7.77e17),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
        },
        21: {
            title: "Deck of Cards",
            description: "52x Rainbows<br>Coinflips always grant multiplier and reset nothing.<br>Click-related multipliers can no longer drain..",
            cost: new Decimal(7.77e21),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 19)
            },
        },
        22: {
            title: "Fortnite Balls",
            description: "1.777x Amoebas.",
            cost: new Decimal(1e24),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 19)
            },
        },
        23: {
            title: "Surprise Guest Appearance",
            description: "^1.1 Rainbows<br>If this layer was picked last, re-enable the Knife layer.<br>A special little friend invades this reset layer...",
            cost: new Decimal(1e32),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 21)
            },
            onPurchase() {
                if (player.LayerTwoChoice=="g") {
                    player.LayerTwoChoice = "!"
                }
            },
        },
    },

    clickables: {
        11: {
            title: "Flip A Coin!",
            display() { // Everything else displayed in the buyable button after the title
                var coinReq = 1e24
                coinReq *= Math.pow(100, Math.log2(player.CoinflipMult))
                return "Force a Gamble reset without earning Cherries for a 50% chance to earn Cherry multiplier.<br>(Requires " + format(coinReq) + " Rainbows)<br>Currently: "+format(player.CoinflipMult)+"x"
            },
            unlocked() { return player[this.layer].unlocked }, 
            canClick() {
                var coinReq = 1e24
                coinReq *= Math.pow(100, Math.log2(player.CoinflipMult))
                return player.points.gte(new Decimal(coinReq))
                //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
            },
            onClick() { 
                if (!hasUpgrade('g', 21)) {
                    doReset(this.layer, true)
                }
                if (Math.random() >= 0.5 || hasUpgrade('g', 21)) {
                    if (player.CoinflipMult<1024) {
                        player.CoinflipMult*=2
                    } else {
                        coinScaleNum = 777
                        if (hasUpgrade('p', 34)) {
                            coinScaleNum*=player.cherryUpgrade14
                        }
                        player.CoinflipMult+=coinScaleNum
                    }
                }
            },
            style: {'height':'77px', 'width':'277px'},
        }
    },
    milestones: {
        17: {
            requirementDescription: "Axe Cat is hungry...",
            effectDescription() {
                if (hasUpgrade('p', 31)) {
                    return "You can feed Axe Cat, completely disabling Amoeba gain and causing Catfood to spawn around the screen, boosting your Rainbow and Cherry gain for each Catfood clicked. The cap scales based on your clicking power. Both the cap and the boost per click scales based on your coinflip-related Cherry multiplier.<br><b>Currently "+format(player.AxeCatMult)+"x and ^"+format(1+Math.log(player.AxeCatMult)/Math.log(5)/200, 3)+". (Capped at "+format((1+Math.log(getClickPower())/Math.log(3.07)*10*player.CoinflipMult/200))+"x and ^"+format(1+Math.log((1+Math.log(getClickPower())/Math.log(3.07)*10*player.CoinflipMult/200))/Math.log(5)/200, 3)+")</b>"
                } else {
                    return "You can feed Axe Cat, completely disabling Amoeba gain and causing Catfood to spawn around the screen, boosting your Rainbow and Cherry gain for each Catfood clicked. The cap scales based on your clicking power. Both the cap and the boost per click scales based on your coinflip-related Cherry multiplier.<br><b>Currently "+format(player.AxeCatMult)+"x. (Capped at "+format((1+Math.log(getClickPower())/Math.log(3.07)*10*player.CoinflipMult/200))+"x)</b>"
                }
            },
            //effectDescription: "You can feed Axe Cat, disabling Amoeba gain entirely and causing Catfood to spawn around the screen, but giving temporary Rainbow and Cherry multiplier for each Catfood clicked.<br>Currently "+format(player.AxeCatMult)+"x. (Capped at "+format(Math.log10(getClickPower()))+"x)",
            toggles: [
                ["p", "feedingAxeCat"], 
            ],
            done() {return hasUpgrade(this.layer, 23)},
            unlocked() {return hasUpgrade(this.layer, 23)},
        }
    },
    tabFormat: [
        "main-display",
        ["display-text",
            function() {
                if (player[this.layer].points.gte(new Decimal("e7777"))) {
                   return "Cherry gain is softcapped after 1.00e7777."
                }
                return null
             }],
        ["display-text",
        function() {
            if(player.LayerTwoChoice!=null && player.LayerTwoChoice!=this.layer && player.LayerTwoChoice!="!") {
                return "This layer is currently deactivated!"
            }
            return null
            }],
        "blank",
        "prestige-button",
        "blank",
        "clickables",
        "blank",
        "resource-display",
        ["display-image", function () {
            if (hasUpgrade('g', 23)) {
                return "resources/AxeCat.png"
            }
            return null
        }],
        "milestones",
        "upgrades",
    ],
})

addLayer("k", {
    name: "pac", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "K", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    image: "resources/Knives_Icon.png",
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        unlockOrder: 0,
    }},
    color: "#DCD200",
    requires() { // Can be a function that takes requirement increases into account
        if (this.getUnlockOrder()==0||player.LayerTwoChoice==this.layer) {
            return new Decimal(1e21)
        }
        return (new Decimal(10)).pow(500)
    },
    resource: "knives", // Name of prestige currency
    baseResource: "rainbows", // Name of resource prestige is based on
    resetDescription: "Kill for ",
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    softcap: new Decimal(1e6), 
    softcapPower: new Decimal(0.1), 
    exponent() { // Prestige currency exponent
        if (this.getUnlockOrder()==0 || hasUpgrade(this.layer, 16)) {
            if (hasUpgrade('p', 28)) {
                return 1.6
            }
            if (hasUpgrade('p', 27)) {
                return 1.8
            }
            return 2
        }
        return 5
    }, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 27)) {
            mult = mult.times(0.5)
        }
        return mult
    },
    directMult() {
        mult = new Decimal(1)
        if (hasUpgrade('k', 16)) {
            mult = mult.times(2)
        }
        if (hasMilestone('k', 22)) {
            mult = mult.times(1.5)
        }
        if (hasMilestone('k', 23)) {
            mult = mult.times(2)
        }
        if (hasUpgrade('p', 34)) {
            mult = mult.times(1.5)
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "k", description: "K: Kill for knives!!!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        //return true
        if (hasUpgrade(this.layer, 11) || hasUpgrade('g', 11) || hasUpgrade('p', 21) || player[this.layer].points.gte(new Decimal(1)) || player['g'].points.gte(new Decimal(1))) {
            return true
        }
        return false
    },
    canReset() {
        return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
        //return hasUpgrade('p', 21) && player.points.gte(tmp[this.layer].requires())
        //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
    canBuyMax() {
        return hasMilestone(this.layer, 13)
    },
    branches: ["p"],
    increaseUnlockOrder: ["g"],
    getUnlockOrder() {
        if (player.LayerTwoChoice==this.layer||player.LayerTwoChoice=="!") {
            return 0
        }
        return player[this.layer].unlockOrder
    },
    onPrestige() {
        if (this.getUnlockOrder()!=0 && player.LayerTwoChoice!="!") {
            this.unlockOrder = 0
            player.LayerTwoChoice = "k"
        }
    },
    deactivated() {
        if (player.LayerTwoChoice!=null && player.LayerTwoChoice!=this.layer && player.LayerTwoChoice!="!") {
            return true
        }
        return false
    },

    upgrades: {
        11: {
            title: "DLC",
            description: "Unlock new Amoeba upgrades.",
            cost: new Decimal(1),
            style: {'width':'160px'},
            onPurchase() {
                player[this.layer].points = new Decimal(0)
                doReset(this.layer, true)
            },
        },
        12: {
            title: "Blood Cells",
            description: "3x Amoebas",
            cost: new Decimal(4),
            style: {'width':'160px'},
            onPurchase() {
                player[this.layer].points = new Decimal(0)
                doReset(this.layer, true)
            },
        },
        13: {
            title: "Good Thing I'm Straight",
            description: "0.01x Rainbows<br>Clicking symbols is 6.66e6x as effective.",
            cost: new Decimal(8),
            style: {'width':'160px'},
            onPurchase() {
                player[this.layer].points = new Decimal(0)
                doReset(this.layer, true)
                resetClickMult()
            },
        },
        14: {
            title: "Genocide",
            description: "Symbols spawn more often.<br>Clicking symbols is 10x as effective.",
            cost: new Decimal(12),
            style: {'width':'160px'},
            onPurchase() {
                player[this.layer].points = new Decimal(0)
                doReset(this.layer, true)
            },
        },
        15: {
            title: "Adrenaline",
            description: "Procrastination reaches its cap faster.<br>Amoebas scale based on your knives.",
            cost: new Decimal(20),
            style: {'width':'160px'},
            onPurchase() {
                player[this.layer].points = new Decimal(0)
                doReset(this.layer, true)
            },
            effect() {
                return player[this.layer].points.add(1).pow(2.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        16: {
            title: "This Is Overpowered [II]",
            description: "4x Amoebas<br>Clicking is 3x as effective<br>2x Knives<br>This layer behaves as if you chose it first.<br>Rainbows scale based on Rainbows again, but weaker.",
            cost: new Decimal(32),
            style: {'width':'160px'},
            onPurchase() {
                player[this.layer].points = new Decimal(0)
                doReset(this.layer, true)
                resetClickMult()
            },
            effect() {
                return player.points.add(1).pow(0.05)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },

    milestones: {
        11: {
            requirementDescription: "1 Killstreak",
            effectDescription() {
                return "3x Rainbows<br>1.5x Amoebas"
            },
            done() {return player[this.layer].best.gte(1)},
        },
        12: {
            requirementDescription: "3 Killstreak",
            effectDescription() {
                return 'You automatically "click" symbols when passing over them.<br>This effect persists while this layer is disabled.'
            },
            done() {return player[this.layer].best.gte(3)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
            onComplete() {
                if (player.SymbolQOL==0) {
                    player.SymbolQOL=2
                } else {
                    player.SymbolQOL=3
                }
            }
        },
        13: {
            requirementDescription: "4 Killstreak",
            effectDescription() {
                return "You can earn max knives from Kill resets."
            },
            done() {return player[this.layer].best.gte(4)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        14: {
            requirementDescription: "5 Killstreak",
            effectDescription() {
                return "<b>Procrastination</b> reaches its cap faster.<br><b>Procrastination</b> now caps at 5000x."
            },
            done() {return player[this.layer].best.gte(5)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        15: {
            requirementDescription: "6 Killstreak",
            effectDescription() {
                var kEffectBase = 1.75
                var kScale = 0
                if (hasMilestone(this.layer, 18)) {
                    kScale = (player['k'].milestones.length-7)*15/100
                }
                return (kEffectBase+kScale)+"x Amoebas for every Killstreak milestone.<br>Currently: "+format(Math.pow((kEffectBase+kScale), player['k'].milestones.length))+"x"
            },
            done() {return player[this.layer].best.gte(6)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        16: {
            requirementDescription: "10 Killstreak",
            effectDescription() {
                var kEffectBase = 2.5
                var kScale = 0
                if (hasMilestone(this.layer, 18)) {
                    kScale = (player['k'].milestones.length-7)*15/100
                }
                return (kEffectBase+kScale)+"x Rainbows for every Killstreak milestone.<br>Currently: "+format(Math.pow((kEffectBase+kScale), player['k'].milestones.length))+"x"
            },
            done() {return player[this.layer].best.gte(10)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        17: {
            requirementDescription: "15 Killstreak",
            effectDescription() {
                return "20x Amoebas.<br>Unlock the <b>Tophat Factory.<b> (not ingame yet sorry lol)"
            },
            done() {return player[this.layer].best.gte(15)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        18: {
            requirementDescription: "20 Killstreak",
            effectDescription() {
                return "+0.15 to the <b>6 Killstreak</b> and <b>10 Killstreak</b> effect base for every Killstreak milestone past this point, including this.<br>Currently: "+format((player['k'].milestones.length-7)*15/100)
            },
            done() {return player[this.layer].best.gte(20)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        19: {
            requirementDescription: "30 Killstreak",
            effectDescription() {
                var kEffectBase = 3
                var kScale = 0
                if (hasMilestone(this.layer, 23)) {
                    kScale = 7
                }
                return (kEffectBase+kScale)+"x click power for every Killstreak milestone past this point.<br>Currently: "+format(Math.pow((kEffectBase+kScale), player['k'].milestones.length-9))+"x"
            },
            done() {return player[this.layer].best.gte(30)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        20: {
            requirementDescription: "90 Killstreak",
            effectDescription() {
                return "^1.15 Rainbows.<br>The <b>Bomb Strapped To Your Chest</b> is disarmed."
            },
            done() {return player[this.layer].best.gte(90)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        21: {
            requirementDescription: "120 Killstreak",
            effectDescription() {
                return "^1.1 Amoebas<br>Click power scales based on your Rainbows.<br>Currently: "+format(player.points.add(1).max(0).log(1.01))+"x"
            },
            done() {return player[this.layer].best.gte(120)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        22: {
            requirementDescription: "150 Killstreak",
            effectDescription() {
                return "1.5x Knives<br>Symbols spawn more often."
            },
            done() {return player[this.layer].best.gte(150)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        23: {
            requirementDescription: "225 Killstreak",
            effectDescription() {
                return "1.00e9x Rainbows<br>1000x Amoebas<br>2x Knives<br>+7 to <b>30 Killstreak</b> effect base."
            },
            done() {return player[this.layer].best.gte(225)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        24: {
            requirementDescription: "500 Killstreak",
            effectDescription() {
                return "Click-related multipliers can no longer drain.<br>If this layer was picked last, re-enable the Cherry layer.<br>Click power scales based on your current click-related Rainbow multiplier.<br>Currently: "+format(upgradeEffect('p', 16).pow(0.4))+"x"
            },
            done() {return player[this.layer].best.gte(500)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
            onComplete() {
                if (player.LayerTwoChoice=="k") {
                    player.LayerTwoChoice = "!"
                }
            }
        },
        25: {
            requirementDescription: "10000 Killstreak",
            effectDescription() {
                return "Unlock more Amoeba upgrades."
            },
            done() {return player[this.layer].best.gte(10000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        26: {
            requirementDescription: "40000 Killstreak",
            effectDescription() {
                return "Symbols spawn more often."
            },
            done() {return player[this.layer].best.gte(40000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        27: {
            requirementDescription: "700000 Killstreak",
            effectDescription() {
                return "nothing lmao the game isnt that long yet"
            },
            done() {return player[this.layer].best.gte(700000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
    },
    tabFormat: [
        "main-display",
        ["display-text",
            function() {
                if (player[this.layer].points.gte(1e6)) {
                   return "Knife gain is softcapped after 1.00e6."
                }
                return null
             }],
        ["display-text",
        function() {
            if(player.LayerTwoChoice!=null && player.LayerTwoChoice!=this.layer && player.LayerTwoChoice!="!") {
                return "This layer is currently deactivated!"
            }
            return null
            }],
        "blank",
        "prestige-button",
        "blank",
        "resource-display",
        "milestones",
        ["display-text",
            function() {
                return "<font color='#ff0000'>All Knife upgrades set your Knives to 0 and force a Kill reset without awarding Knives!"
             }],
        "blank",
        "upgrades",
    ],
})

addLayer("AAA", {
    startData() {
        return {
            unlocked: true,
        }
    },
    color: "yellow",
    row: "side",
    layerShown() { return true },
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievements: {
        11: {
            name: "An Essence of the Broken World",
            done() { return player.mem.points.gte(100) },
            tooltip: "Gain 100 Memories.<br>Rewards:Fragments generation is a little faster.",
            image: "img/acv/mem crystal.jpg",
        },
        12: {
            name: "A Stack",
            done() { return player.points.gte(9999) },
            tooltip: "Gain 9999 Fragments.",
            image: "img/acv/12.png",
        },
        13: {
            name: "Two Stacks for Sure",
            done() { return player.points.gte(19998) && hasUpgrade("mem", 33) },
            tooltip: "Gain 19998 Fragments With Directly Transfer.Rewards:You start at 5 Memories when reset.",
            image: "img/acv/13.png",
        },
        14: {
            name: "Define Aspects",
            done() { return player.light.unlocked && player.dark.unlocked },
            tooltip: "Unlock Both Light And Dark Layers.<br>Rewards:They behave as they are unlocked first.",
            image:"img/acv/define aspects.jpg"
        },
        15: {
            name: "Does Anybody Say sth About Softcap?",
            done() { return tmp['mem'].softcap.gte(1e13) },
            tooltip: "Push Memory Softcap starts x1,000 later.<br>Rewards:Memories gain x1.5, regardless of softcap.",
        },
        21: {
            name: "Eternal Core",
            done() { return hasUpgrade('mem', 41) },
            tooltip: "Build up the Core.<br>Rewards:Unlock L&D milestones and you won't lose Eternal Core.",
        },
        22: {
            name: "Define Aspects™",
            done() { return hasMilestone('light', 0) && hasMilestone('dark', 0) },
            tooltip: "Reach L&D's 1st milestone.<br>Rewards:Conclusion no longer decreases Memories gain.Optimistic Thoughts&Force Operation will always give back their cost.",
            image:"img/acv/define aspects™.jpg"
        },
        23: {
            name: "Now You Are Useless",
            done() { return hasAchievement('a', 22) && hasUpgrade('mem', 34) },
            tooltip: "Buy Conclusion When it is useless.<br>Rewards:When you buy Conclusion, it makes your Memory softcap start later but effect decreases based on your Time since Memory Reset.",
        },
        24: {
            name: "Eternal Core^2",
            done() { return hasAchievement('a', 21) && (player.mem.points.gte(1e23) && player.light.points.gte(65) && player.dark.points.gte(65)) },
            tooltip: "Make you can afford Eternal Core again after you have it.",
        },
        25: {
            name: "Stacks^Stacks",
            done() { return player.points.gte(9.99e18) },
            tooltip: "Gain 9.99e18 Fragments.<br>Rewards:Fragments now make Memory softcap starts later.",
            image: "img/acv/25.png",
        },
        31: {
            name: "Other Angles",
            done() { return player.kou.unlocked && player.lethe.unlocked },
            tooltip: "Unlock Both Red And Forgotten Layers.<br>Rewards:They behave as they are unlocked first.",
        },
        32: {
            name: "Finally I Get Rid of You!",
            done() { return hasMilestone('kou', 2) && hasMilestone('lethe', 2) },
            tooltip: "Reach R&F's 3rd milestone.<br>Rewards:Keep Directly Transfer when L or D reset, and Fragment Sympathy will always give back its cost.",
            image: "img/acv/32.png",
        },
        33: {
            name: "Plenty of them",
            done() { return player.light.points.gte(200) && player.dark.points.gte(200) },
            tooltip: "Have more than 200 on both Light Tachyons&Dark Matters.<br>Rewards:Their effects increase based on their own reset time.",
        },
        34: {
            name: "Introducing: The AutoMate™",
            done() { return hasMilestone('kou', 4) && hasMilestone('lethe', 4) },
            tooltip: "Reach R&F's 5th milestone.<br>Rewards:Unlock L&D's Autobuyer.",
        },
        35: {
            name: "Plenty*1.5 of them",
            done() { return player.light.points.gte(300) && player.dark.points.gte(300) },
            tooltip: "Have more than 300 on both Light Tachyons&Dark Matters.<br>Rewards:L's effect boosts R's gain, D's effect boosts F's gain.",
        },
        41: {
            name: "Scepter of The Soul Guide",
            done() { return player.lethe.upgrades.length >= 1 },
            tooltip: "Buy your first Guiding Beacon.<br>Rewards: Always gain 20% of Memories gain every second.",
            image:"img/acv/Scepter of The Soul Guide.jpg"
        },
        42: {
            name: "Toyhouse",
            done() { return hasChallenge('kou', 11) },
            tooltip() {
                return "Finish Broken Toyhouse challenge.<br>Rewards:Guiding Beacons costing Red Dolls will give back Red Dolls cost by Achievement." + ((hasAchievement('a', 42)) ? ("<br>Currently:" + format(achievementEffect('a', 42)) + "x") : "")
            },
            effect() {
                let eff = new Decimal(0.5);
                eff = eff.plus((player.a.achievements.length - 17) / 10);
                if (eff.gt(1)) eff = new Decimal(1);
                return eff;
            },
            image:"img/acv/toyhouse.jpg"
        },
        43: {
            name: "Force Balance",
            done() { return (player.light.points.gte(900) && player.dark.points.gte(900) && player.light.points.sub(player.dark.points).abs().lte(5)) },
            tooltip: "Have more than 900 Light Tachyons&Dark Matters and difference between the two is not more than 5.<br>Rewards:When one of L or D is fall behind by another, its gain will be boosted.",
            image:"img/acv/Force balance.jpg"
        },
        44: {
            name: "I Can Idle (For) Now",
            done() { return hasUpgrade('lethe', 15) && hasUpgrade('lethe', 51) && hasAchievement('a', 33) },
            tooltip: "Make L,D,R,F's effects increases over their own reset time.<br>Rewards:Memory softcap starts later based on its own reset time.",
        },
        45: {
            name: "9 isn't a lie!",
            done() { return player.lethe.upgrades.length >= 9 },
            tooltip: "Have 9 Guiding Beacons.<br>Rewards:Guiding Scythes level boosts Forgotten Drops effect.",
        },
        51: {
            name: "e(An Essence) of the Broken World",
            done() { return player.mem.points.gte(1e100) },
            tooltip: "Gain 1e100 Memories.<br>Rewards:Starts at 100 Memories when reset.",
            image: "img/acv/e(mem).png",
        },
        52: {
            name: "Stacks e(Stacks)",
            done() { return player.points.gte(9.99e99) },
            tooltip: "Gain 9.99e99 Fragments.",
            image: "img/acv/52.png",
        },
        53: {
            name: "Beacons Beside Lethe",
            done() { return player.lethe.upgrades.length >= 25 },
            tooltip: "Have 25 Guiding Beacons.",
            image: "img/acv/beacons beside lethe.jpg",
        },
        54: {
            name: "Why Did I Watch This?",
            done() { return hasChallenge('kou', 51) },
            tooltip: "Finish Red Comet challenge.<br>Rewards:You become more curious about what you are witnessing.",
        },
        55: {
            name: "The Lab.",
            done() { return hasUpgrade('mem', 42) },
            tooltip: "Set up the Lab.<br>Rewards:Unlock Lab layer and gain 1 Research Point.",
        },
        61: {
            name: "\"A Professional lab in its……field.\"",
            done() { return hasMilestone('lab', 7) },
            tooltip: "Build up your reputation among scientists.",
        },
        62: {
            name: "A Working Lab",
            done() { return player.lab.points.gte(1000) },
            tooltip: "Gain 1000 Research Points.",
        },
        63: {
            name: "Head into Anonymous",
            done() { return player.rei.unlocked && player.yugamu.unlocked },
            tooltip: "Unlock both Anonymous Layers.<br>Rewards:Keep Red Comet Challenge Finished when reset.",
            onComplete() {
                if (!hasChallenge('kou', 51)) player.kou.challenges[51] = 1;
            },
        },
        64: {
            name: "Glance into The World",
            done() { return player.world.unlocked },
            tooltip: "Unlock World Layer.",
        },
        65: {
            name: "The True Presbyter of The World",
            done() { return player.rei.roses.gte(100) },
            tooltip: "Gain 100 Glowing Roses.<br>Rewards:Glowing Roses now boosts The Speed of World Steps gain.",
            effect() {
                if (player['rei'].roses.lte(0)) return new Decimal(1);
                let eff = player.rei.roses.plus(1).log10().plus(1);
                if (hasAchievement('a', 85)) eff = player.rei.roses.plus(1).log(7.5).plus(1);
                if (hasAchievement('a', 93)) eff = eff.times(tmp.etoluna.starPointeffect);
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return eff;
            },
            image:"img/acv/The true Presbyter of the world.jpg"
        },
        71: {
            name: "Dire Straits",
            done() { return player.yugamu.timesmoved.gte(10) },
            tooltip: "Move more than 10 times in the Maze<br>Rewards:Gain more 5 moves in the Maze.",
        },
        72: {
            name: "Triangulation",
            done() { return hasMilestone('rei', 4) && hasMilestone('yugamu', 4) },
            tooltip: "Reach LC & FL's 5th milestone.<br>Rewards:The speed of World Steps gain x1.5.",
        },
        73: {
            name: "Nothing Can Stop Us",
            done() { return player.world.restrictionnum.gte(1) && player.world.fixednum.gte(1) },
            tooltip: "Gone through both difficult World Steps.<br>Rewards:You can choose among two directions in Maze.",
        },
        74: {
            name: "Doll House",
            done() { return player.kou.points.gte(100) },
            tooltip: "Have more than 100 Red Dolls.<br>Rewards:Red Dolls itself boosts The Speed of World Steps gain.",
            effect() {
                return player.kou.points.plus(1).log10().div(1.5).max(1);
            },
        },
        75: {
            name: "Anthemy",
            done() { return player.rei.roses.gte(1000) },
            tooltip: "Gain 1000 Glowing Roses.<br>Rewards:Entering Zero Sky halves your GR instead of resetting them.",
        },
        81: {
            name: "Currently, nothing here",
            done() { return player.storylayer.unlocked },
            tooltip: "Begin your stories.",
            image: "img/acv/81.png",
        },
        82: {
            name: "Lossy Move",
            done() { return player.yugamu.timesmoved.gte(100) },
            tooltip: "Move more than 100 times in the Maze<br>Rewards:You can choose among three directions in Maze.",
        },
        83: {
            name: "Restrictions™",
            done() { return layers.world.restrictReward().gte(30) },
            tooltip: "Let Restriction Steps' reward ≥30.00x<br>Rewards:Restriction Steps' reward's softcap starts at 25.00x",
        },
        84: {
            name: "There is No Limit!",
            done() { return player.mem.points.gte(Number.MAX_VALUE) },
            tooltip: "Gain 1.79e308 Memories.",
            image: "img/acv/84.png",
        },
        85: {
            name: "Thats Not Intended",
            done() { return hasUpgrade('storylayer', 14) && inChallenge('rei', 11) && player.world.restrictChallenge },
            tooltip: "Endure Zero Sky & Restriction Challenge at the same time.<br>Rewards:Glowing Roses boost The Speed of World Steps gain better.",
        },
        91: {
            name: "Higher And Higher",
            done() { return player.world.points.gte(1000) },
            tooltip: "Gain 1000 World Steps.<br>Rewards:You can choose among all four directions in Maze.",
            image: "img/acv/Higher And Higher.jpg",
        },
        92: {
            name: "Building Group",
            done() { return player.rei.points.gte(10) && player.yugamu.points.gte(10) },
            tooltip: "Gain both 10 Luminous Churches&Flourish Labyrinths.<br>Rewards:Stories you have gone through boost Fragments generation.",
            effect() {
                return player.storylayer.points.plus(1);
            }
        },
        93: {
            name: "\"Oh, No. Another BA.\"",
            done() { return player.etoluna.starPoint.gte(250) && player.etoluna.moonPoint.gte(250) },
            tooltip: "Gain both 250 Star Points&Moon Points.<br>Rewards:Unlock their buffs.",
            effect() {
                return player.storylayer.points.plus(1);
            },
            image: "img/acv/93.png",
            //style:{'background-position':'center'}
        },
        94: {
            name: "Being others",
            done() { return challengeCompletions('saya', 11) >= 1 },
            tooltip: "Complete Memory Adjustment Challenge once.<br>Rewards:Keep World upgrades when reset, and you gain moves in maze 2x.",
        },
        95: {
            name: "Suspicious Spots",
            done() { return player.saya.unlocked && player.etoluna.unlocked },
            tooltip: "Unlock both Gemini & Knives Layers.<br>Rewards:You keep your World Atlas when reset.",
            effect() {
                return player.storylayer.points.plus(1);
            }
        },
        101: {
            name: "sizeof(double)",
            done() { return player.points.gte(Number.MAX_VALUE) },
            tooltip: "Gain 1.79e308 Fragments.",
            image: "img/acv/101.png",
        },
        102: {
            name: "\"I told you it's useless\"",
            done() { return (inChallenge('saya', 41) || (player.saya.CurrentPairChallenge!=null && tmp.saya.grid.ChallengeDepth[7]!=-1)) && inChallenge('rei', 11) },
            tooltip: "Enter Zero Sky while in Otherside of Godess Challenge.<br>Rewards:Everflashing Knives also effect Glowing roses Gain.",
        },
        103: {
            name: "Hypersense",
            done() { return player.etoluna.points.gte(100) },
            tooltip: "Gain 100 Gemini Bounds.<br>Rewards:Gemini Bounds give more speed on Star/Moon Points gaining.",
        },
        104: {
            name: "\"Did I just see an NaN?\"",
            done() { return (challengeCompletions('saya', 42) >= 5) && (inChallenge('saya', 42)||(player.saya.CurrentPairChallenge!=null && tmp.saya.grid.ChallengeDepth[8]>=5)) && player.tab == 'light' },
            tooltip: "See an NaN which won't break the game.",
            image: "img/acv/NaN.png",
        },
        105: {
            name: "Liner ≥ Softcaps",
            done() { return hasUpgrade('lab', 194) },
            tooltip: "Unlock Softcap Book.",
        },
        111: {
            name: "Worldwide Paces",
            done() { return player.ins.unlocked },
            tooltip: "Unlock Institutions.",
        },
        112: {
            name: "Seriously?",
            done() { return player.yugamu.timesmoved.gte(50000) },
            tooltip: "Move more than 50,000 times in Maze.<br>Rewards:Times moved in Maze slightly decrease Institution Fund requirement",
            effect() {
                return player.yugamu.timesmoved.max(1).log10().times(0.05).plus(1);
            },
        },
        113: {
            name: "You Can't Rely on These Forever",
            done() { return player['lab'].buyables[12].gte(100) && player['lab'].buyables[13].gte(200) },
            tooltip: "Reach Fragment Transformer & Memory Transformer's Effect Hardcap.<br>Rewards:Their overflowing levels provide weaker effects",
        },
        114: {
            name: "One World, One Goal",
            done() { return player.ins.inslevel.Eng.gte(1) && player.ins.inslevel.Fra.gte(1) && player.ins.inslevel.Deu.gte(1) && player.ins.inslevel.Che.gte(1) && player.ins.inslevel.Pol.gte(1) && player.ins.inslevel.Nor.gte(1) && player.ins.inslevel.Rus.gte(1) && player.ins.inslevel.Egy.gte(1) && player.ins.inslevel.Sau.gte(1) && player.ins.inslevel.Isr.gte(1) && player.ins.inslevel.Jpn.gte(1) && player.ins.inslevel.Ind.gte(1) && player.ins.inslevel.Kaz.gte(1) && player.ins.inslevel.Chn.gte(1) && player.ins.inslevel.Can.gte(1) && player.ins.inslevel.Usa.gte(1) && player.ins.inslevel.Bra.gte(1) && player.ins.inslevel.Arg.gte(1) && player.ins.inslevel.Nga.gte(1) && player.ins.inslevel.Zaf.gte(1) && player.ins.inslevel.Aus.gte(1) && player.ins.inslevel.Nzl.gte(1) },
            tooltip: "Let all Institution sites work at least lv.1.",
        },
        115: {
            name: "Power Awake",
            done() { return player.awaken.points.gte(1) },
            tooltip: "Unlock Awake layer.<br>Rewards:Unlock a new column of achievement.",
        },
        121: {
            name: "Define Aspects®",
            done() { return player.awaken.awakened.includes('light')&&player.awaken.awakened.includes('dark') },
            tooltip: "Awake both Light and Dark layers.",
            image:"img/acv/define aspects®.jpg"
        },
        122: {
            name: "Sea of Happiness",
            done() { return player.kou.points.gte(1000000) },
            tooltip: "Have more than 1,000,000 Red Dolls.",
        },
        123: {
            name: "The Researcher(!)",
            done() { return player.lab.points.gte(1e100)&&player.ins.points.gte(10000) },
            tooltip: "Have more than 1e100 Research Points and 10,000 Institution Funds.",
        },
        124: {
            name: "Clusters of Stars",
            done() { return player.etoluna.points.gte(1e100) },
            tooltip: "Have more than 1e100 Gemini Bounds.",
            image:"img/acv/clusters of stars.jpg"
        },
        125: {
            name: "Strategist",
            done() { return player.points.gte("1e5000")&&layers['lethe'].HyperBeaconLength() <= 12 },
            tooltip: "Have more than 1e5000 Fragments when you have no more than 12 Hyper Beacons.",
        },
        131: {
            name: "Define Aspects Co. Ltd",
            done() { return player['awaken'].awakened.includes('rei')&&player['awaken'].awakened.includes('yugamu') },
            tooltip: "Awake both Luminous & Flourish layers.",
            image:"img/acv/define aspects coltd.jpg"
        },
        132: {
            name: "Worldwide Communication",
            done() { return hasUpgrade('storylayer',52) },
            tooltip: "Unlock Institution Upgrades.",
        },
        133: {
            name: "Alchemist",
            done() { return player.fracture.ElementEssence.gte(500) },
            tooltip: "Have more than 500 Element Essences.<br>Rewards: Element Essence itself now slightly boosts its cap.",
        },
        134: {
            name: "Hold it!",
            done() { return (player.etoluna.starbump>0.9 && player.etoluna.moonbump<0.1)||(player.etoluna.moonbump>0.9 && player.etoluna.starbump<0.1) },
            tooltip: "Push Star/Moon Power while ignoring another.",
        },
        135: {
            name: "\"Oh, No. Another Pair Challenge.\"",
            done() { return (tmp.saya.grid.Sum_All_times>=5) },
            tooltip: "Complete Merge Attachment 5 times.<br>Rewards: Fragment goal of Merge Attachment decreases by Merge Attachment you completed.",
            effect(){
                let eff = new Decimal(tmp.saya.grid.Sum_All_times/280)*0.2
                return new Decimal(1).sub(eff);
            },
            image: "img/acv/PC.jpg",
        },
        141: {
            name: "Super Expander",
            done() { return (layers['fracture'].grid.return_Equiped_Equipment_Num(11)==9) },
            tooltip: "Equip 9 Element Capacity++ in Equipment slot.",
        },
        142: {
            name: "e(An Essence^2) of the Broken World",
            done() { return player.mem.points.gte("1e10000") },
            tooltip: "Gain 1e10000 Memories.",
            image: "img/acv/e(mem^2).png",
        },
        16: {
            name: "The Flash of Creation",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('light') },
            tooltip: "Awake Light layer.",
            image: "img/acv/the flash of creation.jpg",
        },
        26: {
            name: "Hide Capacities",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('dark') },
            tooltip: "Awake Dark layer.",
            image: "img/acv/hide capacities.jpg",
        },
        36: {
            name: "Gorgeous Petard",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('kou') },
            tooltip: "Awake Red layer.",
            image: "img/acv/Gorgeous Petard.jpg",
        },
        46: {
            name: "Spiritfarer",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('lethe') },
            tooltip: "Awake Forgotten layer.",
            image: "img/acv/Spiritfarer.jpg",
        },
        56: {
            name: "Uitima",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('rei') },
            tooltip: "Awake Luminous layer.",
            image: "img/acv/Ultima.jpg",
        },
        66: {
            name: "Nightmare Before the Storm",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('yugamu') },
            tooltip: "Awake Flourish layer.",
            image: "img/acv/Nightmare before storm.jpg",
        },
        76: {
            name: "Meteor Shower",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('etoluna') },
            tooltip: "Awake Gemini layer.",
            image: "img/acv/Meteor Shower.png",
        },
        86: {
            name: "Merge Conflict of Mind",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('saya') },
            tooltip: "Awake Knife layer.",
            image: "img/acv/Merge Conflict of Mind.jpg",
        },
    },
    tabFormat: [
        "blank",
        ["display-text", function () { return "When boosts say sth about achievements, usually it relates to the amount of achievements you have." }],
        ["display-text", function () { return "Achievements: " + player.a.achievements.length + "/" + (Object.keys(tmp.a.achievements).length - 2) }],
        "blank", "blank",
        "achievements",
    ],
},
)