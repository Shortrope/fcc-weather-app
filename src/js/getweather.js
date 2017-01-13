'use strict';

(function () {

  function WeatherData(data) {
    this.condition = data.weather[0].main;
    this.description = data.weather[0].description;
    this.iconURL = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
    this.temp = data.main.temp;
    this.locationName = data.name;
    this.fahrenheit = data.main.temp + ' F';
    this.celsius = data.main.temp + ' C';
    this.windSpeed = data.wind.speed;
  }

  $(document).ready(function () {
    var location = $('.weather__location')[0],
        temp = $('.weather__temp')[0],
        sky = $('.weather__sky')[0],
        wind = $('.weather__wind')[0],
        icon = $('.weather__icon')[0];

    var openWeatherData = 'http://api.openweathermap.org/data/2.5/weather?APPID=18d1710c24bc4c6c3c198074e3a7e866&lat=34.03&lon=-118.14&units=imperial',
        myData = "weatherData/SerraMesaData.js",
        dataLocation = myData;

    $.getJSON(dataLocation, function (data) {
      console.log(JSON.stringify(data));
      var wData = new WeatherData(data);
      console.log('wData Obj:');
      console.log(wData);
      $(icon).attr({ 'src': wData.iconURL, 'alt': wData.description });
      $(location).html(wData.locationName);
      $(temp).html(wData.fahrenheit);
      $(sky).html(wData.description);
      $(wind).html(wData.windSpeed);
    });
  });
})();