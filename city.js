/* Weather App JavaScript
–––––––––––––––––––––––––––––––––––––––––––––––––– */

/* DOM Element Selection
   - Selects all necessary elements we'll need to manipulate
   - Uses specific class selectors for precise targeting */
const form = document.querySelector(".top-banner form");        // Search form element
const input = document.querySelector(".top-banner input");      // City input field
const msg = document.querySelector(".top-banner .msg");         // Error/status message container
const list = document.querySelector(".ajax-section .cities");   // Weather cards container

/* API Configuration
   - OpenWeatherMap API key for authentication
   - Required for all API requests */
const apiKey = "7408bf298a7b96211051fc6d8e4efc79";

/* Weather Icon Mapping
   - Converts OpenWeatherMap icon codes to custom GIF icons
   - Handles both day and night variations
   - Format: '01d' where:
     * 01-50: Weather condition code
     * d/n: Day or night indicator */
/**
 * Converts OpenWeatherMap icon codes to custom icon file paths
 * @param {string} iconCode - The weather icon code from OpenWeatherMap API (e.g., '01d')
 * @returns {string} Path to the corresponding custom GIF icon
 */
function getCustomIconPath(iconCode) {
    // Mapping of API weather codes to custom icon filenames
    const iconMap = {
        // Clear Weather
        '01d': 'clear-day',           // Clear sky - day
        '01n': 'clear-night',         // Clear sky - night
        
        // Partly Cloudy
        '02d': 'partly-cloudy-day',   // Few clouds - day
        '02n': 'partly-cloudy-night', // Few clouds - night
        
        // Cloudy Conditions
        '03d': 'cloudy',              // Scattered clouds - day
        '03n': 'cloudy',              // Scattered clouds - night
        '04d': 'cloudy',              // Broken clouds - day
        '04n': 'cloudy',              // Broken clouds - night
        
        // Rain
        '09d': 'rain-day',            // Shower rain - day
        '09n': 'rain',                // Shower rain - night
        '10d': 'rain',                // Rain - day
        '10n': 'rain',                // Rain - night
        
        // Thunderstorms
        '11d': 'storm',               // Thunderstorm - day
        '11n': 'storm',               // Thunderstorm - night
        
        // Snow
        '13d': 'snow',                // Snow - day
        '13n': 'snow',                // Snow - night
        
        // Atmospheric Conditions
        '50d': 'fog',                 // Mist/fog - day
        '50n': 'fog'                  // Mist/fog - night
    };
    
    // Get the icon name from map or fallback to clear-day
    const iconName = iconMap[iconCode] || 'clear-day';
    // Return the complete path to the GIF file
    return `icons/${iconName}.gif`;
}

/* Event Listeners
–––––––––––––––––––––––––––––––––––––––––––––––––– */

/**
 * Handle form submission for weather search
 * - Prevents default form submission
 * - Fetches weather data from OpenWeatherMap API
 * - Creates and displays weather card with results
 */
form.addEventListener("submit", e => {
  // Prevent traditional form submission
  e.preventDefault();

  // Get current weather cards and input value
  const listItems = list.querySelectorAll(".ajax-section .city");
  const inputVal = input.value;

  // Construct API URL with:
  // - City name from input
  // - API key for authentication
  // - Imperial units for Fahrenheit temperatures
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;

  // Fetch and process weather data
  fetch(url)
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
      // Log data for debugging and development
      console.log('Weather Data:', data);
      
      /* Data Processing
         - Extract relevant weather data
         - Convert timestamps and measurements
         - Prepare data for display */
      
      // Destructure API response for needed values
      const { main, name, sys, weather, wind, visibility } = data;
      
      // Get appropriate weather icon
      const customIconPath = getCustomIconPath(weather[0]["icon"]);

      // Create new card container
      const li = document.createElement("li");
      li.classList.add("city");

      /* Time Conversions
         - Convert Unix timestamps to readable 12-hour format
         - Format: HH:MM AM/PM */
      const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      /**
       * Converts wind degrees to cardinal directions
       * @param {number} degrees - Wind direction in degrees
       * @returns {string} Cardinal direction (N, NNE, NE, etc.)
       */
      const getWindDirection = (degrees) => {
        // Array of 16 cardinal directions
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        // Convert degrees to array index (0-15)
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
      };

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
      /* DOM Updates
         - Insert the weather card
         - Handle any errors
         - Reset form for next search */
      
      // Add the weather card HTML to the container
      li.innerHTML = markup;
      // Insert the new card into the document
      list.appendChild(li);
    })
    .catch(() => {
      // Display user-friendly error message
      msg.textContent = "Please search for a valid city using the format below";
    });

  /* Form Reset
     - Clear error messages
     - Reset input field
     - Return focus to input */
  msg.textContent = "";    // Remove any existing messages
  form.reset();           // Clear the form
  input.focus();          // Focus cursor in input field
});