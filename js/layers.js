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
        NonsenseString: "...",
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
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        if(layers[resettingLayer].row > this.row) layerDataReset(this.layer, ["NonsenseString"]) 
    },
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
            style: {'width':'140px'},
        },
        12: {
            title: "Single Celled",
            description: "Rainbows scale based on your Amoebas.",
            cost: new Decimal(10),
            style: {'width':'140px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Procrastination",
            description: "0.1x Rainbows<br>Rainbow gain now increases over time.",
            cost: new Decimal(50),
            style: {'width':'140px'},
            effect() {
                let scaleSpeed = 2
                let scaleExpo = 1.47
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
            title: "Trust Me, It Gets Gayer",
            description: "Rainbows scale based on your Rainbows.",
            cost: new Decimal(150),
            style: {'width':'140px'},
            effect() {
                return player.points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        15: {
            title: "Stability Zest",
            description: "1.777x Rainbows",
            cost: new Decimal(500),
            style: {'width':'140px'},
        },
        16: {
            title: "Activity Check",
            description: "Symbols now appear on the screen.\nClicking them gives temporary Rainbow multiplier.",
            cost: new Decimal(2000),
            style: {'width':'140px'},
            effect() {
                return player[this.layer].clickingMult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        //Set 2
        17: {
            title: "Mitosis",
            description: "2x Amoebas",
            cost: new Decimal(20000),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
        },
        18: {
            title: "Anomaly Annihilating",
            description: "2.5x Rainbows<br>Clicking symbols is 4x as effective.",
            cost: new Decimal(100000),
            style: {'width':'140px'},
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
            style: {'width':'140px'},
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
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            onPurchase() {
                resetClickMult()
            },
        },
        //Set 3
        22: {
            title: "Woke Agenda?",
            description: "10x Rainbows",
            cost: new Decimal(1e12),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        23: {
            title: "Deep Cut",
            description: "Rainbows scale based on your Knives.",
            cost: new Decimal(4e15),
            style: {'width':'140px'},
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
            style: {'width':'140px'},
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
            style: {'width':'140px'},
            effectDisplay() { return format(upgradeEffect(this.layer, 13))+"x" },
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        26: {
            title: "Pride Year",
            description: "^1.1 Rainbows",
            cost: new Decimal(5e35),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        27: {
            title: "Premeditated",
            description: "Knife requirement scaling is weaker.",
            cost: new Decimal(1e44),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        28: {
            title: "Achieve Big",
            description: "+1 to achievement Rainbow multiplier base.<br>Achievements now give 2x Amoeba multiplier.<br>Knife requirement scaling is weaker.",
            cost: new Decimal(3.25e52),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        29: {
            title: "<h3>Bomb Strapped To Your Chest</h3>",
            description() {
                if (!hasMilestone('k', 20) && !hasUpgrade('g', 23)) {
                    return "1.00e7x Rainbows<br>After this upgrade is purchased, You have 10 seconds before a Kill reset is forced without awarding Knives.<br>Has no effect if you already have the Cherry layer unlocked."
                } else {
                    return "1.00e7x Rainbows"
                }
            },
            cost: new Decimal(8e55),
            style: {'width':'280px'},
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
            onPurchase() {
                setTimeout(function () {
                    if (!hasMilestone('k', 20) && !hasUpgrade('g', 23)) {
                        doReset('k', true)
                    }
                }, 10000);
            }
        },
        //Set 4
        31: {
            title: "Becoming Brave",
            description: "Clicking symbols is 5.55e55x as effective.<br>You feed Axe Cat 3x as much.<br>Axe cat evolves! It now slightly exponentates your Cherry gain.",
            cost: new Decimal("1e39000"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 25)
            },
        },
        32: {
            title: "Energy Drink",
            description: "<b>Procrastination</b>'s base cap is now equal to your click power and scales faster over time.<br>Raise <b>Procrastination</b>'s cap ^1.5.<br>Coinflips are tripled.",
            cost: new Decimal("1e77000"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 25)
            },
        },
        33: {
            title: "Cud Luck",
            description: "^1.1 Amoebas<br>This grants anywhere from ^0.95 to ^1 Rainbows at any given moment.",
            cost: new Decimal("7e80007"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 25)
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
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 25)
            },
        },
        35: {
            title: "<font color='#ff0000'>MALWARE</font>",
            description: "<font color='#ff0000'>Ameoba upgrades no-longer autobuy.<br>Axe Cat gets hungrier faster.</font>",
            cost: new Decimal("1e150012"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 34) && hasMilestone('k', 25)
            },
        },
        36: {
            title: "I Literally Clicked It Four Times Dude",
            description: "^1.07 Rainbows<br>You can feed Catfood to Axe Cat by passing over them.<br>More catfood spawns.",
            cost: new Decimal("1e500000"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 25)
            },
        },
        37: {
            title: "Eternal Algebra Class",
            description: "Unlock the Math sublayer. This feature is currently uncoded, and you have beaten the game!! Yay",
            cost: new Decimal("e1.1e7"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 25)
            },
        },
        38: {
            title: "Anomaly Agriculture",
            description: "Unlock the Anomaly Farm.",
            cost: new Decimal("e1.4e7"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 25)
            },
            fullDisplay() {
                return "<h3>Anomaly Agriculture</h3><br>Unlock the Anomaly Farm.<br><br>Cost: e14,000,000 amoebas<br><br>Req: e30,000,000 rainbows, e17,000,000 cherries, 900,000 knives."
            },
            canAfford() {
                return player.points.gte("e3e7") && player[this.layer].points.gte("e1.4e7") && player['g'].points.gte("e1.7e6") && player['k'].points.gte(900000)
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
        ["text-input",
            function() {
                if (!hasMilestone('k', 27)) {
                    return null
                }
                return "NonsenseString"
            }],
        "blank",

        //"upgrades"
        ["display-text", "<h3>[SET 1]</h3>"],
        ["row", [["upgrade",11],["upgrade",12],["upgrade",13]]],
        ["row", [["upgrade",14],["upgrade",15],["upgrade",16]]],
        "blank",

        ["display-text", function() {
            if (hasUpgrade(this.layer, 16)) {
                return "<h3>[SET 2]</h2>"
            }
            return ""
        }],
        ["row", [["upgrade",17],["upgrade",18],["upgrade",19],["upgrade",21]]],
        "blank",

        ["display-text", function() {
            if (hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)) {
                return "<h3>[SET 3]</h2>"
            }
            return ""
        }],
        ["row", [["upgrade",22],["upgrade",23],["upgrade",24]]],
        ["row", [["upgrade",25],["upgrade",26],["upgrade",27],["upgrade",28]]],
        ["upgrade",29],
        "blank",

        ["display-text", function() {
            if (hasUpgrade(this.layer, 29) && hasMilestone('k', 25)) {
                return "<h3>[SET 4]</h2>"
            }
            return ""
        }],
        ["row", [["upgrade",31],["upgrade",32],["upgrade",33]]],
        ["row", [["upgrade",34],["upgrade",35],["upgrade",36],["upgrade",37],["upgrade",38]]],
        //["upgrade",38],
        "blank",
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
            image: "resources/Rune_Icon.png",
            done() {return player.minimumClickMult >= 1000},
            unlocked() {return true},
            tooltip: "Click 1000 symbols.<br>Award: Clicking symbols is 3x as effective.", 
            onComplete() {
                resetClickMult()
            },
        },
        15: {
            name: "So Much Clicking",
            image: "resources/Rune_Icon.png",
            done() {return player.minimumClickMult >= 5000},
            unlocked() {return true},
            tooltip: "Click 5000 symbols.<br>Award: Symbols spawn more often.", 
        },
        16: {
            name: "Carpal Tunnel",
            image: "resources/Rune_Icon.png",
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
        26: {
            name: "Wait, OoMs/sec Already??",
            image: "resources/WTF.png",
            done() {return player.points.gte("1e20000")},
            unlocked() {return true},
            tooltip: "Didn't think you'd get to this point in the game so fast huh?<br>Award: N/A", 
        },

        1001: {
            name: "Feeling Crazed",
            image: "resources/Secret.png",
            done() {return player.SecretAch1},
            unlocked() {return true},
            tooltip: "Discover themes other than the base 2.<br>Award: N/A", 
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
        "grid",
        ["row", [["achievement",11],["achievement",12],["achievement",13],["achievement",14],["achievement",15],["achievement",16]]], //Achievements 1-6
        ["row", [["achievement",17],["achievement",18],["achievement",19],["achievement",21],["achievement",22],["achievement",23]]], //7-12
        ["row", [["achievement",24],["achievement",25],["achievement",26]]], //13-18
        
        "blank",
        ["row", [["achievement",1001]]], //SECRETS

        //"achievements",
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
        AxeCosmetic: false,
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
            style: {'width':'140px'},
        },
        12: {
            title: "RNG",
            description: "This grants anywhere from 0.1x-10x Rainbows at any given moment.",
            cost: new Decimal(7),
            style: {'width':'140px'},
            effect() {
                return Math.max(Math.random()*10, 0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "I'm Gonna Shit",
            description: "Clicking symbols is 2x as effective.<br>Symbols spawn more often and continue spawning without <b>Activity Check</b>.",
            cost: new Decimal(17),
            style: {'width':'140px'},
            onPurchase() {
                resetClickMult()
            },
        },
        14: {
            title: "Click Your Way To Victory",
            description: "This increases by +0.01x multiplier for Rainbows, Amoebas, and Cherries for every symbol clicked.",
            cost: new Decimal(50),
            style: {'width':'140px'},
            effect() {
                return player.cherryUpgrade14
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        15: {
            title: "Lets Go Gambling",
            description: "Clicking symbols has a 1 in 7 chance to instantly grant you Amoebas equal to what you'd earn from reset.<br>This effect persists while this layer is disabled.",
            cost: new Decimal(5000),
            style: {'width':'140px'},
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
            style: {'width':'140px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        17: {
            title: "THE BROTHERS COCK",
            description: "You automatically purchase Amoeba upgrades.",
            cost: new Decimal(5000000),
            style: {'width':'140px'},
        },
        18: {
            title: "I Love Crack",
            description: "7x Cherries<br>Rainbows scale based on your Cherries and RNG.",
            cost: new Decimal(1.77e11),
            style: {'width':'140px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.25).times(Math.max(Math.random()*5, 0.5))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        19: {
            title: "Chris Luck",
            description: "Clicking symbols always grants Amoebas.",
            cost: new Decimal(7.77e17),
            style: {'width':'140px'},
        },
        //Set 2
        21: {
            title: "Deck of Cards",
            description: "52x Rainbows<br>Click-related multipliers can no longer drain.",
            cost: new Decimal(7.77e21),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 19)
            },
        },
        22: {
            title: "Fortnite Balls",
            description: "1.777x Amoebas<br>Coinflips always grant multiplier and reset nothing.",
            cost: new Decimal(1e25),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 19)
            },
        },
        23: {
            title: "Surprise Guest Appearance",
            description: "^1.1 Rainbows<br>If this layer was picked last, re-enable the Knife layer.<br>A special little friend invades this reset layer...",
            cost: new Decimal(1e32),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 19)
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
                var coinReq = new Decimal(1e24)
                coinReq = coinReq.times(Math.pow(100, Math.log2(player.CoinflipMult)))
                if (player.CoinflipMult > 2e10) {
                    coinReq = (coinReq.times((new Decimal(10000)).pow(player.CoinflipMult/2e10))).pow(player.CoinflipMult/2e10)
                }
                if (player.CoinflipMult<Math.pow(2,22)) {
                    return "Force a Gamble reset without earning Cherries for a 50% chance to double your Cherry multiplier.<br>(Requires " + format(coinReq) + " Rainbows)<br>Currently: "+format(player.CoinflipMult)+"x"
                } else {
                    return "Do a coinflip to gain Cherry multiplier.<br>(Requires " + format(coinReq) + " Rainbows)<br>Currently: "+format(player.CoinflipMult)+"x"
                }
            },
            unlocked() { return player[this.layer].unlocked }, 
            canClick() {
                var coinReq = new Decimal(1e24)
                coinReq = coinReq.times(Math.pow(100, Math.log2(player.CoinflipMult)))
                if (player.CoinflipMult > 2e10) {
                    coinReq = (coinReq.times((new Decimal(10000)).pow(player.CoinflipMult/2e10))).pow(player.CoinflipMult/2e10)
                }
                return player.points.gte(coinReq)
                //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
            },
            onClick() { 
                if (!hasUpgrade('g', 22)) {
                    doReset(this.layer, true)
                }
                if (Math.random() >= 0.5 || hasUpgrade('g', 22)) {
                    if (player.CoinflipMult<Math.pow(2,22)) {
                        player.CoinflipMult*=2
                    } else {
                        coinScaleNum = 7777
                        if (hasMilestone('k', 28)) {
                            coinScaleNum*=1000
                        }
                        if (hasUpgrade('p', 34)) {
                            coinScaleNum*=player.cherryUpgrade14
                        }
                        if (hasUpgrade('p', 32)) {
                            coinScaleNum*=3
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
                ["g", "AxeCosmetic"],
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
                if (hasUpgrade('p', 31) && !player[this.layer].AxeCosmetic) {
                    return "resources/BraveCat.png"
                }
                return "resources/AxeCat.png"
            }
            return null
        }],
        "milestones",
        //"upgrades",

        ["display-text", "<h3>[SET 1]</h3>"],
        ["row", [["upgrade",11],["upgrade",12],["upgrade",13]]],
        ["row", [["upgrade",14],["upgrade",15],["upgrade",16]]],
        ["row", [["upgrade",17],["upgrade",18],["upgrade",19]]],
        "blank",

        ["display-text", function() {
            if (hasUpgrade(this.layer, 19)) {
                return "<h3>[SET 2]</h2>"
            }
            return ""
        }],
        ["row", [["upgrade",21],["upgrade",22],["upgrade",23]]],
        "blank",
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
        if (hasUpgrade(this.layer, 11) || hasUpgrade('g', 11) || hasMilestone('k', 11) || hasUpgrade('p', 21) || player[this.layer].points.gte(new Decimal(1)) || player['g'].points.gte(new Decimal(1))) {
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
            description: "Unlock [SET 3] of Amoeba upgrades.",
            cost: new Decimal(1),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].points = new Decimal(0)
                doReset(this.layer, true)
            },
        },
        12: {
            title: "Blood Cells",
            description: "3x Amoebas",
            cost: new Decimal(4),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].points = new Decimal(0)
                doReset(this.layer, true)
            },
        },
        13: {
            title: "Good Thing I'm Straight",
            description: "0.01x Rainbows<br>Clicking symbols is 6.66e6x as effective.",
            cost: new Decimal(8),
            style: {'width':'140px'},
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
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].points = new Decimal(0)
                doReset(this.layer, true)
            },
        },
        15: {
            title: "Adrenaline",
            description: "Procrastination reaches its cap faster.<br>Amoebas scale based on your knives.",
            cost: new Decimal(20),
            style: {'width':'140px'},
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
            description: "4x Amoebas<br>Clicking is 3x as effective<br>2x Knives<br>Rainbows scale based on Rainbows again, but weaker.",
            cost: new Decimal(32),
            style: {'width':'140px'},
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
            requirementDescription: "88 Killstreak",
            effectDescription() {
                return "^1.15 Rainbows.<br>The <h3>Bomb Strapped To Your Chest</h3> is disarmed."
            },
            done() {return player[this.layer].best.gte(88)},
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
            requirementDescription: "235 Killstreak",
            effectDescription() {
                return "1.00e9x Rainbows<br>1000x Amoebas<br>2x Knives<br>+7 to the <b>30 Killstreak</b> milestone effect base."
            },
            done() {return player[this.layer].best.gte(235)},
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
                return "Unlock [SET 4] of Amoeba upgrades."
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
                return "Unlock The Textbox."
            },
            done() {return player[this.layer].best.gte(700000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        28: {
            requirementDescription: "800000 Killstreak",
            effectDescription() {
                return "Coinflips are multiplied by 1000."
            },
            done() {return player[this.layer].best.gte(800000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        29: {
            requirementDescription: "1.50e7 Killstreak",
            effectDescription() {
                return "+0.55 to the <b>18 Killstreak</b> milestone effect base."
            },
            done() {return player[this.layer].best.gte(1.5e7)},
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
        //"upgrades",
        ["display-text", "<h3>[SET 1]</h3>"],
        ["row", [["upgrade",11],["upgrade",12],["upgrade",13]]],
        ["row", [["upgrade",14],["upgrade",15]]],
        ["upgrade",16],
        "blank",
    ],
})

addLayer("farm", {
    name: "farmm", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    prefix: "$",
    currencyOff: true,
    image: "resources/AnomalyFarm_Icon.png",
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        Crops: {
            Wheat: new Decimal(1),
            Tomatoes: null,
            Carrots: null,
            Corn: null,
            Potatoes: null,
            Cucumbers: null,
            Beetroots: null,
            Cabbages: null,
            Eggplants: null,
            Celery: null,
            Sugarcane: null,
            Watermelon: null,
            Catfruit: null,
            Pumpkin: null,
        },
        CropsCount: {
            Wheat: new Decimal(0),
            Tomatoes: new Decimal(0),
            Carrots: new Decimal(0),
            Corn: new Decimal(0),
            Potatoes: new Decimal(0),
            Cucumbers: new Decimal(0),
            Beetroots: new Decimal(0),
            Cabbages: new Decimal(0),
            Eggplants: new Decimal(0),
            Celery: new Decimal(0),
            Sugarcane: new Decimal(0),
            Watermelon: new Decimal(0),
            Catfruit: new Decimal(0),
            Pumpkin: new Decimal(0),
        },
        SelectedCrop: null,
        SelectedIndex: 0,
    }},
    color: "#8EED5C",
    requires() { // Can be a function that takes requirement increases into account
       return new Decimal(1)
    },
    resource: "dollars", // Name of prestige currency
    baseResource: "rainbows", // Name of resource prestige is based on
    resetDescription: "Farm for ",
    effectDescription() {
        return "which multiplies your click power by "+format((new Decimal(1.25)).pow(player[this.layer].points))+"x"
    },
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    softcap: new Decimal(1e6), 
    softcapPower: new Decimal(0.1), 
    exponent() { // Prestige currency exponent
        return 2
    }, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    directMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    resetsNothing: true,
    row: 2, // Row the layer is in on the tree (0 is the first row)
    
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        if(layers[resettingLayer].row > this.row) layerDataReset(this.layer, ["Crops"]) 
    },
    layerShown(){
        //return true
        if (hasUpgrade('p', 38)) {
            return true
        }
        return false
    },
    canReset() {
        return false
    },
    branches: ["p", "g", "k"],

    upgrades: {
        11: {
            title: "Crop Farming",
            description: "Unlock new crops.",
            fullDisplay() {
                return "<h3>Crop Farming</h3><br>Unlock new crops.<br><br>Cost: $15, 10 wheat"
            },
            cost: new Decimal(15),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].CropsCount.Wheat = player[this.layer].CropsCount.Wheat.add(new Decimal(-10))
            },
            canAfford() {
                return player[this.layer].points.gte(15) && player[this.layer].CropsCount.Wheat.gte(10)
            },
        },
        12: {
            title: "Texty Texty",
            description: "You have ^1.05 rainbows while the Textbox's text begins with the 'A' character, and ^1.05 amoebas while the text begins with the 'B' character.",
            fullDisplay() {
                return "<h3>Texty Texty</h3><br>You have ^1.05 rainbows while the Textbox's text begins with the 'A' character, and ^1.05 amoebas while the text begins with the 'B' character.<br><br>Cost: $30, 10 wheat, 10 tomatoes"
            },
            cost: new Decimal(30),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].CropsCount.Wheat = player[this.layer].CropsCount.Wheat.add(new Decimal(-10))
                player[this.layer].CropsCount.Tomatoes = player[this.layer].CropsCount.Tomatoes.add(new Decimal(-10))
            },
            canAfford() {
                return player[this.layer].points.gte(30) && player[this.layer].CropsCount.Wheat.gte(10) && player[this.layer].CropsCount.Tomatoes.gte(10)
            },
        },
        13: {
            title: "Back To Business",
            description: "Knives slightly scale based on money, and crop grow speed slightly scales based on how many Killstreak milestones you have.",
            fullDisplay() {
                return "<h3>Back To Business</h3><br>Knives slightly scale based on money, and crop grow speed slightly scales based on how many Killstreak milestones you have.<br><br>Cost: $50, 20 carrots"
            },
            cost: new Decimal(50),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].CropsCount.Carrots = player[this.layer].CropsCount.Carrots.add(new Decimal(-20))
            },
            canAfford() {
                return player[this.layer].points.gte(50) && player[this.layer].CropsCount.Carrots.gte(20)
            },
        },
        14: {
            title: "Economic Boom",
            description: "2x Money<br>Unlock [SET 3] of Cherry upgrades.<br>Unlock [SET 2] of Knife upgrades.",
            fullDisplay() {
                return "<h3>Economic Boom</h3><br>2x Money<br>Unlock [SET 3] of Cherry upgrades.<br>Unlock [SET 2] of Knife upgrades.<br><br>Cost: $150"
            },
            cost: new Decimal(150),
            style: {'width':'140px'},
        },
        15: {
            title: "Scarcity",
            description: "^1.025 Cherries<br>Crops grow 1.5x faster if Axe Cat is hungry.",
            fullDisplay() {
                return "<h3>Scarcity</h3><br>^1.025 Cherries<br>Crops grow 1.5x faster if Axe Cat is hungry.<br><br>Cost: $1000, 10 wheat, 10 tomatoes, 10 carrots, 10 potatoes"
            },
            cost: new Decimal(1000),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].CropsCount.Wheat = player[this.layer].CropsCount.Wheat.add(new Decimal(-10))
                player[this.layer].CropsCount.Tomatoes = player[this.layer].CropsCount.Tomatoes.add(new Decimal(-10))
                player[this.layer].CropsCount.Carrots = player[this.layer].CropsCount.Carrots.add(new Decimal(-10))
                player[this.layer].CropsCount.Potatoes = player[this.layer].CropsCount.Potatoes.add(new Decimal(-10))
            },
            canAfford() {
                return player[this.layer].points.gte(1000) && player[this.layer].CropsCount.Wheat.gte(10) && player[this.layer].CropsCount.Tomatoes.gte(10) && player[this.layer].CropsCount.Carrots.gte(10) && player[this.layer].CropsCount.Potatoes.gte(10)
            },
        },
        16: {
            title: "Embrace The Farmlife",
            description: "Crops grow 1.5x faster.<br>The plot is now larger..",
            fullDisplay() {
                return "<h3>Embrace The Farmlife</h3><br>Crops grow 1.5x faster.<br>The plot is now larger.<br><br>Cost: $5000"
            },
            cost: new Decimal(5000),
            style: {'width':'140px'},
        },
        17: {
            title: "True Form",
            description: "+1 Dark Fragment",
            fullDisplay() {
                return "<h3>True Form</h3><br>+1 Dark Fragment<br><br>Cost: 1000 wheat"
            },
            cost: new Decimal(0),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].CropsCount.Wheat = player[this.layer].CropsCount.Wheat.add(new Decimal(-1000))
            },
            canAfford() {
                return player[this.layer].CropsCount.Wheat.gte(1000)
            },
        },

        //CROPS

        1001: {
            title: "Wheat",
            description() {
                var cropID = 0
                return "<i>The first crop in the entire game. A long journey awaits...</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            cost: new Decimal(0),
            style: {'width':'180px'},
            onPurchase() {
                player[this.layer].Crops.Wheat = getCropValue(0)[0]
            },
            unlocked() {
                return true
            },
        },
        1002: {
            title: "Tomatoes",
            description() {
                var cropID = 1
                return "<i>Not a vegetable.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            cost: new Decimal(10),
            style: {'width':'180px'},
            onPurchase() {
                player[this.layer].Crops.Tomatoes = getCropValue(1)[0]
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
        },
        1003: {
            title: "Carrots",
            description() {
                var cropID = 2
                return "<i>Great for your eyesight.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            cost: new Decimal(30),
            style: {'width':'180px'},
            onPurchase() {
                player[this.layer].Crops.Tomatoes = getCropValue(2)[0]
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
        },
        1004: {
            title: "Corn",
            description() {
                var cropID = 3
                return "<i>Corn. Corn. Corn.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            cost: new Decimal(100),
            style: {'width':'180px'},
            onPurchase() {
                player[this.layer].Crops.Corn = getCropValue(3)[0]
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
        },
        1005: {
            title: "Potatoes",
            description() {
                var cropID = 4
                return "<i>Not worth all too much, but certainly fast to grow.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            cost: new Decimal(200),
            style: {'width':'180px'},
            onPurchase() {
                player[this.layer].Crops.Potatoes = getCropValue(4)[0]
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
        },
        1006: {
            title: "Cucumbers",
            description() {
                var cropID = 5
                return "<i>Huh, did you hear that? Must have been the wind.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            cost: new Decimal(2000),
            style: {'width':'180px'},
            onPurchase() {
                player[this.layer].Crops.Cucumbers = getCropValue(5)[0]
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
        },
        1007: {
            title: "Beetroot",
            description() {
                var cropID = 6
                return "<i>I can't fucking come up with a description for this.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            cost: new Decimal(4000),
            style: {'width':'180px'},
            onPurchase() {
                player[this.layer].Crops.Beetroots = getCropValue(6)[0]
            },
            unlocked() {
                return false
            },
        },
    },

    clickables: {
        11: {
            title: "<",
            display() { 
               return null
            },
            unlocked() { return player[this.layer].unlocked }, 
            canClick: true,
            onClick() { 
                player[this.layer].SelectedIndex--
                if (player[this.layer].Crops[player[this.layer].SelectedIndex] != null) {
                    player[this.layer].SelectedCrop = CropOrder[player[this.layer].SelectedIndex]
                } else {
                    player[this.layer].SelectedCrop = "Wheat"
                    player[this.layer].SelectedIndex = 0
                }
            },
            style: {'width':'50px'},
        },
        12: {
            title() {
                return "Harvest"
            },
            display() { 
               return null
            },
            unlocked() { return player[this.layer].unlocked }, 
            canClick: true,
            onClick() { 
                for (g_id in player[this.layer].grid) {
                    player[this.layer].grid[data].Crop = null
                }
            },
            style: {'width':'120px'},
        },
        13: {
            title: ">",
            display() { 
               return null
            },
            unlocked() { return player[this.layer].unlocked }, 
            canClick: true,
            onClick() { 
                player[this.layer].SelectedIndex++
                if (player[this.layer].Crops[player[this.layer].SelectedIndex] != null) {
                    player[this.layer].SelectedCrop = CropOrder[player[this.layer].SelectedIndex]
                } else {
                    player[this.layer].SelectedCrop = "Wheat"
                    player[this.layer].SelectedIndex = 0
                }
            },
            style: {'width':'50px'},
        },
    },

    grid: {
        maxRows: 7,
        maxCols: 7,
        rows() {
            var rowCount = 3
            if (hasUpgrade(this.layer, 16)) {
                rowCount++
            }
            return rowCount
        },
        cols() {
            var colCount = 3
            if (hasUpgrade(this.layer, 16)) {
                colCount++
            }
            return colCount
        },
        getStartData(id) {
            return {
                ChosenCrop: null,
            }
        },
        getUnlocked(id) { // Default
            return true
        },
        getStyle(data, id) {
            if (player[this.layer].grid[data].ChosenCrop != null) {
                return {'background-color': tmp['farm'.color]}
            }
            return {'background-color': '#98562E'}
        },
        onClick(data, id) {
            player[this.layer].grid[data].ChosenCrop = player[this.layer].SelectedCrop
        },
        getTitle(data, id) {
            if (player[this.layer].grid[data].ChosenCrop != null) {
                return player[this.layer].grid[data].ChosenCrop
            }
            return "Empty"
        },
        getDisplay(data, id) {
            //return null
            //return data
            return player[this.layer].SelectedCrop + ":" + player[this.layer].SelectedIndex + ":" + data
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
    },
    tabFormat: [
        "main-display",
        "blank",
        //"upgrades",
        ["display-text", "<h3>[SET 1]</h3>"],
        ["row", [["upgrade",11],["upgrade",12],["upgrade",13]]],
        ["row", [["upgrade",14],["upgrade",15],["upgrade",16],["upgrade",17]]],
        "blank",
        "clickables",
        "blank",
        ["display-text",
            function() {
                return "Currently selected: "+player[this.layer].SelectedCrop
            }
        ],
        "blank",
        "grid",
        "blank",
        //"crops",
        ["display-text", "<h3>[CROPS]</h3>"],
        ["row", [["upgrade",1001],["upgrade",1002],["upgrade",1003]]],
        ["row", [["upgrade",1004],["upgrade",1005],["upgrade",1006]]],
        ["row", [["upgrade",1007],["upgrade",1008],["upgrade",1009]]],
        ["row", [["upgrade",1010],["upgrade",1011],["upgrade",1012]]],
        ["row", [["upgrade",1013],["upgrade",1014],["upgrade",1015]]],
    ],
})