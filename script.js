//title searched by user
let searchValue = document.getElementById("searchValue");

//search input box where user search new city
let cityName = document.getElementById("cityName");

//add favourite city or nearest city which are you most of times search
let setBtn = document.getElementById("set");

//header of tempreture in degree celcius °C
let tempreture = document.getElementById("tem");

//start details more
let feelsLike = document.getElementById("feelsLike");

let humidity = document.getElementById("humidity");

let wind = document.getElementById("wind");

let pressure = document.getElementById("pressure");

let visibility = document.getElementById("visibility");

let highTemp = document.getElementById("highTemp");


//sunrise and sunset time set
let sunrise = document.getElementById("srt");
let sunset = document.getElementById("sst");



let weather = document.getElementById("weather");

// start logic
cityName.addEventListener("input", () => {
  fetchWeather(cityName.value.trim());
})

async function fetchWeather(city) {
  //api key
  const apiKey = 'd7647def1fbdf2943ec3fa9f888c58ff';
  //url
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=metric`;
  try {
    let response = await fetch(url);
    let data = await response.json();
    if (data.cod === 200) {
      searchValue.innerHTML = `${data.name},${data.sys.country}`;
      tempreture.innerHTML = `${Math.floor(data.main.temp)}°`;
      if (data.weather[0].main === "Clouds") {
        weather.innerHTML = `${data.weather[0].main} <i class="fa-solid fa-cloud"></i>`;
      } else if (data.weather[0].main === "Rain") {
        weather.innerHTML = `${data.weather[0].main} <i class="fa-solid fa-cloud-rain"></i>`;
      } else if (data.weather[0].main === "Clear") {
        weather.innerHTML = `${data.weather[0].main} <i class="fa-solid fa-sun"></i>`;
      }
      else {
        weather.innerHTML = "Unable to find weather status!"
      }
      feelsLike.innerHTML = `${Math.ceil(data.main.feels_like- 2)} °`;
      humidity.innerHTML = `${data.main.humidity + 6} %`;
      wind.innerHTML = `${Math.floor(data.wind.speed)+4} mph`;
      pressure.innerHTML = `${data.main.pressure} hPa`;
      visibility.innerHTML = `${Math.floor(data.visibility/1000)} km`;
      highTemp.innerHTML = `${Math.ceil(data.main.temp_max)} °` || 0 + "°";
      
      let sunriseUnix = data.sys.sunrise;
      let sunsetUnix = data.sys.sunset;
      let sunriseTime = new Date(sunriseUnix * 1000);
      let sunsetTime = new Date(sunsetUnix * 1000);
      
      let timeString = sunriseTime.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      let timeStringS = sunsetTime.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      sunrise.innerHTML = timeString;
      sunset.innerHTML = timeStringS;
    }
  } catch (err) {
    console.log(err)
  }
}

function getUserLoaction() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(getLocation, getError)
  } else {
    alert("Unable to fetch location please make sure your location must be enable");
  }
}

function getLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  fetch(url, { headers: { 'User-Agent': 'MySite/1.0' } }).then(res => res.json()).then(data => {
    let c = data.address.city || data.address.town || data.address.village || "Unknown";
    cityName.value = c.trim();
    fetchWeather(cityName.value);
  }).catch(err => alert(`Unable to catch, ${err.message}`))
}

function getError(error) {
  navigator.vibrate(500);
  alert("unable to fetch your location!, please turn on your location (GPS)!");
}

setBtn.addEventListener("click", () => {
  getUserLoaction()
})

let current = document.getElementById("current");
setInterval(() =>{
  let timing = new Date();
  current.innerHTML = `<strong>Time: </strong> ${String(timing.getHours()).padStart(2,"0")}:${String(timing.getMinutes()).padStart(2,"0")}:${String(timing.getSeconds()).padStart(2,"0")}`;
},1000)
