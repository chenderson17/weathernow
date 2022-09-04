var currentSearchValue = " ";
var cityArray = [];
searchBar.addEventListener("keyup", (press)=>{
 currentSearchValue = press.target.value;
 setTimeout(updatedSearchValue,1);
// displayCities(getCitiesSearchResults);


if(currentSearchValue!= ""){
const getCitiesSearchResults = async() =>{
  try{
     const response = fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${currentSearchValue}&limit=10&appid=ffafe42896c4fcb07c485c5a37fbfdba`);
     cityArray = await (await response).json();
     displayCities(cityArray);
  }
  catch(error){
    console.log(error);

  }
}
setTimeout(getCitiesSearchResults,1);
}

});
var updatedSearchValue = function(){
 return currentSearchValue;
};

 let citySelect = document.getElementById("cities");
 const displayCities = (cities)=>{
  const htmlString = cities.map((city)=> {
    if(city.country == "US"){
      return `<li><button data-lat=${city.lat} data-lon=${city.lon}  value=${city.lat} name=cityButton>${city.name}, ${city.state} </button></li>`;
    }
  return `<li><button data-lat=${city.lat} data-lon=${city.lon} name="cityButton" value=${city.lat}>${city.name}, ${city.country}</button></li>`;
}).join('');
citySelect.innerHTML = htmlString;
};
