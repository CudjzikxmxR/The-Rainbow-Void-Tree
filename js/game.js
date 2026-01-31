var player;
var needCanvasUpdate = true;

// Don't change this
const TMT_VERSION = {
	tmtNum: "2.7",
	tmtName: "Δ"
}

function getResetGain(layer, useType = null) {
	let type = useType
	if (!useType){ 
		type = tmp[layer].type
		if (layers[layer].getResetGain !== undefined)
			return layers[layer].getResetGain()
	} 
	if(tmp[layer].type == "none")
		return new Decimal (0)
	if (tmp[layer].gainExp.eq(0)) return decimalZero
	if (type=="static") {
		if ((!tmp[layer].canBuyMax) || tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalOne
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).div(tmp[layer].gainMult).max(1).log(tmp[layer].base).times(tmp[layer].gainExp).pow(Decimal.pow(tmp[layer].exponent, -1))
		gain = gain.times(tmp[layer].directMult)
		if (gain.gte(tmp[layer].softcap)&&player[layer].points.lt(tmp[layer].softcap)) {
			gain = tmp[layer].softcap
		}
		return gain.floor().sub(player[layer].points).add(1).max(1);
	} else if (type=="normal"){
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)
		if (gain.gte(tmp[layer].softcap)) gain = gain.pow(tmp[layer].softcapPower).times(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower)))
		gain = gain.times(tmp[layer].directMult)
		if (gain.gte(tmp[layer].softcap)&&player[layer].points.lt(tmp[layer].softcap)) {
			gain = tmp[layer].softcap
		}
		return gain.floor().max(0);
	} else if (type=="custom"){
		return layers[layer].getResetGain()
	} else {
		return decimalZero
	}
}

function getNextAt(layer, canMax=false, useType = null) {
	let type = useType
	if (!useType) {
		type = tmp[layer].type
		if (layers[layer].getNextAt !== undefined)
			return layers[layer].getNextAt(canMax)

		}
	if(tmp[layer].type == "none")
		return new Decimal (Infinity)

	if (tmp[layer].gainMult.lte(0)) return new Decimal(Infinity)
	if (tmp[layer].gainExp.lte(0)) return new Decimal(Infinity)

	if (type=="static") 
	{
		if (!tmp[layer].canBuyMax) canMax = false
		let amt = player[layer].points.plus((canMax&&tmp[layer].baseAmount.gte(tmp[layer].nextAt))?tmp[layer].resetGain:0).div(tmp[layer].directMult)
		let extraCost = Decimal.pow(tmp[layer].base, amt.pow(tmp[layer].exponent).div(tmp[layer].gainExp)).times(tmp[layer].gainMult)
		let cost = extraCost.times(tmp[layer].requires).max(tmp[layer].requires)
		if (tmp[layer].roundUpCost) cost = cost.ceil()
		return cost;
	} else if (type=="normal"){
		let next = tmp[layer].resetGain.add(1).div(tmp[layer].directMult)
		if (next.gte(tmp[layer].softcap)) next = next.div(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower))).pow(decimalOne.div(tmp[layer].softcapPower))
		next = next.root(tmp[layer].gainExp).div(tmp[layer].gainMult).root(tmp[layer].exponent).times(tmp[layer].requires).max(tmp[layer].requires)
		if (tmp[layer].roundUpCost) next = next.ceil()
		return next;
	} else if (type=="custom"){
		return layers[layer].getNextAt(canMax)
	} else {
		return decimalZero
	}}

function softcap(value, cap, power = 0.5) {
	if (value.lte(cap)) return value
	else
		return value.pow(power).times(cap.pow(decimalOne.sub(power)))
}

// Return true if the layer should be highlighted. By default checks for upgrades only.
function shouldNotify(layer){
	for (id in tmp[layer].upgrades){
		if (isPlainObject(layers[layer].upgrades[id])){
			if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
				return true
			}
		}
	}
	if (player[layer].activeChallenge && canCompleteChallenge(layer, player[layer].activeChallenge)) {
		return true
	}

	if (tmp[layer].shouldNotify)
		return true

	if (isPlainObject(tmp[layer].tabFormat)) {
		for (subtab in tmp[layer].tabFormat){
			if (subtabShouldNotify(layer, 'mainTabs', subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].tabFormat[subtab].glowColor || defaultGlow

				return true
			}
		}
	}

	for (family in tmp[layer].microtabs) {
		for (subtab in tmp[layer].microtabs[family]){
			if (subtabShouldNotify(layer, family, subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].microtabs[family][subtab].glowColor
				return true
			}
		}
	}
	 
	return false
	
}

function canReset(layer)
{	
	if (layers[layer].canReset!== undefined)
		return run(layers[layer].canReset, layers[layer])
	else if(tmp[layer].type == "normal")
		return tmp[layer].baseAmount.gte(tmp[layer].requires)
	else if(tmp[layer].type== "static")
		return tmp[layer].baseAmount.gte(tmp[layer].nextAt) 
	else 
		return false
}

function rowReset(row, layer) {
	for (lr in ROW_LAYERS[row]){
		if(layers[lr].doReset) {
			if (!isNaN(row)) Vue.set(player[lr], "activeChallenge", null) // Exit challenges on any row reset on an equal or higher row
			run(layers[lr].doReset, layers[lr], layer)
		}
		else
			if(tmp[layer].row > tmp[lr].row && !isNaN(row)) layerDataReset(lr)
	}
}

function layerDataReset(layer, keep = []) {
	let storedData = {unlocked: player[layer].unlocked, forceTooltip: player[layer].forceTooltip, noRespecConfirm: player[layer].noRespecConfirm, prevTab:player[layer].prevTab} // Always keep these

	for (thing in keep) {
		if (player[layer][keep[thing]] !== undefined)
			storedData[keep[thing]] = player[layer][keep[thing]]
	}

	Vue.set(player[layer], "buyables", getStartBuyables(layer))
	Vue.set(player[layer], "clickables", getStartClickables(layer))
	Vue.set(player[layer], "challenges", getStartChallenges(layer))
	Vue.set(player[layer], "grid", getStartGrid(layer))

	layOver(player[layer], getStartLayerData(layer))
	let newUpgrades = []
	let newMilestones = []
	let newAchievements = []
	for (id in tmp[layer].upgrades) {
		if (hasUpgrade(layer, id)) {
			if (layers[layer].upgrades[id].persisting == true) {
				newUpgrades.push(id)
			}
		}
	}
	for (id in tmp[layer].milestones) {
		if (hasUpgrade(layer, id)) {
			if (layers[layer].milestones[id].persisting == true) {
				newMilestones.push(id)
			}
		}
	}
	for (id in tmp[layer].achievements) {
		if (hasUpgrade(layer, id)) {
			if (layers[layer].achievements[id].persisting == true) {
				newAchievements.push(id)
			}
		}
	}
	player[layer].upgrades = newUpgrades
	player[layer].milestones = newMilestones
	player[layer].achievements = newAchievements

	for (thing in storedData) {
		player[layer][thing] =storedData[thing]
	}
}



function addPoints(layer, gain) {
	player[layer].points = player[layer].points.add(gain).max(0)
	if (player[layer].best) player[layer].best = player[layer].best.max(player[layer].points)
	if (player[layer].total) player[layer].total = player[layer].total.add(gain)
}

function generatePoints(layer, diff) {
	addPoints(layer, tmp[layer].resetGain.times(diff))
}

function doReset(layer, force=false) {
	if (tmp[layer].type == "none") return
	let row = tmp[layer].row
	if (!force) {
		
		if (tmp[layer].canReset === false) return;
		
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return;
		let gain = tmp[layer].resetGain
		if (tmp[layer].type=="static") {
			if (tmp[layer].baseAmount.lt(tmp[layer].nextAt)) return;
			gain =(tmp[layer].canBuyMax ? gain : 1)
		}

		if (layers[layer].onPrestige){
			updateMilestones(layer)
			run(layers[layer].onPrestige, layers[layer], gain)
		}
		
		addPoints(layer, gain)
		updateMilestones(layer)
		updateAchievements(layer)

		if (!player[layer].unlocked) {
			player[layer].unlocked = true;
			needCanvasUpdate = true;

			if (tmp[layer].increaseUnlockOrder){
				lrs = tmp[layer].increaseUnlockOrder
				for (lr in lrs)
					if (!player[lrs[lr]].unlocked) player[lrs[lr]].unlockOrder++
			}
		}
	
	}

	if (run(layers[layer].resetsNothing, layers[layer])) return
	tmp[layer].baseAmount = decimalZero // quick fix

	if (!hasMilestone('k', 26)) {
		resetClickMult()
	}

	for (layerResetting in layers) {
		if (row >= layers[layerResetting].row && (!force || layerResetting != layer)) completeChallenge(layerResetting)
	}

	player.points = (row == 0 ? decimalZero : getStartPoints())

	for (let x = row; x >= 0; x--) rowReset(x, layer)
	for (r in OTHER_LAYERS){
		rowReset(r, layer)
	}

	player[layer].resetTime = 0

	updateTemp()
	updateTemp()
}

function resetRow(row) {
	if (prompt('Are you sure you want to reset this row? It is highly recommended that you wait until the end of your current run before doing this! Type "I WANT TO RESET THIS" to confirm')!="I WANT TO RESET THIS") return
	let pre_layers = ROW_LAYERS[row-1]
	let layers = ROW_LAYERS[row]
	let post_layers = ROW_LAYERS[row+1]
	rowReset(row+1, post_layers[0])
	doReset(pre_layers[0], true)
	for (let layer in layers) {
		player[layer].unlocked = false
		if (player[layer].unlockOrder) player[layer].unlockOrder = 0
	}
	player.points = getStartPoints()
	updateTemp();
	resizeCanvas();
}

function startChallenge(layer, x) {
	let enter = false
	if (!player[layer].unlocked || !tmp[layer].challenges[x].unlocked || !canEnterChallenge(layer, x)) return

	if (player[layer].activeChallenge == x) {
		// This needs to be embedded due to how 'enter' works
		if(canExitChallenge(layer, x)){
			completeChallenge(layer, x)
			Vue.set(player[layer], "activeChallenge", null)
		}
	}
	else {
		enter = true
	}
	if(enter || canExitChallenge(layer, x)) doReset(layer, true)
	if(enter) {
		Vue.set(player[layer], "activeChallenge", x)
		run(layers[layer].challenges[x].onEnter, layers[layer].challenges[x])
	}
	updateChallengeTemp(layer)
}

function canCompleteChallenge(layer, x)
{
	if (x != player[layer].activeChallenge) return
	let challenge = tmp[layer].challenges[x]
	if (challenge.canComplete !== undefined) return challenge.canComplete

	if (challenge.currencyInternalName){
		let name = challenge.currencyInternalName
		if (challenge.currencyLocation){
			return !(challenge.currencyLocation[name].lt(challenge.goal)) 
		}
		else if (challenge.currencyLayer){
			let lr = challenge.currencyLayer
			return !(player[lr][name].lt(challenge.goal)) 
		}
		else {
			return !(player[name].lt(challenge.goal))
		}
	}
	else {
		return !(player.points.lt(challenge.goal))
	}

}

function completeChallenge(layer, x) {
	var x = player[layer].activeChallenge
	if (!x) return
	
	let completions = canCompleteChallenge(layer, x)
	if (!completions){
		Vue.set(player[layer], "activeChallenge", null)
		run(layers[layer].challenges[x].onExit, layers[layer].challenges[x])
		return
	}
	if (player[layer].challenges[x] < tmp[layer].challenges[x].completionLimit) {
		needCanvasUpdate = true
		player[layer].challenges[x] += completions
		player[layer].challenges[x] = Math.min(player[layer].challenges[x], tmp[layer].challenges[x].completionLimit)
		if (layers[layer].challenges[x].onComplete) run(layers[layer].challenges[x].onComplete, layers[layer].challenges[x])
	}
	Vue.set(player[layer], "activeChallenge", null)
	run(layers[layer].challenges[x].onExit, layers[layer].challenges[x])
	updateChallengeTemp(layer)
}

VERSION.withoutName = "v" + VERSION.num + (VERSION.pre ? " Pre-Release " + VERSION.pre : VERSION.pre ? " Beta " + VERSION.beta : "")
VERSION.withName = VERSION.withoutName + (VERSION.name ? ": " + VERSION.name : "")


function autobuyUpgrades(layer, limit){
	if (!tmp[layer].upgrades) return
	for (id in tmp[layer].upgrades)
		if (isPlainObject(tmp[layer].upgrades[id]) && (layers[layer].upgrades[id].canAfford === undefined || (layers[layer].upgrades[id].canAfford() === true)))
			if (layers[layer].upgrades[id].id <= limit)
				buyUpg(layer, id) 
}

function gameLoop(diff) {
	if (isEndgame() || tmp.gameEnded){
		tmp.gameEnded = true
		clearParticles()
	}

	if (isNaN(diff) || diff < 0) diff = 0
	if (tmp.gameEnded && !player.keepGoing) {
		diff = 0
		//player.tab = "tmp.gameEnded"
		clearParticles()
	}

	if (maxTickLength) {
		let limit = maxTickLength()
		if(diff > limit)
			diff = limit
	}
	addTime(diff)
	player.points = player.points.add(tmp.pointGen.times(diff)).max(0)

	for (let x = 0; x <= maxRow; x++){
		for (item in TREE_LAYERS[x]) {
			let layer = TREE_LAYERS[x][item]
			player[layer].resetTime += diff
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff*tmp[layer].passiveGeneration);
			if (layers[layer].update) layers[layer].update(diff);
		}
	}

	for (row in OTHER_LAYERS){
		for (item in OTHER_LAYERS[row]) {
			let layer = OTHER_LAYERS[row][item]
			player[layer].resetTime += diff
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff*tmp[layer].passiveGeneration);
			if (layers[layer].update) layers[layer].update(diff);
		}
	}	

	for (let x = maxRow; x >= 0; x--){
		for (item in TREE_LAYERS[x]) {
			let layer = TREE_LAYERS[x][item]
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer, tmp[layer].autoUpgrade)
		}
	}

	for (row in OTHER_LAYERS){
		for (item in OTHER_LAYERS[row]) {
			let layer = OTHER_LAYERS[row][item]
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
				player[layer].best = player[layer].best.max(player[layer].points)
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer, tmp[layer].autoUpgrade)
		}
	}

	for (layer in layers){
		if (layers[layer].milestones) updateMilestones(layer);
		if (layers[layer].achievements) updateAchievements(layer)
	}

}

function hardReset(resetOptions) {
	if (!confirm("Are you sure you want to do this? You will lose all your progress!")) return
	player = null
	if(resetOptions) options = null
	save(true);
	window.location.reload();
}

const cudGrade16 = {
    image:"resources/aaaRune.png",
    spread: 20,
	width: 70,
	height: 70,
    time: 3,
	color: "#006BF7",
    rotation (id) {
        return 3 * (id - 1.5) + (Math.random() - 0.5) * 10
    },
    dir() {
        return (Math.random() - 0.5) * 10
    },
    speed() {
        return (Math.random()) * 4 
    },
	onClick() {
		if (this.color == "#006BF7") {
			player.minimumClickMult+=1
			if (hasUpgrade('g', 14)) {
				var CarpalScale = new Decimal(0.01)
				if (hasUpgrade('g', 18)) {
					CarpalScale = CarpalScale.times(777.77)
				}
				if (hasUpgrade('p', 34)) {
					CarpalScale = CarpalScale.times(5)
				}
				CarpalScale = CarpalScale.times(player['k'].yes_power)
				player['g'].CarpalValue = player['g'].CarpalValue.add(CarpalScale)
			}
			var GambleRange = 15
			if (hasUpgrade('g', 19))
				GambleRange = 6
			if (hasUpgrade('g', 25))
				GambleRange = 3
			if (player.MustCrit)
				GambleRange = 1
			if (player['k'].precisionMode)
				GambleRange *= 20

			if ((hasUpgrade('g', 15)) && (Math.floor(Math.random()*GambleRange+1)==GambleRange)) {
				var critPower = decimalOne
				if (hasUpgrade('a', 18))
					critPower = critPower.times(7)
				if (hasUpgrade('k', 19))
					critPower = critPower.times(3)
				if (hasUpgrade('g', 27))
					critPower = critPower.times(5)
				if (player['k'].precisionMode) {
					critPower = critPower.times(1000)
					if (hasUpgrade('p', 33)) critPower = critPower.times(500)
				}
				player['p'].clickingMult = player['p'].clickingMult.add(getClickPower().times(critPower.times(5)))
				this.color = "#770000"
				addPoints("p", getResetGain("p").times(critPower))
				updateMilestones("p")
				updateAchievements("p")
				playSound('Critical', 'ogg', 0.147)
			} else {
				player['p'].clickingMult = player['p'].clickingMult.add(getClickPower())
				this.color = "#6225D1"
				playSound('SymbolClick', 'ogg', 0.247)
			}
			player.NonClickTime = decimalZero
		}
	},
	onMouseLeave() {
		if (hasMilestone('k', 12)) {
			this.onClick()
		}
	},
	onMouseEnter() {
		if (hasMilestone('darkness', 11)) {
			this.onClick()
		}
	},
}

const catFood = {
    image:"resources/CatFood.png",
    spread: 20,
	width: 81,
	height: 66,
    time: 5,
	//pressed: false,
    rotation (id) {
        return 0.2 * (id - 1.5) + (Math.random() - 0.5) * 10
    },
    dir() {
        return (Math.random() - 0.5) * 10
    },
    speed() {
        return (Math.random()) * 3 
    },
	onClick() {
		if (player['g'].AxeCatMult && player['p'].clickingMult && player['g'].AxeCatMult.lt(getAxeCap())) {
			//this.pressed = true
			catMult = 1/16
			if (hasUpgrade('k', 20)) {
				catMult = 1/8
			}
			player['g'].AxeCatMult = player['g'].AxeCatMult.add(getAxeCap().times(catMult)).min(getAxeCap())
			if (Math.random()>=0.5) {
				playSound('CatEat1', 'ogg', 0.4)
			} else {
				playSound('CatEat2', 'ogg', 0.4)
			}
		}
		this.time = 0
	},
	onMouseEnter() {
		if (hasUpgrade('g', 27)) {
			this.onClick()
		}
	},
}

const yes_face = {
    image:"resources/yes.png",
    spread: 20,
	width: 77,
	height: 77,
    time: 4,
	//color: "#FFFFFF",
    rotation (id) {
        return 3 * (id - 1.5) + (Math.random() - 0.5) * 10
    },
    dir() {
        return (Math.random() - 0.5) * 10
    },
    speed() {
        return (Math.random()) * 2
    },
	onClick() {
		if (this.image == "resources/yes.png") {
			this.image = "resources/yes2.png"
			var YesGain = player['k'].points.pow(1.5)
			var YesIncrement = player['k'].points.sub(1500).div(100).floor()
			YesGain = YesGain.times((new Decimal(5)).pow(YesIncrement).max(1))
			if (hasUpgrade('p', 36)) {
            	YesGain = YesGain.times(upgradeEffect('p', 36))
        	}
			player['k'].yes_power = player['k'].yes_power.add(YesGain)
			doReset('k', true)
			playSound('YES_ENCOUNTER', 'ogg')
		}
	},
	onMouseEnter() {
		this.onClick()
	}
}

var ticking = false

var interval = setInterval(function() {
	if (player===undefined||tmp===undefined) return;
	if (ticking) return;
	if (tmp.gameEnded&&!player.keepGoing) return;
	ticking = true
	let now = Date.now()
	let diff = (now - player.time) / 1e3
	let trueDiff = diff
	if (player.offTime !== undefined) {
		if (player.offTime.remain > modInfo.offlineLimit * 3600) player.offTime.remain = modInfo.offlineLimit * 3600
		if (player.offTime.remain > 0) {
			let offlineDiff = Math.max(player.offTime.remain / 10, diff)
			player.offTime.remain -= offlineDiff
			diff += offlineDiff
			options.musicOn = false
			if (bgSong)
				bgSong.pause()

			//RESETTING STUFF
			resetClickMult()
			player.MustCrit = false
			player.NonClickTime = decimalZero
			player['g'].AxeCatMult = new Decimal(1)
			for (i in player['farm'].grid) {
				setGridData('farm', i, {CurrentCrop: null, Ready: false})
			}
		}
		if (!options.offlineProd || player.offTime.remain <= 0) 
			player.offTime = undefined
	}
	if (player.devSpeed) diff *= player.devSpeed
	player.time = now
	if (needCanvasUpdate){ resizeCanvas();
		needCanvasUpdate = false;
	}
	tmp.scrolled = document.getElementById('treeTab') && document.getElementById('treeTab').scrollTop > 30
	var symbolReq = 0.97
	if (hasUpgrade('g', 13)) {
		symbolReq = 0.9
	}
	if (hasAchievement('a', 15)) {
		symbolReq -= 0.017
	}
	if (hasAchievement('a', 23)) {
		symbolReq -= 0.017
	}
	if (hasUpgrade('k', 14)) {
		symbolReq -= 0.01
	}
	if (hasMilestone('k', 26)) {
		symbolReq /= 1.05
	}
	if (player['p'].feedingAxeCat) {
		symbolReq = 1
	}
	if ((hasUpgrade('p', 16) || hasUpgrade('g', 13)) && Math.random()>= symbolReq) {
		if (hasUpgrade('k', 22) && Math.random() >= 0.99) {
			makeShinies(yes_face, 1)
		} else {
			if (hasUpgrade('g', 27) && Math.random() >= 0.995) {
				makeShinies(catFood, 1)
			} else {
				makeShinies(cudGrade16, 1)
			}
		}
	}
	if (!player['farm'].WheatOwned && player['farm'].points.eq(0)) {
		doReset('farm')
	}
	if ((hasUpgrade('p', 19) && player['p'].clickingMult.gt(player.minimumClickMult*3)) || (!(hasUpgrade('p', 19)) && player['p'].clickingMult.gt(1))) {
		var drain = 30
		if (hasMilestone('k', 25)) {
			drain *= 2
		}
		var minClickM = new Decimal(1)
		if (hasUpgrade('p', 19)) {
			minClickM = new Decimal(player.minimumClickMult * 3)
		}
		player['p'].clickingMult = player['p'].clickingMult.sub(getClickPower().div(drain)).max(minClickM)
	} else {
		resetClickMult()
	}
	player.NonClickTime = player.NonClickTime.add(0.25)
	var catfoodChance = 0.95
	if ((hasMilestone('g', 17) && player['p'].feedingAxeCat)) {
		if (Math.random()>=catfoodChance) {
			makeShinies(catFood, 1)
		}
		if (hasMilestone('darkness', 12)) {
			for (i in CropOrder) {
				if (player['farm'][CropOrder[i]+"Owned"] && player['farm'][CropOrder[i]].gt(0)) {
					player['farm'][CropOrder[i]] = player['farm'][CropOrder[i]].sub(0.03).max(0)
				}
			}
		}
	}
	if (player['g'].AxeCatMult) {
		if (player['g'].AxeCatMult && player['p'].clickingMult) {
			var axeDrain = 2000
			if (hasUpgrade('k', 20)) {
				axeDrain *= 2.25
			}
			if (hasMilestone('darkness', 11)) {
				axeDrain /= 2
			}
			if (player['g'].AxeCatMult.gt(getAxeCap().div(axeDrain).add(1))) {
				player['g'].AxeCatMult = player['g'].AxeCatMult.add(getAxeCap().div(-axeDrain))
			} else {
				player['g'].AxeCatMult = new Decimal(1)
			}
		}
	}
	if (hasUpgrade('p', 37) && Math.random()>=0.9997) {
		NewEquation()
	}

	prepareTipRand()
	updateTemp();
	updateOomps(diff);
	updateWidth()
	updateTabFormats()
	gameLoop(diff)
	fixNaNs()
	adjustPopupTime(trueDiff)
	updateParticles(trueDiff)
	//changeSong()
	ticking = false
}, 50)

setInterval(function() {needCanvasUpdate = true}, 500)

