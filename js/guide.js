addLayer("guide", {
    //CODE BORROWED FROM SCONVOLUTION CUZZ I WANTED TO CUT CORNERS GO PLAY IT
    //https://sorbettheshark.github.io/SConvolution-0.3.0/
    startData() {return {
        unlocked: true
    }},
    color: "#c4c6de",
    image: "resources/Secret.png",
    row: "side",
    layerShown: true,
    type: "none",
    resource: "",
    tooltip: "Guide",
    nodeStyle() {
        return {
            "top":"4px",
            "background-size":"90%", 
            "background-repeat":"no-repeat", 
            "background-position":"center"
        }
    },
    clickables: {
        11: {
            title: "[PLAY SOUND]",
            canClick() { 
                return true
            },
            onClick() { 
                playSound("AmoebaReset")
            },
            style: {'background-color': '#006BF7', 'min-height':'0px', 'height':'37px', 'width':'277px', 'border-radius':'177px', 'border': '3px solid', 'border-color': 'rgba(0, 0, 0, 0.125)'},
        },
        12: {
            title: "[PLAY SOUND]",
            canClick() { 
                return true
            },
            onClick() { 
                playSound("GambleReset", "wav")
            },
            unlocked() {return player['g'].unlocked},
            style: {'background-color': '#770000', 'min-height':'0px', 'height':'37px', 'width':'277px', 'border-radius':'177px', 'border': '3px solid', 'border-color': 'rgba(0, 0, 0, 0.125)'},
        },
        13: {
            title: "[PLAY SOUND]",
            canClick() { 
                return true
            },
            onClick() { 
                playSound("KillReset")
                if (randNum(1,100) == 7) player.SecretAch3 = true
            },
            unlocked() {return player['k'].unlocked},
            style: {'background-color': '#DCD200', 'min-height':'0px', 'height':'37px', 'width':'277px', 'border-radius':'177px', 'border': '3px solid', 'border-color': 'rgba(0, 0, 0, 0.125)'},
        },
        14: {
            title: "[PLAY SOUND]",
            canClick() { 
                return true
            },
            onClick() { 
                playSound("ChaChing")
            },
            unlocked() {return player['farm'].unlocked},
            style: {'background-color': '#9ae649', 'min-height':'0px', 'height':'37px', 'width':'277px', 'border-radius':'177px', 'border': '3px solid', 'border-color': 'rgba(0, 0, 0, 0.125)'},
        },
    },
    tabFormat: [
        ["microtabs", "index"],
        "blank",
    ],
    microtabs: {
        index: {
            "Main Layers": {
                content: [
                    "blank", 
                    ["infobox", 1], 
                    ["clickable", 11],
                    "blank", 
                    ["infobox", 2], 
                    ["clickable", 12],
                    "blank", 
                    ["infobox", 3], 
                    ["clickable", 13],
                    "blank", 
                    ["infobox", 4],
                    ["clickable", 14],
                    "blank", 
                    "blank", 
                    "blank", 
                ]
            },

            "Sublayers": {
                content: [
                    "blank", 
                    ["infobox", "Ach"],
                    "blank", 
                    ["infobox", "Dark"],
                    "blank",
                    "blank",
                ],
            },

            "Mechanics/Terminology": {
                content: [
                    "blank", 
                    ["infobox", "Mechanic1"],
                    "blank", 
                    ["infobox", "Mechanic2"],
                    "blank",
                    ["infobox", "Mechanic3"],
                    "blank",
                    ["infobox", "Mechanic4"],
                    "blank",
                    ["infobox", "Mechanic5"],
                    "blank",
                    ["infobox", "Mechanic6"],
                    "blank",
                    ["infobox", "Mechanic7"],
                    "blank",
                    ["infobox", "Mechanic8"],
                    "blank",
                    ["infobox", "Mechanic9"],
                    "blank",
                    ["infobox", "Mechanic10"],
                    "blank",
                    ["infobox", "Mechanic11"],
                    "blank",
                    "blank",
                    "blank",
                    "blank",
                ],
            },

            "Credits": {
                content: [
                    "blank", 
                    ["display-text",
                    function() {
                        var Credits =  `
                        <h2>Creator</h2><br>
                        CudjzikxmxR - Owner of <rainbow>The Void of Rainbows</rainbow> and the creator of this game!<br><br>

                        <h2>Direct Contributors</h2><br>
                        Chris - Originally the sole playtester for this bombshell of a game, but he was TAKING TOO LONG.<br>
                        Pac - Another playtester for the game. Managed to surpass Chris despite starting playtesting like 3 days later.<br><br>

                        <h2>People Whose Work I Used In Some Way</h2><br>
                        Toby Fox - Creator of Deltarune which I used a fuckload of music from<br>
                        pilotredsun - Composer of "Fat Cat" aka the Stability Test lobby theme.<br>
                        Popcap - Several PvZ1 sounds are used in this game.
                        `
                        if (player.SecretAch2) {
                            Credits += "<br>Moikey - SKIBIDILOVANIA"
                        }
                        Credits +=  `<br><br>
                        
                        <h2>The Extra EXTRA Credits</h2><br>
                        SorbetShark - Creator of SConvolution/TFS Tree, which inspired me to make this game.<br>
                        TVoR - The group of people this game is literally for. Stupid IDIOTS . .<br>
                        Lizared - The chris kity meow meow<br>
                        LostCat - For making the greatest song of all time that shows up in one of the tips 🥹🥹 also hi whoever is reading this go play RGV`
                        return Credits
                    }],
                ],
            },
        }
    },
    infoboxes: {
        1: {
            title: "Amoebas [Layer 1]",
            body() {return "The very first layer in the game. Simply reset your Rainbows to earn Amoebas, then spend those Amoebas on upgrades. 'Symbols' are introduced here, and are a foundation for the rest of the game.<br>You have a long journey ahead of you.<br><br>Based off of CudjzikxmxR, the creator of this mod! Hi!"},
            titleStyle() {return {"background-color": tmp['p'].color}},
            bodyStyle() {return {"border-color":tmp['p'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['p'].color}},
        },
        2: {
            title: "Cherries [Layer 2a]",
            body() {return "One of the two halves of the second layer in the game. Do you like RNG? Have a chronic addiction to gambling? Feel like a femboy? Well look no further! This layer throws a bunch of RNG into the mix, making things a lot less straightforward. Progression could be quick or incredibly slow, entirely depending on just how lucky (or unlucky) you get. Gamble away your Rainbows for a random amount of Cherries to spend on all kinds of upgrades. Land coinflips to earn more Cherries, and even make a <i>new friend</i>...<br><br>Based off of Chris The Cherry!<br><img src='resources/chriskitymeowmeow.png' alt='Image failed to load.' width='40px' height='40px'>"},
            titleStyle() {return {"background-color": tmp['g'].color}},
            bodyStyle() {return {"border-color":tmp['g'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['g'].color}},
            unlocked() {return player['g'].unlocked}
        },
        3: {
            title: "Knives [Layer 2b]",
            body() {return "One of the two halves of the second layer in the game. You crave BLOODSHED, which is why you should use your rainbows for DESTRUCTION and VIOLENCE. By Killing countless innocent people, you earn Knives. Keep on Killing and earning Knives to reach \"Killstreak Milestones\", which grant very important boosts for progression. Knives can also be spent on upgrades, but be careful! Buying any upgrades with Knives sets you all the way back down to 0, so think about whether or not to gun for that next milestone before you buy one.<br><br>Based off of pacmanlol20! He's rapidly approaching your current location."},
            titleStyle() {return {"background-color": tmp['k'].color}},
            bodyStyle() {return {"border-color":tmp['k'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['k'].color}},
            unlocked() {return player['k'].unlocked}
        },
        4: {
            title: "The Anomaly Farm [Layer 3]",
            body() {
                return "Tired yet? Hopefully not, we're just getting started! After gambling away your life's savings and committing large-scale mass murder, obviously the most logical thing to do is to settle down and start farming. Duh. Unlike other main layers up to this point, there's nothing to \"reset\" and nothing that Rainbows are spent on. Instead, you can plant and harvest crops to earn Money. Money can be spent on upgrades along with seeds of more valuable crops, but it also boosts your Click Power depending on how much you have. Money won't let you buy everything though, because some upgrades will actually cost crops to purchase! You aren't just able to buy seeds simply after reaching their price in Money though, that'd be too easy! Seeds can only be purchased if you meet their Click Power requirement. You aren't always going to be planting your most valuable crop either, since certain upgrades and achievements mandate that you go back and farm more of those low-income crops way after you first get them. If you want to be as efficient and quick as possible, its in your best interest to MULTITASK. You need to balance farming with clicking symbols, managing Axe Cat, dealing with yes_man, etc. Have fun!<br><br>Based off some elite ball knowledge that I'm NOT TEEELLLLIIING. GATEKEEPING TS TO MY GRAAAAVE ez ez"
            },
            titleStyle() {return {"background-color": tmp['farm'].color}},
            bodyStyle() {return {"border-color":tmp['farm'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['farm'].color}},
            unlocked() {return player['farm'].unlocked}
        },

        Ach: {
            title: "Achievements [Layer A]",
            body() {return "Shows the achievements you've gotten while playing. Each achievement doubles your Rainbows, and a few of them grant additional bonuses."},
            titleStyle() {return {"background-color": tmp['a'].color}},
            bodyStyle() {return {"border-color":tmp['a'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['a'].color}},
        },
        
        Dark: {
            title: "Darkness [Layer ∆]",
            body() {return "Darkness in its purest form. Tracks how many Dark Fragments you have. As you obtain more Dark Fragments, you'll get stronger, but at a cost... It's all in the name of the almighty Axe Cat."},
            titleStyle() {return {"background-color": tmp['darkness'].color}},
            bodyStyle() {return {"border-color":tmp['darkness'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['darkness'].color}},
            unlocked() {return player['darkness'].DarkFragments.gt(0)}
        },

        Mechanic1: {
            title: "Symbols",
            body() {return "After purchasing the <b>Activity Check</b> upgrade in the Amoeba layer, a very... familiar symbol will begin spawning all over the screen. Clicking them boosts your Rainbow gain. The term \"Click Power\" refers to how much multiplier <b>Activity Check</b> gains from each symbol clicked."},
            titleStyle() {return {"background-color": tmp['p'].color}},
            bodyStyle() {return {"border-color":tmp['p'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['p'].color}},
            unlocked() {return hasUpgrade('p', 16) || player['g'].unlocked || player['k'].unlocked}
        },

        Mechanic2: {
            title: "Sets",
            body() {return "Upgrades in this game are organized into \"sets\", formatted as [SET x]."},
            titleStyle() {return {"background-color": tmp['p'].color}},
            bodyStyle() {return {"border-color":tmp['p'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['p'].color}},
            unlocked() {return hasUpgrade('p', 16) || player['g'].unlocked || player['k'].unlocked}
        },

        Mechanic3: {
            title: "Coinflip",
            body() {return "Refers to the \"Flip A Coin\" buyable in the Cherry layer, which doubles your Cherry gain for every successful flip. It's good to do as many Coinflips as you can, especially right before Gambling for Cherries."},
            titleStyle() {return {"background-color": tmp['g'].color}},
            bodyStyle() {return {"border-color":tmp['g'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['g'].color}},
            unlocked() {return player['g'].unlocked}
        },

        Mechanic4: {
            title: "Critical Clicks",
            body() {return "After purchasing the <b>Let's Go Gambling</b> upgrade in the Cherry layer, symbols can crit when clicked, which grants more <b>Activity Check</b> multiplier and earns you Amoebas. Critical Power is essentially Click Power but it only applies to critical clicks, and it also multiplies Amoebas earned from critical clicks. An important difference between the two is that Click Power affects how quickly <b>Activity Check</b> drains, while Critical Power does not."},
            titleStyle() {return {"background-color": tmp['g'].color}},
            bodyStyle() {return {"border-color":tmp['g'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['g'].color}},
            unlocked() {return hasUpgrade('g', 15)}
        },

        Mechanic5: {
            title: "Axe Cat",
            body() {return "After purchasing the <b>Surprise Guest Appearance</b> upgrade in the Cherry layer, a particularly circular feline friend comes to visit you! Axe Cat boosts your Rainbows and Cherries and will affect more things as you progress. Though, it'll only help if you stop what you're doing to feed it Catfood. Don't underestimate this adorable little thing, because it holds a horrific degree of power and is crucial for progression..."},
            titleStyle() {return {"background-color": tmp['g'].color}},
            bodyStyle() {return {"border-color":tmp['g'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['g'].color}},
            unlocked() {return hasUpgrade('g', 23)}
        },

        Mechanic6: {
            title: "Killstreak",
            body() {return "A bit of a special name for the names of milestones in the Knife layer. They're a kill<i>STREAK</i> because the inherent nature of the layer makes your Knives get reset for buying upgrades with them."},
            titleStyle() {return {"background-color": tmp['k'].color}},
            bodyStyle() {return {"border-color":tmp['k'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['k'].color}},
            unlocked() {return player['k'].unlocked}
        },

        Mechanic7: {
            title: "Persisting Content",
            body() {return "Upgrades and milestones marked with 2 lines indicate that they grant some kind of bonus that persists even while the layer its a part of is inactive."},
            bodyStyle() {return {"text-align":"left", "padding-left":"7px"}},
            unlocked() {return hasUpgrade('g', 15) || hasMilestone('k', 12)}
        },

        Mechanic8: {
            title: "yes_man",
            body() {return "It's HIM. You know him. We all do. He can spawn in place of symbols, and running into him could be beneficial for you or extremely unhelpful depending on the circumstance. You want to run into him to scale your <b>Carpal Tunnel</b> multiplier and your Click Power, but if you're not looking to scale up his multiplier, he's going to be an awful pain in the ass to deal with. Keep in mind that every 100 Knives past 1,500 makes him scale more, it's good to start running into him again once you get a couple hundred more Knives. He is crucial for progression."},
            titleStyle() {return {"background-color": tmp['k'].color}},
            bodyStyle() {return {"border-color":tmp['k'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['k'].color}},
            unlocked() {return hasUpgrade('k', 22)}
        },

        Mechanic9: {
            title: "Farming",
            body() {return "Crops, Seeds, and Plots. The Anomaly Farm layer throws in several more factors into the equation, and it's important you know what things mean. Seeds are bought with Money when you can afford them and have enough Click Power, Plots are the spots inside of a grid you can plant seeds in, and Crops are what you harvest and collect when Seeds finish growing. Note that Money multiplier and Crop multiplier are NOT the same thing."},
            titleStyle() {return {"background-color": tmp['farm'].color}},
            bodyStyle() {return {"border-color":tmp['farm'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['farm'].color}},
            unlocked() {return player['farm'].unlocked}
        },

        Mechanic10: {
            title: "Precision Mode",
            body() {return "Once you hit the 12,000 Killstreak milestone, you can now toggle Precision Mode! Precision Mode makes critical clicks a hell of a lot stronger, but it also makes them actually rare again. It's a good idea to enable it to get a stronger Axe Cat and earn some more Amoebas and Cherries before doing a Kill reset."},
            titleStyle() {return {"background-color": tmp['k'].color}},
            bodyStyle() {return {"border-color":tmp['k'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['k'].color}},
            unlocked() {return hasMilestone('k', 28)}
        },

        Mechanic11: {
            title: "The Equation",
            body() {return "Did you get used to managing everything so far? It's only going to get more and more complicated from here. Now that you've purchased the <b>E.X.I.T.</b> Amoeba upgrade, a random algebraic expression will be displayed on your screen, and it will occasionally change, along with changing everytime you repurchase the upgrade. Use the input box in the Amoeba layer to input an answer for what x equals and make sure you keep up! When the equation changes, immediately calculate the new value of x. Happy multitasking!<br>Note: If the answer is undefined, it'll be considered 0 AFTER you refresh the page. If you don't refresh, no input will be considered correct."},
            titleStyle() {return {"background-color": tmp['p'].color}},
            bodyStyle() {return {"border-color":tmp['p'].color, "text-align":"left", "padding-left":"7px"}},
            style() {return {"border-color":tmp['p'].color}},
            unlocked() {return hasUpgrade('p', 37) || player.CurrentEquation != ""}
        },
    },
    componentStyles: {
        "microtabs"() {return {"border-color":"transparent"}}
    }
})