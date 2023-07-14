const apiKey = '8ee559088485d1bc8cfb2f0f9c85ef9c';
const apiUrl = 'https://api.openweathermap.org/data/2.5';

document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var cityInput = document.getElementById('cityInput');
  var city = cityInput.value.trim();
  if (city !== '') {
    getWeather(city);
    cityInput.value = '';
  }
});

function convertToFarhenheit(tempInKelvin) {
  return ((tempInKelvin - 273.15) * 9/5) + 32;
}

function convertToMPH(windSpeedMps) {
  return windSpeedMps * 2.23694;
}

function displayForecast(data) {
  var forecastList = data.list;
  var forecastSection = document.getElementById('forecast');
  forecastSection.innerHTML = '';

  var currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  var filteredForecast = forecastList.filter(function (forecastItem) {
    var forecastDate = new Date(forecastItem.dt * 1000);
    forecastDate.setHours(0, 0, 0, 0);
    return forecastDate.getDate() !== currentDate.getDate();
  }).slice(0, 5);

  var forecastRow = document.createElement('div');
  forecastRow.classList.add('forecast-row');

  filteredForecast.forEach(function (forecastItem, index) {
    var date = new Date();
    date.setDate(currentDate.getDate() + index + 1);
    var icon = forecastItem.weather[0].icon;
    var temperatureKelvin = forecastItem.main.temp;
    var temperatureFahrenheit = Math.round(((temperatureKelvin - 273.15) * 9 / 5) + 32);
    var humidity = forecastItem.main.humidity;
    var windSpeedMps = forecastItem.wind.speed;
    var windSpeedMph = convertToMPH(windSpeedMps);

    var forecastItemElement = document.createElement('div');
    forecastItemElement.classList.add('forecast-item');
    forecastItemElement.innerHTML = `
      <p>Date: ${date.toLocaleDateString()}</p>
      <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
      <p>Temperature: ${temperatureFahrenheit} &#8457;</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeedMph.toFixed(2)} mph</p>
    `;

    forecastRow.appendChild(forecastItemElement);
  });

  forecastSection.appendChild(forecastRow);
}

function displayCurrentWeather(data) {
  var city = data.name;
  var date = new Date(data.dt * 1000);
  var icon = data.weather[0].icon;
  var temperatureKelvin = data.main.temp;
  var temperatureFahrenheit = convertToFarhenheit(temperatureKelvin);
  var humidity = data.main.humidity;
  var windSpeedMps = data.wind.speed;
  var windSpeedMph = convertToMPH(windSpeedMps);

  var currentWeatherSection = document.getElementById('currentWeather');
  currentWeatherSection.innerHTML = `
    <h2>${city} (${date.toLocaleDateString()})</h2>
    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
    <p>Temperature: ${temperatureFahrenheit.toFixed(2)} &#8457;</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeedMph.toFixed(2)} mph</p>
  `;
  currentWeatherSection.style.display = 'block';
}

function getWeather(city) {
  var currentWeatherUrl = `${apiUrl}/weather?q=${city}&appid=${apiKey}`;
  var forecastUrl = `${apiUrl}/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      addSearchHistory(city);
      document.getElementById('currentWeather').classList.add('bordered');
    })
    .catch(error => {
      console.log('Error:', error);
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function addSearchHistory(city) {
  var searchHistory = document.getElementById('searchHistory');
  var searchItem = document.createElement('div');
  searchItem.classList.add('search-item');
  searchItem.textContent = city;
  searchItem.addEventListener('click', function() {
    getWeather(city);
  });

  searchHistory.appendChild(searchItem);
}