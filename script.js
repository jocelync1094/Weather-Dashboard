//all my jquery variables
var currentCity = $("<h2>");
var currentTemp = $("<h6>");
var currentHumid = $("<h6>");
var currentWindSpd = $("<h6>");
var currentUV = $("<h6>");
var city = ""

// click event of search

$(".btn").on("click", function (e) {

    event.preventDefault();
    city = $(".city-input").val();
    console.log(city);
    currentWeatherData(city);
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

        lat = citySearched.coord.lat;
        lon = citySearched.coord.lon;

        uvUrl = "http://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&cnt=1&appid=f7cd9e34cec45ab16fa8240fea00b0b7";

        $("#current-weather").append(currentCity);
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


