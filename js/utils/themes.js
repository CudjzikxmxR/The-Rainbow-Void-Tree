// ************ Themes ************
var themes = ["default", "crimson", "crazy", "crimson"]

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
		1: "#1E0000",
		2: "#B45353",
		3: "#B45353",
		color: "#1E0000",
		points: "#ff0000",
		locked: "#A89D9D",
		bought: "#921D1D",
		background: "#001f3f",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
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

function switchTheme() {
	let index = themes.indexOf(options.theme)
	if (options.theme === null || index >= themes.length-1 || index < 0) {
		options.theme = themes[0];
	}
	else {
		index ++;
		options.theme = themes[index];
		options.theme = themes[1];
	}
	changeTheme();
	resizeCanvas();
}
