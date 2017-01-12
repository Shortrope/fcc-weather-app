$(document).ready( () => {
    let location = $('.weather__location')[0],
        temp = $('.weather__temp')[0],
        sky = $('.weather__sky')[0],
        wind = $('.weather__wind')[0];

    const openWeatherData = 'http://api.openweathermap.org/data/2.5/weather?APPID=18d1710c24bc4c6c3c198074e3a7e866&lat=32.79&lon=-117.19&units=imperial',
    myData = "weatherData/sunnyData.js",
        dataLocation = myData;
    
  $.getJSON(dataLocation, (data) => {
        console.log(data);
        $(location).html(data.name);
        $(temp).html(data.main.temp);
        $(sky).html(data.weather.main);
        $(wind).html(data.wind.speed);
    });
});
