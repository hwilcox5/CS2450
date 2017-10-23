//Steven Benjamin - 2450 Team Project - getWeather

//US ISO 3166 country code.
var countryCode = "840";
var country="us";
var zip;


//number of dayts to forecast, 16 is the max
var forecastLength = 2;


$(document).ready(function getPosition() {
 
  if(Cookies.get('zip')!== undefined)
  {
     zip = Cookies.get('zip');  
     zipcodeForecast();
     console.log(zip + " set via cookie."); 
  } 
    
  else
  {
  // Find the longitude and latitude based on the users ip.
  var location = "http://ip-api.com/json";

  $.getJSON(location, function(json) 
  {

    lat = json.lat;
    lon = json.lon;

    //Get the current weather data from the open weather API
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e", function(json) 
    {
    console.log(json);
      var country = json.sys.country;
      var city = json.name;
      var location = city + ", " + country;
      

      //Let's see if that worked...
      console.log(city);
      console.log(country);

      //how to get the weather description
      var weather = json.weather[0].description;
      var wicon = json.weather[0].icon.substring(0,2);

      console.log(weather);
      console.log(json.weather[0].icon);

      //using the temprature converter
      var temp = json.main.temp;
      var getTemp = new convertTemp(temp);
     
      console.log(getTemp.celcius());
      console.log(getTemp.frnht());
      
      document.getElementById("currentTemp").innerHTML = getTemp.frnht()+"°";
      document.getElementById("currentImg").src = weatherImg(wicon);
      document.getElementById("currentImg").alt = weather;
      document.getElementById("location").innerHTML = city;
      
              //the forecast
              $.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?q='+ city +','+ country + '&cnt=' + forecastLength + '&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e',function(json)
              {
               
                //console.log(json);  
                

                
                //how to get a date item from the retrieved forecast list...
                var currentForecast = json.list[1].dt;
                var date = new convertDate(currentForecast);
               
                console.log(date.month());
                console.log(date.date());

                var temp = json.list[1].temp.day;
                //console.log(temp);
    
    
              });

    });
  });
 }
});


//If we have a zip code...
  function zipcodeForecast()
  {
    var zipFormat = /^\d{5}$/;
    var validZip = zip.match(zipFormat);
    if(validZip != null)
    {

    $.getJSON("http://api.openweathermap.org/data/2.5/weather?zip="+ zip +"," + country + "&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e",function(json)
    {

      var country = json.sys.country;
      var city = json.name;
      var location = city + ", " + country;

      //Let's see if that worked...
      console.log(city);
      console.log(country);
      console.log(json.weather[0].icon);



      var weather = json.weather[0].description;
      var wicon = json.weather[0].icon.substring(0,2);

      var temp = json.main.temp;
      
      //using the temprature convertera
      var getTemp = new convertTemp(temp);
      console.log(getTemp.celcius());
      console.log(getTemp.frnht());
      
      document.getElementById("currentTemp").innerHTML = '';
      document.getElementById("currentTemp").innerHTML = getTemp.frnht()+"°";
  
      document.getElementById("currentImg").src = '';
      document.getElementById("currentImg").src = weatherImg(wicon);
      
      document.getElementById("currentImg").alt = '';
      document.getElementById("currentImg").alt = weather;
      
      document.getElementById("location").innerHTML = '';
      document.getElementById("location").innerHTML = city;
      
      
      
      $.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?q='+ city +','+ country + '&cnt=' + forecastLength + '&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e',function(json)
       {
        //console.log(json); 
        
       });
    });
    }
  }

  //Zip code entered in the alerts form

  $("#setAlerts").on('click', function()
  {
    zip = null;
    zip = document.querySelector('#zipAlerts').value;
    console.log(zip);
    zipcodeForecast();
    
    Cookies.set('zip', zip, {expires: 30});
  });
  
  //"Use a different zip code"

  $("#zipTextbox").on('change keydown paste input', function()
  {
    zip = null;
    zip = document.querySelector('#zipTextbox').value;
    console.log(zip);
    zipcodeForecast();
    
    Cookies.set('zip', zip, {expires: 30});
  });


   //If we have a city name...
  function cityForecast(city)
  {

    $.getJSON('api.openweathermap.org/data/2.5/weather?q='+ city +','+ countryCode +'&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e',function(json)
    {

      var country = json.sys.country;
      var city = json.name;
      var location = city + ", " + country;

      //Let's see if that worked...
      console.log(city);
      console.log(country);


      var weather = json.weather[0].description;

      var temp = json.main.temp;
      
      //using the temprature converter
      var getTemp = new convertTemp(temp);
      console.log(getTemp.celcius());
      console.log(getTemp.frnht());
      
     $.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?q='+ city +','+ country + '&cnt=' + forecastLength + '&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e',function(json)
       {
        //console.log(json); 
        
       });
    });
   }

   
  //converts a unix time stamp to a usable date
  function convertDate(unixDate)
  {
      var a = new Date(unixDate * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      
      return{
      year: function(){ return a.getFullYear();},
      month: function(){ return months[a.getMonth()];},
      date: function(){ return a.getDate();},
      hour: function(){ return a.getHours();},
      min: function(){ return a.getMinutes();},
      sec: function(){ return a.getSeconds();}
      };
  }
  

  //converts kelvin to celcius of fahrenheit
  function convertTemp(temp)
  {
      var c = Math.round((temp - 273.15));
      
      return{
      celcius : function(){return c;},
      frnht : function(){return Math.round(c * 1.8 + 32);}
      };
    
  }
  

 //Gets the zip code for a specified area
  function getZip(city, state)
  {
    var zip;
    
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',' + state + '&sensor=true', function(json)
    {
      console.log(json);
      
      zip = json.results[0].address_components[4].long_name;
      console.log(zip);
      
      //if the city and state are invalid, json.status = ZERO_RESULTS
      
    });
    
    return zip;
    
  }

 //Corrects the spelling of a user entered city.
  function checkCity(city, state)
  {
    var c;
    
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',' + state + '&sensor=true', function(json)
    {
      console.log(json);
      
      //todo
      
      //if the city and state are invalid, json.status = ZERO_RESULTS
      
    });
    
    return c;
    
  }

  

// based on the icons associated with the weather ID codes found here: http://openweathermap.org/weather-conditions
function weatherImg(weather)
{
  var imgName = null;
  
  switch (weather) 
  {
    case '01': 
      {
        imgName = 'png/sunny-day.png';
        break;
      }
      
    case '02': 
      {
        imgName = 'png/partialy-cloudy.png';
        break;
      }
      
    case '03': 
      {
        imgName = 'png/cloudy-day.png';
        break;
      }
     
    case '04': 
      {
        imgName = 'png/overcast-day.png';
        break;
      }
      
    case '11': 
      {
        imgName = 'png/lighting.png';
        break;
      }
      
    case '10': 
      {
        imgName = 'png/rainy-day.png';
        break;
      }
      
    case '09': 
      {
        imgName = 'png/pour-rain.png';
        break;
      }
      
    case '13': 
      {
        imgName = 'png/cold.png';
        break;
      }
      
   case '50': 
      {
        imgName = 'png/mist.png';
        break;
      }
}
return imgName;
  
}
