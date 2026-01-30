addLayer("p", {
    name: "cuddy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    image: "resources/Amoeba.png",
    startData() { return {
        unlocked: true,
		points: decimalZero,
        feedingAxeCat: false,
        clickingMult: decimalOne,
        NonsenseString: "...",
    }},
    nodeStyle() {
        return {
            "background-size":"82.7%", 
            "background-repeat":"no-repeat", 
            "background-position":"center", 
        }
    },
    color: "#006BF7",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "amoebas", // Name of prestige currency
    baseResource: "rainbows", // Name of resource prestige is based on
    setDescription: "Perform cellular division for ",
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = decimalOne
        if (hasUpgrade('p', 17)) {
            mult = mult.times(2)
        }
        if (hasUpgrade('g', 11)) {
            mult = mult.times(7)
        }
        if (hasUpgrade('g', 14)) {
            mult = mult.times(upgradeEffect('g', 14))
        }
        if (hasUpgrade('g', 21)) {
            mult = mult.times(6)
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
            mult = mult.times(6)
        }
        if (hasUpgrade('p', 24)) {
            mult = mult.times(upgradeEffect('p', 24))
        }
        if (hasUpgrade('p', 25)) {
            mult = mult.times(upgradeEffect('p', 13))
        }
        if (hasMilestone('k', 15)) {
            var kEffectBase = new Decimal(1.75)
            var kScale = decimalZero
            var scalingScale = 15
            if (hasMilestone('k', 29)) {
                scalingScale = 70
            }
            if (hasMilestone('k', 18)) {
                kScale = new Decimal((player['k'].milestones.length-7)*scalingScale/100)
            }
            mult = mult.times((kEffectBase.add(kScale)).pow(player['k'].milestones.length))
            //mult = mult.times(Math.pow((1.75+Math.max(0, (player['k'].milestones.length-7))*15/100), player['k'].milestones.length))
          // mult = mult.times(Math.pow(Math.pow((1.5+Math.max(0, (player['k'].milestones.length-7))/20), player['k'].milestones.length)))
        }
        if (hasMilestone('k', 17)) {
            mult = mult.times(15)
        }
        if (hasUpgrade('p', 28)) {
            var achieveBase = 2
            mult = mult.times((new Decimal(achieveBase)).pow(player['a'].achievements.length))
        }
        if (hasUpgrade('k', 16)) {
            mult = mult.times(4)
        }
        if (hasMilestone('k', 23)) {
            mult = mult.times(1e7)
        }
        if (hasUpgrade('k', 19)) {
            mult = mult.div(1e7)
        }
        if (hasAchievement('a', 16)) {
            mult = mult.times(5e10)
        }
        if (hasUpgrade('p', 31)) {
            mult = mult.times(upgradeEffect('p', 31))
        }
        if (hasUpgrade('p', 34)) {
            mult = mult.times(upgradeEffect('p', 34))
        }
        if (hasMilestone('k', 29)) {
		    mult = mult.times(1000)
        }
        if (hasMilestone('k', 30)) {
		    mult = mult.times("1e500")
        }
        if (hasMilestone('darkness', 12)) {
		    mult = mult.times(1000000)
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
        if (hasUpgrade('g', 26)) {
            return 29
        }
        if (hasUpgrade('g', 17)) {
            return 21
        }
        return false
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = decimalOne
        if (hasMilestone('k', 21)) {
            exp = exp.times(1.05)
        }
        if (hasUpgrade('p', 32)) {
            exp = exp.times(1.01)
        }
        return exp
    },
    row: 0,
    hotkeys: [
        {key: "a", description: "A: Divide for amoebas!!!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        if (resettingLayer==this.layer) {
            playSound('AmoebaReset')
        }
        if(layers[resettingLayer].row > this.row) {
            var keep = []
            if ((hasMilestone('k', 26) && (resettingLayer=="g" || resettingLayer=="p")))
                keep.push('clickingMult')
            if (hasUpgrade('farm', 11) && resettingLayer=='g')
                keep.push('upgrades')
            if (hasMilestone('k', 28) && resettingLayer=='g')
                keep.push('points')
            layerDataReset(this.layer, keep) 
        }  
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
            set: 1,
        },
        12: {
            title: "Single Celled",
            description: "Rainbows scale based on your Amoebas.",
            cost: new Decimal(10),
            style: {'width':'140px'},
            set: 1,
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Procrastination",
            getScaling() {
                let scaleSpeed = new Decimal(2)
                let scaleExpo = new Decimal(1.47)
                let scaleCap = new Decimal(1000)
                if (hasMilestone('k', 14)) {
                    scaleSpeed = scaleSpeed.times(2.5)
                    scaleExpo = scaleExpo.add(1)
                    scaleCap = scaleCap.times(5)
                }
                if (hasUpgrade(this.layer, 25)) {
                    scaleCap = scaleCap.times(10)
                }
                if (hasUpgrade('k', 15)) {
                    scaleSpeed = scaleSpeed.times(3)
                    scaleExpo = scaleExpo.times(1.47)
                }
                if (hasUpgrade('farm', 17)) {
                    scaleCap = scaleCap.times(player['g'].AxeCatMult)
                    scaleSpeed = scaleSpeed.times(7)
                    scaleExpo = scaleExpo.times(7)
                }
                if (hasUpgrade(this.layer, 33)) {
                    scaleSpeed = scaleSpeed.times(77)
                    scaleExpo = scaleExpo.times(1.6)
                    scaleCap = scaleCap.pow(1.1)
                }
                return [scaleCap, scaleSpeed, scaleExpo]
            },
            description() {
                return "0.1x Rainbows<br>Rainbow gain now increases over time, capped at " + format(this.getScaling()[0]) + "x."
            },
            //description: "0.1x Rainbows<br>Rainbow gain now increases over time, capped at 1000x.",
            cost: new Decimal(50),
            style: {'width':'140px'},
            set: 1,
            effect() {
                return (((new Decimal(player[this.layer].resetTime)).times(this.getScaling()[1].add(1))).pow(this.getScaling()[2])).min(this.getScaling()[0])
                //return Math.min(Math.pow(player[this.layer].resetTime*scaleSpeed+1,scaleExpo)/10, scaleCap)
            },
            effectDisplay() {
                if (upgradeEffect(this.layer, this.id).eq(this.getScaling()[0])) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },
        14: {
            title: "Trust Me, It Gets Gayer",
            description: "Rainbows scale based on your Rainbows.",
            cost: new Decimal(150),
            style: {'width':'140px'},
            set: 1,
            effect() {
                return player.points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        15: {
            title: "Stability Zest",
            description: "1.477x Rainbows",
            cost: new Decimal(500),
            style: {'width':'140px'},
            set: 1,
        },
        16: {
            title: "Activity Check",
            description: "Symbols now appear on the screen.\nClicking them gives temporary Rainbow multiplier.<br>Unlock [SET 2] of Amoeba upgrades.",
            cost: new Decimal(2000),
            style: {'width':'140px'},
            set: 1,
            effect() {
                return player[this.layer].clickingMult.max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        //Set 2
        17: {
            title: "Mitosis",
            description: "2x Amoebas",
            cost: new Decimal(20000),
            style: {'width':'140px'},
            set: 2,
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
        },
        18: {
            title: "Anomaly Annihilating",
            description: "2.5x Rainbows<br>4x Click Power",
            cost: new Decimal(1e6),
            style: {'width':'140px'},
            set: 2,
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            onPurchase() {
                resetClickMult()
            },
        },
        19: {
            title: "Fallback",
            description: "<b>Activity Check</b>'s multiplier can't decrease while below triple the total # of symbols you've ever clicked.",
            cost: new Decimal(12345678),
            style: {'width':'140px'},
            set: 2,
            effect() {
                return player.minimumClickMult
            },
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
        },
        21: {
            title: "This Is Overpowered",
            description: "100x Click Power",
            cost: new Decimal(1e8),
            style: {'width':'140px'},
            set: 2,
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            onPurchase() {
                resetClickMult()
            },
        },
        //Set 3
        22: {
            title: "Woke Agenda",
            description: "10x Rainbows",
            cost: new Decimal(1e12),
            style: {'width':'140px'},
            set: 3,
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        23: {
            title: "Deep Cut",
            description: "Rainbows scale based on your Knives.",
            cost: new Decimal(4e15),
            style: {'width':'140px'},
            set: 3,
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
            cost: new Decimal(2e22),
            style: {'width':'140px'},
            set: 3,
            effect() {
                return player.points.add(1).max(0).log(17)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        25: {
            title: "Army of Amoebas",
            description: "<b>Procrastination</b>'s cap is 10x larger. <b>Procrastination</b> has an effect on Amoebas.",
            cost: new Decimal(5e25),
            style: {'width':'140px'},
            set: 3,
            effectDisplay() { return format(upgradeEffect(this.layer, 13))+"x" },
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        26: {
            title: "Pride Year",
            description: "^1.05 Rainbows<br>/50,000 Kill requirement",
            cost: new Decimal(1e36),
            style: {'width':'140px'},
            set: 3,
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        27: {
            title: "Premeditated",
            description: "Kill requirement scaling is weaker.",
            cost: new Decimal(6e39),
            style: {'width':'140px'},
            set: 3,
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        28: {
            title: "Achieve Big",
            description: "+1 to achievement Rainbow multiplier base.<br>Achievements now give 2x Amoeba multiplier.<br>Kill requirement scaling is weaker.",
            cost: new Decimal(5.25e70),
            style: {'width':'140px'},
            set: 3,
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
        },
        29: {
            title: "<h2>Bomb Strapped To Your Chest</h2>",
            description() {
                if (!hasMilestone('k', 22)) {
                    return "7.77e17x Rainbows<br><br><h3><font color='#ff0000'>After this upgrade is purchased, You have 10 seconds before a Kill reset is forced without awarding Knives.</font></h3>"
                } else {
                    return "7.77e17x Rainbows"
                }
            },
            cost: new Decimal(7e135),
            style: {'width':'280px'},
            set: 3,
            unlocked() {
                return hasUpgrade(this.layer, 21) && hasUpgrade('k', 11)
            },
            onPurchase() {
                setTimeout(function () {
                    if (!hasMilestone('k', 22)) {
                        doReset('k', true)
                    }
                }, 10000);
            }
        },
        //Set 4
        31: {
            title: "Cob Cannon",
            description: "Rainbows, Amoebas, and Cherries scale based on your Corn.<br>Unlock Plot #5.",
            cost: new Decimal("1e2400"),
            style: {'width':'140px'},
            set: 4,
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
            effect() {
                return player['farm'].Corn.add(1).pow(5).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        32: {
            title: "Hey Guys!",
            description: "^1.01 Rainbows<br>^1.01 Amoebas<br>^1.01 Money<br>Whenever you perform a Kill reset of your own volition, yes_man will immediately appear and critical clicks are 1 in 1 for 10 seconds.",
            cost: new Decimal("1e2700"),
            style: {'width':'140px', 'background-image':'url(resources/RoyalBorder.png)', "background-size":"95% 95%", "background-repeat":"no-repeat", "background-position":"center",},
            set: 4,
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
            persisting: true,
        },
        33: {
            title: "Energy Drink",
            description: "3x Crops<br>500x Critical Power while in Precision Mode<br><b>Procrastination</b> scales much faster and its cap is raised ^1.1.<br>Coinflips affect Rainbows.",
            cost: new Decimal("7e3200"),
            style: {'width':'140px'},
            set: 4,
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
        },
        34: {
            title: "Cotton Cuddy",
            description: "1.02x Knives<br>2x Money<br>1.25x Crops<br>7,777x Click Power<br>Amoebas scale based on your Sugarcane.<br>Unlock Plot $6.",
            cost: new Decimal("1e4400"),
            style: {'width':'210px'},
            set: 4,
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
            effect() {
                return player['farm'].Sugarcane.add(0).pow(5).times(100).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        35: {
            title: "Development Hell",
            description: "^1.04 Click Power<br>10x Money<br>/2 Crop Grow Speed",
            cost: new Decimal("1e6000"),
            style: {'width':'210px', 'background-image':'url(resources/RoyalBorder.png)', "background-size":"95% 95%", "background-repeat":"no-repeat", "background-position":"center",},
            set: 4,
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
            persisting: true,
        },
        /*
        36: {
            title: "Vitamin A",
            description: "10,000x Click Power<br>Symbols are pressed by hovering over them rather than passing through them.<br>Click Power scales based on your Carrots.",
            cost: new Decimal("1e15000"),
            style: {'width':'140px'},
            set: 4,
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
            effect() {
                return player['farm'].Carrots.add(0).pow(3).times(50).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        */
        36: {
            title: "Choke Point",
            description() {
                return "This rapidly increases in multiplier for Click Power, Money, Crops, Catfood Effectiveness, and yes_man but resets once you click a symbol, capped at "+format(this.getCap())+"x."
            },
            cost: new Decimal("1e7000"),
            style: {'width':'140px'},
            set: 4,
            getCap() {
                return new Decimal(5)
            },
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
            effect() {
                return player.NonClickTime.add(1).min(5)
            },
            effectDisplay() {
                if (upgradeEffect(this.layer, this.id).eq(this.getCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },
        37: {
            title: "My Best Buddy",
            description: "^1.1 Amoebas.",
            cost: new Decimal("e8000"),
            style: {'width':'140px'},
            set: 4,
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
        },
        /*
        38: {
            title: "Anomaly Agriculture",
            description: "Unlock [SET 2] of The Anomaly Farm... just kidding this is the end of the game until v0.3. Haha.",
            cost: new Decimal("e12000"),
            style: {'width':'140px', 'background-image':'url(resources/RoyalBorder.png)', "background-size":"95% 95%", "background-repeat":"no-repeat", "background-position":"center",},
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
            fullDisplay() {
                return "<h3>"+this.title+"</h3><br>"+this.description+"<br><br>Cost: 1e12,000 amoebas<br><br>Req: e20,000 rainbows, e7,777 cherries, 50,000 knives."
            },
            canAfford() {
                return player.points.gte("e20000") && player[this.layer].points.gte("e12000") && player['g'].points.gte("e7777") && player['k'].points.gte(50000)
            },
            persisting: true,
        },
        */
        38: {
            title: "Anomaly Agriculture",
            description: "Crops scale based on your Amoebas, Cherries, and Knives.",
            cost: new Decimal("e12000"),
            style: {'width':'140px'},
            set: 4,
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
            calculateMultipleEffects() {
                return [player['p'].points.max(1).log(10000).div(100).pow(0.1).add(1), player['g'].points.max(1).log(1000).div(77).pow(0.15).add(1), player['k'].points.max(1).log(10).div(5).pow(0.5).add(1)]
            },
            effect() {
                return this.calculateMultipleEffects()[0].times(this.calculateMultipleEffects()[1]).times(this.calculateMultipleEffects()[2])
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            fullDisplay() {
                return "<h3>"+this.title+"</h3><br>"+this.description+"<br>Currently: ("+format(this.calculateMultipleEffects()[0])+"x,"+format(this.calculateMultipleEffects()[1])+"x,"+format(this.calculateMultipleEffects()[2])+"x):"+this.effectDisplay()+"<br><br>Cost: 1e12,000 amoebas, 1e7,777 cherries, 50,000 knives"
            },
            canAfford() {
                return player.points.gte("e20000") && player[this.layer].points.gte("e12000") && player['g'].points.gte("e7777") && player['k'].points.gte(50000)
            },
        },
        39: {
            title: "Realm of Carnage",
            description: "+1 Dark Fragment<br>Click Power scales based on Dark Fragments.",
            cost: new Decimal("e50000"),
            style: {'width':'420px','height':'200px','corner-radius':'30px', 'background-image':'url(resources/RoyalBorder.png)', "background-size":"95% 95%", "background-repeat":"no-repeat", "background-position":"center",},
            set: 4,
            unlocked() {
                return hasUpgrade(this.layer, 29) && hasMilestone('k', 27)
            },
            effect() {
                return player['darkness'].DarkFragments.div(20).add(1)
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
            persisting: true,
        },
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        //"resource-display",
        ["display-text",
            function() {
                if (!hasUpgrade('p', 16) && !hasUpgrade('g', 13)) {
                    return ""
                }
                return "You have clicked " + player.minimumClickMult + " symbols."
            }],
        ["text-input",
            function() {
                if (!hasMilestone('k', 30)) {
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
            if ((hasUpgrade(this.layer, 21) && hasUpgrade('k', 11))) {
                return "<h3>[SET 3]</h2>"
            }
            return ""
        }],
        ["row", [["upgrade",22],["upgrade",23],["upgrade",24]]],
        ["row", [["upgrade",25],["upgrade",26],["upgrade",27],["upgrade",28]]],
        ["upgrade",29],
        "blank",

        ["display-text", function() {
            if ((hasUpgrade(this.layer, 29) && hasMilestone('k', 27)) || hasPersistingUpdateOfSet(this.layer, 4)) {
                return "<h3>[SET 4]</h2>"
            }
            return ""
        }],
        ["row", [["upgrade",31],["upgrade",32],["upgrade",33]]],
        ["row", [["upgrade",34],["upgrade",35]]],
        ["row", [["upgrade",36],["upgrade",37],["upgrade",38]]],
        ["upgrade",39],
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
    layerShown(){
        return true
    },
    color: "#F7B100",
    row: "side",
    image: "resources/AchievementIcon.png",
    /*
    effectDescription() {
        return "which multiplies Rainbow gain by " + format((new Decimal(2)).pow(player['A'].points)) +"x"
    },
    */
    nodeStyle() {
        return {
            "background-size":"90%", 
            "background-repeat":"no-repeat", 
            "background-position":"center", 
        }
    },
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
            tooltip: "Purchase the <b>Activity Check</b> upgrade.<br>Award: N/A", 
        },
        12: {
            name: "Mocking My Cucks Mucks",
            image: "resources/Amoeba_Icon.png",
            done() {return player['p'].points.gte(new Decimal(1e17))},
            unlocked() {return true},
            tooltip: "Achieve 1.00e17 amoebas.<br>Award: 1.5x Amoebas", 
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
            unlocked() {return hasUpgrade('p', 16) || player['g'].unlocked || player['k'].unlocked},
            tooltip: "Click 1,000 symbols.<br>Award: 3x Click Power.", 
            onComplete() {
                resetClickMult()
            },
        },
        15: {
            name: "So Much Clicking",
            image: "resources/Rune_Icon.png",
            done() {return player.minimumClickMult >= 5000},
            unlocked() {return hasUpgrade('p', 16) || player['g'].unlocked || player['k'].unlocked},
            tooltip: "Click 5,000 symbols.<br>Award: Symbols spawn more often.", 
        },
        16: {
            name: "Call A Doctor",
            image: "resources/Rune_Icon.png",
            done() {return player.minimumClickMult >= 50000},
            unlocked() {return hasUpgrade('p', 16) || player['g'].unlocked || player['k'].unlocked},
            tooltip: "Click 50,000 symbols.<br>Award: 5.00e10x Amoebas", 
        },
        //Chris Layer Achievements
        17: {
            name: "The Slots Call",
            image: "resources/Cherries_Icon.png",
            done() {return player['g'].points.gte(1)},
            unlocked() {return player['g'].unlocked},
            tooltip: "Perform a Gamble reset.<br>Award: N/A", 
        },
        18: {
            name: "Coinage",
            image: "resources/Cherries_Icon.png",
            done() {return player['g'].CoinflipMult.gte(2)},
            unlocked() {return player['g'].unlocked},
            tooltip: "Successfully gain Cherry multiplier from flipping a coin.<br>Award: N/A", 
        },
        19: {
            name: "Crop Farming",
            image: "resources/Cherries_Icon.png",
            done() {return player['g'].points.gte(new Decimal(1e7))},
            unlocked() {return player['g'].unlocked},
            tooltip: "Achieve 1.00e7 Cherries.<br>Award: 2x Amoebas", 
        },
        21: {
            name: "Crack Addict",
            image: "resources/Cherries_Icon.png",
            done() {return player['g'].points.gte(new Decimal(1e150))},
            unlocked() {return player['g'].unlocked},
            tooltip: "Achieve 1.00e150 Cherries.<br>Award: 7x Cherries", 
        },
        //Pac Layer Achievements
        22: {
            name: "Murder",
            image: "resources/Knives_Icon.png",
            done() {return player['k'].points.gte(1)},
            unlocked() {return player['k'].unlocked},
            tooltip: "Perform a Kill reset.<br>Award: N/A", 
        },
        23: {
            name: "Knife Collection",
            image: "resources/Knives_Icon.png",
            done() {return player['k'].points.gte(10)},
            unlocked() {return player['k'].unlocked},
            tooltip: "Achieve 10 Knives.<br>Award: Symbols spawn more often.", 
        },
        24: {
            name: "Point of No Return",
            image: "resources/Knives_Icon.png",
            done() {return player['k'].points.gte(15)},
            unlocked() {return player['k'].unlocked},
            tooltip: "Achieve 15 Knives.<br>Award: N/A.", 
        },
        25: {
            name: "The Achieving Achievement",
            image: "resources/Amoeba_Icon.png",
            done() {return hasUpgrade('p', 28)},
            unlocked() {return player['k'].unlocked},
            tooltip: "Purchase the <b>Achieve Big</b> upgrade.<br>Award: N/A.", 
        },
        26: {
            name: "IT'S SO GAY",
            image: "resources/WTF.png",
            done() {return player.points.gte("7.77e777")},
            unlocked() {return true},
            tooltip: "Achieve 7.77e777 Rainbows.<br>Award: N/A", 
        },
        27: {
            name: "DANK MEMEZ",
            image: "resources/Cherries_Icon.png",
            done() {return player['g'].points.gte("6.9e420")},
            unlocked() {return player['g'].unlocked && player['k'].unlocked},
            tooltip: "Achieve 6.90e420 Cherries.<br>Award: 7,777x Cherries", 
        },
        28: {
            name: "Fault Route",
            image: "resources/Knives_Icon.png",
            done() {return player['k'].points.gte(2500)},
            unlocked() {return player['g'].unlocked && player['k'].unlocked},
            tooltip: "Achieve 2,500 Knives.<br>Award: N/A", 
        },
        29: {
            name: "Cellular Congregation",
            image: "resources/Amoeba_Icon.png",
            done() {return player['p'].points.gte("1e500")},
            unlocked() {return player['p'].unlocked && player['k'].unlocked},
            tooltip: "Achieve 1.00e500 Amoebas.<br>Award: N/A", 
        },
        31: {
            name: "Lilly's Garden",
            image: "resources/AnomalyFarm_Icon.png",
            done() {return player['farm'].Wheat.gte(1)},
            unlocked() {return player['farm'].unlocked},
            tooltip: "Achieve 1.00 Wheat.<br>Award: N/A", 
        },
        32: {
            name: "I Need These To Throw At People",
            image: "resources/AnomalyFarm_Icon.png",
            done() {return player['farm'].Tomatoes.gte(100)},
            unlocked() {return player['farm'].unlocked},
            tooltip: "Achieve 100 Tomatoes.<br>Award: N/A", 
        },
        33: {
            name: "Crop Hoarder",
            image: "resources/AnomalyFarm_Icon.png",
            done() {
                var amount = decimalOne
                for (i in CropOrder) {
                    amount = amount.add(player['farm'][CropOrder[i]])
                }
                return amount.gte(250)
            },
            unlocked() {return player['farm'].unlocked},
            tooltip: "Have at least 250 crops in total.<br>Award: 1.25x Money", 
        },
        34: {
            name: "Millionaire",
            image: "resources/AnomalyFarm_Icon.png",
            done() {return player['farm'].points.gte(1e6)},
            unlocked() {return player['farm'].unlocked},
            tooltip: "Achieve $1,000,000.<br>Award: 1.05x Knives", 
        },
        35: {
            name: "Set For Life",
            image: "resources/AnomalyFarm_Icon.png",
            done() {
                var amount = decimalOne
                for (i in CropOrder) {
                    amount = amount.add(player['farm'][CropOrder[i]])
                }
                return amount.gte(5000)
            },
            unlocked() {return player['farm'].unlocked},
            tooltip: "Have at least 5,000 crops in total.<br>Award: N/A", 
        },
        36: {
            name: "Monopoly",
            image: "resources/AnomalyFarm_Icon.png",
            done() {
                var count = 0
                for (i in CropOrder) {
                    if (player['farm'][CropOrder[i]].gte(50)) {
                        count++
                    }
                }
                return count>=7
            },
            unlocked() {return player['farm'].unlocked},
            tooltip: "Have at least 50 of 7 different crops.<br>Award: N/A", 
        },
        37: {
            name: "Taking Over The World",
            image: "resources/Amoeba_Icon.png",
            done() {return player['p'].points.gte("1e3000")},
            unlocked() {return player['farm'].unlocked},
            tooltip: "Achieve 1.00e3000 Amoebas.<br>Award: N/A", 
        },
        38: {
            name: "Billionaire",
            image: "resources/AnomalyFarm_Icon.png",
            done() {return player['farm'].points.gte(1e9)},
            unlocked() {return player['farm'].unlocked},
            tooltip: "Achieve $1.00e9.<br>Award: N/A", 
        },
        39: {
            name: "Irish Diet",
            image: "resources/AnomalyFarm_Icon.png",
            done() {return player['farm'].Potatoes.gte(3000)},
            unlocked() {return player['farm'].unlocked},
            tooltip: "Achieve 3,000 Potatoes.<br>Award: 1.1x Crops", 
        },
        41: {
            name: "Into Madness",
            image: "resources/Knives_Icon.png",
            done() {return player['k'].points.gte(21000)},
            unlocked() {return player['farm'].unlocked},
            tooltip: "Achieve 21,000 Knives.<br>Award: N/A", 
        },
        42: {
            name: "Excessive Hoarding",
            image: "resources/AnomalyFarm_Icon.png",
            done() {
                var amount = decimalOne
                for (i in CropOrder) {
                    amount = amount.add(player['farm'][CropOrder[i]])
                }
                return amount.gte(500000)
            },
            unlocked() {return player['farm'].unlocked},
            tooltip: "Have at least 500,000 crops in total.<br>Award: N/A", 
        },
        43: {
            name: "Trillionaire",
            image: "resources/AnomalyFarm_Icon.png",
            done() {return player['farm'].points.gte(1e12)},
            unlocked() {return player['farm'].unlocked},
            tooltip: "Achieve $1.00e12.<br>Award: 1,000x Click Power", 
        },

        1001: {
            name: "Feeling Crazed",
            image: "resources/Secret.png",
            done() {return player.SecretAch1},
            unlocked() {return this.done()},
            tooltip: "Discover themes other than the base 2.<br>Award: N/A", 
        },
        1002: {
            name: "Skibidi Bop Yes Yes Yes",
            image: "resources/Secret.png",
            done() {return player.SecretAch2},
            unlocked() {return this.done()},
            tooltip: "Painfully discover the last of the music this game has to offer.<br>Award: 0.99x Rainbows", 
        },
        1003: {
            name: "Dude, You Good????",
            image: "resources/Knives_Icon.png",
            done() {return player.SecretAch3},
            unlocked() {return this.done()},
            tooltip: "1 in 100 chance to be granted when playing the Kill reset noise in the Guide.<br>Award: N/A", 
        },
        1004: {
            name: "LORE",
            image: "resources/Rune_Icon.png",
            done() {return player.minimumClickMult>=77777},
            unlocked() {return this.done()},
            tooltip: "Click 77,777 symbols.<br>Award: N/A", 
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
        ["row", [["achievement",24],["achievement",25],["achievement",26],["achievement",27],["achievement",28],["achievement",29]]], //13-18
        ["row", [["achievement",31],["achievement",32],["achievement",33],["achievement",34],["achievement",35],["achievement",36]]], //19-24
        ["row", [["achievement",37],["achievement",38],["achievement",39],["achievement",41],["achievement",42],["achievement",43]]], //25-30
        "blank",
        ["row", [["achievement",1001],["achievement",1002],["achievement",1003],["achievement",1004]]], //SECRETS

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
		points: decimalZero,
        unlockOrder: 0,
        AxeCosmetic: false,
        CoinflipMult: decimalOne,
        AxeCatMult: decimalOne,
        CarpalValue: decimalOne,
        precisionMode: false,
    }},
    nodeStyle() {
        return {
            "background-size":"82.7%", 
            "background-repeat":"no-repeat", 
            "background-position":"center", 
        }
    },
    color: "#770000",
    requires() { // Can be a function that takes requirement increases into account
        if (this.getUnlockOrder()==0||player.LayerTwoChoice==this.layer) {
            return new Decimal(1e17)
        }
        return (new Decimal(10)).pow(63)
    },
    resource: "cherries", // Name of prestige currency
    baseResource: "rainbows", // Name of resource prestige is based on
    resetDescription: "Gamble for ",
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        if (this.getUnlockOrder()==0) {
            return 0.47+0.017
        }
        return 0.07
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
        if (hasAchievement('a', 21)) {
            mult = mult.times(7)
        }
        if (hasUpgrade('k', 21)) {
            mult = mult.times(upgradeEffect('k', 21))
        }
        if (hasAchievement('a', 27)) {
            mult = mult.times(7777)
        }
        if (hasUpgrade('farm', 11)) {
            mult = mult.times(5000)
        }
        if (hasUpgrade('g', 24)) {
            mult = mult.times(upgradeEffect('g', 24))
        }
        if (hasUpgrade('p', 31)) {
            mult = mult.times(upgradeEffect('p', 31))
        }
        if (hasMilestone('k', 29)) {
		    mult = mult.times(1000)
        }
        if (hasMilestone('darkness', 13)) {
		    mult = mult.times(500000)
	    }
        mult = mult.times(player['g'].CoinflipMult)
        mult = mult.times(player['g'].AxeCatMult)
        mult = mult.times(player['k'].yes_power)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = decimalOne
        if (hasUpgrade('farm', 15)) {
            exp = exp.times(1.025)
        }
        if (hasUpgrade('g', 31)) {
            exp = exp.times(upgradeEffect('g', 31))
        }
        return exp
    },
    softcap: new Decimal("e7777"), 
    softcapPower: new Decimal(0.1), 
    row: 1,
    hotkeys: [
        {key: "g", description: "G: Gamble for cherries!!!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        //return true
        if (hasUpgrade(this.layer, 11) || hasMilestone("k", 11) || hasUpgrade('p', 21) || player[this.layer].points.gte(decimalOne)) {
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
    doReset(resettingLayer) {
        if (resettingLayer==this.layer) {
            playSound('GambleReset', 'wav')
        }
        var LoseAxe = true
        if (hasMilestone('k', 26) && resettingLayer == 'g')
            LoseAxe = false
        if (LoseAxe) {
           player['g'].AxeCatMult = decimalOne
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
            description: "0.25x Rainbows<br>7x Amoebas",
            cost: new Decimal(7),
            style: {'width':'140px'},
        },
        12: {
            title: "RNG",
            description: "This grants anywhere from 0.1x-25x Rainbows at any given moment.",
            cost: new Decimal(27),
            style: {'width':'140px'},
            effect() {
                return Math.max(Math.random()*25, 0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "I'm Gonna Shit",
            description: "2.5x Click Power<br>Symbols spawn more often and continue spawning without <b>Activity Check</b>.",
            cost: new Decimal(57),
            style: {'width':'140px'},
            onPurchase() {
                resetClickMult()
            },
        },
        14: {
            title: "Carpal Tunnel",
            description: "This increases by +0.01x multiplier for Rainbows, Amoebas, and Cherries for every symbol clicked.",
            cost: new Decimal(1000),
            style: {'width':'140px'},
            effect() {
                return player['g'].CarpalValue
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        15: {
            title: "Let's Go Gambling",
            description: "You have a 1 in 15 chance to critically click a symbol. Critical clicks are 5x stronger and instantly grant Amoebas equal to what you'd earn from reset.",
            cost: new Decimal(7777),
            style: {'width':'140px', 'background-image':'url(resources/RoyalBorder.png)', "background-size":"95% 95%", "background-repeat":"no-repeat", "background-position":"center",},
            persisting: true,
        },
        16: {
            title: "Cherry Tree",
            description: "Rainbows scale based on your Cherries.",
            cost: new Decimal(1000000),
            style: {'width':'140px'},
            effect() {
                return player[this.layer].points.add(1).pow(0.32)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        17: {
            title: "THE BROTHERS COCK",
            description: "You automatically purchase [SET 1] and [SET 2] Amoeba upgrades.",
            cost: new Decimal(2e8),
            style: {'width':'140px'},
        },
        18: {
            title: "I Love Crack",
            description: "<b>Carpal Tunnel</b> scales 777x faster.<br>7x Critical Power",
            cost: new Decimal(1.77e10),
            style: {'width':'140px'},
        },
        19: {
            title: "Revolver",
            description: "6x Click Power<br>Critical clicks are now 1 in 6.<br>Unlock [SET 2] of Cherry upgrades.",
            cost: new Decimal(7.77e17),
            style: {'width':'140px'},
        },
        //Set 2
        21: {
            title: "Inside Joke",
            description: "52x Rainbows<br>(10 - 4)x Amoebas",
            cost: new Decimal(4e19),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 19)
            },
        },
        22: {
            title: "Odds Against You",
            description: "Coinflip requirement scaling is weaker but only has a 1 in 4 chance to work.",
            cost: new Decimal(1e22),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 19)
            },
        },
        23: {
            title: "Surprise Guest Appearance",
            description: "A special little friend invades this reset layer...<br><br>If this layer was picked last, re-enable the Knife layer.",
            cost: new Decimal(1e24),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade(this.layer, 19)
            },
            onPurchase() {
                if (player.LayerTwoChoice=="g") {
                    player.LayerTwoChoice = "!"
                }
            },
            buySound: ["AxeCatArrives"]
            //buySound: ["AxeCatArrives"]
        },
        //Set 3
        24: {
            title: "Escape Route",
            description: "Coinflips always work.<br>Cherries lightly scale based on your Cherries past 7.00e707.",
            cost: new Decimal("7e707"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade('farm', 14)
            },
            effect() {
                return player[this.layer].points.div("7e707").add(1).log(2).pow(1.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        25: {
            title: "Bountiful Harvest",
            description: "Critical clicks are now 1 in 3.<br>Money lightly scales based on Axe Cat multiplier past 1.00e36x.",
            cost: new Decimal("1e820"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade('farm', 14)
            },
            effect() {
                return player[this.layer].AxeCatMult.div(1e36).floor().add(1).log(40).pow(0.6).div(2).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        26: {
            title: "<img src='resources/THEBROTHERSCOCK.png' alt='Image failed to load.' width='100px' height='30px'>",
            description: "500x Click Power<br>You automatically purchase [SET 3] Amoeba upgrades.",
            cost: new Decimal("1e900"),
            style: {'width':'140px'},
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description + "<br><br>Cost: 1.00e900 cherries, 1.00e900 amoebas"
            },
            unlocked() {
                return hasUpgrade('farm', 14)
            },
            onPurchase() {
                return
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost) && player['p'].points.gte(this.cost)
            }
        },
        27: {
            title: "Constant Presence",
            description: "1,000x Click Power<br>5x Critical Power<br>Catfood has a 1 in 200 chance to replace a symbol outside of feeding Axe Cat.<br>Catfood is fed to Axe Cat by hovering over it.",
            cost: new Decimal("6e1070"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade('farm', 14)
            },
        },
        28: {
            title: "Honestly Quite Incredible",
            description: "Money ever-so-slightly scales based on your Cherries past 1.00e1500.",
            cost: new Decimal("1e1500"),
            style: {'width':'140px'},
            unlocked() {
                return hasUpgrade('farm', 14)
            },
            effect() {
                return player[this.layer].points.div("1e1500").floor().add(1).log(700).pow(0.5).div(7).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        29: {
            title: "First We Crop, Then We Farm",
            description: "1.01x Crops for every 100 OoMs of Cherries.<br>1.5x Amoebas for every OoM of Axe Cat.",
            cost: new Decimal("7.77e2000"),
            style: {'width':'140px'},
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description + "<br>Currently: " + this.effectDisplay() + " and " + this.effectDisplay2() + "<br><br>Cost: 7.77e2000 cherries"
            },
            unlocked() {
                return hasUpgrade('farm', 14)
            },
            effect() {
                return (new Decimal(1.01)).pow(player[this.layer].points.log("1e100").floor())
            },
            effect2() {
                return (new Decimal(1.5)).pow(player[this.layer].AxeCatMult.log(10).floor())
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            effectDisplay2() { return format(upgradeEffect2(this.layer, this.id))+"x" },
        },
        31: {
            title: "No More Bad Dreams",
            description: "+1 Dark Fragment<br>Cherries scale based on Dark Fragments.",
            cost: new Decimal("e3000"),
            style: {'width':'420px','height':'200px','corner-radius':'30px'},
            unlocked() {
                return hasUpgrade('farm', 14)
            },
            onPurchase() {
                player['darkness'].DarkFragments = player['darkness'].DarkFragments.add(1)
            },
            effect() {
                return player['darkness'].DarkFragments.div(50).add(1)
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
        },
    },

    clickables: {
        11: {
            title() {
                return "Flip A Coin!"
            },
            display() { // Everything else displayed in the buyable button after the title
                var coinReq = new Decimal(1e24)
                var scale = new Decimal(100)
                if (hasUpgrade('g', 22)) {
                    scale = new Decimal(17)
                }
                if (player['g'].CoinflipMult.gte("1e80")) {
                    scale = scale.times(player['g'].CoinflipMult.log(10).div(10).add(1))
                }
                //coinReq = coinReq.times(Math.pow(scale, Math.log2(Math.pow(player['g'].CoinflipMult, 1.02))))
                coinReq = coinReq.times(scale.pow(player['g'].CoinflipMult.pow(1.02).log2()))
                if (player['g'].CoinflipMult.gte("1e6")) {
                    coinReq = coinReq.pow(4)
                }
                if (player['g'].CoinflipMult.gte("1e9")) {
                    coinReq = coinReq.pow(3)
                }
                if (player['g'].CoinflipMult.gte("1e12")) {
                    coinReq = coinReq.pow(2)
                }
                if (player['g'].CoinflipMult.gte("1e60")) {
                    coinReq = coinReq.pow(1.2)
                }

                var coinChance = "50"
                if (hasUpgrade('g', 22)) {
                    coinChance = "25"
                }
                if (hasUpgrade('g', 24)) {
                    coinChance = "100"
                }
                return "Force a Gamble reset without earning Cherries for a "+ coinChance +"% chance to double your Cherry multiplier.<br>(Requires " + format(coinReq) + " Rainbows)<br>Currently: "+format(player['g'].CoinflipMult)+"x"
            },
            unlocked() { return player[this.layer].unlocked}, 
            canClick() {
                var coinReq = new Decimal(1e24)
                var scale = new Decimal(100)
                if (hasUpgrade('g', 22)) {
                    scale = new Decimal(17)
                }
                if (player['g'].CoinflipMult.gte("1e80")) {
                    scale = scale.times(player['g'].CoinflipMult.log(10).div(10).add(1))
                }
                //coinReq = coinReq.times(Math.pow(scale, Math.log2(Math.pow(player['g'].CoinflipMult, 1.02))))
                coinReq = coinReq.times(scale.pow(player['g'].CoinflipMult.pow(1.02).log2()))
                if (player['g'].CoinflipMult.gte("1e6")) {
                    coinReq = coinReq.pow(4)
                }
                if (player['g'].CoinflipMult.gte("1e9")) {
                    coinReq = coinReq.pow(3)
                }
                if (player['g'].CoinflipMult.gte("1e12")) {
                    coinReq = coinReq.pow(2)
                }
                if (player['g'].CoinflipMult.gte("1e60")) {
                    coinReq = coinReq.pow(1.2)
                }
                return player.points.gte(coinReq)
                //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
            },
            onClick() { 
                var odds = 0.5
                if (hasUpgrade('g', 22)) {
                    odds = 0.75
                }
                if (hasUpgrade('g', 24)) {
                    odds = 0
                }
                if (Math.random() >= odds) {
                    player['g'].CoinflipMult = player['g'].CoinflipMult.times(2)
                    playSound('CoinflipSuccess', 'mp3', 0.4)
                } else {
                    playSound('CoinflipFail', 'mp3', 0.4)
                }
                doReset(this.layer, true)
            },
            style: {'height':'177px', 'width':'177px', 'border-radius':'177px', 'border': '5px solid', 'border-color': 'rgba(0, 0, 0, 0.125)'},
        }
    },
    milestones: {
        17: {
            requirementDescription() {
                var CatName = "Axe Cat"
                if (hasUpgrade('k', 20) && !player[this.layer].AxeCosmetic) {
                    CatName = "Brave Cat"
                }
                return "<h2>" + CatName + " is hungry...</h2>"
            },
            effectDescription() {
                var CatName = "Axe Cat"
                if (hasUpgrade('k', 20) && !player[this.layer].AxeCosmetic) {
                    CatName = "Brave Cat"
                }
                var Desc = "You can feed "+CatName+", completely disabling Amoeba gain and symbol spawning. Catfood will spawn around the screen, boosting your Rainbow and Cherry gain"
                if (hasUpgrade('farm', 17)) {
                    Desc =  Desc + ", the <b>Procrastination</b> cap"
                }
                if (hasUpgrade('k', 20)) {
                    Desc =  Desc + ", along with reducing the Kill requirement"
                }
                return Desc+" for each Catfood clicked. The cap scales based on your <b>Activity Check</b> multiplier.<br><b>Currently "+format(player['g'].AxeCatMult)+"x. (Capped at "+format(getAxeCap())+"x)</b>"
                /*
                if (hasUpgrade('p', 31)) {
                    return "You can feed Axe Cat, completely disabling Amoeba gain and symbol spawning. Catfood will spawn around the screen, boosting your Rainbow and Cherry gain for each Catfood clicked. The cap scales based on your <b>Activity Check</b> multiplier.<br><b>Currently "+format(player['g'].AxeCatMult)+"x. (Capped at "+format(player['p'].clickingMult.pow(0.5))+"x)</b>"
                    //return "You can feed Axe Cat, completely disabling Amoeba gain and causing Catfood to spawn around the screen, boosting your Rainbow and Cherry gain for each Catfood clicked. The cap scales based on your clicking power.<br><b>Currently "+format(player['g'].AxeCatMult)+"x and ^"+format(1+Math.log(player['g'].AxeCatMult)/Math.log(5)/200, 3)+". (Capped at "+format((1+Math.log(getClickPower())/Math.log(3.07)*10*player.CoinflipMult/200))+"x and ^"+format(1+Math.log((1+Math.log(getClickPower())/Math.log(3.07)*10*player.CoinflipMult/200))/Math.log(5)/200, 3)+")</b>"
                } else {
                    return "You can feed Axe Cat, completely disabling Amoeba gain and symbol spawning. Catfood will spawn around the screen, boosting your Rainbow and Cherry gain for each Catfood clicked. The cap scales based on your <b>Activity Check</b> multiplier.<br><b>Currently "+format(player['g'].AxeCatMult)+"x. (Capped at "+format(player['p'].clickingMult.pow(0.5))+"x)</b>"
                }
                */
            },
            //effectDescription: "You can feed Axe Cat, disabling Amoeba gain entirely and causing Catfood to spawn around the screen, but giving temporary Rainbow and Cherry multiplier for each Catfood clicked.<br>Currently "+format(player.AxeCatMult)+"x. (Capped at "+format(Math.log10(getClickPower()))+"x)",
            toggles: [
                ["p", "feedingAxeCat"], 
                ["g", "AxeCosmetic"],
            ],
            completeSound: "N/A",
            //completeSound: "N/A",
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
        ["display-image", function () {
            if (hasUpgrade('g', 23)) {
                if (hasUpgrade('k', 20) && !player[this.layer].AxeCosmetic) {
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

        ["display-text", function() {
            if (hasUpgrade('farm', 15)) {
                return "<h3>[SET 3]</h2>"
            }
            return ""
        }],
        ["row", [["upgrade",24],["upgrade",25],["upgrade",26]]],
        ["row", [["upgrade",27],["upgrade",28],["upgrade",29]]],
        ["upgrade", 31]
    ],
})

addLayer("k", {
    name: "pac", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "K", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    image: "resources/Knives_Icon.png",
    startData() { return {
        unlocked: false,
		points: decimalZero,
        yes_power: decimalOne,
        unlockOrder: 0,
    }},
    nodeStyle() {
        return {
            "background-size":"82.7%", 
            "background-repeat":"no-repeat", 
            "background-position":"center", 
        }
    },
    color: "#DCD200",
    requires() { // Can be a function that takes requirement increases into account
        if (this.getUnlockOrder()==0||player.LayerTwoChoice==this.layer) {
            return new Decimal(1e17)
        }
        return (new Decimal(10)).pow(63)
    },
    resource: "knives", // Name of prestige currency
    baseResource: "rainbows", // Name of resource prestige is based on
    resetDescription: "Kill for ",
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    softcap: new Decimal(100000), 
    softcapPower: new Decimal(1.07), 
    exponent() { // Prestige currency exponent
        if (this.getUnlockOrder()==0 || hasUpgrade(this.layer, 16)) {
            var scale = 1.75
            if (hasUpgrade('p', 28)) {
               scale-=0.2
            }
            if (hasUpgrade('p', 27)) {
                scale-=0.07
            }
            if (player[this.layer].points.gte(tmp[this.layer].softcap)) {
                scale*=tmp[this.layer].softcapPower
            }
            return scale
        }
        return 1.75
    }, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = decimalOne
        if (hasUpgrade('p', 26)) {
            mult = mult.times(0.00002)
        }
        if (hasUpgrade('p', 27)) {
            mult = mult.times(0.2)
        }
        if (hasUpgrade('k', 20)) {
            mult = mult.div(player['g'].AxeCatMult)
        }
        return mult
    },
    directMult() {
        mult = decimalOne
        if (hasUpgrade('k', 15)) {
            mult = mult.times(2)
        }
        if (hasUpgrade('k', 16)) {
            mult = mult.times(2)
        }
        if (hasUpgrade('k', 17)) {
            mult = mult.times(1.1)
        }
        if (hasUpgrade('k', 18)) {
            mult = mult.times(upgradeEffect('k', 18))
        }
        if (hasUpgrade('farm', 13)) {
            mult = mult.times(upgradeEffect('farm', 13))
        }
        if (hasAchievement('a', 34)) {
            mult = mult.times(1.05)
        }
        if (hasUpgrade('p', 34)) {
            mult = mult.times(1.02)
        }
        if (hasMilestone('k', 29)) {
		    mult = mult.times(1.1)
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return decimalOne
    },
    row: 1,
    hotkeys: [
        {key: "k", description: "K: Kill for knives!!!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        //return true
        if (hasUpgrade(this.layer, 11) || hasUpgrade('g', 11) || hasMilestone('k', 11) || hasUpgrade('p', 21) || player[this.layer].points.gte(decimalOne) || player['g'].points.gte(decimalOne)) {
            return true
        }
        return false
    },
    canReset() {
        return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
        //return hasUpgrade('p', 21) && player.points.gte(tmp[this.layer].requires())
        //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
    doReset(resettingLayer) {
        if (resettingLayer==this.layer) {
            playSound('KillReset')
        }
    },
    onPrestige() {
        if (hasUpgrade('p', 32)) {
            makeShinies(yes_face, 1)
            player.MustCrit = true
            setTimeout(function () {
                player.MustCrit = false
            }, 10000);
        }
    },
    canBuyMax() {
        return hasMilestone(this.layer, 17)
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
            cost: decimalOne,
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
            },
        },
        12: {
            title: "Blood Cells",
            description: "6x Amoebas",
            cost: new Decimal(4),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
            },
        },
        13: {
            title: "Good Thing I'm Straight",
            description: "/10,000 Rainbows<br>6.66e6x Click Power",
            cost: new Decimal(8),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
                resetClickMult()
            },
        },
        14: {
            title: "Genocide",
            description: "Symbols spawn more often.<br>10x Click Power",
            cost: new Decimal(12),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
            },
        },
        15: {
            title: "Adrenaline",
            description: "/10 Rainbows<br>2x Knives<br><b>Procrastination</b> reaches its cap faster.<br>Amoebas scale based on your Knives.",
            cost: new Decimal(20),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
            },
            effect() {
                return player[this.layer].points.add(1).pow(1.75)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        16: {
            title: "This Is Overpowered [II]",
            description: "4x Amoebas<br>3x Click Power<br>2x Knives<br>Rainbows scale based on Rainbows again, but weaker.<br><br>If this layer was picked last, re-enable the Cherry layer.",
            cost: new Decimal(36),
            style: {'width':'240px'},
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
                resetClickMult()

                if (player.LayerTwoChoice=="k") {
                    player.LayerTwoChoice = "!"
                }
            },
            effect() {
                return player.points.add(1).pow(0.04)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        //Set 2
        17: {
            title: "Dark And Twisted Upgrade",
            description: "1.1x Knives.<br>Axe Cat affects Amoebas at a reduced rate.",
            cost: new Decimal(500),
            style: {'width':'140px'},
            unlocked() {
                return hasMilestone(this.layer, 24)
            },
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
                resetClickMult()
            },
            effect() {
                return player['g'].AxeCatMult.pow(0.7)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        18: {
            title: "What Is Wrong With You?",
            description() {
                return "Knives ever-so-slightly scale based on your Cherries, capped at "+format(this.getCap())+"x."
            },
            cost: new Decimal(580),
            style: {'width':'140px'},
            getCap() {
                return new Decimal(3.5)
            },
            unlocked() {
                return hasMilestone(this.layer, 24)
            },
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
                resetClickMult()
            },
            effect() {
                return player['g'].points.pow(0.5).max(1).log(25).div(200).add(1).min(3.5)
            },
            effectDisplay() {
                if (upgradeEffect(this.layer, this.id).eq(this.getCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },
        19: {
            title: "This Is The Relationship I Want To Have With You",
            description: "/10,000,000 Amoebas.<br>^1.1 Rainbows<br>3x Critical Power",
            cost: new Decimal(860),
            style: {'width':'140px'},
            unlocked() {
                return hasMilestone(this.layer, 24)
            },
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
                resetClickMult()
            },
        },
        20: {
            title: "Becoming Brave",
            description: "Axe Cat evolves and becomes stronger, having a higher multiplier and reducing Kill requirement.<br>Axe Cat gets fed double.<br>Axe Cat gets hungry slower.",
            cost: new Decimal(1225),
            style: {'width':'140px'},
            unlocked() {
                return hasMilestone(this.layer, 24)
            },
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
                resetClickMult()
            },
        },
        21: {
            title: "Agonizing Pain",
            description: "Cherries scale based on your Knives and even more from your Knives past 1,450.",
            cost: new Decimal(1400),
            style: {'width':'140px'},
            unlocked() {
                return hasMilestone(this.layer, 24)
            },
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
                resetClickMult()
            },
            effect() {
                return player[this.layer].points.add(1).pow(4.07).times(player[this.layer].points.sub(1450).max(1).pow(2.7))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            title: "yes_upgrade",
            description: "Summon the wrath of yes_man to cause mass destruction. His face has a 1 in 100 chance to spawn in place of a symbol. When hovered over, a Kill reset is forced without awarding Knives, but it increases <b>Carpal Tunnel</b> and Click Power multiplier based on your Knives. Scales 5x more for every 100 Knives past 1500.",
            cost: new Decimal(1600),
            style: {'width':'700px','corner-shape': 'squircle','corner-radius':'10px'},
            unlocked() {
                return hasMilestone(this.layer, 24)
            },
            onPurchase() {
                player[this.layer].points = decimalZero
                doReset(this.layer, true)
                resetClickMult()
            },
            effect() {
                return player[this.layer].yes_power
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
            persisting: true,
            style: {'background-image':'url(resources/RoyalBorder.png)', "background-size":"95%", "background-repeat":"no-repeat", "background-position":"center",},
            effectDescription() {
                return '2x Click Power<br>You automatically "click" symbols when passing through them.'
            },
            done() {return player[this.layer].best.gte(3)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
        },
        13: {
            requirementDescription: "4 Killstreak",
            effectDescription() {
                return "4x Rainbows"
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
                var kEffectBase = new Decimal(1.75)
                var kScale = decimalZero
                var scalingScale = 15
                if (hasMilestone(this.layer, 29)) {
                    scalingScale = 70
                }
                if (hasMilestone(this.layer, 18)) {
                   kScale = new Decimal((player['k'].milestones.length-7)*scalingScale/100)
                }
                return (kEffectBase.add(kScale))+"x Amoebas for every Killstreak milestone.<br>Currently: "+format((kEffectBase.add(kScale)).pow(player['k'].milestones.length))+"x"
            },
            done() {return player[this.layer].best.gte(6)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        16: {
            requirementDescription: "10 Killstreak",
            effectDescription() {
                var kEffectBase = new Decimal(2.5)
                var kScale = decimalZero
                var scalingScale = 15
                if (hasMilestone(this.layer, 29)) {
                    scalingScale = 70
                }
                if (hasMilestone(this.layer, 18)) {
                    kScale = new Decimal((player['k'].milestones.length-7)*scalingScale/100)
                }
                return (kEffectBase.add(kScale))+"x Rainbows for every Killstreak milestone.<br>Currently: "+format((kEffectBase.add(kScale)).pow(player['k'].milestones.length))+"x"
            },
            done() {return player[this.layer].best.gte(10)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        17: {
            requirementDescription: "15 Killstreak",
            effectDescription() {
                return "/100 Rainbows.<br>15x Amoebas.<br>You can earn max Knives from Kill resets."
            },
            done() {return player[this.layer].best.gte(15)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        18: {
            requirementDescription: "18 Killstreak",
            effectDescription() {
                return "+0.15 to the <b>6 Killstreak</b> and <b>10 Killstreak</b> effect base for every Killstreak milestone past this point, including this.<br>Currently: "+format((player['k'].milestones.length-7)*15/100)
            },
            done() {return player[this.layer].best.gte(18)},
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
                return (kEffectBase+kScale)+"x Click Power for every Killstreak milestone past this point.<br>Currently: "+format(Math.pow((kEffectBase+kScale), player['k'].milestones.length-9))+"x"
            },
            done() {return player[this.layer].best.gte(30)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        20: {
            requirementDescription: "300 Killstreak",
            effectDescription() {
                return "^1.05 Rainbows."
            },
            done() {return player[this.layer].best.gte(300)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        21: {
            requirementDescription: "360 Killstreak",
            effectDescription() {
                return "^1.05 Amoebas<br>Click Power scales based on your Rainbows.<br>Currently: "+format(player.points.add(1).max(0).log(1.01))+"x"
            },
            done() {return player[this.layer].best.gte(360)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        22: {
            requirementDescription: "420 Killstreak",
            effectDescription() {
                return "The <h3>Bomb Strapped To Your Chest</h3> is disarmed."
            },
            done() {return player[this.layer].best.gte(420)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        23: {
            requirementDescription: "480 Killstreak",
            effectDescription() {
                return "1.00e7x Rainbows<br>1.00e7x Amoebas<br>+7 to the <b>30 Killstreak</b> milestone effect base."
            },
            done() {return player[this.layer].best.gte(480)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        24: {
            requirementDescription: "500 Killstreak",
            effectDescription() {
                return "Unlock [SET 2] of Knife upgrades."
            },
            done() {return player[this.layer].best.gte(500)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
        },
        25: {
            requirementDescription: "800 Killstreak",
            effectDescription() {
                return "<b>Activity Check</b> multiplier drains 50% slower.<br>Click power scales based on itself.<br>Currently: "+format(getClickPower().pow(0.1))+"x"
            },
            done() {return player[this.layer].best.gte(800)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
        },
        26: {
            requirementDescription: "1,500 Killstreak",
            effectDescription() {
                return "<b>Activity Check</b> is no longer reset upon Cellular Division resets.<br><b>Activity Check</b> and Axe Cat are no longer reset upon Gamble resets."
            },
            done() {return player[this.layer].best.gte(1500)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
        },
        27: {
            requirementDescription: "10,000 Killstreak",
            effectDescription() {
                return "Unlock [SET 4] of Amoeba upgrades."
            },
            done() {return player[this.layer].best.gte(10000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        28: {
            requirementDescription: "12,000 Killstreak",
            effectDescription() {
                return "Amoebas persist on Gamble resets.<br>Symbols spawn more often.<br>Unlock the ability to toggle Precision Mode, which makes critical clicks 20x rarer but give 1,000x Critical Power."
            },
            done() {return player[this.layer].best.gte(12000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
            toggles: [
                ["k", "precisionMode"],
            ],
        },
        29: {
            requirementDescription: "20,000 Killstreak",
            effectDescription() {
                return "1,000x Rainbows<br>1,000x Amoebas<br>1,000x Cherries<br>1.1x Knives<br>1,000x Click Power<br>1.5x Money<br>1.2x Crops<br>1.2x Crop Grow Speed<br>+0.55 to the <b>18 Killstreak</b> milestone effect base.<br>Keep Plot #5 and #6 without <b>Cob Cannon</b> and <b>Cotton Cuddy</b>."
            },
            done() {return player[this.layer].best.gte(20000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        30: {
            requirementDescription: "30,000 Killstreak",
            effectDescription() {
                return "+1 Dark Fragment<br>1.00e500x Amoebas"
            },
            done() {return player[this.layer].best.gte(30000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
            onComplete() {
                player['darkness'].DarkFragments = player['darkness'].DarkFragments.add(1)
            },
        },
        31: {
            requirementDescription: "100,000 Killstreak",
            effectDescription() {
                return ":)"
            },
            done() {return player[this.layer].best.gte(100000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        32: {
            requirementDescription: "150,000 Killstreak",
            effectDescription() {
                return "Coinflips are multiplied by 1000."
            },
            done() {return player[this.layer].best.gte(150000)},
            unlocked() {return hasMilestone(this.layer, this.id-1)}
        },
        33: {
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
                if (player[this.layer].points.gte(100000)) {
                   return "Knife gain is softcapped after 100,000."
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
         ["display-text", function() {
            if (hasMilestone(this.layer, 24)) {
                return "<h3>[SET 2]</h2>"
            }
            return ""
        }],
        ["row", [["upgrade",17],["upgrade",18],["upgrade",19],["upgrade",20],["upgrade",21]]],
        ["upgrade",22],
        "blank",
    ],
})

addLayer("farm", {
    name: "farmm", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    prefix: "$",
    currencyOff: true,
    image: "resources/AnomalyFarm_Icon.png",
    startData() { return {
        unlocked: false,
		points: decimalZero,

        Wheat: decimalZero,
        Tomatoes: decimalZero,
        Carrots: decimalZero,
        Corn: decimalZero,
        Potatoes: decimalZero,
        Cucumbers: decimalZero,
        Beetroots: decimalZero,
        Cabbages: decimalZero,
        Eggplants: decimalZero,
        Celery: decimalZero,
        Sugarcane: decimalZero,
        Watermelons: decimalZero,
        Catfruit: decimalZero,
        Pumpkin: decimalZero,

        WheatOwned: false,
        TomatoesOwned: false,
        CarrotsOwned: false,
        CornOwned: false,
        PotatoesOwned: false,
        CucumbersOwned: false,
        BeetrootsOwned: false,
        CabbagesOwned: false,
        EggplantsOwned: false,
        CeleryOwned: false,
        SugarcaneOwned: false,
        WatermelonsOwned: false,
        CatfruitOwned: false,
        PumpkinOwned: false,

        SelectedCrop: null,
        SelectedIndex: 0,
    }},
    nodeStyle() {
        return {
            "background-size":"94.7%", 
            "background-repeat":"no-repeat", 
            "background-position":"center", 
        }
    },
    color: "#8EED5C",
    requires() { // Can be a function that takes requirement increases into account
       return new Decimal("1e1100")
    },
    resource: "dollars", // Name of prestige currency
    baseResource: "rainbows", // Name of resource prestige is based on
    resetDescription: "Farm for ",
    effectDescription() {
        return "which multiplies your click power by "+format(player[this.layer].points.add(1).max(1).pow(2))+"x"
    },
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    softcap: new Decimal(1e9), 
    softcapPower: new Decimal(0.1), 
    exponent() { // Prestige currency exponent
        return new Decimal(2)
    }, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = decimalOne
        if (hasUpgrade('farm', 12)) {
            mult = mult.times(upgradeEffect(this.layer, 12))
        }
        if (hasUpgrade('farm', 14)) {
            mult = mult.times(2)
        }
        if (hasUpgrade('g', 25)) {
            mult = mult.times(upgradeEffect('g', 25))
        }
        if (hasAchievement('a', 33)) {
            mult = mult.times(1.25)
        }
        if (hasUpgrade('farm', 18)) {
            mult = mult.times(upgradeEffect('farm', 18))
        }
        if (hasUpgrade('p', 34)) {
            mult = mult.times(2)
        }
        if (hasMilestone('k', 29)) {
		    mult = mult.times(1.5)
        }
        if (hasUpgrade('p', 35)) {
		    mult = mult.times(10)
        }
        if (hasMilestone('darkness', 12)) {
		    mult = mult.times(3)
	    }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = decimalOne
        if (hasUpgrade('p', 32)) {
            exp = exp.times(1.01)
        }
        return decimalOne
    },
    resetsNothing: true,
    row: 2,
    doReset(resettingLayer) {
        if (resettingLayer==this.layer) {
            playSound('ChaChing')
        }
    },
    layerShown(){
        if (hasUpgrade('k', 22)) {
            return true
        }
        return false
    },
    canReset() {
        return player.points.gte(this.requires())
        //return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
    branches: ["p", "g", "k"],

    upgrades: {
        11: {
            title: "The Farming Begins",
            description: "5,000x Cherries.<br>Amoeba upgrades are no longer reset by Gamble resets.<br>Unlock new crops.<br>Unlock Plot #2.",
            fullDisplay() {
                return "<h3>The Farming Begins</h3><br>" + this.description + "<br><br>Cost: $5, 5 wheat"
            },
            cost: new Decimal(5),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].Wheat = player[this.layer].Wheat.sub(new Decimal(5))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost) && player[this.layer].Wheat.gte(5)
            },
        },
        12: {
            title: "Rainbow Capitalism",
            description: "Money scales slightly based on your Rainbows past 1.00e1100.",
            fullDisplay() {
                return "<h3>Rainbow Capitalism</h3><br>" + this.description + "<br>Currently: " + this.effectDisplay() + "<br><br>Cost: $30"
            },
            cost: new Decimal(30),
            style: {'width':'140px'},
            effect() {
                return player.points.div(new Decimal("e1100")).max(1).pow(0.7).log(20).div(100).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Back To Business",
            description: "Knives ever-so-slightly scale based on your Money and Crop Grow Speed scales based on Killstreak milestones.",
            fullDisplay() {
                return "<h3>Back To Business</h3><br>" + this.description + "<br>Currently: " + this.effectDisplay() + " and " + this.effectDisplay2() + "<br><br>Cost: $150, 20 carrots"
            },
            cost: new Decimal(150),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].Carrots = player[this.layer].Carrots.sub(new Decimal(20))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost) && player[this.layer].Carrots.gte(20)
            },
            effect() {
                return player[this.layer].points.div(4).max(1).pow(2).log(20).div(70).add(1)
            },
            effect2() {
                return new Decimal(player['k'].milestones.length).pow(0.17)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            effectDisplay2() { return format(upgradeEffect2(this.layer, this.id))+"x" },
        },
        14: {
            title: "Economic Boom",
            description: "2x Money<br>Unlock [SET 3] of Cherry upgrades.<br>Unlock Plot #3.",
            fullDisplay() {
                return "<h3>Economic Boom</h3><br>" + this.description + "<br><br>Cost: $600"
            },
            cost: new Decimal(600),
            style: {'width':'140px'},
        },
        15: {
            title: "Scarcity",
            description: "^1.025 Cherries<br>2x Crop Grow Speed while Axe Cat is hungry",
            fullDisplay() {
                return "<h3>Scarcity</h3><br>" + this.description + "<br><br>Cost: $5,000, 10 wheat, 10 tomatoes, 10 carrots, 10 corn, 10 potatoes"
            },
            cost: new Decimal(5000),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].Wheat = player[this.layer].Wheat.sub(new Decimal(10))
                player[this.layer].Tomatoes = player[this.layer].Tomatoes.sub(new Decimal(10))
                player[this.layer].Potatoes = player[this.layer].Potatoes.sub(new Decimal(10))
                player[this.layer].Carrots = player[this.layer].Carrots.sub(new Decimal(10))
                player[this.layer].Corn = player[this.layer].Corn.sub(new Decimal(10))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost) && player[this.layer].Wheat.gte(10) && player[this.layer].Tomatoes.gte(10) && player[this.layer].Potatoes.gte(10) && player[this.layer].Carrots.gte(10) && player[this.layer].Corn.gte(10)
            },
        },
        16: {
            title: "Embrace The Farmlife",
            description: "1.5x Crop Grow Speed.<br>Unlock new crops.<br>Unlock Plot #4.",
            fullDisplay() {
                return "<h3>Embrace The Farmlife</h3><br>" + this.description + "<br><br>Cost: $100,000"
            },
            cost: new Decimal(100000),
            style: {'width':'140px'},
        },
        17: {
            title: "Soon",
            description: "<b>Procrastination</b>'s cap is affected by Axe Cat and scales faster.",
            effect() {
                if (Math.random()>=0.97) {
                    return "Never, Or About Ten Years"
                }
                return this.title
            },
            fullDisplay() {
                return "<h3>"+upgradeEffect(this.layer, this.id)+"</h3><br>" + this.description + "<br><br>Cost: $5,000,000, 50 carrots, 20 cabbages"
            },
            cost: new Decimal(5e6),
            style: {'width':'140px'},
            onPurchase() {
                player[this.layer].Carrots = player[this.layer].Carrots.sub(new Decimal(50))
                player[this.layer].Cabbages = player[this.layer].Cabbages.sub(new Decimal(20))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost) && player[this.layer].Carrots.gte(50) && player[this.layer].Cabbages.gte(20)
            },
        },
        18: {
            title: "Unkept Promises",
            description: "+1 Dark Fragment<br>Money scales based on Dark Fragments.",
            fullDisplay() {
                return "<h3>Unkept Promises</h3><br>" + this.description + "<br>Currently: " + this.effectDisplay() + "<br><br>Cost: 1,000 wheat, 250 potatoes, 100 cucumbers"
            },
            cost: decimalZero,
            style: {'width':'420px','height':'200px','corner-radius':'30px'},
            onPurchase() {
                player[this.layer].Wheat = player[this.layer].Wheat.sub(new Decimal(1000))
                player[this.layer].Potatoes = player[this.layer].Potatoes.sub(new Decimal(250))
                player[this.layer].Cucumbers = player[this.layer].Cucumbers.sub(new Decimal(100))
                player['darkness'].DarkFragments = player['darkness'].DarkFragments.add(1)
            },
            canAfford() {
                return player[this.layer].Wheat.gte(1000) && player[this.layer].Potatoes.gte(250) && player[this.layer].Cucumbers.gte(100)
            },
            effect() {
                return (new Decimal(5)).pow(player['darkness'].DarkFragments)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        //CROPS

        1001: {
            title: "Wheat",
            description() {
                var cropID = 0
                return "<i>The first crop in the entire game. A long journey awaits...</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $0"
            },
            cost: decimalZero,
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return true
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(0)[2])
            },
        },
        1002: {
            title: "Tomatoes",
            description() {
                var cropID = 1
                return "<i>Not a vegetable.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $20"
            },
            cost: new Decimal(20),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(1)[2])
            },
        },
        1003: {
            title: "Carrots",
            description() {
                var cropID = 2
                return "<i>Great for your eyesight.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $75"
            },
            cost: new Decimal(75),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(2)[2])
            },
        },
        1004: {
            title: "Corn",
            description() {
                var cropID = 3
                return "<i>Corn. Corn. Corn.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $200"
            },
            cost: new Decimal(200),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(3)[2])
            },
        },
        1005: {
            title: "Potatoes",
            description() {
                var cropID = 4
                return "<i>Not worth all too much, but certainly fast to grow.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $1,250"
            },
            cost: new Decimal(1250),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(4)[2])
            },
        },
        1006: {
            title: "Cucumbers",
            description() {
                var cropID = 5
                return "<i>Huh, did you hear that? Must have been the wind.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $24,000"
            },
            cost: new Decimal(24000),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(5)[2])
            },
        },
        1007: {
            title: "Beetroots",
            description() {
                var cropID = 6
                return "<i>We can scrap the S 'cause I've never missed a beet.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $80,000"
            },
            cost: new Decimal(80000),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(6)[2])
            },
        },
        1008: {
            title: "Cabbages",
            description() {
                var cropID = 7
                return "<i>Let my savage cabbage damage ravage flying challenges 'til they scavenge bandages!</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $400,000"
            },
            cost: new Decimal(400000),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(7)[2])
            },
        },
        1009: {
            title: "Eggplants",
            description() {
                var cropID = 8
                return "<i>When has this emoji ever been used for its intended purpose? Genuine question. 🍆🍆🍆</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $2,100,000"
            },
            cost: new Decimal(2.1e6),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(8)[2])
            },
        },
        1011: {
            title: "Celery",
            description() {
                var cropID = 9
                return "<i>Plantin' celery to earn a salary.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $50,000,000"
            },
            cost: new Decimal(5e7),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(9)[2])
            },
        },
        1012: {
            title: "Sugarcane",
            description() {
                var cropID = 10
                return "<i>Our victory's in clear view.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $6.00e9"
            },
            cost: new Decimal(6e9),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return hasUpgrade(this.layer, 16)
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(10)[2])
            },
        },
        1013: {
            title: "Watermelons",
            description() {
                var cropID = 11
                return "<i>Puts the 'rind' in 'grind'.</i><br><br>Value: $"+format(getCropValue(cropID)[0])+"<br>Grow Speed: "+format(getCropValue(cropID)[1])+"s<br>Click Power Req: "+format(getCropValue(cropID)[2])
            },
            fullDisplay() {
                return "<h3>" + this.title + "</h3><br>" + this.description() + "<br><br>Cost: $6.50e11"
            },
            cost: new Decimal(6.5e11),
            style: {'width':'180px'},
            onPurchase() {
                player['farm'][this.title+"Owned"] = true
            },
            unlocked() {
                return false
            },
            canAfford() {
                return player['farm'].points.gte(this.cost) && getClickPower().gte(getCropValue(11)[2])
            },
        },
    },
    /*
    clickables: {
        11: {
            title: "<",
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
            canClick: true,
            onClick() { 
                for (g_id in player[this.layer].grid) {
                    player[this.layer].grid[data].ChosenCrop = null
                }
            },
            style: {'width':'120px'},
        },
        13: {
            title: ">",
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
    */

    /*grid: {
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
    */

    grid: {
        maxRows: 6, // If these are dynamic make sure to have a max value as well!
        maxCols: 6,
        rows() {
            var rowCount = 3
            return rowCount
        },
        cols() {
            var colCount = 3
            return colCount
        },
        getStartData(id) {
            return {
                ID: id,
                CurrentCrop: null,
                Row: Math.floor(id/100),
                Column: id%100,
                Ready: false,
            }
        },
        getCanClick(data, id) {
            var Max = 1
            if (hasUpgrade('farm', 11)) {
                Max++
            }
            if (hasUpgrade('farm', 14)) {
                Max++
            }
            if (hasUpgrade('farm', 16)) {
                Max++
            }
            if (hasUpgrade('p', 31) || hasMilestone('k', 29)) {
                Max++
            }
            if (hasUpgrade('p', 34) || hasMilestone('k', 29)) {
                Max++
            }
            return ((Math.floor(id/100)-1)*this.cols())+id%100 <= Max && (data.Ready || !data.CurrentCrop)
            //return true
            //return data.Row <= 2 && data.Column <= 2
        },
        onClick(data, id) { 
            if (player['farm'].SelectedCrop && getCropIndexFromName(player['farm'].SelectedCrop) && (data.CurrentCrop==null) && (data.Ready==false)) {
                var SCrop = player['farm'].SelectedCrop
                setGridData('farm', id, {CurrentCrop: SCrop})
                playSound('PlaceCrop', 'ogg', 0.5)
                var GrowTime = getCropValue(getCropIndexFromName(player['farm'].SelectedCrop))[1]
                if (hasUpgrade('farm', 13)) {
                    GrowTime /= upgradeEffect2('farm', 13).toNumber()
                }
                if (hasUpgrade('farm', 15) && player['g'].AxeCatMult.eq(1)) {
                    GrowTime /= 2
                } 
                if (hasUpgrade('farm', 16)) {
                    GrowTime /= 1.5
                }
                if (hasMilestone('k', 29)) {
		            GrowTime /= 1.2
                }
                if (hasUpgrade('p', 35)) {
		            GrowTime *= 2
                }
                setTimeout(() => {
                    setGridData('farm', id, {CurrentCrop: SCrop, Ready: true})
                }, GrowTime*1000);
            } else {
                if (data.Ready && data.CurrentCrop) {
                    player['farm'][data.CurrentCrop] = player['farm'][data.CurrentCrop].add(gainCropMult())
                    setGridData('farm', id, {CurrentCrop: null, Ready: false})
                    playSound('HarvestCrop', 'mp3', 0.6)
                }   
            }
        },
        getStyle(data, id) {
            if (data.CurrentCrop) {
                if (data.Ready && this.getCanClick(data,id)) {
                    return {'background-color': getCropValue(getCropIndexFromName(data.CurrentCrop))[3]}
                }
                return {'background-color': '#60a33b'}
            }
        },
        getDisplay(data, id) {
            //return data.CurrentCrop + " /// " + data.Ready
            if (data.CurrentCrop) {
                if (data.Ready) {
                    return "Harvest for +" + format(gainCropMult()) + " " + data.CurrentCrop + "!"
                }
                return "Growing " + data.CurrentCrop + "..."
            } else {
                return "[EMPTY]"
            }
            //return {'background-color': '#98562E'}
        },
        getTitle(data, id) {
            //return ((Math.floor(id/100)-1)*this.cols())+id%100
            var PlotNumber = ((Math.floor(id/100)-1)*this.cols())+id%100
            return "Plot #" + PlotNumber
        },
    },

    clickables: {
        11: {
            title: "Wheat",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(0)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        12: {
            title: "Tomatoes",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(1)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        13: {
            title: "Carrots",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(2)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        14: {
            title: "Corn",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(3)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        15: {
            title: "Potatoes",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(4)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        16: {
            title: "Cucumbers",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(5)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        17: {
            title: "Beetroots",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(6)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        18: {
            title: "Cabbages",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(7)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        19: {
            title: "Eggplants",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(8)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        21: {
            title: "Celery",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(9)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        22: {
            title: "Sugarcane",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(10)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        23: {
            title: "Watermelons",
            unlocked() {return player['farm'][this.title+"Owned"] }, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = this.title
            },
            style() {
                return {
                    'background-color': getCropValue(11)[3],
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
        777: {
            title: "",
            effect() {
                if (player['farm'].SelectedCrop == null) {
                    var Sum = decimalZero
                    for (i in CropOrder) {
                        if (player['farm'][CropOrder[i]].gt(0)) {
                            Sum = Sum.add(getCropValue(i)[0].times(player['farm'][CropOrder[i]]))
                        }
                    }
                    Sum = Sum.times(tmp['farm'].gainMult)
                    return Sum
                } else {
                    var i = getCropIndexFromName(player['farm'].SelectedCrop)
                    return getCropValue(i)[0].times(player['farm'][CropOrder[i]]).times(tmp['farm'].gainMult)
                }
            },
            display() {
                if (player['farm'].SelectedCrop == null) {
                    return "<b>Sell all your crops for +<h3>$" + format(this.effect()) + "</h3></b>"
                } else {
                    return "<b>Sell all your " + player['farm'].SelectedCrop.toLowerCase() + " for +<h3>$" + format(this.effect()) +"</h3></b>"
                }
            },
            unlocked() {return true}, 
            canClick() {
                return this.effect().gt(0)
            },
            onClick() { 
                player['farm'].points = player['farm'].points.add(this.effect())
                if (player['farm'].SelectedCrop == null) {
                    for (i in CropOrder) {
                       player['farm'][CropOrder[i]] = decimalZero
                    }
                } else {
                    var i = getCropIndexFromName(player['farm'].SelectedCrop)
                    player['farm'][CropOrder[i]] = decimalZero
                }
                playSound('ChaChing')
            },
            style() {
                return {
                    //'background-color': '#bf8f8f',
                    'width':'400px',
                    'min-height': '120px',
                    'border': '4px solid',
                    'border-radius': '100px',
	                'border-color': 'rgba(0, 0, 0, 0.125)',
                    'font-size': '12px',
                }
            }
        },
        999: {
            title: "N/A",
            unlocked() {return true}, 
            canClick() {
                return true
            },
            onClick() { 
                player['farm'].SelectedCrop = null
            },
            style() {
                return {
                    'background-color': '#bf8f8f',
                    'width':'300px',
                    'min-height': '15px',
                    'border-radius': '3px',
                }
            }
        },
    },

    tabFormat: [
        "main-display",
        ["display-text",
            function() {
                var CropDisplay = ""
                for (i in CropOrder) {
                    var RealCrop = CropOrder[i]
                    if (player['farm'][RealCrop+"Owned"]) {
                        if (i > 0) {
                            CropDisplay = CropDisplay+"<br>"
                        }
                        CropDisplay = CropDisplay + "You have <font color='" + getCropValue(i)[3] + "'>" + format(player['farm'][RealCrop]) + "</font> " + RealCrop.toLowerCase()
                    }
                }
                return CropDisplay
            }],
        

        "blank",
        "grid",
        "blank",
        ["display-text",
            function() {
                if (player['farm'].SelectedCrop) {
                    return "Currently Selected: " + player['farm'].SelectedCrop
                }
                return "Currently Selected: N/A"
            }],
        //"prestige-button",
        "blank",
        ["clickable",777],
        "blank",

        ["display-text", "<h3>[SEEDS]</h3>"],
        ["display-text", "Click a seed to switch your Selected Crop!"],
        "blank",
        ["clickable",11],
        ["clickable",12],
        ["clickable",13],
        ["clickable",14],
        ["clickable",15],
        ["clickable",16],
        ["clickable",17],
        ["clickable",18],
        ["clickable",19],
        ["clickable",21],
        ["clickable",22],
        ["clickable",23],
        ["clickable",24],
        ["clickable",25],
        ["clickable",26],
        ["clickable",27],
        ["clickable",28],
        ["clickable",29],
        ["clickable",999],
        "blank",

        ["display-text", "<h3>[SET 1]</h3>"],
        ["row", [["upgrade",11],["upgrade",12],["upgrade",13]]],
        ["row", [["upgrade",14],["upgrade",15],["upgrade",16],["upgrade",17]]],
        ["upgrade",18],
        "blank",
        
        ["display-text", "<h3>[CROPS]</h3>"],
        ["row", [["upgrade",1001],["upgrade",1002],["upgrade",1003]]],
        ["row", [["upgrade",1004],["upgrade",1005],["upgrade",1006]]],
        ["row", [["upgrade",1007],["upgrade",1008],["upgrade",1009]]],
        ["row", [["upgrade",1011],["upgrade",1012],["upgrade",1013]]],
        ["row", [["upgrade",1014],["upgrade",1015],["upgrade",1016]]],
        "blank",
        ["display-text",
            function() {
                return "Your click power is " + format(getClickPower()) + "."
            }],
        "blank",
    ],
})

addLayer("darkness", {
    startData() { return {
        unlocked: true,
        DarkFragments: decimalZero,
    }},
    layerShown(){
        return player['darkness'].DarkFragments.gt(0)
    },
    color: "#534a55",
    row: 1,
    image: "resources/Darkness.png",
    nodeStyle() {
        return {
            'width': '75px',
            'height': '75px',
            "background-size":"90%", 
            "background-repeat":"no-repeat", 
            "background-position":"center", 
            //"transform":`translate(${(player.cX^player.cY) * 15}px, ${(player.cY^player.cX) * 15}px)`
        }
    },
    branches: [["g", "#e70ce7"]],
    /*
    effectDescription() {
        return "which multiplies Rainbow gain by " + format((new Decimal(2)).pow(player['A'].points)) +"x"
    },
    */
    tooltip() {
        return ("Darkness")
    },
    
    milestones: {
        11: {
            requirementDescription: "1 Dark Fragment - Into Darkness",
            effectDescription() {
                return "50,000,000x Rainbows<br>Symbols are pressed by hovering over them rather than passing through them.<br><font color='#ff0000'>Axe Cat is hungrier, making the multiplier drain twice as fast.</font>"
            },
            done() {return player['darkness'].DarkFragments.gte(1)},
        },
        12: {
            requirementDescription: "2 Dark Fragments - Darker Yet Darker",
            effectDescription() {
                return "1,000,000x Amoebas<br>3x Money<br>1.25x Crops<br><font color='#ff0000'>Axe Cat wants to try more food, so it'll start consuming your crops! You lose a random crop every second while feeding Axe Cat.</font>"
            },
            done() {return player['darkness'].DarkFragments.gte(2)},
        },
        13: {
            requirementDescription: "3 Dark Fragments - Something Is Coming",
            effectDescription() {
                return "1.00e20x and ^1.01 Cherries<br><font color='#ff0000'>Axe Cat demands more attention. You are unable to earn Cherries, Knives, Money, or Crops while feeding Axe Cat. You can no longer critically click while feeding Axe Cat.</font>"
            },
            done() {return player['darkness'].DarkFragments.gte(3)},
        },
        14: {
            requirementDescription: "4 Dark Fragments - True Form",
            effectDescription() {
                return "Axe Cat unlocks its true potential.<br><font color='#e70ce7'><b>You won't ever be able to turn back. It's too late.</b></font>"
            },
            done() {return player['darkness'].DarkFragments.gte(4)},
        },
    },
    
    tabFormat: [
        ["display-text", "<h2><font color='#e70ce7'>Awaken the power of the Dark Knight.</font></h2>"],
        "blank",
        "milestones",
        "blank",
    ],
})