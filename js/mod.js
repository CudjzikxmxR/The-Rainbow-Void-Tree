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
	name: "The Farm Update",
}

let changelog = `<h1>Changelog:</h1><br><br>
	<h3>v0.2 - The Farm Update</h3><br>
		- New layer: The Anomaly Farm.<br>
		- New sublayer: Darkness.<br>
		- Rebalanced majority of the game.<br>
		- Adjusted UI.<br>
		- Polished the game up.<br>
		- Added SOUND!!! What???<br>
		- Fixed several bugs.<br><br>
	<h3>v0.1 - Update 1</h3><br>
		- Added things.<br>
		- Added stuff.
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
		gain = gain.times(1000)

	//Achievements
	var achieveBase = 2
	if (hasMilestone('p', 28))
		achieveBase += 1
	
	gain = gain.times((new Decimal(achieveBase)).pow(player['a'].achievements.length))
	if (hasAchievement('a', 1002))
		gain = gain.pow(0.99)

	//DARKNESS
	if (hasMilestone('darkness', 11))
		gain = gain.times(5e7)

	//Other
	gain = gain.times(player['g'].AxeCatMult)

	//Exponents
	if (hasAchievement('a', 13))
		gain = gain.pow(1.01)
	if (hasUpgrade('p', 26))
		gain = gain.pow(1.05)
	if (hasMilestone('k', 20))
		gain = gain.pow(1.05)
	if (hasUpgrade('p', 36))
		gain = gain.pow(1.07)
	if (hasUpgrade('k', 19))
		gain = gain.pow(1.1)
	if (hasUpgrade('p', 32))
		gain = gain.pow(1.01)

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
	"The first of the 'This Is Overpowered' upgrades used to work differently, but it crashed the game a lot so it was changed.",
	"Upgrades in the 'This Is Overpowered' series are usually the last upgrade in a set, and signify that you're close to a new feature.",
	"Make sure to tie the poll.",
	"<h2><font color='#ff0000'>Beware the wrath of yes_man.</font></h2>",
	"Fun Fact: This game's inital release delayed Stability Test 1.7 by a week.",
	"vwow ., wh[at] a [b. >STUPID<///b> ga.me, ppl4y St7b7l7t7 T7st_ insT-instea. :p",
	"This has truly been our Void of Rainbows.",
	"㊗️",
	"🤓",
	"Make sure to be clicking those symbols!",
	"You'll have to revisit earlier layers a lot throughout the game.",
	'in the stripped club. straight up "jorkin it". and by "it", haha, well. '+"let's justr say. My peanits",
	"Meow",
	"The gayest upgrade tree to ever exist.",
	"Layers with direct relation to the Knife layer will tend to be static requirements. Layers with direct relation to the Cherry layer will tend to involve RNG in some way.",
	"What the- What the fuck is Televex doing here??",
	"Balala > Balatro",
	"Whenever there's a choice between multiple layers, you will be forced to play through all of the layers individually without access to the content of the other layers, excluding certain QoL features.",
	"If it isn't clear, "+'"click power" refers to how much multiplier you gain from clicking symbols.',
	"Huh? What's wrong with the word Festival???",
	"R.I.P. TFS tree.",
	"🍞",
	"It's probably in your best bet to double-click the symbols. The onClick function is an asshole.",
	"more gay = more rainbow",
	"The coin desires to be flipped.",
	"Wait, hang on, this mod adds new themes?",
	"I'm preeeeetty sure the achievements shouldn't be invisible.",
	`<a class="link" href="https://www.youtube.com/watch?v=QdnhDj40gMo" target="_blank">You haven't truly heard "music" until you hear THIS.</a>`,
	"https://www.roblox.com/games/10745195956/",
	"Be cautious, <font color='#ff0000'>MALWARE</font> 'upgrades' are lurking.",
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
	"<font color='#5050a2'>DR Fan: I think I am a Boy.</font>",
	"I do not believe in people who use mm/dd/yyyy.",

	//Update
	"This game currently has 3 total main layers.",
	"There are currently 61 tips in the game!",
	"At this current moment of you playing this game, Stability Test 1.7 is still not released.",
]
let tipTick = 0
let randomTipIndex = Math.floor(Math.random() * tipMessages.length)

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	minimumClickMult: 0,
	//AxeCatMult: 1,
	LayerTwoChoice: null,
	AntivirusLevel: 0,
	NonClickTime: decimalZero,
	MustCrit: false,
	SecretAch1: false,
	SecretAch2: false,
	SecretAch3: false,
}}

// Display extra things at the top of the page
var displayThings = [
	function() {return "<div class='ghost'>aaa</div>"},
	function() {
		if (player['darkness'].DarkFragments.gt(0)) 
			return "You have <font color='#e70ce7'><h2>" + formatWhole(player['darkness'].DarkFragments) + "</h2></font> dark fragments...<br>"+"<div class='ghost'>aaa</div>"
		return ""
	},
	function() {
		if (hasUpgrade('p', 16) || player['g'].unlocked || player['k'].unlocked) 
			return "You have clicked <h3>" + player.minimumClickMult + "</h3> symbols.<br>"+"<div class='ghost'>aaa</div>"
		return ""
	},
	function() {return tipMessages[randomTipIndex]},
]
function prepareTipRand() {
	tipTick+=1
	if (tipTick%170==0) {
		tipTick = 0
		randomTipIndex = Math.floor(Math.random() * tipMessages.length)
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
	let baseClickPower = decimalOne
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
		baseClickPower = baseClickPower.times(player.points.add(1).max(0).log(1.01))
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

	//EXPONENTS

	if (hasUpgrade('p', 35))
		baseClickPower = baseClickPower.pow(1.04)

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
	[new Decimal(1000), 30, new Decimal("e300"), "#f898a6"], // watermelon
	[new Decimal(30000), 600, new Decimal("e700"), "#ff0000"], // catfruit
	[new Decimal(2000), 38, new Decimal("e1000"), "#ff8800"], // pumpkin
	[new Decimal(1500), 8, new Decimal("e1200"), "#ac349a"], // yoyleberries
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