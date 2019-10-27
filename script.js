//all my jquery variables
var currentCity = $("<h2>");
var currentIcon = $("<img>");
var currentTemp = $("<h6>");
var currentHumid = $("<h6>");
var currentWindSpd = $("<h6>");
var currentUV = $("<h6>");
var city = ""

var fiveDayHeader = $("<h2>"+"5-Day Forecast:"+"</h2>");

// click event of search

var searchHistory = [];

$(".btn").on("click", function (e) {

    event.preventDefault();
    city = $(".city-input").val();
    console.log(city);
    currentWeatherData(city);
    $("#current-weather").attr("style", "border: 1px solid lightgray; padding:10px")
    forecastWeather(city);

    searchHistory.push(city);
    city="";
    localStorage.setItem("cityChosen", JSON.stringify(searchHistory));

})


//getting current city data

function currentWeatherData(city) {
    var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&apikey=f7cd9e34cec45ab16fa8240fea00b0b7"
    var uvUrl = "";
    var lat = "";
    var lon = "";

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (citySearched) {

        currentCity.text(citySearched.name + " (" + moment().format('L') + ")");
        currentTemp.text("Temperature: " + citySearched.main.temp + " C");
        currentHumid.text("Humidity: " + citySearched.main.humidity + "%");
        currentWindSpd.text("Wind Speed: " + citySearched.wind.speed + " MPH");

        var wicon = citySearched.weather[0].icon
        console.log("wicon: ",wicon);
        var iconUrl = "http://openweathermap.org/img/w/" + wicon + ".png";
        currentIcon.attr("src",iconUrl);
        currentIcon.attr("alt","Weather Icon");


        lat = citySearched.coord.lat;
        lon = citySearched.coord.lon;

        uvUrl = "http://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&cnt=1&appid=f7cd9e34cec45ab16fa8240fea00b0b7";

        $("#current-weather").append(currentCity);
        $("#current-weather").append(currentIcon);
        $("#current-weather").append(currentTemp);
        $("#current-weather").append(currentHumid);
        $("#current-weather").append(currentWindSpd);

        $.ajax({
            method: 'GET',
            url: uvUrl
        }).then(function (citySearched) {
            currentUV.text("UV Index: " + citySearched.value);
            $("#current-weather").append(currentUV);
        });


    })
}


// getting the 5 day forecast
function forecastWeather(city){
var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=f7cd9e34cec45ab16fa8240fea00b0b7&units=metric";
var forecastObjectIndexEachDay =[0,7,15,23,31];
$(".future-weather").empty();
$.ajax({
    url:forecastUrl,
    method:"GET"
}).then(function(citySearched){
    console.log(citySearched);
    $("#fivedayheader").append(fiveDayHeader);

    for (var i=0;i<5;i++){
        console.log("this is index", i);
        var forecastDate = $("<h6>");
        var forecastIcon = $("<img>");
        var forecastTemp =$("<h6>");
        var forecastHumid=$("<h6>");
        var dt = citySearched.list[forecastObjectIndexEachDay[i]].dt_txt;
        dt = dt.substr(0,dt.indexOf(' '));
        console.log(dt);
        forecastDate.text(dt);

        var wicon = citySearched.list[forecastObjectIndexEachDay[i]].weather[0].icon
        var iconUrl = "http://openweathermap.org/img/w/" + wicon + ".png";

        forecastIcon.attr("src",iconUrl);
        forecastIcon.attr("alt","Weather Icon");

        forecastTemp.text("Temp: " + citySearched.list[forecastObjectIndexEachDay[i]].main.temp +"C");
        forecastHumid.text("Humidity: " + citySearched.list[forecastObjectIndexEachDay[i]].main.humidity +"%");
       
        $(".day"+i).append(forecastDate);
        $(".day"+i).append(forecastIcon);
        $(".day"+i).append(forecastTemp);
        $(".day"+i).append(forecastHumid);
    }
    
})
}

function getStoredCities() {
  
    var storedCities = JSON.parse(localStorage.getItem("cityChosen"));
  
    if (storedCities !== null) {
      searchHistory = storedCities;
    }
  
    renderStoredCities();
}

function renderStoredCities() {

    for (var i = 0; i <searchHistory.length; i++) {
      var city = searchHistory[i];
  
      var a = $("<a>");
      a.text(city);
      a.attr("href","#");
      a.attr("data-value",city);
      a.addClass("list-group-item list-group-item-action");
      
      $(".list-group").append(a)
    }

  }

  getStoredCities();

// when the searched cities are clicked on the weather information is displayed

$("a").on("click",function (){
    var cityClicked = $(this).attr("data-value");
    console.log(cityClicked);

    currentWeatherData(cityClicked);
    $("#current-weather").attr("style", "border: 1px solid lightgray; padding:10px")
    forecastWeather(cityClicked);

})