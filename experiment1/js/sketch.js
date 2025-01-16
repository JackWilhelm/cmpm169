// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  //redrawCanvas(); // Redraw everything based on new size
}

'use strict';

var tileCount = 10;

var tileWidth;
var tileHeight;
var shapeSize = 100;
var newShapeSize = shapeSize;
var shapeAngle = 0;
var maxDist;
var currentShape;
var shapes;
var shakeMagnitude = 5;

var sizeMode = 0;

var shapeGrid = [];

function preload() {
  shapes = [];
  shapes.push(loadImage('data/EyeBrown.svg'));
  shapes.push(loadImage('data/EyeBlue.svg'));
  shapes.push(loadImage('data/EyeGreen.svg'));
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  imageMode(CENTER);
  // set the current shape to the first in the array
  currentShape = shapes[0];
  for (var gridY = 0; gridY < tileCount; gridY++) {
    shapeGrid[gridY] = [];
    for (var gridX = 0; gridX < tileCount; gridX++) {
      shapeGrid[gridY][gridX] = random(shapes);
    }
  }
  tileWidth = 83.2;
  tileHeight = 60;
  maxDist = sqrt(pow(width, 2) + pow(height, 2));
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  clear();
  background(0);

  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {

      var posX = tileWidth * gridX + tileWidth / 2;
      var posY = tileHeight * gridY + tileWidth / 2;

      // calculate angle between mouse position and actual position of the shape
      var e = dist(mouseX, mouseY, posX, posY)/200;
      var angle = lerp(
        atan2(mouseY - posY, mouseX - posX) + (180 * (PI / 180)), 
        atan2(mouseY - posY, mouseX - posX) + (0 * (PI / 180)), 
        max(min(e*e, 1),0));

      newShapeSize = max(30, min(60, map(dist(mouseX, mouseY, posX, posY), 0, 500, 5, shapeSize)));
      push();
      translate(
        posX + giveShakeInput(posX, posY), 
        posY + giveShakeInput(posX, posY)
      );
      rotate(angle);
      noStroke();
      currentShape = shapeGrid[gridY][gridX];
      image(currentShape, 0, 0, newShapeSize, newShapeSize);
      pop();
    }
  }
}

function keyReleased() {
  if (keyCode == UP_ARROW) shapeSize += 5;
  if (keyCode == DOWN_ARROW) shapeSize = max(shapeSize - 5, 5);
}

function giveShakeInput(posX, posY) {
  return random(-shakeMagnitude, shakeMagnitude)  * 
  min(0, 
    lerp(
    (map(dist(mouseX, mouseY, posX, posY), 0, 500, 5, shapeSize)/50), 
    0, 
    (map(dist(mouseX, mouseY, posX, posY), 0, 500, 5, shapeSize)/50)
  )
  );
}


// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}