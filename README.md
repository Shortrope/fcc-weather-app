# Local Weather App
## Free Code Camp project
- Data from openweathermap.org
- Need to add API key to the ajax call in getweather.js
    - add '&APPID={key}' to the ajax url
    - &APPID=18d1710c24bc4c6c3c198074e3a7e866
- Can only request info once every 10 min
    - The date/time and data of the last request are stored in local storage
    - if less than 10 min since last request use stored data
- Weather Icon url
  - http://openweathermap.org/img/w/10d.png
- Contiton group names  http://openweathermap.org/weather-conditions 
  - Thunderstorm  200
  - Drizzle 300
  - Rain 500
  - Snow  600
  - Atmosphere  700.. mist, smoke, haze, fog
  - Clear 800
  - Clouds 80x
  - Extreme 90x
  - Additional  9xx
