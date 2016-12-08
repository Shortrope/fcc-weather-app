# Free Code Camp project: 
## Local Weather App
- Data from openweathermap.org
- Need to add API key to the ajax call in getweather.js
    - add '&APPID={key}' to the ajax url
- Can only request info once every 10 min
    - The last request date/time is stored in local storage
    - The last request data is stored in local storage
    - if less than 10 min since last request use stored data
