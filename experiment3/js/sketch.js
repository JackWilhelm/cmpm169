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
      for (let i = 0; i < numOfTriangleWalkers; i++) {
        painting(currentTriangles[i]);
      }
      for (let x = 0; x <= width; x++) {
        for (let y = 0; y <= height; y++) {
          world[x][y]--;
        }
      }
      userInteraction();
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

let photo;
let alpha = 10;
let travelDistance = 30;
let currentTriangles = [];
let numOfTriangleWalkers = 10;
let world = [[]];
let newPointImpactRadius = travelDistance/3;
let framesTillPointFree = 20;

function preload() {
	photo = loadImage('data/the-last-supper.jpg');
}


// setup() function is called once when the program starts
function setup() {
  canvasContainer = $("#canvas-container");
  if (photo.width > photo.height) {
    photo.resize(canvasContainer.width(), 0);
  } else {
    photo.resize(0, canvasContainer.height());
  }
  
  let canvas = createCanvas(photo.width,  photo.height);
  canvas.parent("canvas-container");
  myInstance = new MyClass("VALUE1", "VALUE2");
  noStroke();
  for (let i = 0; i < numOfTriangleWalkers; i++) {
    currentTriangles[i] = [
      {x:int((photo.width/2) + random(-travelDistance,travelDistance)), y:int((photo.height/2) + random(-travelDistance,travelDistance))},
      {x:int((photo.width/2) + random(-travelDistance,travelDistance)), y:int((photo.height/2) + random(-travelDistance,travelDistance))},
      {x:int((photo.width/2) + random(-travelDistance,travelDistance)), y:int((photo.height/2) + random(-travelDistance,travelDistance))}
    ]
  }
  for (let x = 0; x <= width; x++) {
    world[x] = [];
    for (let y = 0; y <= height; y++) {
      world[x][y] = 0;
    }
  }
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  myInstance.myMethod();
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function painting(currentTriangle) {
  let newPointIndex = int(random(0,3));
  let midPointX = 0;
  let midPointY = 0;
  for (let pointIndex = 0; pointIndex < 3; pointIndex++) {
    if (pointIndex != newPointIndex) {
      midPointX += currentTriangle[pointIndex].x;
      midPointY += currentTriangle[pointIndex].y;
    }
  }
  midPointX /= 2;
  midPointY /= 2;
  currentTriangle[newPointIndex] = makeNewPoint(midPointX, midPointY, currentTriangle[newPointIndex]);
  let centroidX = 0;
  let centroidY = 0;
  for (let pointIndex = 0; pointIndex < 3; pointIndex++) {
    centroidX += currentTriangle[pointIndex].x;
    centroidY += currentTriangle[pointIndex].y;
  }
  centroidX /= 3;
  centroidY /= 3;
  let pixelColor = photo.get(centroidX,centroidY);
	pixelColor[3] = alpha;
	fill(pixelColor);
  triangle(
    currentTriangle[0].x, currentTriangle[0].y,
    currentTriangle[1].x, currentTriangle[1].y,
    currentTriangle[2].x, currentTriangle[2].y
  );
}

function makeNewPoint(midPointX, midPointY, currentPoint) {
  let newPoint =  {
    x: constrain(int(midPointX + random(-travelDistance,travelDistance)),0,width),
    y: constrain(int(midPointY + random(-travelDistance,travelDistance)),0,height)
  };
  if (world[newPoint.x][newPoint.y] <= 0) {
    for (let x = -newPointImpactRadius; x <= newPointImpactRadius; x++) {
      for (let y = -newPointImpactRadius; y <= newPointImpactRadius; y++) {
        world[
          constrain(newPoint.x - x, 0, width)
        ][
          constrain(newPoint.y - y, 0, height)
        ] = framesTillPointFree;
      }
    }
    return newPoint;
  } else {
    return currentPoint;
  }
}

function userInteraction() {
  if (keyIsDown(87)) { //W key
    alpha = min(255, alpha + 1);
  }
  if (keyIsDown(83)) { //S key
    alpha = max(10, alpha - 1);
  }
}