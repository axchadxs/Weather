const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "7408bf298a7b96211051fc6d8e4efc79";

// Function to get custom icon path based on weather condition and time of day
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

form.addEventListener("submit", e => {
  e.preventDefault();
  const listItems = list.querySelectorAll(".ajax-section .city");
  const inputVal = input.value;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const customIconPath = getCustomIconPath(weather[0]["icon"]);

      const li = document.createElement("li");
      li.classList.add("city");
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