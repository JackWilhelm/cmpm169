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
  {color: "red", x: 0.5, y: 0.5}, 
  {color: "blue", x: 0.5, y: 0.5}, 
  {color: "green", x: 0.5, y: 0.5},
  {color: "purple", x: 0.5, y: 0.5}
];
let world = [[]];

function movePack(pack) {
  stroke(pack.color);
  point(pack.x, pack.y);
  let xOld = pack.x;
  let yOld = pack.y;
  pack.x += Math.floor(random(-5, 6));
  pack.y += Math.floor(random(-5, 6));
  pack.x = constrain(pack.x, 0, width);
  pack.y = constrain(pack.y, 0, height);
  if (world[pack.x][pack.y] == "none" || world[pack.x][pack.y] == pack.color) {
    line(xOld, yOld, pack.x, pack.y);
    world[pack.x][pack.y] = pack.color;
  } else {
    pack.x = xOld;
    pack.y = yOld;
  }
}

function setPackStart(pack) {
  pack.x = Math.floor(lerp(0, width, pack.x));
  pack.y = Math.floor(lerp(0, height, pack.y));
}

function setupWorld() {
  for (let x = 0; x < width; x++) {
    world[x] = [];
    for (let y = 0; y < height; y++) {
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