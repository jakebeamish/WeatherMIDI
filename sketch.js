let gui;

let temps, vals;

let tempsMin, tempsMax;
let valsMin, valsMax;

// Variables to use with GUI
var ampOffset = 0.0;
var ampOffsetMin = -1.0;
var ampOffsetMax = 1.0;
var ampOffsetStep = 0.001;

var amp = 1.0;
var ampMin = 0.0;
var ampMax = 2.0;
var ampStep = 0.001;

var steps = 168;
var stepsMin = 1;
var stepsMax = 168;

var stepsOffset = 0;
var stepsOffsetMin = 0;
var stepsOffsetMax = 168;


// Define clip function
const clamp = (min, max) => value => Math.max(Math.min(value, max), min);

// Location for weather data
const geolocation = {
  lat: 51.5002,
  lon: 0.1262
};

// Make API request URL
let url = 'https://api.open-meteo.com/v1/forecast?latitude=' + geolocation.lat + '&longitude=' + geolocation.lon + '&hourly=temperature_2m';

function preload() {
  weather = loadJSON(url);
}

function setup() {

  createCanvas(windowWidth, windowHeight);

  gui = createGui('Weather-Edit');
  gui.addGlobals('amp', 'ampOffset', 'steps', 'stepsOffset');


  // Make an array of values from temperature_2m (in degrees C)
  temps = weather.hourly.temperature_2m;


  // Only call draw() when GUI is changed
  noLoop();

}

function draw() {

  fill(0);
  clear();

  text(
    "Coordinates: " +
    geolocation.lat + ", " + geolocation.lon,
    width - 200, 20
  );

  tempsMin = Math.min(...temps);
  tempsMax = Math.max(...temps);


  // Draw temperature data as an evenly distributed set of points through time
  for (let i = 0; i <= temps.length; i++) {
    let x = i * (width / temps.length)
    strokeWeight(3)
    point(x, height / 3 - temps[i]);

  }

  text("Minimum: " + tempsMin + "ºC", 10, height / 3 + 30);

  text("Maximum: " + tempsMax + "ºC", 10, height / 3 - 30);


  // Map temperatures to values from 0–127 using minimum and maximum temperatures

  vals = temps.map(v => (v - tempsMin) * (127 / (tempsMax - tempsMin)));



  valsMin = Math.min(...vals);
  valsMax = Math.max(...vals);



  text(valsMin, 10, 2 * height / 3 + 13);
  text(valsMax, 10, 2 * height / 3 - 130);

  // Multiply values by amplitude parameter
  vals = vals.map(v => v * amp);

  // Attenuate values using ampOffset parameter
  vals = vals.map(v => v + (ampOffset * 127));

  // Limit values to 0–127
  vals = vals.map(clamp(0, 127))

  // Choose a portion of the array of values
  vals = vals.slice(stepsOffset, stepsOffset + steps - 1)




  // Draw manipulated data

  strokeWeight(1)

  // Draw upper & lower bounds
  line(0, 2 * height / 3, width, 2 * height / 3);
  line(0, 2 * height / 3 - 127, width, 2 * height / 3 - 127);

  noFill();
  beginShape();
  for (let j = 0; j <= vals.length; j++) {
    let x = j * (width / vals.length);
    strokeWeight(4)
    point(x, 2 * height / 3 - vals[j]);
    strokeWeight(1)
    vertex(x, 2 * height / 3 - vals[j]);
  }
  endShape();

}
