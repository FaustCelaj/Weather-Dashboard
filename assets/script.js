// Define API key and elements from the HTML
const apiKey = "2fcc36041962140cb847a44a37c1797b";
const searchInput = document.getElementById('city-input');
const searchButton = document.querySelector('.btn');
const searchHistoryList = document.getElementById('search-history');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');

// Function to handle search submission
function handleSearch(event) {
    event.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        getCurrentWeather(city);
        getForecast(city);
        saveCityToLocalStorage(city);
        searchInput.value = ''; // Clear the input after search
    }
}

// Fetch current weather data
function getCurrentWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        });
}

// Fetch 5-day forecast data
function getForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        });
}

// Display current weather
function displayCurrentWeather(data) {
    const { name, main, weather, wind } = data;
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const currentDate = dayjs().format('MM/DD/YYYY');
    currentWeatherDiv.classList.add('card', 'bg-secondary', 'text-white');
    currentWeatherDiv.innerHTML = `
        <div class="card-body">
            <h2 class="card-title">${name} (${currentDate})<img src="${weatherIcon}" alt="${weather[0].description}" class="weather-icon"></h2>
            <p>Temperature: ${main.temp}°C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} km/h</p>
        </div>
    `;
}

// Display 5-day forecast
function displayForecast(data) {
    forecastDiv.innerHTML = ''; // Clear the row
    for (let i = 0; i < data.list.length; i += 8) { // Loop through the forecast data at 8 intervals for daily forecast
        const { dt, main, weather, wind } = data.list[i];
        const date = dayjs.unix(dt).format('MM/DD/YYYY');
        const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        const card = document.createElement('div');
        card.classList.add('col-md-2', 'mb-3');
        card.innerHTML = `
            <div class="card bg-secondary text-white">
                <div class="card-body">
                    <h5 class="card-title">${date}</h5>
                    <img src="${weatherIcon}" alt="${weather[0].description}" class="card-img-top weather-icon">
                    <p>Temp: ${main.temp}°C</p>
                    <p>Humidity: ${main.humidity}%</p>
                    <p>Wind: ${wind.speed} km/h</p>
                </div>
            </div>
        `;
        forecastDiv.appendChild(card);
    }
}

// Save searched city to local storage
function saveCityToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(cities));
        displaySearchHistory();
    }
}

// Display search history
function displaySearchHistory() {
    let cities = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryList.innerHTML = '';
    cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'bg-secondary', 'text-white');
        listItem.textContent = city;
        listItem.onclick = function() {
            getCurrentWeather(city);
            getForecast(city);
        };
        searchHistoryList.appendChild(listItem);
    });
}

// Event listeners
searchButton.addEventListener('click', handleSearch);
document.addEventListener('DOMContentLoaded', displaySearchHistory);
