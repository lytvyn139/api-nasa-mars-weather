/*
1. fetch date form API in getWeather())
2. displaySelectedSol, change html, create vars
3. write functions
     displayDate() to shorten date format
     displayTemperature() round the temp
     displaySpeed() round the speed
4. build template in HTML for bottom data footer
5. write function that will display previous sols
6. make toggle button work
7. converte units
*/
const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;
//https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0

let selectedSolIndex;
const previousWeatherToggle = document.querySelector(".show-previous-weather");
const previousWeather = document.querySelector(".previous-weather");
//main sols
const currentSolElement = document.querySelector("[data-current-sol]");
const currentDateElement = document.querySelector("[data-current-date]");
const currentTempHighElement = document.querySelector(
  "[data-current-temp-high]"
);
const currentTempLowElement = document.querySelector("[data-current-temp-low]");
const windSpeedElement = document.querySelector("[data-wind-speed]");
const windDirectionArrow = document.querySelector(
  "[data-wind-direction-arrow]"
);
const windDirectionText = document.querySelector("[data-wind-direction-text]");
//bottom sols
const previousSolTemplate = document.querySelector(
  "[data-previous-sol-template]"
);
const previousSolContainer = document.querySelector("[data-previous-sols]");
//toggle button
const unitToggle = document.querySelector("[data-unit-toggle]");
const metricRadio = document.getElementById("cel");
const imperialRadio = document.getElementById("fah");

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});

getWeather().then(sols => {
  selectedSolIndex = sols.length - 1; // will give the last index of array -1
  displaySelectedSol(sols);
  displayPreviousSols(sols);
  updateUnits();

  unitToggle.addEventListener("click", () => {
    let metricUnits = !isMetric();
    metricRadio.checked = metricUnits;
    imperialRadio.checked = !metricUnits;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });

  metricRadio.addEventListener("change", () => {
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });

  imperialRadio.addEventListener("change", () => {
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });
  console.log(sols);
});

function getWeather() {
  return fetch(API_URL)
    .then(res => res.json()) //convert respond to JSON
    .then(data => {
      const {
        sol_keys,
        validity_checks, 
        ...solData //will take everyting in 451,452,452
      } = data;
      console.log(data);
      //const temp = Object.entries(solData).map(([sol, data]) => {
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS.av,
          windDirectionDegrees: data.WD.most_common.compass_degrees,
          windDirectionCardinal: data.WD.most_common.compass_point,
          date: new Date(data.First_UTC)
        };
      });
      //console.log(temp)
    });
}




function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIndex];
  currentSolElement.innerHTML = selectedSol.sol;
  currentDateElement.innerHTML = displayDate(selectedSol.date);
  currentTempHighElement.innerHTML = displayTemperature(selectedSol.maxTemp);
  currentTempLowElement.innerHTML = displayTemperature(selectedSol.minTemp);
  windSpeedElement.innerHTML = displaySpeed(selectedSol.windSpeed);
  windDirectionArrow.style.setProperty(
    "--direction",
    `${selectedSol.windDirectionDegrees}deg`
  );
  windDirectionText.innerHTML = selectedSol.windDirectionCardinal;
}

function displayDate(date) {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long" });
}

function displayTemperature(temperature) {
  let returnTemp = temperature;
  if (!isMetric()) {
    returnTemp = (temperature - 32) * (5 / 9);
  }
  return Math.round(returnTemp);
}

function displaySpeed(speed) {
  let returnSpeed = speed;
  if (!isMetric()) {
    returnSpeed = speed / 1.609;
  }
  return Math.round(returnSpeed);
}

function displayPreviousSols(sols) {
  previousSolContainer.innerHTML = "";
  sols.forEach((solData, index) => {
    const solContainer = previousSolTemplate.content.cloneNode(true);
    solContainer.querySelector("[data-sol]").innerText = solData.sol;
    console.log('this will popup in the middled of random func');
    solContainer.querySelector("[data-date").innerText = displayDate(
      solData.date
    );
    solContainer.querySelector(
      "[data-temp-high"
    ).innerText = displayTemperature(solData.maxTemp);
    solContainer.querySelector("[data-temp-low").innerText = displayTemperature(
      solData.minTemp
    );
    solContainer
      .querySelector("[data-select-button")
      .addEventListener("click", () => {
        selectedSolIndex = index;
        displaySelectedSol(sols);
      });
    previousSolContainer.appendChild(solContainer);
  });
}

function updateUnits() {
  const speedUnits = document.querySelectorAll("[data-speed-unit]");
  const tempUnits = document.querySelectorAll("[data-temp-unit]");
  speedUnits.forEach(unit => {
    unit.innerText = isMetric() ? "kph" : "mph";
  });
  tempUnits.forEach(unit => {
    unit.innerText = isMetric() ? "C" : "F";
  });
}

function isMetric() {
  return metricRadio.checked;
}
console.log('the end');


