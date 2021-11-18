var timeEl = document.getElementById('time');
var dateEl = document.getElementById('date');
var currentWeatherItemsEl = document.getElementById('weather-condition');
var timezone = document.getElementById('time-zone');
var countryEl = document.getElementById('country');
var weatherForcastEl = document.getElementById('forcast-by-day');
var currentTempEl = document.getElementById('current-temp');

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var API_KEY = '16c03c8a01cdf5ac8cde4d7f84133036';


setInterval(() => {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth();
    var date = time.getDate();
    var day = time.getDay();
    var hour = time.getHours();
    var hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    var minutes = time.getMinutes();
    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + '' + `<span id="am-pm">${hour >= 12 ? ' PM' : ' AM'}</span>`;
    dateEl.innerHTML = days[day] + ', ' + (date < 10 ? '0' + date : date) + ' ' + months[month] + ', ' + year
}, 1000)
navigator.geolocation.getCurrentPosition((success) => {        // if success then what happen is shown by =>
    //console.log(success);

    let { latitude, longitude } = success.coords;
    getWeatherData(latitude, longitude)
})

function getWeatherData(latitude, longitude) {


    // call the weather API
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
        // create and call showWeatherData function and pass the data
        showWeatherData(data);
    })

}
function showWeatherData(data) {
    let { temp, sunrise, sunset, humidity, pressure, wind_speed, clouds, uvi } = data.current;
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N' + data.lon + 'E'


    currentWeatherItemsEl.innerHTML =

        `<div class="weather-item">
                <div>Temperature:</div>
                <div>${temp}</div>
            </div>
            <div class="weather-item">
                <div>Sunrise:</div>
                <div>${window.moment(sunrise * 1000).format('hh:mm:ss a')}</div>
            </div>
            <div class="weather-item">
                <div>Sunset:</div>
                <div>${window.moment(sunset * 1000).format('hh:mm:ss a')}</div>
            </div>
            <div class="weather-item">
                <div>Humidity:</div>
                <div>${humidity}%</div>
            </div>
            <div class="weather-item">
                <div>Pressure:</div>
                <div>${pressure}</div>
            </div>
            <div class="weather-item">
                <div>Wind Speed:</div>
                <div>${wind_speed}</div>
            </div>
            
            <div class="weather-item">
                <div>UV Index:</div>
                <div>${uvi}</div>
            </div>
            <div class="weather-item">
                <div>Cloud:</div>
                <div>${clouds}</div>
            </div>` ;
    // For each day Forcast
    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        var displayToday = window.moment(day.dt * 1000).format('ddd')
        if (idx == 0) {
            displayToday = "Today"
            currentTempEl.innerHTML = `
                    <div class="today" id="current-temp">
                    <div class="today-update">
                        <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">                        
                        <div class="day">${window.moment(day.dt * 1000).format('hh-mm-dddd')}</div>
                    </div> 
                    <div class="temp">Night - ${day.temp.night}#176; F</div>
                        <div class="temp">Day - ${day.temp.day}#176; F</div>
                </div>`

        }
        otherDayForcast +=       //+= means string concatination
            `<div class="weather-forcast-item">
                        <div class="day">${displayToday}</div>
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                        <div class="temp">Night - ${day.temp.night}&#176; F</div>
                        <div class="temp">Day - ${day.temp.day}&#176; F</div>
                    </div>`

    })
    weatherForcastEl.innerHTML = otherDayForcast;
}

// For Search options

// Entering city - where I want the weather details variable
var searchInput = document.getElementById('city_input');
// search button variable
var searchButton = document.getElementById('search_btn');
// event listener for giving the input
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(searchInput.value) //just to check if the system is OK after this code change
    // fetching with the weather API for search city
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${API_KEY}`)
        .then(res => res.json()).then(data => {   // to get the output in JSON format
            console.log(data) // to check if the code works upto this
            getWeatherData(data.coord.lat, data.coord.lon) // coord I got from consol the property path for lat and lon and copied and paste
            // to get element for current city   
            document.getElementById('current-city').innerText = data.name
        })
    // Get item - by city and store in Local storage. If there is no city in storage
    // it will start new and store in array
    var cities = JSON.parse(localStorage.getItem("City Name")) || []
    // to set the city history within 10 or less
    if (cities.length >= 10) {
        cities.shift()   // shift will erase the old city and add new if more than 10
    }
    cities.push(searchInput.value)
    console.log(cities)
    // setting the local storage
    localStorage.setItem("City Name", JSON.stringify(cities))
    // to identify the city history place holders.
    var cityHistory = document.getElementById('city-history')
    cityHistory.innerHTML = ''
    for (var i = 0; i < cities.length; i++) {

        cityHistory.innerHTML += '<div class="city-1" id="city-one" placeholder = "City1">' + cities[i] + '</div>'
    }


})
