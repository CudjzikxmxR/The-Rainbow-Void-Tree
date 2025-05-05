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
        if (this.getAxeStatus()) {
            mult = mult.times(0)
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
        exp = new Decimal(1)
        if (hasMilestone('k', 21)) {
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
                let scaleCap = 1000
                if (hasMilestone('k', 14)) {
                    scaleSpeed = 5
                    scaleExpo = 2.47
                    scaleCap = 5000
                }
                if (hasUpgrade(this.layer, 25)) {
                    scaleCap *= 10
                }
                if (hasUpgrade('k', 15)) {
                    scaleSpeed *= 3
                    scaleExpo *= 1.47
                }
                return Math.min(Math.pow(player[this.layer].resetTime*scaleSpeed+1,scaleExpo)/10, scaleCap)
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
            title: "Eternal Algebra Class",
            description: "Unlock the Math sublayer. This feature is currently uncoded, and you have beaten the game!! Yay",
            cost: new Decimal("ee9"),
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
        if (this.getUnlockOrder()==0) {
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
        mult = new Decimal(1+Math.random()*5)
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
        return new Decimal(1)
    },
    softcap: new Decimal("e5e6"), 
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
        return hasUpgrade('p', 21) && player.points.gte(this.requires())
        //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
    branches: ["p"],
    increaseUnlockOrder: ["k"],
    getUnlockOrder() {
        if (hasUpgrade(this.layer, 23)) {
            return 0
        }
        return player[this.layer].unlockOrder
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
            description: "Clicking symbols has a 1 in 10 chance to instantly grant you Amoebas equal to what you'd earn from reset.",
            cost: new Decimal(5000),
            style: {'width':'160px'},
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
            description: "52x Rainbows<br>Coinflips always grant multiplier and reset nothing.<br>The click-related Rainbow multiplier never decreases.",
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
            description: "^1.1 Rainbows<br>This layer behaves as if you chose it first.<br>A special little friend invades this reset layer...",
            cost: new Decimal(1e32),
            style: {'width':'160px'},
            unlocked() {
                return hasUpgrade(this.layer, 21)
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
                        player.CoinflipMult+=777
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
                return "You can feed Axe Cat, completely disabling Amoeba gain and causing Catfood to spawn around the screen, giving temporary Rainbow and Cherry multiplier for each Catfood clicked. The multiplier cap scales based on your clicking power. Both the multiplier cap and the multiplier per click scales based on your coinflip counter.<br><b>Currently "+format(player.AxeCatMult)+"x. (Capped at "+format(1+Math.log(getClickPower())/Math.log(3.07)*10*player.CoinflipMult/200)+"x)</b>"
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
                if (player[this.layer].points.gte(new Decimal("e5e6"))) {
                   return "Cherry gain is softcapped after e5.00e6."
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
        if (this.getUnlockOrder()==0) {
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
        return hasUpgrade('p', 21) && tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
        //return hasUpgrade('p', 21) && player.points.gte(tmp[this.layer].requires())
        //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
    canBuyMax() {
        return hasMilestone(this.layer, 13)
    },
    branches: ["p"],
    increaseUnlockOrder: ["g"],
    getUnlockOrder() {
        if (hasUpgrade(this.layer, 23)) {
            return 0
        }
        return player[this.layer].unlockOrder
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
            unlocked() {return hasMilestone(this.layer, this.id-1)}
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
            requirementDescription: "100 Killstreak",
            effectDescription() {
                return "^1.15 Rainbows.<br>The <b>Bomb Strapped To Your Chest</b> is disarmed."
            },
            done() {return player[this.layer].best.gte(100)},
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
                return "2x Knives<br>+7 to <b>30 Killstreak</b> effect base."
            },
            done() {return player[this.layer].best.gte(225)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        24: {
            requirementDescription: "500 Killstreak",
            done() {return player[this.layer].best.gte(500)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        25: {
            requirementDescription: "10000 Killstreak",
            effectDescription() {
                return "Unlock... a new Amoeba upgrade."
            },
            done() {return player[this.layer].best.gte(10000)},
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
        "prestige-button",
        "blank",
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
