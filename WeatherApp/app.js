const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=&appid=";
const API_KEY = "fe087ba8540a7b9f3c1d9738e96188e7";

const cityNameInput = document.querySelector("#searchInput");

const searchButton = document.querySelector("#search-btn");
function attachEvents() {
  searchButton.addEventListener("click", displayWeather);
  document.addEventListener("keypress", (event) => {
    let keyCode = event.keyCode ? event.keyCode : event.which;

    if (keyCode === 13) {
      searchButton.click();
    }
  });
}

async function displayWeather() {
  const city = cityNameInput.value;
  cityNameInput.value = "";
  try {
    const weatherData = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${API_KEY}`
      )
    ).json();

    // CHANGE MAIN INFO

    const cityName = weatherData.name;
    const country = weatherData.sys.country;
    const temp = Math.round(weatherData.main.temp);
    const date = dateConverter(weatherData.dt);
    const time = timeConverter(weatherData.dt);
    const desc = weatherData.weather[0].description;
    const mainDesc = weatherData.weather[0].main;

    changeMainInfo(cityName, country, temp, date, time, desc, mainDesc);

    // CHAGNE ADDITIONIAL INFO

    const tempHigh = Math.round(weatherData.main.temp_max);
    const tempLow = Math.round(weatherData.main.temp_min);
    const wind = Math.round(weatherData.wind.speed);
    const humidity = weatherData.main.humidity;
    const sunrise = timeConverterHourAndMins(weatherData.sys.sunrise);
    const sunset = timeConverterHourAndMins(weatherData.sys.sunset);

    changeAdditionalInfo(tempHigh, tempLow, wind, humidity, sunrise, sunset);
  } catch (error) {
    alert("City not found");
  }
}

function changeMainInfo(
  cityName,
  country,
  temp,
  dateData,
  timeData,
  desc,
  mainDesc
) {
  const location = document.querySelector("#location h2");
  location.textContent = `${cityName}, ${country}`;

  const date = document.querySelector("#location p");
  date.textContent = dateData;

  const degree = document.querySelector("#degree");
  degree.textContent = temp;

  const description = document.querySelector("#desc");
  description.textContent = desc;

  const weatherIcon = document.querySelector("#weather-icon");
  changeWeatherIcon(mainDesc, desc, weatherIcon, timeData);
}
function changeAdditionalInfo(
  tempHigh,
  tempLow,
  wind,
  humidityData,
  sunriseData,
  sunsetData
) {
  const degreeHigh = document.querySelector("#degree-high");
  degreeHigh.textContent = tempHigh;

  const degreeLow = document.querySelector("#degree-low");
  degreeLow.textContent = tempLow;

  const windSpeed = document.querySelector("#wind");
  windSpeed.textContent = wind;

  const humidity = document.querySelector("#humidity");
  humidity.textContent = humidityData;

  const sunrise = document.querySelector("#sunrise");
  sunrise.textContent = sunriseData;

  const sunset = document.querySelector("#sunset");
  sunset.textContent = sunsetData;
}
function changeWeatherIcon(mainDesc, desc, weatherIcon, timeData) {
  if (mainDesc === "Clear") {
    const hours = Number(timeData.split(":").shift());
    if (hours > 6 && hours < 21) {
      weatherIcon.src = "Images/clear.png";
    } else {
      weatherIcon.src = "Images/full-moon.png";
    }
  } else if (mainDesc === "Drizzle") {
    weatherIcon.src = "Images/drizzle.png";
  } else if (mainDesc === "Rain") {
    if (desc === "light rain" || desc === "moderate rain") {
      weatherIcon.src = "Images/drizzle.png";
    } else {
      weatherIcon.src = "Images/rain.png";
    }
  } else if (mainDesc === "Clouds") {
    if (desc === "few clouds") {
      weatherIcon.src = "Images/mist.png";
    } else {
      weatherIcon.src = "Images/clouds.png";
    }
  } else if (mainDesc === "Snow") {
    weatherIcon.src = "Images/snow.png";
  } else if (mainDesc === "Thunderstorm") {
    weatherIcon.src = "Images/storm.png";
  }
}
function timeConverter(UNIX_timestamp) {
  let unix_timestamp = UNIX_timestamp;
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  var formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  return formattedTime;
}
function timeConverterHourAndMins(UNIX_timestamp) {
  let unix_timestamp = UNIX_timestamp;
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  var formattedTime;

  if (hours >= 0 && hours <= 9) {
    formattedTime = "0" + hours + ":" + minutes.substr(-2);
  } else {
    formattedTime = hours + ":" + minutes.substr(-2);
  }

  return formattedTime;
}
function dateConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + "/" + month + "/" + year;
  var weekDay = getDayName(time, "en");
  return `${weekDay} ${date} ${month}`;
}
function getDayName(dateStr, locale) {
  var date = new Date(dateStr);
  return date.toLocaleDateString(locale, { weekday: "long" });
}

attachEvents();
