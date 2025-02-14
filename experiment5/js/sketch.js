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

'use strict';

var textTyped = '';
var font;

var shapeSpace;
var shapeSpace2;
var shapePeriod;
var shapeComma;
var shapeQuestionmark;
var shapeExclamationmark;
var shapeReturn;

var centerX;
var centerY;
var offsetX;
var offsetY;
var zoom;

var actRandomSeed;

function preload() {
  font = loadFont('data/miso-bold.ttf');
  shapeSpace = loadImage('data/space.svg');
  shapeSpace2 = loadImage('data/space2.svg');
  shapePeriod = loadImage('data/period.svg');
  shapeComma = loadImage('data/comma.svg');
  shapeExclamationmark = loadImage('data/exclamationmark.svg');
  shapeQuestionmark = loadImage('data/questionmark.svg');
  shapeReturn = loadImage('data/return.svg');
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
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  textTyped += 'Ich bin der Musikant mit Taschenrechner in der Hand!\n\n';
  textTyped += 'Ich addiere\n';
  textTyped += 'Und subtrahiere, \n\n';
  textTyped += 'Kontrolliere\nUnd komponiere\nUnd wenn ich diese Taste drück,\nSpielt er ein kleines Musikstück?\n\n';

  textTyped += 'Ich bin der Musikant mit Taschenrechner in der Hand!\n\n';
  textTyped += 'Ich addiere\n';
  textTyped += 'Und subtrahiere, \n\n';
  textTyped += 'Kontrolliere\nUnd komponiere\nUnd wenn ich diese Taste drück,\nSpielt er ein kleines Musikstück?\n\n';

  centerX = width / 2;
  centerY = height / 2;
  offsetX = 0;
  offsetY = 0;
  zoom = 0.75;

  actRandomSeed = 6;

  cursor(HAND);
  textFont(font, 25);
  textAlign(LEFT, BASELINE);
  noStroke();
  fill(0);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(255);

  if (mouseIsPressed && mouseButton == LEFT) {
    centerX = mouseX - offsetX;
    centerY = mouseY - offsetY;
  }

  // allways produce the same sequence of random numbers
  randomSeed(actRandomSeed);

  translate(centerX, centerY);
  scale(zoom);

  for (var i = 0; i < textTyped.length; i++) {
    var letter = textTyped.charAt(i);
    var letterWidth = textWidth(letter);

    // ------ letter rule table ------
    switch (letter) {
    case ' ': // space
      // 50% left, 50% right
      var dir = floor(random(0, 2));
      if (dir == 0) {
        image(shapeSpace, 1, -15);
        translate(4, 1);
        rotate(QUARTER_PI);
      }
      if (dir == 1) {
        image(shapeSpace2, 1, -15);
        translate(14, -5);
        rotate(-QUARTER_PI);
      }
      break;

    case ',':
      image(shapeComma, 1, -15);
      translate(35, 15);
      rotate(QUARTER_PI);
      break;

    case '.':
      image(shapePeriod, 1, -55);
      translate(56, -56);
      rotate(-HALF_PI);
      break;

    case '!':
      image(shapeExclamationmark, 1, -27);
      translate(42.5, -17.5);
      rotate(-QUARTER_PI);
      break;

    case '?':
      image(shapeQuestionmark, 1, -27);
      translate(42.5, -17.5);
      rotate(-QUARTER_PI);
      break;

    case '\n': // return
      image(shapeReturn, 1, -15);
      translate(1, 10);
      rotate(PI);
      break;

    default: // all others
      text(letter, 0, 0);
      translate(letterWidth, 0);
    }
  }

  // blink cursor after text
  if (frameCount / 6 % 2 == 0) rect(0, 0, 15, 2);
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
  offsetX = mouseX - centerX;
  offsetY = mouseY - centerY;
}

function keyPressed() {
  switch (keyCode) {
  case DELETE:
  case BACKSPACE:
    textTyped = textTyped.substring(0, max(0, textTyped.length - 1));
    print(textTyped);
    break;
  case ENTER:
  case RETURN:
    // enable linebreaks
    textTyped += '\n';
    break;
  case UP_ARROW:
    zoom += 0.05;
    break;
  case DOWN_ARROW:
    zoom -= 0.05;
    break;
  }
}

function keyTyped() {
  if (keyCode >= 32) {
    textTyped += key;
    print(textTyped);
  }
}