// =====================================================
var gl;
var shadersLoaded = 0;
var vertShaderTxt;
var fragShaderTxt;
var shaderProgram = null;
var vertexBuffer;
var colorBuffer;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
var Seuil = 0.1;
var z = 1.0; //position Z
var n = 128; //nombre de coupes
var ALPHA = 0.6; //ajout pour la transparence
var COLOR1 = [1.0, 0.0, 0.0];
var COLOR2 = [0.0, 1.0, 0.0];
var COLOR3 = [0.0, 0.0, 1.0];
var COLOR4 = [0.5, 0.5, 1.0];
var COLOR5 = [0.2, 0.8, 1.0];

mat4.identity(objMatrix);
listeImg = [];
listTexture = [];


// =====================================================
function webGLStart() {
	var canvas = document.getElementById("WebGL-test");
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;

	initGL(canvas);
	initBuffers();

	loadShaders('shader');

	//boucle pour liste d'image
	for(j=0; j<10; j++){
		listeImg[j]="image-0000"+j+".jpg";
	}

	for(j=10; j<100; j++){
		listeImg[j]="image-000"+j+".jpg";
	}

	for(j=100; j<128; j++){
		listeImg[j]="image-00"+j+".jpg";
	}


	//boucle pour remplir texture
	for(i=0; i<listeImg.length; i++){
		listTexture.push(gl.createTexture());
		listTexture[i].id = i;
		initTexture(listTexture[i], listeImg[i]);
	}

	gl.clearColor(0.7, 0.7, 0.7, 1.0);//réinitialisation 
	gl.enable(gl.DEPTH_TEST);//profondeur

	//drawScene();
	tick();
}

// =====================================================
function initGL(canvas)//lie carte graphique au canvas
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);//carte graphique dessine dans la totalité du canvas --> il peut y avoir plusieurs viewport
		gl.enable(gl.BLEND); //ajout pour transparence
		gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA); //ajout pour transparence
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}

// =====================================================
function initBuffers() {//géométrie
	// Vertices (array)
	vertices = [
		-0.3, -0.3,
		-0.3,  0.3,
		 0.3,  0.3,
		 0.3, -0.3];

	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);//on envoie tableau sur le buffer qui est bind
	vertexBuffer.itemSize = 2;
	vertexBuffer.numItems = 4;

	// Texture coords (array)
	texcoords = [ 
		  1.0, 0.0, //a
		  1.0, 1.0, //b
		  0.0, 1.0, //c
		  0.0, 0.0 ]; //d

	texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
	texCoordBuffer.itemSize = 2;
	texCoordBuffer.numItems = 4;
	
	// Index buffer (array)
	var indices = [ 0, 1, 2, 3];
	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	indexBuffer.itemSize = 1;
	indexBuffer.numItems = indices.length;

}


// =====================================================

function initTexture(texture, imgName)
{
	var texImage = new Image();
	texImage.src = imgName;

	texture.image = texImage;

	texImage.onload = function () {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);//envoie de l'imagesur carte graphique
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.activeTexture(gl.TEXTURE0);
	}
}




// =====================================================
function loadShaders(shader) {
	loadShaderText(shader,'.vs');
	loadShaderText(shader,'.fs');
}

// =====================================================
function loadShaderText(filename,ext) {   // technique car lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { vertShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(ext=='.fs') { fragShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(shadersLoaded==2) {
				initShaders(vertShaderTxt,fragShaderTxt);
				shadersLoaded=0;
			}
    }
  }
  xhttp.open("GET", filename+ext, true);
  xhttp.send();
}

// =====================================================
function initShaders(vShaderTxt,fShaderTxt) {

	vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vshader, vShaderTxt);
	gl.compileShader(vshader);
	if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vshader));
		return null;
	}

	fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fshader, fShaderTxt);
	gl.compileShader(fshader);
	if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fshader));
		return null;
	}

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vshader);
	gl.attachShader(shaderProgram, fshader);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.texCoordsAttribute = gl.getAttribLocation(shaderProgram, "texCoords");
	gl.enableVertexAttribArray(shaderProgram.texCoordsAttribute);
	
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	shaderProgram.z = gl.getUniformLocation(shaderProgram, "uZ"); //position en Z
	shaderProgram.s = gl.getUniformLocation(shaderProgram, "uS"); //seuil
	shaderProgram.COLOR1 = gl.getUniformLocation(shaderProgram, "uColor1");
	shaderProgram.COLOR2 = gl.getUniformLocation(shaderProgram, "uColor2");
	shaderProgram.COLOR3 = gl.getUniformLocation(shaderProgram, "uColor3");
	shaderProgram.COLOR4 = gl.getUniformLocation(shaderProgram, "uColor4");
	shaderProgram.COLOR5 = gl.getUniformLocation(shaderProgram, "uColor5");
	shaderProgram.alpha = gl.getUniformLocation(shaderProgram, "uAlpha"); //ajout pour transparence


	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
     	vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texCoordsAttribute,
      	texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);


}


// =====================================================
function setMatrixUniforms() {
	if(shaderProgram != null) {
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

		gl.uniform1f(shaderProgram.alpha, ALPHA); //ajout pour transparence
		gl.uniform1f(shaderProgram.s, Seuil); 
		gl.uniform3fv(shaderProgram.COLOR1, COLOR1);
		gl.uniform3fv(shaderProgram.COLOR2, COLOR2);
		gl.uniform3fv(shaderProgram.COLOR3, COLOR3);
		gl.uniform3fv(shaderProgram.COLOR4, COLOR4);
		gl.uniform3fv(shaderProgram.COLOR5, COLOR5);
	}
}

//====================================================
function setZ(z){
	if(shaderProgram != null) {
		gl.uniform1f(shaderProgram.z, z);
	}
}

// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	if(shaderProgram != null) {

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0.0, 0.0, -2.0]);
		mat4.multiply(mvMatrix, objMatrix);
		setMatrixUniforms();
		
		//boucle d'affichage des images 
		for (i=0; i<n; i++){
			setZ((i-n/2)/500);
			gl.bindTexture(gl.TEXTURE_2D, listTexture[i]); 
			gl.drawElements(gl.TRIANGLE_FAN, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}

	}
}