/* DOM element selection */
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

/* OpenWeatherMap API key */
const apiKey = "7408bf298a7b96211051fc6d8e4efc79";

/* Converts OpenWeatherMap icon codes to custom icon paths */
function getCustomIconPath(iconCode) {
    const iconMap = {
        '01d': 'clear-day',
        '01n': 'clear-night',
        '02d': 'partly-cloudy-day',
        '02n': 'partly-cloudy-night',
        '03d': 'cloudy',
        '03n': 'cloudy',
        '04d': 'cloudy',
        '04n': 'cloudy',
        '09d': 'rain-day',
        '09n': 'rain',
        '10d': 'rain',
        '10n': 'rain',
        '11d': 'storm',
        '11n': 'storm',
        '13d': 'snow',
        '13n': 'snow',
        '50d': 'fog',
        '50n': 'fog'
    };
    
    const iconName = iconMap[iconCode] || 'clear-day';
    return `icons/${iconName}.gif`;
}

/* Handle weather search form submission */
form.addEventListener("submit", e => {
  e.preventDefault();

  const listItems = list.querySelectorAll(".ajax-section .city");
  const inputVal = input.value;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Weather Data:', data);
      
      const { main, name, sys, weather, wind, visibility } = data;
      const customIconPath = getCustomIconPath(weather[0]["icon"]);

      const li = document.createElement("li");
      li.classList.add("city");

      /* Convert Unix timestamps to 12-hour time format */
      const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      /* Convert wind degrees to cardinal directions */
      const getWindDirection = (degrees) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
      };
      /* Build weather card HTML with city name, temperature, weather details, and sunrise/sunset times */
      const markup = `
        <div class="weather-card">
          <div class="left-content">
            <h2 class="city-name" data-name="${name},${sys.country}">
              <span>${name}</span>
              <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°F</sup></div>
            <div class="weather-details">
              <span class="details">${weather[0]["description"]}</span>
            </div>
          </div>
          <figure class="weather-icon">
            <img class="city-icon" src="${customIconPath}" alt="${weather[0]["main"]}">
          </figure>
        </div>
              <span class="detail">Humidity: ${main.humidity}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Wind:</span>
              <span class="detail-value">${Math.round(wind.speed)} mph ${getWindDirection(wind.deg)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-value">High: ${Math.round(main.temp_max)}°F   Low: ${Math.round(main.temp_min)}°F</span>
            </div> 
          </div>
          <div class="sun-times">
            <div class="sunrise">
              <span class="sun-label">Sunrise</span>
              <span class="sun-value">${sunriseTime}</span>
            </div>
            <div class="sunset">
              <span class="sun-label">Sunset</span>
              <span class="sun-value">${sunsetTime}</span>
            </div>
          </div>
        </div>
      `;
      
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city using the format below";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});