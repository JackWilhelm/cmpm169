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

let cw, ch
let coords = []
let gridSize
let cellSize
let thePath = []
let startFrame = 0
let palette
let MAX_FILL
let rotX, rotY, rotZ
let neighbors = [];
let basePossibleNeighbors = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
let shapeColorMode = 0;
let strokeColorMode = 2;
let p;

let head;

// Load the file and create a p5.Geometry object.
function preload() {
  head = loadModel('data/Head.obj');
}

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
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  cw = min(canvasContainer.width(), canvasContainer.height())
  ch = cw
  colorMode(HSB);
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      for (let k = -1; k <= 1; k++) {
        neighbors.push([i,j,k]);
      }
    }
  }
  initializeGrid();
}

let initializeGrid = () => {
  thePath = []
  coords = []
  startFrame = frameCount

  gridSize = 7
  cellSize = (cw - 400) / (gridSize * sqrt(2))
  MAX_FILL = random(0.5, 0.8)
  rotX = random(0.0005, 0.002) * random([-1, 1])
  rotY = random(0.0005, 0.002) * random([-1, 1])
  rotZ = random(0.0005, 0.002) * random([-1, 1])

  for (let i = 0; i < gridSize; i++) {
    coords[i] = []
    for (let j = 0; j < gridSize; j++) {
      coords[i][j] = []
      for (let k = 0; k < gridSize; k++) {
        coords[i][j][k] = undefined

      }
    }
  }

  p = createVector(
    floor(random(gridSize)),
    floor(random(gridSize)),
    floor(random(gridSize))
  )
  thePath.push(p)
  coords[p.x][p.y][p.z] = "X"
  possibleNeighbors = basePossibleNeighbors.map((v) => createVector(v[0], v[1], v[2]))
  let pn = shuffle([...possibleNeighbors])
  let counter = 0
  let totalCells = gridSize * gridSize * gridSize
  while (pn.length > 0 && counter < totalCells * MAX_FILL) {
    let delta = pn.pop()
    let np = p.copy().add(delta)
    let added = false
    if (
      np.x >= 0 &&
      np.x < gridSize &&
      np.y >= 0 &&
      np.y < gridSize &&
      np.z >= 0 &&
      np.z < gridSize
    ) {
      let cell = coords[np.x][np.y][np.z]
      if (cell !== undefined) {
        // Do nothing, it's already been visited
      } else {
        coords[np.x][np.y][np.z] = possibleNeighbors.indexOf(delta)
        p = np
        thePath.push(p)
        pn = shuffle([...possibleNeighbors])
        added = true
      }
    }
    if (added) {
      counter++
    }
  }
}
function draw() {
  background(0, 0, 10)
  orbitControl()

  let nf = frameCount - startFrame
  spinningHead();
  push()
  rotateX(PI / 6)
  rotateY(PI / 6)
  rotateZ(PI / 6)
  rotateX(nf * rotX)
  rotateY(nf * rotY)
  rotateZ(nf * rotZ)
  
  


  let drawSpeed = 0.9

  let drawFrames = (thePath.length / drawSpeed)
  let totalFrames = drawFrames
  let maxIndex = nf <= drawFrames ?
    map(nf, 0, drawFrames, 0, thePath.length, true) :
    map(nf, drawFrames, totalFrames, thePath.length, 0, true)

  if (nf > totalFrames) {
    initializeGrid()
  }
  let cs = -gridSize * cellSize / 2
  translate(cs, cs-100, cs)
  for(let i = 1; i < thePath.length; i++) {
    if (i > maxIndex) {
      if (i > 1) {
        thePath.shift();
        thePath[thePath.length] = thePath[thePath.length-1]
      }
      return
    }
    if (thePath[0] == thePath[thePath.length-1]) {
      initializeGrid()
      break
    }
    if (strokeColorMode == 0) {
      stroke("black")
    } else if (strokeColorMode == 1) {
      stroke("white")
    } else {
      stroke((i*20)%255, 75, 75)
    }
    push() 
    translate(
      thePath[i-1].x * cellSize,
      thePath[i-1].y * cellSize,
      thePath[i-1].z * cellSize
    )
    if (shapeColorMode == 0) {
      fill("black")
    } else if (shapeColorMode == 1) {
      fill("white")
    } else {
      fill((i*20)%255, 75, 75)
    }
    box(cellSize*min(i/5, 1))
    pop()
    line(
      thePath[i-1].x * cellSize,
      thePath[i-1].y * cellSize,
      thePath[i-1].z * cellSize,
      thePath[i].x * cellSize,
      thePath[i].y * cellSize,
      thePath[i].z * cellSize,
    )
  }
}

let f = 0;
function spinningHead() {
  push()
  fill("black")
  stroke("black")
  translate(50,900,-800)
  rotateX(HALF_PI);
  rotateZ(f/(50*PI))
  f++
  scale(25)
  model(head)
  pop()
}

function keyPressed() {
  if (key === "r") {
    initializeGrid()
  }
  if (key === "q") {
    shapeColorMode++
    shapeColorMode %= 3;
  }
  if (key === "e") {
    strokeColorMode++
    strokeColorMode %= 3;
  }
}

function colorToRGBString(col) {
  let r = red(col);
  let g = green(col);
  let b = blue(col);
  return `rgb(${r}, ${g}, ${b})`;
}