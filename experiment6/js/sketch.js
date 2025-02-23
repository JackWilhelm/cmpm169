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
  fetchCards();
}
let yearsMagicHasBeenAround = 32
let yearsSinceMagicStart = 6;
let circleSizeMult = 7;
let colors = ["W", "U", "B", "R", "G"];
let types = ["Creature", "Enchantment", "Instant", "Sorcery"]
let yearMagicMade = 1993;
let YearsAndColorsData = [];
let PercentileRelativeYearsAndColorsData = [];
let SumPercentileRelativeYearsAndColorsData = [];
let chosenType = 0;
let ready = false;
let yearsLoaded = 0;

let svg = d3.select("#canvas-container")
      .append("svg")
      .attr("width", $("#canvas-container").width())
      .attr("height", $("#canvas-container").height()+500);

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  // call a method on the instance
  myInstance.myMethod();
  background(92, 64, 51);
  textSize(50);
  stroke(color("white"));
  textAlign(CENTER, CENTER);
  if (!ready) {
    textSize(150);
    text("LOADING " + yearsLoaded + "/32", width/2, height/2);
    return;
  }
  if (chosenType > 3) {
    text(`Type: All` , 375, height-20);
  } else {
    text(`Type: ${types[chosenType]}` , 375, height-20);
  }
  text(`Year: ${yearMagicMade+yearsSinceMagicStart}`, width/2, 30);
}

function createCircleCharts() {
  for (let year = yearMagicMade; year <= yearMagicMade + yearsSinceMagicStart; year++) {
    let ra = SumPercentileRelativeYearsAndColorsData[year-yearMagicMade];
    for (let i = 1; i < ra.length; i++) {
      let arcColor = "purple" //tester
      if (i == 1) {
        arcColor = color(228, 150, 4)
      } else if (i == 2) {
        arcColor = color(38, 68, 144)
      } else if (i == 3) {
        arcColor = color(66, 1, 97)
      } else if (i == 4) {
        arcColor = color(126, 0, 30)
      }else {
        arcColor = color(0, 102, 51)
      }
      let arc = d3.arc()
        .innerRadius(((year-yearMagicMade)*circleSizeMult)+5)
        .outerRadius((year-yearMagicMade)*circleSizeMult)
        .startAngle(ra[i-1] * (2*Math.PI))
        .endAngle(ra[i] * (2*Math.PI))
        .padAngle(0.02);

      if (year == yearMagicMade + yearsSinceMagicStart) {
        arc.outerRadius((yearsMagicHasBeenAround+4)*circleSizeMult)
      }
      svg.append("path")
      .attr("transform", "translate(400,375)")
      .attr("d", arc)
      .attr("fill", color(arcColor))

    }
  }
  createClusteredBubbleChart(yearsSinceMagicStart);
}

function createClusteredBubbleChart(year) {
  let xSpot = 0
  let ySpot = 0
  let data = [];
  for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
    for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
      data.push({type: types[typeIndex], cluster: colors[colorIndex], radius: 0.8 * YearsAndColorsData[year].get(colors[colorIndex]).get(types[typeIndex])})
    }
  }

  let data2 = [];
  for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
    for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
      for (let i = 0; i < YearsAndColorsData[year].get(colors[colorIndex]).get(types[typeIndex])/5; i++) {
        data2.push({type: types[typeIndex], cluster: colors[colorIndex], radius: 0.8 * YearsAndColorsData[year].get(colors[colorIndex]).get(types[typeIndex])})
      }
    }
  }
  
  let squareSize = 10;
  let clusters = colors;
  const simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(xSpot).strength(0.2))
    .force("y", d3.forceY(ySpot).strength(0.2))
    .force("collide", d3.forceCollide(d => d.radius + 2))
    .on("tick", ticked);

  const squaresSimulation = d3.forceSimulation(data2)
    .force("x", d3.forceX(xSpot).strength(0.05))
    .force("y", d3.forceY(ySpot).strength(0.05))
    .force("collide", d3.forceCollide(d => squareSize))
    .on("tick", ticked);

  const nodes = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("transform", `translate(900,375)`)
    .attr("r", d => d.radius)
    .attr("fill", d => {if (d.cluster == "W") {
      return color(228, 150, 4)
    } else if (d.cluster == "U") {
      return color(38, 68, 144)
    } else if (d.cluster == "B") {
      return color(66, 1, 97)
    } else if (d.cluster == "R") {
      return color(126, 0, 30)
    }else {
      return color(0, 102, 51)
    }})
    .call(d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded));


  
  const squares = svg.selectAll("rect")
    .data(data2)
    .enter().append("rect")
    .attr("transform", `translate(${canvasContainer.width() * 9/10},375)`)
    .attr("width", squareSize)
    .attr("height", squareSize)
    .attr("fill", r => {if (r.cluster == "W") {
      return color(228, 150, 4)
    } else if (r.cluster == "U") {
      return color(38, 68, 144)
    } else if (r.cluster == "B") {
      return color(66, 1, 97)
    } else if (r.cluster == "R") {
      return color(126, 0, 30)
    }else {
      return color(0, 102, 51)
    }})
    .call(d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded));
  
  const labels = svg.selectAll("text")
    .data(data)
    .enter().append("text")
    .attr("transform", "translate(900,375)")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
    .attr("font-size", "12px")
    .style("user-select", "none")
    .style("pointer-events", "none")
    .text(d => d.type);
  
  function ticked() {
    nodes.attr("cx", d => d.x)
         .attr("cy", d => d.y);
    squares.attr("x", d => d.x - squareSize / 2)
         .attr("y", d => d.y - squareSize / 2);
    labels.attr("x", d => d.x)
         .attr("y", d => d.y);
  }

  function dragStarted(event, d) {
    if (!event.active) {
      simulation.alphaTarget(0.3).restart();
      squaresSimulation.alphaTarget(0.3).restart();
    }
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
  if (keyCode === 83) {
    chosenType++
    chosenType %= 5;
    adjustToRelativePercents()
  }
}

function resetGraphs() {
  d3.select("svg").selectAll("*").remove();
  createCircleCharts();
}



async function fetchCards() {
  let url = "";
  let promises = [];
  
  for (let year = yearMagicMade; year <= yearMagicMade + yearsMagicHasBeenAround; year++) {
    YearsAndColorsData[year-yearMagicMade] = new Map();
    console.log(year-yearMagicMade)
    yearsLoaded = year-yearMagicMade;
    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      YearsAndColorsData[year-yearMagicMade].set(colors[colorIndex], new Map());
      for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
        await new Promise(resolve => setTimeout(resolve, 60));
        url = `https://api.scryfall.com/cards/search?q=year%3D${year}+c%3D${colors[colorIndex]}+not%3Areprint+type%3D${types[typeIndex]}`;
        promises.push(fetch(url)
        .then(response => response.json())
        .then(data => {
          YearsAndColorsData[year-yearMagicMade].get(colors[colorIndex]).set(types[typeIndex], data.total_cards);
        })
        .catch(error => console.error("Error fetching cards cards:", error, year, colors[colorIndex], types[typeIndex])));
      }
    }
  }
  await Promise.all(promises);
  ready = true;
  adjustToRelativePercents();
}

function adjustToRelativePercents() {
  if (chosenType == 4) {
    for (let year = yearMagicMade; year <= yearMagicMade + yearsMagicHasBeenAround; year++) {
      let sumOfCardsThisYear = 0;
      for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
        for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
          sumOfCardsThisYear += YearsAndColorsData[year-yearMagicMade].get(colors[colorIndex]).get(types[typeIndex]);
        }
      }
      PercentileRelativeYearsAndColorsData[year-yearMagicMade] = new Map();
      for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
        let sumOfColorCardsThisYear = 0;
        for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
          sumOfColorCardsThisYear += YearsAndColorsData[year-yearMagicMade].get(colors[colorIndex]).get(types[typeIndex]);
        }
        PercentileRelativeYearsAndColorsData[year-yearMagicMade].set(colors[colorIndex], sumOfColorCardsThisYear/sumOfCardsThisYear);
      }
    }
  } else {
    let type = types[chosenType];
    for (let year = yearMagicMade; year <= yearMagicMade + yearsMagicHasBeenAround; year++) {
      let sumOfCardsThisYear = 0;
      for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
        sumOfCardsThisYear += YearsAndColorsData[year-yearMagicMade].get(colors[colorIndex]).get(type);
      }
      PercentileRelativeYearsAndColorsData[year-yearMagicMade] = new Map();
      for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
        PercentileRelativeYearsAndColorsData[year-yearMagicMade].set(colors[colorIndex], YearsAndColorsData[year-yearMagicMade].get(colors[colorIndex]).get(type)/sumOfCardsThisYear);
      }
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