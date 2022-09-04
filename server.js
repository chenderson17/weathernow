require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
var bodyParser = require("body-parser");
const citySearch = "";
const ejs = require("ejs");
var city = [];

const http = require("http");
const WebSocket = require("ws");


var clients = [];

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");


const WebSocketServer = require("ws");
const wss = new WebSocketServer.Server({port:8080});
wss.on("connection",ws=>{
   console.log("Client is connected");
   
   ws.on("message", data =>{
      if(data != ""){
      axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${data}&limit=10&appid=${process.env.APP_ID}`).then(response=>{
       city = response.data;
      
}).catch(error=>{
 console.log(error);
})
   ws.on("message", (request)=>{
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
const getCity = function(){
   return city;
}

function updateCity(){
   console.log(city);
   city = getCity();
}
setInterval(updateCity,1000);


//static
app.get("/", (request,response)=>{
   console.log(request.body.searchBar);
 try{
  response.render("index",{
     city:city,
     updateCity:updateCity
  });
  
 }
 catch(error){
  console.log(error);
 }
});

//app.get("/result", function(request,response){
 //response.render("result");
//})
//need post request.
app.post("/", function(request,response,next){
 var search = request.body.searchBar.toLowerCase();
 console.log(request.body);
 axios.get(`https://api.openweathermap.org/data/2.5/weather?&q=Berlin&appid=${process.env.APP_ID}&units=imperial`).then(res => {
 //console.log(res.data);
 //debug:
 //console.log("Temperature: " + res.data.main.temp);
 //console.log("Weather Description: " + res.data.weather[0].main);
}).catch(error=>{
 console.log(error);
})
response.render("result");
next();
})
app.use(express.static(__dirname + "/"));


app.listen(8081);