const form = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#city");
const report = document.querySelector(".report");
const apikey = "3f422d8390f8ed529100d3689379158f";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  const conversionType = document.querySelector('input[name="one"]:checked')
    ? document.querySelector('input[name="one"]:checked').value
    : "celsius";

  if (city) {
    getWeatherData(city, conversionType);
  } else {
    displayError("Please Enter A City!");
  }
});

async function getWeatherData(city, conversionType) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`
    );
    const data = await response.json();

    if (data.cod === 200) {
      displayWeatherInfo(data, conversionType);
    } else {
      displayError(data.message);
    }
  } catch (error) {
    displayError("Unable to retrieve weather data.");
  }
}

function displayWeatherInfo(data, conversionType) {
  const {name, main, weather} = data;
  const weatherId = weather[0].id;
  const weatherEmoji = getWeatherEmoji(weatherId);

  let temp = main.temp;
  let tempUnit = "°C";

  if (conversionType === "fahrenheit") {
    temp = (temp * 9) / 5 + 32;
    tempUnit = "°F";
  }

  report.innerHTML = `
        <h1 class="citydisplay">${name}</h1>
        <p class="tempdisplay">${temp.toFixed(1)}${tempUnit}</p>
        <div class="weatherEmoji">${weatherEmoji}</div>
        <p class="descdisplay">${weather[0].description}</p>
        <p class="humidity">Humidity: ${main.humidity}%</p>
    `;
  report.style.display = "flex";
}

function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) {
    return "⛈️";
  } else if (weatherId >= 300 && weatherId < 500) {
    return "🌧️";
  } else if (weatherId >= 500 && weatherId < 600) {
    return "🌦️";
  } else if (weatherId >= 600 && weatherId < 700) {
    return "❄️";
  } else if (weatherId >= 700 && weatherId < 800) {
    return "🌫️";
  } else if (weatherId === 800) {
    return "☀️";
  } else if (weatherId > 800) {
    return "☁️";
  } else {
    return "❓";
  }
}

function displayError(msg) {
  report.innerHTML = `<p class="errordisplay">${msg}</p>`;
  report.style.display = "flex";
}
