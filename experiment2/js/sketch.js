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
let packs = [
  {color: "red", x: 0.1, y: 0.1, wolves: []}, 
  {color: "blue", x: 0.9, y: 0.9, wolves: []}, 
  {color: "green", x: 0.1, y: 0.9, wolves: []},
  {color: "purple", x: 0.9, y: 0.1, wolves: []}
];
let world = [[]];
let worldSpotSize = 5;
let travelDistance = 1;
let packSize = 3;

function moveWolf(wolf) {
  strokeWeight(worldSpotSize);
  point(wolf.x * worldSpotSize, wolf.y * worldSpotSize);
  strokeWeight(1);
  let xOld = wolf.x;
  let yOld = wolf.y;
  wolf.x += Math.floor(random(-travelDistance, travelDistance+1));
  wolf.y += Math.floor(random(-travelDistance, travelDistance+1));
  wolf.x = constrain(wolf.x, 0, Math.floor(width/worldSpotSize));
  wolf.y = constrain(wolf.y, 0, Math.floor(height/worldSpotSize));
  if (world[wolf.x][wolf.y] == "none" || world[wolf.x][wolf.y] == wolf.color) {
    line(xOld * worldSpotSize, yOld * worldSpotSize, wolf.x * worldSpotSize, wolf.y * worldSpotSize);
    world[wolf.x][wolf.y] = wolf.color;
  } else {
    wolf.x = xOld;
    wolf.y = yOld;
  }
}

function movePack(pack) {
  stroke(pack.color);
  pack.wolves.forEach(moveWolf);
}

function setPackStart(pack) {
  pack.x = Math.floor(lerp(0, width, pack.x)/worldSpotSize);
  pack.y = Math.floor(lerp(0, height, pack.y)/worldSpotSize);
  for (let wolf = 0; wolf < packSize; wolf++) {
    pack.wolves[wolf] = {x: pack.x, y: pack.y};
  }
}

function setupWorld() {
  for (let x = 0; x <= width/worldSpotSize; x++) {
    world[x] = [];
    for (let y = 0; y <= height/worldSpotSize; y++) {
      world[x][y] = "none";
    }
  }
}

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
        packs.forEach(movePack);
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
  background(255);
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
  packs.forEach(setPackStart);
  setupWorld();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  //background(220);    
  // call a method on the instance
  myInstance.myMethod();
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}