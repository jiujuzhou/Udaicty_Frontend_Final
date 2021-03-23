# dependencies   
    "body-parser": "1.19.0",   
    "cors": "2.8.5",   
    "css-loader": "5.1.3",    
    "express": "4.17.1",    
    "node-fetch": "2.6.1",    
    "node-sass": "5.0.0",    
    "sass": "1.32.8",   
    "sass-loader": "10.1.1",   
    "style-loader": "2.0.0",   
    "webpack": "4.35.3",   
    "webpack-cli": "3.3.5"    

# How to run
1, install all dependecies with: npm install    
2, run with produciton mode:    
npm run build-prod    
npm start   
open browser: http://localhost:8080/   
3, run with test mode:    
npm run build-dev   
4, type in start city name, destination city, start date & return date, then submit the form.   
5, do test with:   
npm run test

# The extention
Add end date and display length of trip.

# Implementation    
after user input start date, end date, start city and end city, then submit the from, this APP will do:   
1, call Geonames API to get the destination city latitude and longtitude.   
2, use this longtitude and latitude to call Weatherbit API to get the weather of destination.     
3, use the destination city name to call Pixabay API to get the image of this city.   
4, put all the trip info into server storage by calling "post" routing.     
5, retrieve the info from server by calling "get" routing, and update UI dynamically.    
This project combines all the knowledge learn from previous project.    
Use only vanilla javascript, Project is built up with node.js+npm+express+webpack+service workers.     
 
# important files
src/client/js/formhandle.js  
src/server/index.js   
