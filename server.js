require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
var bodyParser = require("body-parser");
const ejs = require("ejs");
var cities = [];
const http = require("http");
const WebSocket = require("ws");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
const WebSocketServer = require("ws");
const { json } = require("body-parser");
const { setDefaultResultOrder } = require("dns");
const wss = new WebSocketServer.Server({port:8080});
wss.on("connection",ws=>{
   console.log("Client is connected");
   
   ws.on("message", data =>{
      if(data != ""){
      axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${data}&limit=10&appid=${process.env.APP_ID}`).then(response=>{
       cities = response.data;
       ws.send(JSON.stringify(cities));
}).catch(error=>{
 console.log(error);
})
  
      }
   
   })
   ws.on("close", ()=>{
      console.log("The client has disconnected");
   })
   ws.onerror = function(){
      console.log("An error has occurred.");
   }
})

//static
app.get("/", (request,response)=>{
 try{
  response.render("index",{
     cities:cities,
  });
  
 }
 catch(error){
  console.log(error);
 }
});


app.post("/", async (request,response,next)=>{
var cityButton = request.body.cityButton;
var citySelection = cities[cityButton];
var weatherData = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${citySelection.lat}&lon=${citySelection.lon}&units=imperial&appid=${process.env.APP_ID}`).then(res => {
  return res;
}).catch(error=>{
 console.log(error);
})


weatherObject = weatherData.then(data=>{
   console.log(data);
   console.log(citySelection.state == undefined);
   return data;
}).then(result=>{
   if(citySelection.state != undefined){
      var obj = {name:citySelection.name.toUpperCase(), country:citySelection.state.toUpperCase(), main: result.data.main, description:result.data.weather[0],wind:result.data.wind.speed, cloud:result.data.clouds.all};
    return obj;

   }
   else{
   var obj = {name:citySelection.name.toUpperCase(), country:citySelection.country.toUpperCase(), main: result.data.main, description:result.data.weather[0], wind:result.data.wind.speed, cloud:result.data.clouds.all};
   return obj;
   }
})
const result = await weatherObject
 response.render("result",{
   result:result
 
 })

next();
})



app.use(express.static(__dirname + "/"));


app.listen(8081);