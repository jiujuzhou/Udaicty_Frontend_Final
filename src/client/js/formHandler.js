let projData={};
function handleSubmit(event) {
    console.log("::: Form Submitted :::")
    event.preventDefault()
    const startName = document.getElementById('startName').value;
    const endName = document.getElementById('endName').value;
    const dateControl = document.querySelector('input[type="date"]');
    projData['startName'] = startName;
    projData['endName'] = endName;
    projData['startDate'] = dateControl.value;

  //get how manys dates until departure
    var curday = function(sp){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //As January is 0.
      var yyyy = today.getFullYear();
      
      if(dd<10) dd='0'+dd;
      if(mm<10) mm='0'+mm;
      return (yyyy+sp+mm+sp+dd);
      };
      curday = curday('-');
      console.log("start day ",projData['startDate'])
      console.log("cur day ",curday)
      var difValue = (new Date(projData['startDate']) - new Date(curday)) / (1000 * 60 * 60 * 24);
      if (difValue<0){
        alert("pls input a valid date!");
      }
      else {
        projData["difDate"] = difValue;
      }

    /* --------- Here we go, Main logic begins ----------*/
    try {
      //get the city info: longtitude, latitude, country code.
      getGeoCity(endName)    
      .then( //get weather forcast
          (city)=> {
            console.log("call wather API")
            return getWeather(city.lat, city.lng);
          }
      )
      .then( //save weather info
          (weather) =>{
              //current date weather info
              console.log("save weather info")
              projData['cur_temp'] = weather['data'][0]['temp'];
              projData['cur_weather_condition'] = weather['data']['0']['weather']['description'];
          }
      )    
      .then( //get image
          ()=>{
            console.log("call img API")
            return  getImageURL(endName);
          }
      )
      .then( //save img info
          (imgURL) =>{
              console.log("save img info")
              projData["imgURL"] = imgURL;
          }
      )
      .then( //just a print
        ()=>{
            console.log("All API calls are done!, before saving to server, data is:",projData);
        }
      )
      .then( //save data to server
        () => {
          console.log("call post API")
          postData('/post',projData);
        }
      )
      .then( //retrieve data from server
        ()=>{
          console.log("call get API")
          return getData();
        }
      ) 
      .then( //update UI
        (data)=>{
           updateUI(data);
        }
      )
  } catch (e) {
    console.log('error', e);
  }
}
/*------------------------ main logic ends ----------------- */



function updateUI(data){
    console.log("Data retrieved from server:",data)
    console.log("update UI");
        var card = document.getElementById('imgcard')
        card.style.display=""; //show this card
        var img = document.createElement('img');
        var heading = document.createElement('h1');
        var difdate = document.createElement('p');
        var temp = document.createElement('p');
        var weather = document.createElement('p');
    
        img.src = data.imgURL;
        heading.innerHTML = "Welcome to "+capitalizeFirstLetter(data.endName);
        difdate.innerHTML = `<p>${data.difDate} days until depature`;
        temp.innerHTML    = `<p>Temprature: ${data.cur_temp} ℃</p>`; 
        weather.innerHTML = `<p>Weather: ${data.cur_weather_condition}</p>`;
    
        card.appendChild(heading);
        card.appendChild(img);
        card.appendChild(difdate);
        card.appendChild(temp);
        card.appendChild(weather);
        card.classList.add("imgcardshow");

}

//post data to server
async function postData(url = '', data = {}){
  console.log("post to server",data);
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify(projData)
  })

  try {
    const newData = await req.json();
    return newData;
  }
  catch (error) {
    console.error(error);
  }
};

//get data from server
async function getData(){
	const request = await fetch("/get");
	try {
		const data = await request.json();
    console.log("data back from server:",data);
    return data;
	} catch (error) {
		console.error("error", error);
	}
};


const username = 'jiujuzhou';
async function getGeoCity(city) {
    const url = 'http://api.geonames.org/searchJSON?formatted=true&q=' + city + '&username=' + username + '&style=full'; 
    try {
      const res = await fetch(url);
      const city = {};
      const data = await res.json();
      //console.log(data);
      city.lat = data.geonames[0].lat;
      city.lng = data.geonames[0].lng;
      console.log(city);
      return city;
    } catch (error) {
      console.log(error);
    }
  }

  const pixabayKey = '20790605-786a08187c9e18a15d53bac32';
  async function getImageURL(city) {
      const url = `https://pixabay.com/api/?key=${pixabayKey}&q=${city}&image_type=photo&pretty=true&category=places`;
      try {
        let response = await fetch(url);
        //console.log(response);
        let res = await response.json();
        console.log(res);
        return res.hits[0].webformatURL;
        //return res.hits[0].previewURL;
        //return res.hits[0].largeImageURL;
      } catch (error) {
        console.log(error);
      }
    }


    const weatherKey= 'ef8d0bb2c59a452fb82efa580879bf79';
    async function getWeather(latitude, longitude ) {
         const url =`https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${weatherKey}`;
         console.log(url);
         try {
            const response = await fetch(url);
            const res = await response.json();
            console.log(res);
            return res;
         } catch (error) {
           console.log(error);
         }
     }
     
     function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

export { 
  handleSubmit
}

