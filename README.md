# Local Weather App
## Free Code Camp project
- Data from openweathermap.org
- Need to add API key to the ajax call in getweather.js
    - add '&APPID={key}' to the ajax url
    - &APPID=18d1710c24bc4c6c3c198074e3a7e866
- Can only request info once every 10 min
    - The date/time and data of the last request are stored in local storage
    - if less than 10 min since last request use stored data
