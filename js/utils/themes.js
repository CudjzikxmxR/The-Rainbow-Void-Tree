// ************ Themes ************
var themes = ["default", "aqua", "crazy", "crimson", "envious"]
var songList = [
	"ElevatorMusic1", "FatCat", "DR_Hometown", "DR_Home", "DR_HipShop", 
	"DR_GreenRoom", "DR_AnotherHometown", "DR_DarkSanctuary",
	"SKIBIDILOVANIA"
]

var colors = {
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		bought: "#77bf5f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	aqua: {
		1: "#bfdfff",
		2: "#8fa7bf",
		3: "#5f6f7f",
		color: "#bfdfff",
		points: "#dfefff",
		locked: "#c4a7b3",
		bought: "#77bf5f",
		background: "#001f3f",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
	crazy: {
		1: "#E5C7F1",
		2: "#A886C4",
		3: "#6225D1",
		color: "#E5C7F1",
		points: "#6225D1",
		locked: "#c4a7b3",
		bought: "#6225D1",
		background: "#1B0A3A",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	crimson: {
		1: "#E5BEBE",
		2: "#B45353",
		3: "#B45353",
		color: "#E5BEBE",
		points: "#ff0000",
		locked: "#A89D9D",
		bought: "#921D1D",
		background: "#1E0000",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
	envious: {
		1: "#d9ffee",
		2: "#8fbfa6",
		3: "#177d47",
		color: "#ffffff",
		points: "#dfefff",
		locked: "#c4a7b3",
		bought: "#77bf5f",
		background: "#0e2a15",
		background_tooltip: "rgba(1, 30, 7, 0.75)",
	},
}

var songs = {
	ElevatorMusic1: {
		name: "Elevator Music",
		path: "elevatorMusic1",
		fileType: "mp3",
		volume: 1,
	},
	FatCat: {
		name: "pilotredsun - fat cat",
		path: "FatCat",
		fileType: "mp3",
		volume: 1,
		description: "Now playing!!! ST refrints???!"
	},
	DR_Hometown: {
		name: "DELTARUNE - A Town Called Hometown",
		path: "DeltaruneHometown",
		fileType: "mp3",
		volume: 1,
	},
	DR_Home: {
		name: "DELTARUNE - You Can Always Come Home",
		path: "DeltaruneYouCanAlwaysComeHome",
		fileType: "mp3",
		volume: 1,
	},
	DR_HipShop: {
		name: "DELTARUNE - Hip Shop",
		path: "DeltaruneHipShop",
		fileType: "mp3",
		volume: 1,
	},
	DR_GreenRoom: {
		name: "DELTARUNE - Welcome To The Green Room",
		path: "DeltaruneGreenRoom",
		fileType: "mp3",
		volume: 1,
	},
	DR_AnotherHometown: {
		name: "DELTARUNE - Another Day In Hometown",
		path: "DeltaruneAnotherDayInHometown",
		fileType: "mp3",
		volume: 1,
	},
	DR_DarkSanctuary: {
		name: "DELTARUNE - Dark Sanctuary",
		path: "DeltaruneDarkSanctuary",
		fileType: "mp3",
		volume: 1,
	},
	SKIBIDILOVANIA: {
		name: "SKIBIDILOVANIA",
		path: "SKIBIDILOVANIA",
		fileType: "mp3",
		volume: 1,
		description: ":)"
	},
}


function changeTheme() {
	colors_theme = colors[options.theme || "default"];
	document.body.style.setProperty('--background', colors_theme["background"]);
	document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
	document.body.style.setProperty('--color', colors_theme["color"]);
	document.body.style.setProperty('--points', colors_theme["points"]);
	document.body.style.setProperty("--locked", colors_theme["locked"]);
	document.body.style.setProperty("--bought", colors_theme["bought"]);
}
function getThemeName() {
	return options.theme? options.theme : "default";
}

let song_play = songs[options.currentSong || "ElevatorMusic1"];
let bgSong = new Audio("audio/"+song_play["path"]+"."+song_play["fileType"])

function changeSong() {
	song_play = songs[options.currentSong || "ElevatorMusic1"];
	if (bgSong) {
		bgSong.pause()
	}
	bgSong = new Audio("audio/"+song_play["path"]+"."+song_play["fileType"])
	bgSong.currentTime = 0
	bgSong.loop = true
	bgSong.volume = song_play["volume"]
	if (options.musicOn) {
		bgSong.play()
		doPopup('none', song_play['description'] || 'Now playing...', song_play['name'], 3, colors[options.theme || "default"].color)
	}
}
function getSongName() {
	song_play = songs[options.currentSong || "ElevatorMusic1"];
	return song_play['name']? song_play['name'] : "Elevator Music";
}

function switchTheme() {
	let index = themes.indexOf(options.theme)
	if (options.theme === null || index >= themes.length-1 || index < 0) {
		options.theme = themes[0];
	}
	else {
		index++;
		options.theme = themes[index];
		if (index == 2) {
			player.SecretAch1 = true
		}
	}
	changeTheme();
	resizeCanvas();
}

function switchSong() {
	let index = songList.indexOf(options.currentSong)
	//alert(index2)
	if (options.currentSong === null || index >= songList.length-1 || index < 0) {
		options.currentSong = songList[0];
	}
	else {
		index++;
		options.currentSong = songList[index];
		if (index == (songList.length-1)) {
			player.SecretAch2 = true
		}
	}
	changeSong()
}