// =====================================================
// Mouse management
// =====================================================
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var rotY = 0;
var rotX = 0;

// =====================================================
window.requestAnimFrame = (function()
{
	return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback,
									/* DOMElement Element */ element)
         {
            window.setTimeout(callback, 1000/60);
         };
})();

// ==========================================
function tick() {
	requestAnimFrame(tick);
	drawScene();
}

// =====================================================
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

// =====================================================
function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}


// =====================================================
function handleMouseUp(event) {
	mouseDown = false;
}


// =====================================================
function handleMouseMove(event) {
	if (!mouseDown) {
		return;
	}
	var newX = event.clientX;
	var newY = event.clientY;

	var deltaX = newX - lastMouseX;
	var deltaY = newY - lastMouseY;

	rotY += degToRad(deltaX / 2);
	rotX += degToRad(deltaY / 2);

	mat4.identity(objMatrix);
	mat4.rotate(objMatrix, rotX, [1, 0, 0]);
	mat4.rotate(objMatrix, rotY, [0, 1, 0]);

	lastMouseX = newX
	lastMouseY = newY;
}

//============================== slider pour transparence

var sliderAlpha = document.getElementById("tran");
sliderAlpha = 100; 
sliderAlpha.oninput = function() {transparence()};


function transparence(val) {
	ALPHA = val/100;
	var output = document.getElementById("demo");
	output.innerHTML = ALPHA ;
}

//============================== Slider du nombre de coupes
var sliderCoupe = document.getElementById("coupes");
sliderCoupe = 128; 
sliderCoupe.oninput = function() {coupe()};

function coupe(val){
	n = val;
	var output = document.getElementById("demo2");
	output.innerHTML = n;
}

//============================== Slider du seuil
var sliderSeuil = document.getElementById("seuils");
sliderSeuil = 100; 
sliderSeuil.oninput = function() {seuil()};


function seuil(val) {
	Seuil = val/100;
	var output = document.getElementById("demo3");
	output.innerHTML = Seuil ;
}

//============================== Convertisseur HEX to RGB

function convertHex(hex){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16)/255;
    v = parseInt(hex.substring(2,4), 16)/255;
    b = parseInt(hex.substring(4,6), 16)/255;

    var rvb = [r,v,b];

    return rvb;
}

//============================== Gestion des couleurs

function FausseCol1(){
    var Col1 = document.getElementById("colors1");
    COLOR1 = convertHex(Col1.value);
}

function FausseCol2(){
    var Col2 = document.getElementById("colors2");
    COLOR2 = convertHex(Col2.value);
}

function FausseCol3(){
    var Col3 = document.getElementById("colors3");
    COLOR3 = convertHex(Col3.value);
}

function FausseCol4(){
    var Col4 = document.getElementById("colors4");
    COLOR4 = convertHex(Col4.value);
}

function FausseCol5(){
    var Col5 = document.getElementById("colors5");
    COLOR5 = convertHex(Col5.value);
}