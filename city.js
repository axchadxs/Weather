// Selecting DOM elements we'll need to interact with
const form = document.querySelector(".top-banner form");        // The search form
const input = document.querySelector(".top-banner input");      // The city input field
const msg = document.querySelector(".top-banner .msg");         // Message display element
const list = document.querySelector(".ajax-section .cities");   // Container for weather cards

// Your OpenWeatherMap API key
const apiKey = "7408bf298a7b96211051fc6d8e4efc79";

/**
 * Converts OpenWeatherMap icon codes to our custom icon file paths
 * OpenWeatherMap uses codes like '01d' where:
 * - First two characters (01-50) represent weather condition
 * - Last character (d/n) represents day or night
 */
function getCustomIconPath(iconCode) {
    // iconCode from API looks like: '01d' or '01n' where 'd' is day and 'n' is night
    const iconMap = {
        '01d': 'clear-day',     // clear sky day
        '01n': 'clear-night',   // clear sky night
        '02d': 'partly-cloudy-day',    // few clouds day
        '02n': 'partly-cloudy-night',  // few clouds night
        '03d': 'cloudy',        // scattered clouds day
        '03n': 'cloudy',        // scattered clouds night
        '04d': 'cloudy',        // broken clouds day
        '04n': 'cloudy',        // broken clouds night
        '09d': 'rain-day',          // shower rain day
        '09n': 'rain',          // shower rain night
        '10d': 'rain',          // rain day
        '10n': 'rain',          // rain night
        '11d': 'storm',  // thunderstorm day
        '11n': 'storm',  // thunderstorm night
        '13d': 'snow',          // snow day
        '13n': 'snow',          // snow night
        '50d': 'fog',           // mist day
        '50n': 'fog'            // mist night
    };
    
    const iconName = iconMap[iconCode] || 'clear-day'; // default to clear-day if icon code not found
    return `icons/${iconName}.gif`;
}

// Add event listener for form submission
form.addEventListener("submit", e => {
  e.preventDefault();  // Prevent the form from submitting traditionally
  const listItems = list.querySelectorAll(".ajax-section .city");  // Get existing weather cards
  const inputVal = input.value;  // Get the city name from input

  // Construct the API URL with the city name and your API key
  // Using imperial units for Fahrenheit temperatures
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;

  // Fetch weather data from OpenWeatherMap API
  fetch(url)
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
      // Destructure the needed data from the response
      const { main, name, sys, weather } = data;
      // Get the path for our custom weather icon
      const customIconPath = getCustomIconPath(weather[0]["icon"]);

      // Create a new weather card
      const li = document.createElement("li");
      li.classList.add("city");
      // Create the HTML for the weather card
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°F</sup></div>
        <figure>
          <img class="city-icon" src="${customIconPath}" alt="${weather[0]["description"]}">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      // Insert the weather card HTML
      li.innerHTML = markup;
      // Add the weather card to the page
      list.appendChild(li);
    })
    .catch(() => {
      // Show error message if the city isn't found
      msg.textContent = "Please search for a valid city using the format below";
    });

  // Reset the form for the next search
  msg.textContent = "";    // Clear any existing messages
  form.reset();           // Clear the input field
  input.focus();          // Put the cursor back in the input field
});