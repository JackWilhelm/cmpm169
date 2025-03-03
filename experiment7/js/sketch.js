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
let typedText = "";
let wordDictionary = {
  Adjective: [
    "happy", "sad", "bright", "dark", "cold", "hot", "beautiful", "ugly", "slow", "quick",
    "strong", "weak", "light", "heavy", "soft", "hard", "loud", "quiet", "funny", "serious",
    "rich", "poor", "fresh", "stale", "smooth", "rough", "clear", "cloudy", "warm", "clean",
    "dirty", "new", "old", "clean", "messy", "bright", "dim"
  ],
  Noun: [
    "dog", "cat", "tree", "car", "house", "book", "computer", "phone", "person", "student",
    "teacher", "child", "adult", "food", "apple", "banana", "orange", "city", "country",
    "mountain", "river", "building", "flower", "city", "street", "shirt", "dog", "fish", "ball"
  ],
  Verb: [
    "running", "jumping", "swimming", "talking", "listening", "watching", "writing", "reading",
    "sleeping", "eating", "drinking", "playing", "studying", "working", "thinking", "speaking",
    "dancing", "singing", "drawing", "painting", "traveling", "meeting", "helping", "pushing",
    "pulling", "opening", "closing", "sitting", "standing", "driving", "climbing", "skipping",
    "looking", "bringing"
  ],
  PNoun: [
    "dogs", "cats", "trees", "cars", "houses", "books", "computers", "phones", "people", "students",
    "teachers", "children", "adults", "apples", "bananas", "oranges", "flowers", "buildings", "cities",
    "streets", "shirts", "fish", "balls", "cakes", "buses", "airplanes", "clothes", "shoes", "games"
  ],
  PTVerb: [
    "ran", "jumped", "swam", "talked", "listened", "watched", "wrote", "read", "slept", "ate", "drank",
    "played", "studied", "worked", "thought", "spoke", "danced", "sang", "drew", "painted", "traveled",
    "met", "helped", "pushed", "pulled", "opened", "closed", "sat", "stood", "drove", "climbed", "skipped",
    "looked", "brought"
  ]
};

const functionWords = [
  // Conjunctions
  "and", "but", "or", "nor", "for", "yet", "so", "either", "neither", "because", "although", "since", "unless",
  
  // Prepositions
  "in", "on", "at", "by", "for", "with", "about", "against", "between", "under", "over", "through", "during", 
  "before", "after", "to", "from", "up", "down", "inside", "outside", "beneath", "beyond", "upon", "within",
  
  // Pronouns
  "he", "she", "it", "they", "we", "you", "him", "her", "them", "us", "me", "this", "that", "these", "those",
  
  // Articles
  "the", "a", "an",
  
  // Be Verbs (Auxiliary Verbs)
  "is", "are", "am", "was", "were", "been", "being"
];



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


    const trainingData = [
      {input: createArrayFromString("The quick brown fox jumped over the lazy dog"), output: {Adjective: 1}},
{input: createArrayFromString("She felt incredibly happy after the success"), output: {Adjective: 1}},
{input: createArrayFromString("The sun rose slowly over the horizon"), output: {Adjective: 1}},
{input: createArrayFromString("The tiny mouse scurried across the floor"), output: {Adjective: 1}},
{input: createArrayFromString("The wind howled through the trees"), output: {Noun: 1}},
{input: createArrayFromString("He packed his suitcase in the morning"), output: {Noun: 1}},
{input: createArrayFromString("They sat at the table eating their breakfast"), output: {Noun: 1}},
{input: createArrayFromString("She found a wallet on the ground"), output: {Noun: 1}},
{input: createArrayFromString("I love to run in the park"), output: {Verb: 1}},
{input: createArrayFromString("He quickly ran to the store"), output: {Verb: 1}},
{input: createArrayFromString("They decided to leave early in the morning"), output: {Verb: 1}},
{input: createArrayFromString("She yelled for help in the dark"), output: {Verb: 1}},
{input: createArrayFromString("He walked through the muddy path"), output: {PTVerb: 1}},
{input: createArrayFromString("She laughed at the funny joke"), output: {PTVerb: 1}},
{input: createArrayFromString("They played in the yard all afternoon"), output: {PTVerb: 1}},
{input: createArrayFromString("John finished his work and went home"), output: {PTVerb: 1}},
{input: createArrayFromString("The dogs barked at the mailman"), output: {PNoun: 1}},
{input: createArrayFromString("The children were playing in the garden"), output: {PNoun: 1}},
{input: createArrayFromString("There were many birds flying in the sky"), output: {PNoun: 1}},
{input: createArrayFromString("The teachers gathered in the staff room"), output: {PNoun: 1}},
{input: createArrayFromString("The storm caused great damage to the houses"), output: {Adjective: 1}},
{input: createArrayFromString("A giant tree stood in the middle of the field"), output: {Adjective: 1}},
{input: createArrayFromString("He wore a green jacket and red boots"), output: {Adjective: 1}},
{input: createArrayFromString("The tiny bird flew away with ease"), output: {Adjective: 1}},
{input: createArrayFromString("She picked up the book from the table"), output: {Noun: 1}},
{input: createArrayFromString("A delicious cake was sitting on the counter"), output: {Noun: 1}},
{input: createArrayFromString("The old lamp flickered in the corner"), output: {Noun: 1}},
{input: createArrayFromString("He placed the vase carefully on the shelf"), output: {Noun: 1}},
{input: createArrayFromString("I love to dance in the rain"), output: {Verb: 1}},
{input: createArrayFromString("She runs faster than anyone else in the team"), output: {Verb: 1}},
{input: createArrayFromString("They studied for hours before the exam"), output: {Verb: 1}},
{input: createArrayFromString("He sleeps early every night"), output: {Verb: 1}},
{input: createArrayFromString("They visited the museum last weekend"), output: {PTVerb: 1}},
{input: createArrayFromString("She traveled to Paris last year"), output: {PTVerb: 1}},
{input: createArrayFromString("He finished his lunch before leaving the office"), output: {PTVerb: 1}},
{input: createArrayFromString("They played football until sunset"), output: {PTVerb: 1}},
{input: createArrayFromString("The monkeys jumped from tree to tree"), output: {PNoun: 1}},
{input: createArrayFromString("The students finished their assignments on time"), output: {PNoun: 1}},
{input: createArrayFromString("The fish swam in the tank"), output: {PNoun: 1}},
{input: createArrayFromString("The soldiers marched across the field"), output: {PNoun: 1}},
{input: createArrayFromString("She smiled brightly at the compliment"), output: {Adjective: 1}},
{input: createArrayFromString("The house was warm and inviting"), output: {Adjective: 1}},
{input: createArrayFromString("The sky turned dark as the storm approached"), output: {Adjective: 1}},
{input: createArrayFromString("Her laughter echoed in the hall"), output: {Adjective: 1}},
{input: createArrayFromString("The dog wagged its tail happily"), output: {Noun: 1}},
{input: createArrayFromString("He reached for the keys on the shelf"), output: {Noun: 1}},
{input: createArrayFromString("The phone rang loudly in the quiet room"), output: {Noun: 1}},
{input: createArrayFromString("I wrote a letter to my friend"), output: {Noun: 1}},
{input: createArrayFromString("They wanted to leave immediately"), output: {Verb: 1}},
{input: createArrayFromString("She shouted for help when she saw the fire"), output: {Verb: 1}},
{input: createArrayFromString("He raised his hand to ask a question"), output: {Verb: 1}},
{input: createArrayFromString("We need to clean the house before dinner"), output: {Verb: 1}},
{input: createArrayFromString("The teacher spoke loudly in the classroom"), output: {PTVerb: 1}},
{input: createArrayFromString("She completed her homework on time"), output: {PTVerb: 1}},
{input: createArrayFromString("He painted the wall last weekend"), output: {PTVerb: 1}},
{input: createArrayFromString("They traveled to London for the holidays"), output: {PTVerb: 1}},
{input: createArrayFromString("The flowers bloomed brightly in the garden"), output: {PNoun: 1}},
{input: createArrayFromString("The children played with their toys in the living room"), output: {PNoun: 1}},
{input: createArrayFromString("The birds chirped loudly in the morning"), output: {PNoun: 1}},
{input: createArrayFromString("The books are scattered on the table"), output: {PNoun: 1}},

    ];
    net.train(trainingData);

  

  
  textSize(32);
  textWrap(WORD);
  textAlign(LEFT, TOP);
}

function createArrayFromString(string) {
  let inputArray = [];
  inputArray = string.split('').map(char => char.charCodeAt(0));
  while (inputArray.length < 100) {
    inputArray.push(0);
  }
  return inputArray;
}

let maxLabel = "";
let maxValue = -Infinity;


// draw() function is called repeatedly, it's the main animation loop
function draw() {
  
  background(220);    
  // call a method on the instance
  myInstance.myMethod();
  
  let x = 20;
  let y = 100;
  
  for (let i = 0; i < typedText.length; i++) {
    if (i % 2 === 0) {
      fill(0);  // Regular color (black)
    } else {
      fill(255, 0, 0);  // Red color for every second letter
    }
    
    text(typedText[i], x, y);  // Draw each character
    
    x += textWidth(typedText[i]);  // Move x position for the next character
  }
}

function keyTyped() {
  if (key === " ") {
    let recentText = typedText.slice(-50);
    let recentWords = recentText.split(" ");
    let lastWord = recentWords.pop();
    typedText += " ";
    if (typedText.length > 20 && Math.random() < 0.5 && functionWords.includes(lastWord)) {
      let output = net.run(createArrayFromString(recentText));
      for (let label in output) {
        if (output[label] > maxValue) {
          maxValue = output[label];
          maxLabel = label;
        }
      }
      typedText += random(wordDictionary[maxLabel]) + " ";
    }
    return false;
  } else {
    typedText += key;
  }
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    typedText = typedText.slice(0, -1);
    return false;
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}