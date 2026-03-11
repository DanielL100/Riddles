document.addEventListener('click', function() {
	var audio = document.getElementById("myAudio");
	audio.play();
	document.getElementById("cookies").style.display = "none";
}, { once: true });

function start() {
	document.getElementById('start').classList.add('animatePageOut');
	document.getElementById('page1').classList.add('animatePageIn');
}

function page1() {
	document.getElementById('sun').classList.remove('sun');
	document.getElementById('sun').classList.add('moon');
	document.getElementById('page1').style.background = 'black';
	document.getElementById('bottomPage1').style.visibility = "visible";
	setTimeout(function() {
		document.getElementById('page1').classList.add('animatePageOut');
		document.getElementById('page2').classList.add('animatePageIn');
	}, 2000);
}

function page2() {
	document.getElementById('switch_btn').style.backgroundColor = 'white';
	document.getElementById('switch_btn2').style.backgroundColor = 'gray';
	document.getElementById('container2').classList.add('night');
	document.getElementById('bottomPage2').classList.add('animateBottom');
	setTimeout(function() {
		document.getElementById('page2').classList.add('animatePageOut');
		document.getElementById('page3').classList.add('animatePageIn');
	}, 7000);
}

function page3() {
	document.getElementById('bottomPage3').style.visibility = "visible";
	setTimeout(function() {
		document.getElementById('page3').classList.add('animatePageOut');
		document.getElementById('page4').classList.add('animatePageIn');
	}, 3000);
}

function page4() {
	document.getElementById('bottomPage4').style.visibility = "visible";
	setTimeout(function() {
		document.getElementById('page4').classList.add('animatePageOut');
		document.getElementById('page5').classList.add('animatePageIn');
	}, 3000);
}

function page5() {
	document.getElementById('bottomPage5').style.visibility = "visible";
	setTimeout(function() {
		document.getElementById('page5').classList.add('animatePageOut');
		document.getElementById('page6').classList.add('animatePageIn');
	}, 3000);
}

const { canvas, ctx } = setupCanvas('canvas-wrapping'); 
 let colors = [
	"#10b981",
	"#7c3aed",
	"#fbbf24",
	"#ef4444",
	"#3b82f6",
	"#22c55e",
	"#f97316",
	"#ef4444",
]
function page6() {
	document.getElementById('bottomPage6').style.visibility = "visible";
	setTimeout(function() {
		document.getElementById('page6').classList.add('animatePageOut');
		document.getElementById('end').classList.add('animatePageIn');
		renderWrappingConfetti();
		setTimeout(function() {
			document.getElementById('bottomPage7').style.visibility = "visible";
		}, 10000);
	}, 3000);
}

//start
var readRecipe = false;
function showRecipe() {
	if(!readRecipe) {
		document.getElementById("coffeeRecipe").style.left = "50%";
		document.getElementById("coffeeRecipe").style.top = "50%";
		document.getElementById("coffeeRecipe").style.transform = "translate(-50%, -50%)";
		if(window.innerWidth <= 1000) {
			document.getElementById("coffeeRecipe").style.width = "63vw";
			document.getElementById("coffeeRecipe").style.height = "63vw";
			document.getElementById("coffeeRecipe").style.fontSize = "6vw";
		} else {
			document.getElementById("coffeeRecipe").style.width = "33vw";
			document.getElementById("coffeeRecipe").style.height = "60vh";
			document.getElementById("coffeeRecipe").style.fontSize = "3vw";
		}
		readRecipe = true;
	} else {
		document.getElementById("coffeeRecipe").style.left = "-5%";
		document.getElementById("coffeeRecipe").style.top = "";
		document.getElementById("coffeeRecipe").style.transform = "rotateZ(-13deg)";
		document.getElementById("coffeeRecipe").style.width = "5vw";
		document.getElementById("coffeeRecipe").style.height = "20vh";
		document.getElementById("coffeeRecipe").style.fontSize = "0.5em";
		readRecipe = false;
	}
}

// page 3

var clickedKey = false;

function breakGlass() {
	document.getElementById("keyGlass").style.clipPath = "polygon(evenodd, 100% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 50%, 50% 0%, 100% 50%, 50% 100%) content-box";
}

function clickKey() {
	clickedKey = true;
	document.getElementById("key").style.display = "none";
}

function clickDoor() {
	if(clickedKey) {
		document.getElementById("boom").style.display = "none";
		document.getElementById("door").style.transform = "perspective(1200px) rotateY(80deg)";
		setTimeout(function() {
			page3();
		}, 1000);
	}
}

// page 4

function editWiki() {
	document.getElementsByClassName("wikiBtn")[0].classList.add("chosenBtn");
	document.getElementsByClassName("wikiBtn")[1].classList.remove("chosenBtn");
	document.getElementById("editableText").contentEditable = "true";
	document.getElementById("editableText").style.color = "blue";
	document.getElementById("textCounter").innerText = "(מספר תווים: בעריכה)";
}

function readWiki() {
	document.getElementsByClassName("wikiBtn")[1].classList.add("chosenBtn");
	document.getElementsByClassName("wikiBtn")[0].classList.remove("chosenBtn");
	document.getElementById("editableText").contentEditable = "false";
	document.getElementById("editableText").style.color = "black";
	document.getElementById("textCounter").innerText = "(מספר תווים: " + document.getElementById("editableText").innerText.length + ")";
	
	if(document.getElementById("editableText").innerText == ''){
		page4();
	}
}

// page 5
function sendMsg() {
	if(document.getElementById("wtspanswer").value.replace(" ", "") != "") {
		document.getElementById("whatsappChat").innerHTML += "<div class='wtspmsgAns'>" + document.getElementById("wtspanswer").value + "<div class='time'>11:00</div></div>";
		document.getElementById("wtspanswer").value = "";
		document.getElementById("whatsappChat").scrollTop = document.getElementById("whatsappChat").scrollHeight;
	}
}

function showmenu() {
	if(document.getElementById("menu").style.display == "none")
		document.getElementById("menu").style.display = "block";
	else
		document.getElementById("menu").style.display = "none";
}

// page 6

function openCupboard(id, angle) {
	if(document.getElementById(id).style.transform == "perspective(1200px) rotateY(" + angle + ")")
		document.getElementById(id).style.transform = "";
	else
		document.getElementById(id).style.transform = "perspective(1200px) rotateY(" + angle + ")";
}

var itemsTaken = 0;
var chosen = -1;
var items = [];

function takeItem(id) {
	// add placeholder to storage
	document.getElementById("storage").innerHTML += "<div id=item" + itemsTaken + " class='itemTaken'></div>";
	
	// move clicked item to its placeholder in storage
	document.getElementById("item" + itemsTaken).appendChild(document.getElementById(id));
	
	// add click event to item and placeholder
	document.getElementById(id).setAttribute("onclick", "chooseItem('" + id + "')");
	document.getElementById("item" + itemsTaken).setAttribute("onclick", "chooseItem('" + id + "')");
	
	// move item placeholder in storgae
	if(window.innerWidth < 1000)
		document.getElementById("item" + itemsTaken).style.left = (9 * itemsTaken) + "vw";
	else
		document.getElementById("item" + itemsTaken).style.left = (4 * itemsTaken) + "vw";

	// add item to list
	items.push(id);
	
	// set item position in its placeholder
	if(id == "spoon" || id == "milk" || id =="cup") {
		document.getElementById(id).style.left = "50%";
		document.getElementById(id).style.transform = "translate(-50%, 0)";
	} else {
		document.getElementById(id).style.position = "relative";
		document.getElementById(id).style.top = "0";
		document.getElementById(id).style.left = "0";
	}
	itemsTaken += 1;
}


function chooseItem(id) {
	event.stopPropagation(); 
	
	if(chosen == -2) {
		document.getElementById("cup").style.borderTop = "";
		document.getElementById("cup").style.borderRight = "";
		document.getElementById("cup").style.borderLeft = "";
	}
	
	if(chosen <= -1) {
		chosen = items.indexOf(id);
		document.getElementById("item" + chosen).style.backgroundColor = "green";
	} else if(chosen != items.indexOf(id)) {
		document.getElementById("item" + chosen).style.backgroundColor = "crimson";
		chosen = items.indexOf(id);
		document.getElementById("item" + chosen).style.backgroundColor = "green";
	} else {
		document.getElementById("item" + chosen).style.backgroundColor = "crimson";
		chosen = -1;
	}
}

var currentRoom = 2;
function moveRoom(side) {
	document.getElementById("room" + currentRoom).style.display = "none";
	if(side == -1) {
		currentRoom -= 1;
	} else {
		currentRoom += 1;
	}
	document.getElementById("room" + currentRoom).style.display = "block";
	
	document.getElementById("larrow").style.display = "flex";
	document.getElementById("rarrow").style.display = "flex";
	
	if(currentRoom == 1)
		document.getElementById("larrow").style.display = "none";
	else if(currentRoom == 3)
		document.getElementById("rarrow").style.display = "none";
}

var mixed = false;
function putCup() {
	if(chosen >= 0){
		if(items[chosen] == "cup") {
			document.getElementById("tablePlate").appendChild(document.getElementById("cup"));
			document.getElementById("cup").style.bottom = "";
			if(window.innerWidth < 1000)
				document.getElementById("cup").style.top = "-0.5vh";
			else
				document.getElementById("cup").style.top = "-1vh";
			document.getElementById("cup").style.left = "40%";
			document.getElementById("cup").style.transform = "rotateZ(180deg)";
			document.getElementById("cup").setAttribute("onclick", "clearCup(false)");
			
			document.getElementById("storage").removeChild(document.getElementById("item" + chosen));
			
			// move other items left
			for(var i = chosen + 1; i < itemsTaken; i++) {
				if(window.innerWidth < 1000)
					document.getElementById("item" + i).style.left = (parseInt(document.getElementById("item" + i).style.left.replace("vw", "")) - 9) + "vw";
				else
					document.getElementById("item" + i).style.left = (parseInt(document.getElementById("item" + i).style.left.replace("vw", "")) - 4) + "vw";
				document.getElementById("item" + i).id = "item" + (i - 1);
			}
			
			items.splice(chosen, 1);
			chosen = -1;
			--itemsTaken;
		}
	}
}

var layers = 0;
function clearCup(isSink) {
	switch(chosen) {
		case -2:
			chosen = -1;
			document.getElementById("cup").style.borderTop = "";
			document.getElementById("cup").style.borderRight = "";
			document.getElementById("cup").style.borderLeft = "";
			if(isSink) {
					document.getElementById("cup").innerHTML = "";
				layers = 0;
				mixed = false;
			}
			break;
			
		case -1:
			if(!isSink){
				chosen = -2;
				document.getElementById("cup").style.borderTop = "1px solid green";
				document.getElementById("cup").style.borderRight = "1px solid green";
				document.getElementById("cup").style.borderLeft = "1px solid green";
			}
			break;
		
		default:
			if(!mixed && !isSink) {
				document.getElementById("item" + chosen).style.backgroundColor = "crimson";
				
				if(items[chosen] == "spoon" && layers > 0) {
					mixCup();
				} else {
					document.getElementById("cup").innerHTML += "<div id='layer" + layers + "' class='layer'></div>";
					document.getElementById("layer" + layers).style.backgroundColor = window.getComputedStyle(document.getElementById(items[chosen])).backgroundColor;
					++layers;
				}
				
				chosen = -1;
			}
			
			break;
	}
}

function mixCup() {
	var red = 0;
	var green = 0;
	var blue = 0;
	for(var i = 0; i < layers; i++) {
		var colors = document.getElementById("layer" + i).style.backgroundColor.replace("rgba(", "").replace("rgb(", "").replace(")", "").split(", ");
		red += parseInt(colors[0]);
		green += parseInt(colors[1]);
		blue += parseInt(colors[2]);
	}
	red /= layers;
	green /= layers;
	blue /= layers;
	
	red = Math.round(red);
	green = Math.round(green);
	blue = Math.round(blue);
	
	document.getElementById("cup").innerHTML = "<div id='layer0' class='layer'></div>";
	document.getElementById("layer0").style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + ")";
	document.getElementById("layer0").style.height = (layers * 15) + "%";
	
	if(red == 226 && green == 212 && blue == 202)
		page6();
	
	mixed = true;
}

/* end */
function setupCanvas(id) {
	const canvas = document.getElementById(id);
	const ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	return { canvas, ctx };
}
function renderWrappingConfetti() {
	const timeDelta = 0.05;
	const xAmplitude = 0.5;
	const yAmplitude = 1;
	const xVelocity = 2;
	const yVelocity = 3;

	let time = 0;
	const confetti = []

	for (let i = 0; i < 100; i++) {
		const radius = Math.floor(Math.random() * 50) - 10
		const tilt = Math.floor(Math.random() * 10) - 10
		const xSpeed = Math.random() * xVelocity - xVelocity / 2
		const ySpeed = Math.random() * yVelocity
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height - canvas.height;

		confetti.push({
			x,
			y,
			xSpeed,
			ySpeed,
			radius,
			tilt,
			color: colors[Math.floor(Math.random() * colors.length)],
			phaseOffset: i, // Randomness from position in list
		})
	}

	function update() {
		// Run for at most 10 seconds
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		confetti.forEach((piece, i) => {
			piece.y += (Math.cos(piece.phaseOffset + time) + 1) * yAmplitude + piece.ySpeed;
			piece.x += Math.sin(piece.phaseOffset + time) * xAmplitude + piece.xSpeed;
			// Wrap around the canvas
			if (piece.x < 0) piece.x = canvas.width;
			if (piece.x > canvas.width) piece.x = 0;
			if (piece.y > canvas.height) piece.y = 0;
			ctx.beginPath();
			ctx.lineWidth = piece.radius / 2;
			ctx.strokeStyle = piece.color;
			ctx.moveTo(piece.x + piece.tilt + piece.radius / 4, piece.y);
			ctx.lineTo(piece.x + piece.tilt, piece.y + piece.tilt + piece.radius / 4);
			ctx.stroke();
		})
		time += timeDelta;
		requestAnimationFrame(update);
	}
	update();
}
