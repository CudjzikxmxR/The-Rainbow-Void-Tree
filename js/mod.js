let modInfo = {
	name: "The Rainbow Void Tree",
	author: "CudjzikxmxR",
	pointsName: "rainbows",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "v0.0",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Added things.<br>
		- Added stuff.`

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

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
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
		gain = gain.times(1.77)
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
		gain = gain.times(1e7)

	//Chris Layer Upgrades
	if (hasUpgrade('g', 11))
		gain = gain.times(0.2)
	if (hasUpgrade('g', 12))
		gain = gain.times(upgradeEffect('g', 12))
	if (hasUpgrade('g', 14))
		gain = gain.times(upgradeEffect('g', 14))
	if (hasUpgrade('g', 16))
		gain = gain.times(upgradeEffect('g', 16))
	if (hasUpgrade('g', 18))
		gain = gain.times(upgradeEffect('g', 18))
	if (hasUpgrade('g', 21))
		gain = gain.times(52)

	//Pac Layer Content
	if (hasMilestone('k', 11))
		gain = gain.times(3)
	if (hasUpgrade('k', 13))
		gain = gain.times(0.01)
	if (hasMilestone('k', 16))
		gain = gain.times(Math.pow((2.5+Math.max(0, (player['k'].milestones.length-7))*15/100), player['k'].milestones.length))
	if (hasUpgrade('k', 16))
		gain = gain.times(upgradeEffect('k', 16))
	if (hasUpgrade('k', 23))
		gain = gain.times(1e9)

	//Achievements
	var achieveBase = 2
	if (hasMilestone('p', 28))
		achieveBase += 1
	gain = gain.times((new Decimal(achieveBase)).pow(player['a'].achievements.length))

	//Other
	gain = gain.times(player.AxeCatMult)

	//Exponents
	if (hasUpgrade('g', 23))
		gain = gain.pow(1.1)
	if (hasAchievement('a', 13))
		gain = gain.pow(1.07)
	if (hasUpgrade('p', 26))
		gain = gain.pow(1.1)
	if (hasMilestone('k', 20))
		gain = gain.pow(1.15)
	if (hasUpgrade('[', 31))
		gain = gain.pow(1+Math.log2(player.AxeCatMult)/100)

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
	"Upgrades in the 'This Is Overpowered' series are usually the last upgrade you purchase before you can access a new main layer.",
	"Make sure to tie the poll.",
	"<h2><font color='#ff0000'>Beware the wrath of yes_man.</font></h2>",
	"Fun Fact: This game's inital release delayed Stability Test 1.7 by a week.",
	"vwow ., wh[at] a [b. >STUPID<///b> ga.me, ppl4y St7b7l7t7 T7st_ insT-instea. :p",
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

	//Update
	"This game currently has 3 total main layers.",
	"There are currently 25 tips in the game!",
	"At this current moment of you playing this game, Stability Test 1.7 is not released.",
]
let tipTick = 0
let randomTipIndex = Math.floor(Math.random() * tipMessages.length)

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	minimumClickMult: 0,
	cherryUpgrade14: 1,
	CoinflipMult: 1,
	AxeCatMult: 1,
	SymbolQOL: 0,
	LayerTwoChoice: null,
}}

// Display extra things at the top of the page
var displayThings = [
	function() {return "<div class='ghost'>aaa</div>"},
	function() {return tipMessages[randomTipIndex]},
]
function prepareTipRand() {
	tipTick+=1
	if (tipTick%120==0) {
		tipTick = 0
		randomTipIndex = Math.floor(Math.random() * tipMessages.length)
	}
}

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("eee6"))
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
	let baseClickPower = new Decimal(0.5)
	if (hasUpgrade('p', 18))
		baseClickPower = baseClickPower.times(4)
	if (hasUpgrade('p', 21))
		baseClickPower = baseClickPower.times(100000)
	if (hasUpgrade('g', 13))
		baseClickPower = baseClickPower.times(2)
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
	if (hasMilestone('k', 24))
		baseClickPower = baseClickPower.times(upgradeEffect('p', 16).pow(0.4))
	if (hasUpgrade('p', 31))
		baseClickPower = baseClickPower.times(5.55e55)

	return baseClickPower
}

function resetClickMult() {
	if (player['p'].clickingMult) {
		if (hasUpgrade('p', 19)) {
			player['p'].clickingMult = new Decimal(player.minimumClickMult * 3)
		} else {
			player['p'].clickingMult = new Decimal(1)
		}
	}
}

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if You have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}