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
let worldSpotSize = 10;
let travelDistance = 1;
let packSize = 3;
let smellRange = 1;
let startRandom = false;

function moveWolf(wolf, packColor) {
  strokeWeight(worldSpotSize);
  point(wolf.x * worldSpotSize, wolf.y * worldSpotSize);
  strokeWeight(1);
  let xOld = wolf.x;
  let yOld = wolf.y;
  let speedBoost = randomAdditionalSpeed();
  wolf.x += Math.floor(random(-travelDistance - speedBoost, travelDistance + 1 + speedBoost));
  wolf.y += Math.floor(random(-travelDistance - speedBoost, travelDistance + 1 + speedBoost));
  wolf.x = constrain(wolf.x, 0, Math.floor(width/worldSpotSize));
  wolf.y = constrain(wolf.y, 0, Math.floor(height/worldSpotSize));
  if ((world[wolf.x][wolf.y] == "none" || world[wolf.x][wolf.y] == packColor)
    && random() < calculateChanceOfMoving(wolf.x, wolf.y, packColor)) {
    line(xOld * worldSpotSize, yOld * worldSpotSize, wolf.x * worldSpotSize, wolf.y * worldSpotSize);
    world[wolf.x][wolf.y] = packColor;
  } else {
    wolf.x = xOld;
    wolf.y = yOld;
  }
}

function giveRandomStarts(pack) {
  pack.x = random();
  pack.y = random();
}

function randomAdditionalSpeed() {
  if (random() < 0.9) {
    return 0;
  } else {
    return 1;
  }
}

function otherColorNearbyPresence(x, y, color) {
  let presense = 0;
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      if (i == 0 && j == 0) {
        continue;
      }
      if (world[x+i] != null && world[x+i][y+j] != null && world[x+i][y+j] != color && world[x+i][y+j] != "none") {
        presense += 1;
      }
    }
  }
  return presense;
}

function calculateChanceOfMoving(x, y, color) {
  let presense = otherColorNearbyPresence(x, y, color);
  let a = 2 * smellRange;
  a += 1;
  a = Math.pow(a, 2);
  a -= 1;
  return -1 / Math.pow(a - 1, 2) * Math.pow(presense - 1, 2) + 1;
}

function movePack(pack) {
  stroke(pack.color);
  pack.wolves.forEach(wolf => {
    moveWolf(wolf, pack.color);
  });
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
  console.log('here');
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  console.log("done");
  // redrawCanvas(); // Redraw everything based on new size
  setup();
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
  console.log("done3");
  resetPacks();
  world = [[]];
  if (startRandom) {
    packs.forEach(giveRandomStarts);
  }
  packs.forEach(setPackStart);
  setupWorld();
  background(255);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  //background(220);    
  // call a method on the instance
  myInstance.myMethod();
}

function resetPacks() {
  packs = [
    {color: "red", x: 0.1, y: 0.1, wolves: []}, 
    {color: "blue", x: 0.9, y: 0.9, wolves: []}, 
    {color: "green", x: 0.1, y: 0.9, wolves: []},
    {color: "purple", x: 0.9, y: 0.1, wolves: []}
  ];
}

function keyReleased() {
  if (key == 'q') {
    resetPacks();
    worldSpotSize = max(1, worldSpotSize - 1);
    setup();
  }
  if (key == 'w') {
    resetPacks();
    worldSpotSize = 10;
    setup();
  }
  if (key == 'e') {
    resetPacks();
    worldSpotSize += 1;
    setup();
  }
  if (key == 'a') {
    resetPacks();
    travelDistance = max(1, travelDistance - 1);
    setup();
  }
  if (key == 's') {
    resetPacks();
    travelDistance = 1;
    setup();
  }
  if (key == 'd') {
    resetPacks();
    travelDistance = min(5, travelDistance + 1);
    setup();
  }
  if (key == 'z') {
    resetPacks();
    packSize = max(1, packSize - 1);
    setup();
  }
  if (key == 'x') {
    resetPacks();
    packSize = 3;
    setup();
  }
  if (key == 'c') {
    resetPacks();
    packSize = min(7, packSize + 1);
    setup();
  }
  if (key == 'i') {
    resetPacks();
    smellRange = max(1, smellRange - 1);
    setup();
  }
  if (key == 'o') {
    resetPacks();
    smellRange = 1;
    setup();
  }
  if (key == 'p') {
    resetPacks();
    smellRange = min(10, smellRange + 1);
    setup();
  }
  if (key == 'n') {
    resetPacks();
    startRandom = true;
    setup();
  }
  if (key == 'm') {
    resetPacks();
    startRandom = false;
    setup();
  }
  if (key == 'r') {
    resetPacks();
    world = [[]];
    worldSpotSize = 10;
    travelDistance = 1;
    packSize = 3;
    smellRange = 1;
    startRandom = false;
    setup();
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
    
}