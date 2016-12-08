$(document).ready( () => {
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139', function (data) {
        console.log(data);
    });
});
