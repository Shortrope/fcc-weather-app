$(document).ready( () => {
    var location = $('.weather__location')[0],
        temp = $('.weather__temp')[0],
        sky = $('.weather__sky')[0],
        wind = $('.weather__wind')[0];

    var openWeatherData = 'http://api.openweathermap.org/data/2.5/weather?lat=32.79&lon=-117.19',
        myData = 'js/data.js',
        dataLocation = myData;
    
    $.getJSON(dataLocation, function (data) {
        console.log(data);
        $(location).html(data.name);
        $(temp).html(data.main.temp);
        $(sky).html(data.weather.main);
        $(wind).html(data.wind.speed);
    });
});
