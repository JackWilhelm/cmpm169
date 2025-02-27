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
  // redrawCanvas(); // Redraw everything based on new size
}

const net = new brain.NeuralNetwork();
const padlength = 50
const savedModel = localStorage.getItem('trainedModel');

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

  if (savedModel) {
    // Load the saved model from localStorage
    net.fromJSON(JSON.parse(savedModel));
    console.log("Model loaded from localStorage.");
  } else {
    // If no model is found, train the network
    const trainingData = [
      {input: createArrayFromString("Rachel’s heart did a sank in the lobby of the Springhill Suites. Her"), output: {Adjective: 1}},
      {input: createArrayFromString("engagement ring, adorned a"), output: {Adjective: 1}},
      {input: createArrayFromString("diamond, was gone! Vanished! In Orlando, of all places, during a"), output: {Adjective: 1}},
      {input: createArrayFromString("business trip. She’d arrived that afternoon, a blur of "), output: {Adjective: 1}},
      {input: createArrayFromString("taxis. “It has to be here,” she "), output: {PTVerb: 1}},
      {input: createArrayFromString(", dumping her"), output: {Adjective: 1}},
      {input: createArrayFromString("suitcase onto the"), output: {Noun: 1}},
      {input: createArrayFromString("knock announced her coworkers, Jana and Todd. They’d seen her"), output: {Adjective: 1}},
      {input: createArrayFromString("face in the hallway and came to"), output: {Verb: 1}},
      {input: createArrayFromString("“Everything okay?” Todd asked, looking"), output: {Adjective: 1}},
      {input: createArrayFromString("“My Ring!” Rachel cried, waving her hands. “I lost it!” My fiancé Karl is going to be so "), output: {Adjective: 1}},
      {input: createArrayFromString("As the sun set, their"), output: {Noun: 1}},
      {input: createArrayFromString("Rachel felt"), output: {Adjective: 1}},
      {input: createArrayFromString("Back at the"), output: {Noun: 1}},
      {input: createArrayFromString("Then, laughter. Todd and Jana"), output: {PTVerb: 1}},
    ];
    net.train(trainingData);
    localStorage.setItem('trainedModel', JSON.stringify(net.toJSON()));
  }

  

  let output = net.run(createArrayFromString("I went to the grocery store"));
  console.log('Output:', output);
}

function createArrayFromString(string) {
  let inputArray = [];
  inputArray = string.split('').map(char => char.charCodeAt(0));
  while (inputArray.length < 100) {
    inputArray.push(0);
  }
  return inputArray;
}


// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(220);    
  // call a method on the instance
  myInstance.myMethod();

  // Set up rotation for the rectangle
  push(); // Save the current drawing context
  translate(centerHorz, centerVert); // Move the origin to the rectangle's center
  rotate(frameCount / 100.0); // Rotate by frameCount to animate the rotation
  fill(234, 31, 81);
  noStroke();
  rect(-125, -125, 250, 250); // Draw the rectangle centered on the new origin
  pop(); // Restore the original drawing context

  // The text is not affected by the translate and rotate
  fill(255);
  textStyle(BOLD);
  textSize(140);
  text("p5*", centerHorz - 105, centerVert + 40);
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}