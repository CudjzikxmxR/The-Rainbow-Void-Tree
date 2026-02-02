let modInfo = {
	name: "The Rainbow Void Tree",
	author: "nobody",
	//id: "idk777",
	pointsName: "rainbows",
	modFiles: ["layers.js", "guide.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(5), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "The Farming Update",
}

let changelog = `<h1>Changelog:</h1><br><br>
	<h3><rainbow>v0.2 - The Farming Update</rainbow></h3><br>
		- New layer: The Anomaly Farm.<br>
		- New sublayer: Darkness.<br>
		- Several new mechanics.<br>
		- Heavily rebalanced majority of the game.<br>
		- Polished the game up.<br>
		- Adjusted UI.<br>
		- Added SOUND!!! What???<br>
		- Fixed several bugs.<br><br>
		<b>[Endgame: 1e150,000 rainbows]</b><br><br><br>
	<h3><rainbow>v0.1 - Release</rainbow></h3><br>
		- Added things.<br>
		- Added stuff.<br><br>
		<b>[Endgame: I have no idea I don't remember]</b>
		`

	

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

function getPointGen() {
	if(!canGenPoints())
		return decimalZero

	let gain = decimalOne
	//Cud Layer Upgrades
	if (hasUpgrade('p', 11))
		gain = gain.times(2)
	if (hasUpgrade('p', 12))
		gain = gain.times(upgradeEffect('p', 12))
	if (hasUpgrade('p', 13))
		gain = gain.times(upgradeEffect('p', 13))
	if (hasUpgrade('p', 14))
		gain = gain.times(upgradeEffect('p', 14))
	if (hasUpgrade('p', 15))
		gain = gain.times(1.477)
	if (hasUpgrade('p', 16))
		gain = gain.times(upgradeEffect('p', 16))
	if (hasUpgrade('p', 18))
		gain = gain.times(2.5)
	//Cud Layer Extension (from Pac Layer)
	if (hasUpgrade('p', 22))
		gain = gain.times(10)
	if (hasUpgrade('p', 23))
		gain = gain.times(upgradeEffect('p', 23))
	if (hasUpgrade('p', 29))
		gain = gain.times(7.77e17)
	//Cud Set 4
	if (hasUpgrade('p', 31)) 
        gain = gain.times(upgradeEffect('p', 31))
	if (hasUpgrade('p', 33)) 
        gain = gain.times(player['g'].CoinflipMult)
	if (hasUpgrade('p', 36)) 
        gain = gain.times(upgradeEffect('p', 36))


	//Chris Layer Upgrades
	if (hasUpgrade('g', 11))
		gain = gain.times(0.25)
	if (hasUpgrade('g', 12))
		gain = gain.times(upgradeEffect('g', 12))
	if (hasUpgrade('g', 14))
		gain = gain.times(upgradeEffect('g', 14))
	if (hasUpgrade('g', 16))
		gain = gain.times(upgradeEffect('g', 16))
	if (hasUpgrade('g', 21))
		gain = gain.times(52)

	//Pac Layer Content
	if (hasMilestone('k', 11))
		gain = gain.times(3)
	if (hasMilestone('k', 13)) 
		gain = gain.times(4)
	if (hasUpgrade('k', 13))
		gain = gain.times(0.0001)
	if (hasMilestone('k', 16))
		//gain = gain.times(Math.pow((2.5+Math.max(0, (player['k'].milestones.length-7))*15/100), player['k'].milestones.length))
		var kScale = decimalZero
		var scalingScale = 15
		if (hasMilestone('k', 29)) {
			scalingScale = 70
		}
		if (hasMilestone('k', 18)) {
			kScale = new Decimal((player['k'].milestones.length-7)*scalingScale/100)
		}
		gain = gain.times((new Decimal(2.5)).add(kScale).pow(player['k'].milestones.length))
	if (hasMilestone('k', 17))
		gain = gain.times(0.01)
	if (hasUpgrade('k', 16))
		gain = gain.times(upgradeEffect('k', 16))
	if (hasUpgrade('k', 23))
		gain = gain.times(1e7)
	if (hasMilestone('k', 29))
		gain = gain.times(1000000)

	//Achievements
	var achieveBase = 2
	if (hasMilestone('p', 28))
		achieveBase += 1
	
	gain = gain.times((new Decimal(achieveBase)).pow(player['a'].achievements.length))
	if (hasAchievement('a', 1002))
		gain = gain.pow(0.99)

	//DARKNESS
	if (hasMilestone('darkness', 11))
		gain = gain.times(5e10)

	//Other
	gain = gain.times(player['g'].AxeCatMult)

	//Exponents
	if (hasAchievement('a', 13))
		gain = gain.pow(1.01)
	if (hasUpgrade('p', 26))
		gain = gain.pow(1.05)
	if (hasMilestone('k', 20))
		gain = gain.pow(1.05)
	if (hasUpgrade('k', 19))
		gain = gain.pow(1.1)
	if (hasUpgrade('p', 32))
		gain = gain.pow(1.01)
	if (hasUpgrade('p', 37) && CalculateEquationCorrectness())
		gain = gain.pow(clickableEffect('p', 11))

	return gain
}

//"Tip" messages that appear at the top of the screen
let tipMessages = [
	"Placeholder Tip",
	"What kind of woke liberal created this game...",
	"Hope you enjoy manual labor, this game won't be very kind with automation past earlygame.",
	'Majority of these "tips" are far from actually helpful.',
	"Whaaaaaat, nooooo! These tip popups weren't inspired by any kind of cookie related clicking game!...",
	"Fortnite balls, all in yo face. Aye!",
	"If you're close to completing an achievement, go for it before doing any kind of significant reset.",
	"Did you know: There are <b><font color='#ff0000'>NOT</font></b> 1806881 tips you can encounter!",
	"Make sure to tie the poll.",
	"Whenever you refresh the page, the Music setting will turn itself Off. If you wanna have music on, remember to turn it back on everytime.",
	"<h2><font color='#ff0000'>Beware the wrath of yes_man.</font></h2>",
	"Fun Fact: This game's inital release delayed Stability Test 1.7 by a week.",
	"vwow ., wh[at] a [b. >STUPID<///b> ga.me, ppl4y St7b7l7t7 T7st_ insT-instea. :p",
	"This has truly been our Void of Rainbows.",
	"<font color='#ff0000'>Jajajaja. You Have Not Win.</font>",
	"㊗️",
	"🤓",
	"Meow",
	"The gayest upgrade tree to ever exist.",
	"<rainbow>RRRRAAAAAAAIIIINBOOOOW</rainbow>",
	"Layers with direct relation to the Knife layer will tend to be static requirements. Layers with direct relation to the Cherry layer will tend to involve RNG in some way.",
	"What the- What the fuck is Televex doing here??",
	"Balala > Balatro",
	"Whenever there's a choice between multiple layers, you will be forced to play through all of the layers individually without access to the content of the other layers, excluding certain QoL features.",
	"Huh? What's wrong with the word Festival???",
	"R.I.P. TFS tree.",
	"🍞",
	"more gay = more rainbow",
	`<a class="link" href="https://www.youtube.com/watch?v=QdnhDj40gMo" target="_blank">You haven't truly heard "music" until you hear THIS.</a>`,
	"https://www.roblox.com/games/10745195956/",
	//"Be cautious, <font color='#ff0000'>MALWARE</font> 'upgrades' are lurking.",
	"Play Randomly Generated Voronezh.",
	"Do you think these tips go by too quickly?",
	"It all spirals into chaos.",
	"get on your rod you gotta fish",
	"i seem to have replicated the uhhhhh big bang in my own pants",
	"nith can you say butt?",
	"how long are you BLUE",
	"theres 2 teams of 4",
	"Hey Cud can you add an nMarkov layer to the game pls plz",
	"Gooning my gourd rn 🎃",
	"These inside jokes continue to age extremely badly.",
	"ANYTHING but working on ST, huh?",
	"Play Sorbet's Convulution it's cool: https://sorbettheshark.github.io/SConvolution-0.3.0/",
	"i am a hunter droid i am as fast as sonic, i zoom like an automobile",
	"... .--. .. -. / -- -.-- / .-- .... . . .-.. -.-.--",
	"im statix and I voice fear!!!!",
	"Slavery? Is this slavery? Where is the 13th amendment? What the fuck?",
	"I am not going to die. That would ruin my sex life!",
	"pee essay",
	"Play <font color='#0d69ac'>Division Among Clarity</font>.",
	"I, I love you like a love song baby!",
	"<b><font color='#5050a2'>DR Fan: I think I am a Boy.</font></b>",
	"I do not believe in people who use mm/dd/yyyy.",
	"The longer tips get hidden behind the Guide. Oops.",

	//Update
	"This game currently has 3 total main layers.",
	"At this current moment of you playing this game, Stability Test 1.7 is still not released.",
]
let allTips = []
let tipTick = 0
let randomTipIndex = Math.floor(Math.random() * tipMessages.length)

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	minimumClickMult: 0,
	criticalClicks: 0,
	//AxeCatMult: 1,
	LayerTwoChoice: null,
	AntivirusLevel: 0,
	NonClickTime: decimalZero,
	MustCrit: false,
	CurrentEquation: "",
	CorrectAnswer: [decimalZero],
	EquationInput: decimalZero,
	SecretAch1: false,
	SecretAch2: false,
	SecretAch3: false,
	SecretAch4: false,
}}

// Display extra things at the top of the page
var displayThings = [
	function() {return "<div class='ghost'>aaa</div>"},
	function() {
		if (player['darkness'].DarkFragments.gt(0)) 
			return "You have <h2><pinkDark>" + formatWhole(player['darkness'].DarkFragments) + "</pinkDark></h2> dark fragments...<br>"+"<div class='ghost'>aaa</div>"
		return ""
	},
	function() {
		if (hasUpgrade('p', 37)) 
			return "<h2>["+player.CurrentEquation+"]</h2><br><div class='ghost'>aaa</div>"
		return ""
	},
	function() {
		if (hasUpgrade('p', 16) || player['g'].unlocked || player['k'].unlocked)
			if (hasUpgrade('g', 15)) {
				return "You have clicked <h3>" + format(player.minimumClickMult) + "</h3> symbols.<br>You have <font color='#770000'>critically</font> clicked <h3>" + format(player.criticalClicks) + "</h3> symbols."+"<div class='ghost'>aaa</div>"
			} else {
				return "You have clicked <h3>" + format(player.minimumClickMult) + "</h3> symbols.<br>"+"<div class='ghost'>aaa</div>"
			}
		return ""
	},
	function() {return allTips[randomTipIndex]},
]
function prepareTipRand() {
	allTips = []
	for (i in tipMessages) {
		allTips.push(tipMessages[i])
	}
	if (hasUpgrade('p', 16) || player['g'].unlocked || player['k'].unlocked) {
		allTips.push(
			"Make sure to be clicking those symbols!",
			"You'll have to revisit earlier layers a lot throughout the game.",
			"CUDDDD DO NOT ABBREVIATE CLICK POWERRR",
			'in the stripped club. straight up "jorkin it". and by "it", haha, well. '+"let's justr say. My peanits",
			"The first of the 'This Is Overpowered' upgrades used to work differently, but it crashed the game a lot so it was changed.",
			"Upgrades in the 'This Is Overpowered' series are usually the last upgrade in a set, and signify that you're close to a new feature.",
			"It's probably in your best bet to double-click the symbols. The onClick function is an asshole.",
			"Ever feel lost and unable to progress? Check the Guide!<br>Remember that if there's any resource you can still be earning, you SHOULD be earning it.",
		)
	}
	if (player['g'].unlocked) {
		allTips.push(
			"The coin desires to be flipped.",
			"Let's go gambling!",
			"Wait, hang on, this mod adds new themes?",
		)
	}
	if (player['k'].unlocked) {
		allTips.push(
			"KILL. KILL. KILL.",
			"Woooaaahhhhhhhhh Story Of Undertale",
		)
	}
	if (hasUpgrade('g', 23)) {
		if (player['darkness'].DarkFragments.gt(0)) {
			var CatName = "Axe Cat"
			if (player['darkness'].DarkFragments.gt(1)) CatName = "<pinkDark>Axe Cat</pinkDark>"
			if (player['darkness'].DarkFragments.gt(2)) CatName = "<pinkDark>\"Axe Cat\"</pinkDark>"
			allTips.push(
				"Oh... "+CatName+"...?",
				CatName+" is so... cute...",
				CatName+"... could never do anything wrong...?",
				CatName+" is a bundle of.....",
				CatName+"... what are you?",
			)
		} else {
			allTips.push(
				"OMG!! AXE CAT!!!",
				"Axe Cat so CUTE!!!",
				"Axe Cat could never do anything wrong!",
				"Axe Cat is a bundle of joy!",
			)
			var Weapon = "an axe"
			if (hasUpgrade('k', 20) && !player['g'].AxeCosmetic) {
				Weapon = "a sword"
			} 
			allTips.push("Awwww! That little cat's got " + Weapon + "!")
		}
	}
	if (hasUpgrade('k', 22)) {
		allTips.push(
			"<h2><font color='#ff0000'>You were told to beware. Will you?</font></h2>",
			"<h2><font color='#ff0000'>You will fall to yes_man. It is inevitable.</font></h2>",
			"Have you or a loved one fallen to accidentally running into yes_man right before you performed a reset to earn more Cherries or Knives? You are not alone.<br>Call 1-800-777-GayPornography if you or a loved one has experienced unjust yes_manning.",
			"You can't blame yes_man for getting in your way. He's having a bad day okay?",
		)
	}
	if (player['farm'].unlocked) {
		allTips.push(
			"We've got to have money.",
			"CHA-CHING!",
			"anomaly farm some crazy elite ball knowledge yo",
			"Alright guys, let's go Farm this Anomaly.<br>King, you go left.<br>Angel, you go right.<br>Voidling, you know what to do.<br>[Totally Real Fourth Character],<br>You just be [Totally Real Fourth Character].<br>Let's Farm this Anomaly,<br>because together we are THE ANOMALY FARM.",
		)
	}
	if (hasUpgrade('p', 37) || player.CurrentEquation != "") {
		allTips.push(
			"Oh come on, you didn't seriously think Cud would code a game WITHOUT the inclusion of math?",
			"Methmetics",
			"WAH! WAH! WAH! I don't wanna fuckin' hear it!",
			"You should be trying to get every achievement! Some are very important for progression.",
		)
	}
	allTips.push("There are currently "+allTips.length+1+" tips you can encounter!",)
	tipTick+=1
	if (tipTick%177==0) {
		tipTick = 0
		randomTipIndex = Math.floor(Math.random() * allTips.length)
	}
}

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}

// Less important things beyond this point!

// Millisecond wait time
function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function randNum(min, max) {
	return Math.ceil(Math.random()*(max-min))+min
}

// Get rune click power
function getClickPower() {
	let baseClickPower = decimalOne.times(2)
	if (hasUpgrade('p', 18))
		baseClickPower = baseClickPower.times(4)
	if (hasUpgrade('p', 21))
		baseClickPower = baseClickPower.times(100)
	if (hasUpgrade('g', 13))
		baseClickPower = baseClickPower.times(2.5)
	if (hasUpgrade('g', 19))
		baseClickPower = baseClickPower.times(6)
	if (hasAchievement('a', 14))
		baseClickPower = baseClickPower.times(3)
	if (hasMilestone('k', 12))
		baseClickPower = baseClickPower.times(2)
	if (hasUpgrade('k', 13))
		baseClickPower = baseClickPower.times(6.66e6)
	if (hasUpgrade('k', 14))
		baseClickPower = baseClickPower.times(10)
	if (hasMilestone('k', 19))
		if (hasMilestone('k', 23)) {
			baseClickPower = baseClickPower.times(Math.pow(10, player['k'].milestones.length-9))
		} else {
			baseClickPower = baseClickPower.times(Math.pow(3, player['k'].milestones.length-9))
		}
	if (hasMilestone('k', 21))
		baseClickPower = baseClickPower.times(player.points.max(1).log(1.001).times(10).add(1))
	if (hasUpgrade('k', 16))
		baseClickPower = baseClickPower.times(3)

	if (hasUpgrade('p', 34))
		baseClickPower = baseClickPower.times(7777)

	if (hasMilestone('k', 25))
		baseClickPower = baseClickPower.times(baseClickPower.pow(0.1))
	
	baseClickPower = baseClickPower.times(player['k'].yes_power)

	if (player['farm'].unlocked) {
		baseClickPower = baseClickPower.times(player['farm'].points.add(1).max(1).pow(2))
	}

	if (hasUpgrade('g', 26))
		baseClickPower = baseClickPower.times(500)
	if (hasUpgrade('g', 27))
		baseClickPower = baseClickPower.times(1000)
	if (hasMilestone('k', 29))
		baseClickPower = baseClickPower.times(1000)
	if (hasAchievement('a', 43))
		baseClickPower = baseClickPower.times(1000)
	if (hasAchievement('a', 46))
		baseClickPower = baseClickPower.times(1000000)

	//EXPONENTS

	if (hasUpgrade('p', 35))
		baseClickPower = baseClickPower.pow(1.07)
	if (hasUpgrade('p', 41))
		baseClickPower = baseClickPower.pow(upgradeEffect('p', 41))

	return baseClickPower
}

function resetClickMult() {
	if (player['p'].clickingMult) {
		if (hasUpgrade('p', 19)) {
			player['p'].clickingMult = new Decimal(player.minimumClickMult * 3)
		} else {
			player['p'].clickingMult = decimalOne
		}
	}
}

function gainCropMult() {
    mult = decimalOne
	if (hasUpgrade('g', 29)) {
		mult = mult.times(upgradeEffect('g', 29))
	}
	if (hasUpgrade('p', 33)) {
		mult = mult.times(3)
	}
	if (hasUpgrade('p', 34)) {
		mult = mult.times(1.25)
	}
	if (hasMilestone('k', 29)) {
		mult = mult.times(1.2)
    }
	if (hasAchievement('a', 39)) {
		mult = mult.times(1.1)
    }
	if (hasMilestone('darkness', 12)) {
		mult = mult.times(1.25)
	}
	if (hasUpgrade('p', 38)) {
		mult = mult.times(upgradeEffect('p', 38))
	}
	return mult
}

//Get Axe Cat Cap
function getAxeCap() {
	var axeExp = 0.5
	if (hasUpgrade('k', 20)) {
	    axeExp = 0.7
    }
	return player['p'].clickingMult.pow(axeExp)
}

const CropValues = [
	//MoneyValue, GrowTime, ClickReq, Color
	[decimalOne, 20, decimalZero, "#ffff88"], // wheat
	[new Decimal(2), 15, new Decimal(1e30), "#ff2222"], // tomatoes
	[new Decimal(4), 20, new Decimal(1e36), "#ff932e"], // carrots
	[new Decimal(10), 25, new Decimal(1e40), "#e9e63d"], // corn
	[new Decimal(8), 10, new Decimal(1e50), "#c0992f"], // potatoes
	[new Decimal(40), 30, new Decimal(1e56), "#0c8019"], // cucumbers
	[new Decimal(36), 16, new Decimal(4e70), "#d969ae"], // beetroot
	[new Decimal(120), 33, new Decimal(1e80), "#58de7c"], // cabbage
	[new Decimal(150), 17, new Decimal("e100"), "#9b278c"], // eggplant
	[new Decimal(270), 20, new Decimal("e152"), "#b5ef8c"], // celery
	[new Decimal(400), 11, new Decimal("e178"), "#a2ffb6"], // sugarcane
	[new Decimal(3500), 45, new Decimal("e300"), "#f898a6"], // watermelon
	[new Decimal(50000), 600, new Decimal("e700"), "#ff0000"], // catfruit
	[new Decimal(7000), 56, new Decimal("e1000"), "#ff8800"], // pumpkin
	[new Decimal(10500), 8, new Decimal("e1200"), "#ac349a"], // yoyleberries
]

const CropOrder = [
	"Wheat",
	"Tomatoes",
	"Carrots",
	"Corn",
	"Potatoes",
	"Cucumbers",
	"Beetroots",
	"Cabbages",
	"Eggplants",
	"Celery",
	"Sugarcane",
	"Watermelons",
	"Catfruit",
	"Pumpkin",
]

function getCropValue(i) {
	return CropValues[i]
}

function getCropIndexFromName(Name) {
	for (i in CropOrder) {
		if (CropOrder[i] == Name) {
			return i
		}
	}
	return null
}

function NewEquation() {
	playSound("EquationChange")
	let RandomChoose = randNum(1,6)
	let Rand1 = randNum(1,10)
	let Rand2 = randNum(1,10)
	let Rand3 = randNum(1,10)
	let Rand4 = randNum(1,10)
	function GetPref(number) {
		if (number == 1) {
			return ""
		}
		return number
	}
	if (RandomChoose <= 2) { // Extremely basic linear equation
		if (Math.random()>=0.7) Rand1 *= (-1)
		if (Math.random()>=0.7) Rand2 *= (-1)
		if (Math.random()>=0.7) Rand3 *= (-1)
		if (Math.sign(Rand2) == -1) {
			player.CurrentEquation = GetPref(Rand1)+"x - "+Math.abs(Rand2)+" = "+Rand3
		} else {
			player.CurrentEquation = GetPref(Rand1)+"x + "+Rand2+" = "+Rand3
		}
		player.CorrectAnswer = [new Decimal((Rand3-Rand2)/Rand1)]
	} else if (RandomChoose == 3) { // Linear equation with variables on both sides
		if (Math.random()>=0.75) Rand1 *= (-1)
		if (Math.random()>=0.75) Rand2 *= (-1)
		if (Math.random()>=0.75) Rand3 *= (-1)
		if (Math.random()>=0.75) Rand4 *= (-1)

		if (Math.sign(Rand2) == -1) {
			if (Math.sign(Rand4) == -1) {
				player.CurrentEquation = GetPref(Rand1)+"x - "+Math.abs(Rand2)+" = "+GetPref(Rand3)+"x - "+Math.abs(Rand4)
			} else {
				player.CurrentEquation = GetPref(Rand1)+"x - "+Math.abs(Rand2)+" = "+GetPref(Rand3)+"x + "+Rand4
			}
		} else {
			if (Math.sign(Rand4) == -1) {
				player.CurrentEquation = GetPref(Rand1)+"x + "+Rand2+" = "+GetPref(Rand3)+"x - "+Math.abs(Rand4)
			} else {
				player.CurrentEquation = GetPref(Rand1)+"x + "+Rand2+" = "+GetPref(Rand3)+"x + "+Rand4
			}
		}
		player.CorrectAnswer = [new Decimal((Rand4-Rand2)/(Rand1-Rand3))]
	} else if (RandomChoose == 4) { // Annoyingly time wasting linear equation
		let Rand5 = randNum(1,5)
		let Rand6 = randNum(1,5)
		if (Math.random()>=0.75) Rand1 *= (-1)
		if (Math.random()>=0.75) Rand2 *= (-1)
		if (Math.random()>=0.75) Rand3 *= (-1)
		if (Math.random()>=0.75) Rand4 *= (-1)
		if (Math.random()>=0.75) Rand5 *= (-1)
		if (Math.random()>=0.75) Rand6 *= (-1)

		if (Math.sign(Rand2) == -1) {
			if (Math.sign(Rand4) == -1) {
				player.CurrentEquation = Rand5+"("+GetPref(Rand1)+"x - "+Math.abs(Rand2)+") = "+Rand6+"("+GetPref(Rand3)+"x - "+Math.abs(Rand4)+")"
			} else {
				player.CurrentEquation = Rand5+"("+GetPref(Rand1)+"x - "+Math.abs(Rand2)+") = "+Rand6+"("+GetPref(Rand3)+"x + "+Rand4+")"
			}
		} else {
			if (Math.sign(Rand4) == -1) {
				player.CurrentEquation = Rand5+"("+GetPref(Rand1)+"x + "+Rand2+") = "+Rand6+"("+GetPref(Rand3)+"x - "+Math.abs(Rand4)+")"
			} else {
				player.CurrentEquation = Rand5+"("+GetPref(Rand1)+"x + "+Rand2+") = "+Rand6+"("+GetPref(Rand3)+"x + "+Rand4+")"
			}
		}
		player.CorrectAnswer = [new Decimal((Rand4*Rand6-Rand2*Rand5)/(Rand1*Rand5-Rand3*Rand6))]
	} else if (RandomChoose == 5) { // Generic quadratic factor
		Rand3 = randNum(1,5)
		if (Math.random()>=0.6) Rand1 *= (-1)
		if (Math.random()>=0.6) Rand2 *= (-1)
		let pre1 = " + "
		let pre2 = " + "
		if ((Rand1+Rand2)*Rand3 < 0) pre1 = " - "
		if ((Rand1*Rand2)*Rand3 < 0) pre2 = " - "
		let sum = Math.abs((Rand1+Rand2)*Rand3)
		let product = Math.abs((Rand1*Rand2)*Rand3)
		if (sum != 0) {
			player.CurrentEquation = GetPref(Rand3) + "x²" + pre1+sum+"x" + pre2 + product + " = 0"
		} else {
			player.CurrentEquation = GetPref(Rand3) + "x²" + pre2 + product + " = 0"
		}
		player.CorrectAnswer = [(new Decimal(Rand1)).times(-1), (new Decimal(Rand2)).times(-1)]
	} else if (RandomChoose == 6) { // Square!!
		player.CurrentEquation = Rand1+"x² = "+(Rand1*Math.pow(Rand2, 2))
		player.CorrectAnswer = [new Decimal(Rand2), (new Decimal(Rand2)).times(-1)]
	}
}

function CalculateEquationCorrectness() {
	for (i in player.CorrectAnswer) {
		if (player.EquationInput.times(100).round().div(100).eq(new Decimal(player.CorrectAnswer[i]).times(100).round().div(100))) {
			return true
		}
	}
	return false
}

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

function playSound(name, soundFormat="mp3", vol=1) {
	if (options.soundOn) {
		var sound = new Audio("audio/"+name+"."+soundFormat)
		sound.currentTime = 0
		sound.volume = vol
		sound.play()
	}
}