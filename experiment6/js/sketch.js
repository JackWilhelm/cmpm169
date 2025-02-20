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
  fetchCardsForYearAndColor();
  
}
let yearsMagicHasBeenAround = 32
let yearsSinceMagicStart = 6;
let circleSizeMult = 7;
let colors = ["W", "U", "B", "R", "G"];
let yearMagicMade = 1993;
let YearsAndColorsData = [];
let PercentileRelativeYearsAndColorsData = [];
let SumPercentileRelativeYearsAndColorsData = [];

let svg = d3.select("#canvas-container")
      .append("svg")
      .attr("width", $("#canvas-container").width())
      .attr("height", $("#canvas-container").height()+500);

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  // call a method on the instance
  myInstance.myMethod();

}

function createCircleCharts() {
  for (let year = yearMagicMade; year <= yearMagicMade + yearsSinceMagicStart; year++) {
    let ra = SumPercentileRelativeYearsAndColorsData[year-yearMagicMade];
    for (let i = 1; i < ra.length; i++) {
      let arcColor = "purple" //tester
      if (i == 1) {
        arcColor = "white"
      } else if (i == 2) {
        arcColor = "blue"
      } else if (i == 3) {
        arcColor = "black"
      } else if (i == 4) {
        arcColor = "red"
      }else {
        arcColor = "green"
      }
      let arc = d3.arc()
        .innerRadius(((year-yearMagicMade)*circleSizeMult)+5)
        .outerRadius((year-yearMagicMade)*circleSizeMult)
        .startAngle(ra[i-1] * (2*Math.PI))
        .endAngle(ra[i] * (2*Math.PI))
        .padAngle(0.02);

      if (year == yearMagicMade + yearsSinceMagicStart) {
        console.log(year);
        arc.outerRadius((yearsMagicHasBeenAround+4)*circleSizeMult)
      }
      svg.append("path")
      .attr("transform", "translate(400,375)")
      .attr("d", arc)
      .attr("fill", color(arcColor))

      
    }
  }
  createClusteredBubbleChart();
}

function createClusteredBubbleChart() {
  let xSpot = 0
  let ySpot = 0
  const data = [
    { cluster: "A", radius: 20 }, { cluster: "A", radius: 15 },
    { cluster: "B", radius: 25 }, { cluster: "B", radius: 18 },
    { cluster: "C", radius: 30 }, { cluster: "C", radius: 22 },
    { cluster: "A", radius: 50 }, { cluster: "B", radius: 19 },
    { cluster: "C", radius: 24 }, { cluster: "A", radius: 14 }
  ];

  const clusters = ["A", "B", "C"];

  // Force simulation
  const simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(xSpot).strength(0.2))
    .force("y", d3.forceY(ySpot).strength(0.2))
    .force("collide", d3.forceCollide(d => d.radius + 2))
    .on("tick", ticked);

  // Create bubble nodes
  const nodes = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("transform", "translate(900,375)")
    .attr("r", d => d.radius)
    .attr("fill", color("white"))
    .call(d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded));

  function ticked() {
    nodes.attr("cx", d => d.x)
         .attr("cy", d => d.y);
  }

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x; 
    d.fy = event.y; 
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0); 
    d.fx = null;
    d.fy = null;
  }
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



async function fetchCardsForYearAndColor() {
  let url = "";
  let promises = [];
  for (let year = yearMagicMade; year <= yearMagicMade + yearsMagicHasBeenAround; year++) {
    YearsAndColorsData[year-yearMagicMade] = new Map();
    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      url = `https://api.scryfall.com/cards/search?q=year%3D${year}+c%3D${colors[colorIndex]}`;
      promises.push(fetch(url)
      .then(response => response.json())
      .then(data => {
        YearsAndColorsData[year-yearMagicMade].set(colors[colorIndex], data.total_cards);
      })
      .catch(error => console.error("Error fetching Red cards:", error)));
    }
  }
  await Promise.all(promises);

  console.log(YearsAndColorsData);
  adjustToRelativePercents();
}

function adjustToRelativePercents() {
  for (let year = yearMagicMade; year <= yearMagicMade + yearsMagicHasBeenAround; year++) {
    let sumOfCardsThisYear = 0;
    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      sumOfCardsThisYear += YearsAndColorsData[year-yearMagicMade].get(colors[colorIndex]);
    }
    PercentileRelativeYearsAndColorsData[year-yearMagicMade] = new Map();
    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      PercentileRelativeYearsAndColorsData[year-yearMagicMade].set(colors[colorIndex], YearsAndColorsData[year-yearMagicMade].get(colors[colorIndex])/sumOfCardsThisYear);
    }
  }
  adjustToSumRelativePercentsArray();
}

function adjustToSumRelativePercentsArray() {
  for (let year = yearMagicMade; year <= yearMagicMade + yearsMagicHasBeenAround; year++) {
    SumPercentileRelativeYearsAndColorsData[year-yearMagicMade] = [0];
    let sumPercent = 0;
    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      sumPercent += PercentileRelativeYearsAndColorsData[year-yearMagicMade].get((colors[colorIndex]));
      SumPercentileRelativeYearsAndColorsData[year-yearMagicMade].push(sumPercent);
    }
  }
  resetGraphs();
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}