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
  initializeGrid();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

let initializeGrid = () => {
  thePath = []
  coords = []
  startFrame = frameCount

  gridSize = floor(random(5, 10))
  cellSize = cw / (gridSize * sqrt(2))
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

  let p = createVector(
    floor(random(gridSize)),
    floor(random(gridSize)),
    floor(random(gridSize))
  )
  thePath.push(p)
  coords[p.x][p.y][p.z] = "X"
  let possibleNeighbors = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ].map((v) => createVector(v[0], v[1], v[2]))
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

    if (pn.length === 0) {
      p = createVector(
        floor(random(gridSize)),
        floor(random(gridSize)),
        floor(random(gridSize))
      )
      let tries = 0
      while (coords[p.x][p.y][p.z] !== undefined && tries < 100) {
        p = createVector(
          floor(random(gridSize)),
          floor(random(gridSize)),
          floor(random(gridSize))
        )
        tries++
      }
      thePath.push(p)
      coords[p.x][p.y][p.z] = "X"
      pn = shuffle([...possibleNeighbors])
    }
    if (added) {
      counter++
    }
    if (counter >= totalCells * 0.85) {
    }
  }
}

let seg = (x1, y1, z1, x2, y2, z2) => {
  let n = cellSize
  let x = (x1 + x2) / 2
  let y = (y1 + y2) / 2
  let z = (z1 + z2) / 2
  let w = abs(x2 - x1) || n / 10
  let h = abs(y2 - y1) || n / 10
  let d = abs(z2 - z1) || n / 10
  push()
  translate(x, y, z)
  drawRod(w, h, d)

  pop()
}

let drawRod = (w, h, d) => {
  let rr
  let rh

  if (w > h && w > d) {
    rr = h / 2
    rh = w
    rotateZ(HALF_PI)
    cylinder(rr, rh)
    push()
    translate(0, rh / 2)
    sphere(rr)
    pop()
    push()
    translate(0, -rh / 2)
    sphere(rr)
    pop()
    rotateZ(-HALF_PI)
  } else if (h > w && h > d) {
    rr = w / 2
    rh = h
    cylinder(rr, rh)
    push()
    translate(0, rh / 2)
    sphere(rr)
    pop()
    push()
    translate(0, -rh / 2)
    sphere(rr)
    pop()
  } else {
    rr = w / 2
    rh = d
    rotateX(HALF_PI)
    cylinder(rr, rh)
    push()
    translate(0, rh / 2)
    sphere(rr)
    pop()
    push()
    translate(0, -rh / 2)
    sphere(rr)
    pop()
    rotateX(-HALF_PI)
  }
}

function draw() {
  background(0, 0, 10)
  orbitControl()

  let nf = frameCount - startFrame

  push()
  rotateX(PI / 6)
  rotateY(PI / 6)
  rotateZ(PI / 6)
  rotateX(nf * rotX)
  rotateY(nf * rotY)
  rotateZ(nf * rotZ)


  let drawSpeed = 0.5
  let rewindSpeed = 2

  let drawFrames = (thePath.length / drawSpeed)
  let rewindFrames = (thePath.length / rewindSpeed)
  let totalFrames = drawFrames + rewindFrames
  let maxIndex = nf <= drawFrames ?
    map(nf, 0, drawFrames, 0, thePath.length, true) :
    map(nf, drawFrames, totalFrames, thePath.length, 0, true)

  if (nf > totalFrames) {
    initializeGrid()
  }

  let cs = -gridSize * cellSize / 2
  translate(cs, cs, cs)

  thePath.forEach((p, i) => {
    if (i > maxIndex) {
      return
    }
    push()
    translate(p.x * cellSize, p.y * cellSize, p.z * cellSize)
    let c = coords[p.x][p.y][p.z]
    if (c === "X") {
    } else {
      noStroke()
      fill("white")
      shininess(40)
      switch (c) {
        case 0:
          seg(0, 0, 0, -cellSize, 0, 0)
          break
        case 1:
          seg(0, 0, 0, cellSize, 0, 0)
          break
        case 2:
          seg(0, 0, 0, 0, -cellSize, 0)
          break
        case 3:
          seg(0, 0, 0, 0, cellSize, 0)
          break
        case 4:
          seg(0, 0, 0, 0, 0, -cellSize)
          break
        case 5:
          seg(0, 0, 0, 0, 0, cellSize)
          break
      }
    }

    pop()
  })
  pop()
}

function keyPressed() {
  if (key === "r") {
    initializeGrid()
  }
}

function colorToRGBString(col) {
  let r = red(col);
  let g = green(col);
  let b = blue(col);
  return `rgb(${r}, ${g}, ${b})`;
}