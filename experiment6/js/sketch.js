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
  resetGraphs();
}
let yearsMagicHasBeenAround = 32
let yearsSinceMagicStart = 1;
let circleSizeMult = 7;

let svg = d3.select("#canvas-container")
      .append("svg")
      .attr("width", 10000)
      .attr("height", 10000);

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  // call a method on the instance
  myInstance.myMethod();

}

function createCircleCharts() {
  // Select the canvas container and append an SVG element for D3

  for (let circleNum = 0; circleNum < yearsSinceMagicStart; circleNum++) {
    let ra = getRandomAngles();
    for (let i = 1; i < ra.length; i++) {
      
      let arc = d3.arc()
        .innerRadius((circleNum*circleSizeMult)+5)
        .outerRadius(circleNum*circleSizeMult)
        .startAngle(ra[i-1])
        .endAngle(ra[i]);

      if (circleNum == yearsSinceMagicStart-1) {
        arc.outerRadius(yearsMagicHasBeenAround*circleSizeMult)
      }
      svg.append("path")
      .attr("transform", "translate(400,375)")
      .attr("d", arc)
      .attr("fill", color(random(0,225),random(0,225),random(0,225),225))
    }
  }
}

function getRandomAngles() {
  const angles = [];
  let sum = 0;
  angles.push(0);

  // Generate 4 random angles
  for (let i = 0; i < 4; i++) {
    let angle = Math.random() * ((2*Math.PI) - sum);
    sum += angle;
    angles.push(sum);
  }
  angles.push((2*Math.PI));
  return angles;
}



function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    yearsSinceMagicStart = min(yearsMagicHasBeenAround, yearsSinceMagicStart+1);
    resetGraphs()
  }
  if (keyCode === LEFT_ARROW) {
    yearsSinceMagicStart = max(0, yearsSinceMagicStart-1);
    resetGraphs()
  }
}

function resetGraphs() {
  d3.select("svg").selectAll("*").remove();
  createCircleCharts();
}

async function fetchCards() {
  let url = "https://api.scryfall.com/cards/search?q=c=r";
  let allCards = [];

  try {
    while (url) {
      let response = await fetch(url);
      let data = await response.json();
      
      // Extract and print card names
      data.data.forEach(card => console.log(card.name));

      // Store the cards (optional)
      allCards.push(...data.data);

      // Get the next page URL, if it exists
      url = data.has_more ? data.next_page : null;
    }

    console.log(`Total Red Cards: ${allCards.length}`);
  } catch (error) {
    console.error("Error fetching Red cards:", error);
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}