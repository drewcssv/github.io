<!DOCTYPE html>
<html>
  <head>
    <title>SSV Air Quality Sensor Network Monitor V0.7 (c) 2019, 2020 SSV Labs</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <script src="https://github.com/drewcssv/ssvaq/blob/master/feeds-18-3.js"></script>  
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map_wrapper {
        height: 100%;
      }
      #map_canvas {
	      width: 100%;
	      height: 100%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      
      #container {
        height: 100%;
        display: flex;
      }
      
    #sidebar {
        flex-basis: 15rem;
        flex-grow: 1;
        padding: 1rem;
        max-width: 30rem;
        height: 100%;
        box-sizing: border-box;
        display: flex;
      }

      #map {
        flex-basis: 0;
        flex-grow: 4;
        height: 100%;
      }
      
      #popupbox{
  margin: 0; 
  margin-left: 40%; 
  margin-right: 40%;
    margin-top: 50px; 
  padding-top: 10px; 
  width: 20%; 
  height: 150px; 
  position: absolute; 
  background: #FBFBF0; 
    border: solid #000000 2px; 
  z-index: 9; 
  font-family: arial; 
   visibility: hidden; 
  }
 
    
      #floating-panel {
        position: absolute;
        top: 10px;
        left: 15%;
        z-index: 5;
        background-color: #fff;
        padding: 5px;
        border: 1px solid #999;
        position: absolute;
        text-align: center;
        font-family: 'Roboto','sans-serif';
        line-height: 30px;
        padding-left: 10px;
      }
      
      #info-box {
        background-color: white;
        border: 1px solid black;
        bottom: 30px;
        height: 20px;
        padding: 10px;
        position: absolute;
        left: 30px;
      }
      #info_map {
       border: 1px solid black;
       background-color: white;
      /*
       background-image:  
           url(https://drewcssv.github.io/ssvaq/color_background.png);          
            background-position: center, center; 
            background-size: 100%;   */
       top: 455px;
       left: 22%;
       position: absolute;
       height: 250px;
       width: 700px;
      }
      
      #chart-container {
       border: 1px solid black;
       top: 220px;
       left: 5%;
       position: absolute;
       height: 450px;
       width: 950px;
      }
      #below chart {
       bottom: 10%;
       left: 95%;
       position: absolute;
       height: 20px;
       width: 30px;
      }
      html {
        height: 100%;
      }

      #map {
        height: 100%;
      }
      #map.over {
        opacity: 0.5;
        background-color: rgba(100, 100, 100, 0.5);
      }

      #sidebar {
        flex-direction: column;
        align-items: center;
        justify-content: left;
        columns: 2;
        overflow: auto;
      }

      .file {
        display: flex;
        flex-flow: column;
        margin-top: 1em;
        cursor: move;
        columns: 2;
        text-align: center;
      }
      .file:hover .material-icons {
        color: darkorange;
      }
      .file:hover .filename {
        font-weight: bold;
      }
      .file .material-icons {
        font-size: 30px;
        color: orange;
      }
      .file .material-icons:hover {
        color: darkorange;
      }
      .file .filename {
        margin-top: 0.5em;
        font-size: 10px;
        color: #333333;
      }   
      
   /*  */
  
    </style>
    <script type="application/json" src=https://maps.googleapis.com/maps/api/js?key=AIzaSyC9cwbKnz2iZqFWazHkaqyigA40tSK3s5g&libraries=visualization,drawing"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.11.0/underscore-min.js"></script> 
    <script src="http://code.highcharts.com/stock/highstock.js"></script>
    <script src="http://code.highcharts.com/stock/modules/exporting.js"></script>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
    <script src="https://github.com/highcharts/export-csv"></script>
    <script src="http://highcharts.github.io/export-csv/export-csv.js"></script>
    <script src="https://drewcssv.github.io/dragdroptouch.js"></script>
    <script src="https://drewcssv.github.io/files.js"></script>
       
     <link
      href="https://unpkg.com/material-components-web@6.0.0/dist/material-components-web.css"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
   
   <script type="text/javascript">   
    
 
     const heatMapData1 = new Array(); // array to hold track data for heatmap

     const flightPlanCoords = new Array(); // array to hold track point data
     
     const flightpath = new Array(); //array to hold polyline coords
     
     const trackNames = []; // array to hold track names
          
    
  // global variables           
      var j_endPhrase1='/fields/2/';
      var j_endPhrase2 ='last_data_age.json?';
               
      var pm25=[0,0,0,0,0,0,0,0,0]; // Array to hold PM values
      var pm1;
      var trackName1, trackNNN;
      var pm25_nodata_time=[0,0,0,0,0,0,0,0,0] ;// array to hold no data received values
      var pmMaxTime = 30;
      var wndMaxTime = 30; 
      var wind=[0,0,0,0,0,0,0,0];
      var windDir=0, windSpeed=0; // Wind Direction (0-360) and Wind Speed (Kn)
      var vasMeasureOne = 0;
      var vasMeasureTwo = 0;
      var wind_nodata_time=[0,0,0,0,0,0,0,0,0];
      var airQualityIndex;
      var aqiMess=["", "", "", "", "", "", "", ""];
      var AQI;
      var kmlLayer;
      var pmCorrection = "";
      var geoURL;
      var dynamicChart;
      var channelsLoaded = 0;
      var map, heatmap, trafficLayer, pollutionLayer, flightPath;
      var infowindow4, gLayer, infowindow5;
      var bpUser, aqvUser;
      var contentDiv = '<div id="info_map" style="height:250px; width:400px; display:inline"></div>';
      var whichContainer = "chart-container";
      
      //var hideTrack = false;
      
 // CSV header for "markers": Name	Latitude	Longitude	Channel	PMfield	format	ReadAPI	Location	Type
      
  var markers = []; // array to hold sensor and marker info
     
  var channelKeys = [];  // array to hold plot data from Thingspeak
      
  getCSVConfig(); // read in CSV that contains sensor, marker and Thingspeak config
  
  var tracksArray = []; // array to hold track names
      
// login dialog    
function login(showhide){
       
if(showhide == "show"){
    document.getElementById('popupbox').style.visibility="visible";
    
}else if(showhide == "hide"){
    document.getElementById('popupbox').style.visibility="hidden"; 
}
}
// get user id
function getUserId() {
  
 //fetch the form element by using forms object.
var formEl = document.forms.useridForm;
//Get the data from the form by using FormData objects.
var formData = new FormData(formEl);
//Get the value of the fields by the form data object.
aqvUser = formData.get('username');
  
 alert("Welcome " + aqvUser + " !");
 
// do something here

}
   
    jQuery(function($) {
   // Asynchronously Load the map API
     var script = document.createElement('script');
     script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC9cwbKnz2iZqFWazHkaqyigA40tSK3s5g&libraries=visualization&callback=initialize";
     document.body.appendChild(script);
     //getSensor();
    });
    
//   document.querySelector("input").onchange = function() {
  //  [].slice.call( this.files ).forEach( function(v) {
 //         $("body").append("<div>"+v.name+"</div>" );
 //   });        
//};
    
 //   var myTimer = setInterval(initialize, 120000); //refresh markers (and get fresh data) every 120 seconds 
 
    function loadGeoJsonString(geoString) {
        try {
          const geojson = JSON.parse(geoString);
          console.log("geojson: " + geojson);
          map.data.addGeoJson(geojson);
        } catch (e) {
          alert("Not a GeoJSON file!");
        }
        zoom(map); // zoom map to proper depth     
        drawPolyline(); // draw track path
      }

      /**
       * Update a map's viewport to fit each geometry in a dataset
       */
      function zoom(map) {
        const bounds = new google.maps.LatLngBounds();
      //  gLayer = new google.maps.Data();
        infowindow4 = new google.maps.InfoWindow();
        map.data.forEach((feature) => {
          processPoints(feature.getGeometry(), bounds.extend, bounds);
          extractFeatures(feature); // enumerate each feature and populate infowindow
        //  trackNNN = feature.getProperty("TrackName"); // track name
      //   tracksArray.push(feature.getProperty("TrackName")); // push track name)
       //  console.log("track name: " + tracksArray);
         });
        map.fitBounds(bounds);    
      }
// draw line connecting each point along track    
function drawPolyline() {
   console.log(tracksArray);
   flightPath = new google.maps.Polyline({
    path: flightPlanCoords,
    geodesic: true,
    draggable: true,
    strokeColor: "#FF0000",
    strokeOpacity: 0.5,
    strokeWeight: 2,      
    trackTitle: tracksArray[0]
   });
   flightPath.setMap(map); // draw polyline on map  
 // handle infowindow  
   var handelPolyClick = function(eventArgs, polyLine) {
    infowindow5 = new google.maps.InfoWindow();
    // here you can handle the poly
     var trck = "<b>Track Name: </b>" + flightPath.trackTitle;
     console.log("trck: " + flightPath.trackTitle);
      infowindow5.setContent("<div style='width:150px;'>"+trck+"</div>");
      infowindow5.setPosition(eventArgs.latLng);
      infowindow5.open(map);
  };
  
  var handlePolyClose = function(eventArgs, polyLine)  {
     infowindow5.close();
  };
  
  google.maps.event.addListener(flightPath, 'mouseover', function(e) {
     handelPolyClick(e, this);
  });
  
  google.maps.event.addListener(flightPath, 'mouseout', function(e)  {
     handlePolyClose(e, this);
  });
}  
    
 function showTrack() {
  flightPath.setMap(map);
}

function hideTrack() {
  flightPath.setMap(null);
}    
 
  function hideMarkers(feature) {
           map.data.setStyle(function(feature) { 
        return {visible: false} // hide markers
        });
  }
       
 // fetch track data from geojson file     
      function extractFeatures(feature) {
       // prepare infowindow content to be displayed on 'click'
      
         var ll = feature.getGeometry().get(); // get lanlng object
         var latt = parseFloat(ll.lat());
         var lngg = parseFloat(ll.lng());
         
         var rrr = {lat:latt, lng:lngg};
         flightPlanCoords.unshift(rrr); //push onto path array
         tracksArray.unshift(feature.getProperty("TrackName")); // push track name)
          
         map.data.addListener('click', function(event) {
          
         map.data.setStyle(function(feature) { // set style...
        return {icon: feature.getProperty("icon"), title: feature.getProperty("userid"), visible: true} // color of icon based on embedded AQI in geojson file
        });
         
         pm1 = event.feature.getProperty("PM25"); // set temp PM value
         var trackID = "<b>" + "Point No.: " + "</b>" + event.feature.getProperty("entry_id");
         var dateTime = "<b>" + "Created at: " + "</b>" + event.feature.getProperty("created_at");
         var pm25 = "<b>" + "PM2.5: " + "</b>" + event.feature.getProperty("PM25"); // fetch PM2.5 value
      //   var AQI = "<b>" + "AQI: " + "</b>" + event.feature.getProperty("AQI");
         var TVOCi = Math.trunc(event.feature.getProperty("TVOC")); // fetch and truncate TVOC value
         var TVOC = "<b>" + "TVOC: " + "</b>" + TVOCi;
        
         var comments_parsed = event.feature.getProperty("Comments");
         var comments = "<b>" + "Comments: " + "</b>" + comments_parsed;
         
         var user = event.feature.getProperty("userid"); // userid
         var trackN = event.feature.getProperty("TrackName"); // track name
     
         var userid = "<b>" + "User: " + "</b>" + user;
         var trackName = "<b>" + "Track Name: " + "</b>" + trackN;
                  
	       infowindow4.setContent("<div style='width:250px;'>"+ trackName + '<br>' + userid + '<br>' + trackID +'<br>'+ '<hr>' + dateTime +'<br>'+ pm25 + '<br>' + TVOC + '<br>' + comments + "</div>");
	       // position the infowindow on the marker
	       infowindow4.setPosition(event.feature.getGeometry().get());
        	// anchor the infowindow on the marker
	       infowindow4.setOptions({pixelOffset: new google.maps.Size(0,-30)});
	       infowindow4.open(map);
       });
         
         var uuu = new google.maps.LatLng(latt,lngg); // get LanLng object for each point
         heatMapData1.unshift({location: uuu, weight: 0.5}); // push onto heatmap array, using PM2.5 as weight
         // maroon: 128,0,0,1
        // red: 255, 0,0,1
        // orange: 255,165,0,1
        // yellow: 255,255, 0, 1
        // green: 
      //   var gradient = [
      //    'rgba(128, 0, 0, 1)',
      //    'rgba(255, 0, 0, 1)',
       //   'rgba(255, 165, 0, 1)',
      //    'rgba(255, 255, 0, 1)'
     //   ]
         var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
       
          heatmap.set('gradient', gradient);
    }       
      /**
       * Process each point in a Geometry, regardless of how deep the points may lie.
       */
      function processPoints(geometry, callback, thisArg) {
        if (geometry instanceof google.maps.LatLng) {
          callback.call(thisArg, geometry);
        } else if (geometry instanceof google.maps.Data.Point) {
          callback.call(thisArg, geometry.get());
        } else {
          geometry.getArray().forEach((g) => {
            processPoints(g, callback, thisArg);
          });
        }
      }
           
      /* DOM (drag/drop) functions */
      function initEvents() {
        [...document.getElementsByClassName("file")].forEach((fileElement) => {
          fileElement.addEventListener(
            "dragstart",
            (e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify(files[Number(e.target.dataset.value)])
              );
              console.log(e);  
            },
            false
          );
        });
        
        // set up the drag & drop events
        const mapContainer = document.getElementById("map");
        mapContainer.addEventListener("dragenter", addClassToDropTarget, false);
        mapContainer.addEventListener("dragover", addClassToDropTarget, false);
        mapContainer.addEventListener("drop", handleDrop, false);
        mapContainer.addEventListener("dragleave", removeClassFromDropTarget, false);
      }

      function addClassToDropTarget(e) {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById("map").classList.add("over");
        return false;
      }

      function removeClassFromDropTarget(e) {
        document.getElementById("map").classList.remove("over");
      }

      function handleDrop(e) {
        console.log("handleDrop");
        e.preventDefault();
        e.stopPropagation();
        removeClassFromDropTarget(e);
        const files = e.dataTransfer.files;
        console.log("Files: " + files);
        if (files.length) {
          // process file(s) being dropped
          // grab the file data from each file
          for (let i = 0, file; (file = files[i]); i++) {
            const reader = new FileReader();

            reader.onload = function (e) {
              loadGeoJsonString(reader.result);
            };

            reader.onerror = function (e) {
              console.error("reading failed");
            };
            reader.readAsText(file);
          }
        } else {
          // process non-file (e.g. text or html) content being dropped
          // grab the plain text version of the data
          const plainText = e.dataTransfer.getData("text/plain");
         // console.log(plainText);

          if (plainText) {
            loadGeoJsonString(plainText);
          }
        }
        // prevent drag event from bubbling further
        return false;
      }
    
    function toggleHeatmap() {
       
        heatmap.setMap(heatmap.getMap() ? null : map);
      } 
 
    function toggleGTraffic() {
      trafficLayer = new google.maps.TrafficLayer(); // how cool is this?   
      if (trafficLayer.getMap() == null) {
     //traffic layer is disabled.. enable it
        console.log('disabled..enable it');
        console.log(trafficLayer.getMap());
        trafficLayer.setMap(map);
       } else {
      //traffic layer is enabled.. disable it
        console.log('enabled...disable it');
        trafficLayer.setMap(null);
      }
    }
   // display today's track data from airnow     
    function displayAirnow(){
  
      var infowindow1 = new google.maps.InfoWindow();
     
      $.getJSON("https://www.airnowapi.org/aq/observation/latLong/current/?" +
      "format=application/json&latitude=37.8946&longitude=-122.5517&distance=25&API_KEY=21393772-95EF-4851-BE2C-F42562A236FD", function(result) {
         var m=result;
         console.log(m); });
              
      //  ctaLayer.setMap(map);
      //  ctaLayer.addListener('click', function(event) {
    	//  var myHTML = event.feature.getProperty("Facility");
	   //   infowindow1.setContent("<div style='width:150px;'>"+myHTML+"</div>");
	   //   infowindow1.setPosition(event.feature.getGeometry().get());
    	// anchor the infowindow on the marker
	   //   infowindow1.setOptions({pixelOffset: new google.maps.Size(0,-30)});
	   //   infowindow1.open(map);
     // });
         
 } // displayairnow
 
// display a user's track file from previous BackpAQ session
// reads from a .geojson file

    function displayTrack() {
      // togTracks();
       // display geojson tracks file
       var pLayer = new google.maps.Data();
       var infowindow1 = new google.maps.InfoWindow();
       geoURL = 'https://drewcssv.github.io/ssvaq/feeds-15-2.geojson';
       pLayer.loadGeoJson(geoURL, null,
       function (feature) {  console.log("loadGeoJson", feature.length); // for each marker...
        pLayer.setStyle(function(feature) { // set style...
        return {icon: feature.getProperty("icon"), title: feature.getProperty("userid"), visible: true} // color of icon based on embedded AQI in geojson file
        }); }
       ); // geojson file from BackpAQ session      
    
       pLayer.setMap(pLayer.getMap() ? null : map);                              
        
    // prepare infowindow content to be display on 'click'
       pLayer.addListener('click', function(event) {
      // Parse feature/property data from JSON
       var trackID = "<b>" + "Track id: " + "</b>" + event.feature.getProperty("entry_id");
       var dateTime = "<b>" + "Created at: " + "</b>" + event.feature.getProperty("created_at");
       var pm25 = "<b>" + "PM2.5: " + "</b>" + event.feature.getProperty("PM25");
       var AQI = "<b>" + "AQI: " + "</b>" + event.feature.getProperty("AQI");
       var  iconAQI = event.feature.getProperty("icon"); // AQI "color"
       //console.log(iconAQI);
       var comments = "<b>" + "Comments: " + "</b>" + event.feature.getProperty("Comments");
       var userID = "<b>" + "User: " + "</b>" + event.feature.getProperty("userid");
       
     // define infowindow  
	     infowindow1.setContent("<div style='width:250px;'>"+ userID + "<br>" + trackID +'<br>'+ '<hr>' + dateTime +'<br>'+ pm25 + '<br>' + AQI + '<br>' + comments + "</div>");
	     // position the infowindow on the marker
	     infowindow1.setPosition(event.feature.getGeometry().get());
      	// anchor the infowindow on the marker
	     infowindow1.setOptions({pixelOffset: new google.maps.Size(0,-30)});
	     infowindow1.open(map);
      });
  }
     
// choose PM correction (if any)
//  Two “conversions” to adjust PM2.5 concentrations and corresponding AQI values for woodsmoke, an “AQandU” calibration (0.778 * PA + 2.65)
//  to a long-term University of Utah study in Salt Lake City and an “LRAPA” calibration (0.5 * PA − 0.68) to a Lane Regional Air
//  Pollution Agency study of PA sensors. 
// LRAPA = PM_Val_cf1 = 0.5 * PM_Val_cf1 -.68
// AQandU = PM_Val_cf1 = 0.778 * PM_Val_cf1 + 2.65;
  function checkRadio(name) {
    pmCorrection = "None"; // default
    if (name == "None") {
        console.log("Choice: ", name);
        pmCorrection = "None";
       // initialize();
        document.getElementById("no-choice").checked = true;
        document.getElementById("LRAPA-choice").checked = false;
        document.getElementById("AQandU-choice").checked = false;
    }
   else if(name == "LRAPA"){
    console.log("Choice: ", name);
        pmCorrection = "LRAPA";
       // initialize();
        document.getElementById("no-choice").checked = false;
        document.getElementById("LRAPA-choice").checked = true;
        document.getElementById("AQandU-choice").checked = false;

    } else if (name == "AQandU"){
        console.log("Choice: ", name);
        pmCorrection = "AQandU";
       // initialize();
        document.getElementById("no-choice").checked = false;
        document.getElementById("AQandU-choice").checked = true;
        document.getElementById("LRAPA-choice").checked = false;
    }
  }
  
// functions to calculate API from PM2.5 concentration      
 //var AQI = aqiFromPM(pm25[i][2]);
  //var AQIDescription = getAQIDescription(AQI); //A short description of the provided AQI
//var AQIMessage = getAQIMessage(AQI); // What the provided AQI means (a longer description)
 // And here are the functions:
 
function aqiFromPM(pm) {

      if (isNaN(pm)) return "-"; 
      if (pm == undefined) return "-";
      if (pm < 0) return pm; 
      if (pm > 1000) return "-"; 
       
        if (pm > 350.5) {
          return calcAQI(pm, 500, 401, 500, 350.5);
        } else if (pm > 250.5) {
          return calcAQI(pm, 400, 301, 350.4, 250.5);
        } else if (pm > 150.5) {
          return calcAQI(pm, 300, 201, 250.4, 150.5);
        } else if (pm > 55.5) {
          return calcAQI(pm, 200, 151, 150.4, 55.5);
        } else if (pm > 35.5) {
          return calcAQI(pm, 150, 101, 55.4, 35.5);
        } else if (pm > 12.1) {
          return calcAQI(pm, 100, 51, 35.4, 12.1);
        } else if (pm >= 0) {
          return calcAQI(pm, 50, 0, 12, 0);
        } else {
          return undefined;
        }
      
      }
      function bplFromPM(pm) {
      if (isNaN(pm)) return 0; 
      if (pm == undefined) return 0;
      if (pm < 0) return 0; 
      
        if (pm > 350.5) {
        return 401;
        } else if (pm > 250.5) {
        return 301;
        } else if (pm > 150.5) {
        return 201;
        } else if (pm > 55.5) {
        return 151;
        } else if (pm > 35.5) {
        return 101;
        } else if (pm > 12.1) {
        return 51;
        } else if (pm >= 0) {
        return 0;
        } else {
        return 0;
        }
      
      }
      function bphFromPM(pm) {
      //return 0;
      if (isNaN(pm)) return 0; 
      if (pm == undefined) return 0;
      if (pm < 0) return 0; 
        
        if (pm > 350.5) {
        return 500;
        } else if (pm > 250.5) {
        return 500;
        } else if (pm > 150.5) {
        return 300;
        } else if (pm > 55.5) {
        return 200;
        } else if (pm > 35.5) {
        return 150;
        } else if (pm > 12.1) {
        return 100;
        } else if (pm >= 0) {
        return 50;
        } else {
        return 0;
        }
      
      }
 
      function calcAQI(Cp, Ih, Il, BPh, BPl) {
      
        var a = (Ih - Il);
        var b = (BPh - BPl);
        var c = (Cp - BPl);
        return Math.round((a/b) * c + Il);
      
      }
 
 
      function getAQIDescription(aqi) {
        if (aqi >= 401) {
          return 'Hazardous';
        } else if (aqi >= 301) {
          return 'Hazardous';
        } else if (aqi >= 201) {
          return 'Very Unhealthy';
        } else if (aqi >= 151) {
          return 'Unhealthy';
        } else if (aqi >= 101) {
          return 'Unhealthy for Sensitive Groups';
        } else if (aqi >= 51) {
          return 'Moderate';
        } else if (aqi >= 0) {
          return 'Good';
        } else {
          return undefined;
        }
      }
      
      function getAQIIconURL(aqi) {
   
        if (aqi >= 401) {
          return 'http://maps.google.com/mapfiles/kml/paddle/purple-circle.png';
        } else if (aqi >= 301) {
          return 'http://maps.google.com/mapfiles/kml/paddle/purple-circle.png';
        } else if (aqi >= 201) {
          return 'http://maps.google.com/mapfiles/kml/paddle/purple-circle.png';
        } else if (aqi >= 151) {
          return 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png';
        } else if (aqi >= 101) {
          return 'http://maps.google.com/mapfiles/kml/paddle/orange-circle.png';
        } else if (aqi >= 51) {
          return 'http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png';
        } else if (aqi >= 0) {
          return 'http://maps.google.com/mapfiles/kml/paddle/grn-circle.png';
        } else {
          return undefined;
        }
      }
 
      function getAQIMessage(aqi) {
        if (aqi >= 401) {
          return '>401: Health alert: everyone may experience more serious health effects';
        } else if (aqi >= 301) {
          return '301-400: Health alert: everyone may experience more serious health effects';
        } else if (aqi >= 201) {
          return '201-300: Health warnings of emergency conditions. The entire population is more likely to be affected. ';
        } else if (aqi >= 151) {
          return '151-200: Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
        } else if (aqi >= 101) {
          return '101-150: Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
        } else if (aqi >= 51) {
          return '51-100: Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.';
        } else if (aqi >= 0) {
          return '0-50: Air quality is considered satisfactory, and air pollution poses little or no risk';
        } else {
          return undefined;
        }
     }
      
// Set value, color of AQI gauge on Blynk gauge ////////
function calcAQIValue() {
  var gaugeValue = airQualityIndex;
  var newColor;
  var newLabel;
  // assign color according to US AQI standard (modified per https://airnow.gov/index.cfm?action=aqibasics.aqi)

  if (gaugeValue > 300) {
    newColor = AQI_MAROON;
    newLabel = "AQI: HAZARDOUS";
  } else if (gaugeValue > 200) {
    newColor = AQI_PURPLE;
    newLabel = "AQI: VERY UNHEALTHY";
  } else if (gaugeValue > 150) {
    newColor = AQI_RED;
    newLabel = "AQI: UNHEALTHY";
  } else if (gaugeValue > 100) {
    newColor = AQI_ORANGE;
    newLabel = "AQI: UNHEALTHY FOR SOME";
  } else if (gaugeValue > 50) {
    newColor = AQI_YELLOW;
    newLabel = "AQI: MODERATE";
  } else {
    newColor = AQI_GREEN;  //"Safe"
    newLabel = "AQI: GOOD";
  }
}   
function displayPlot() {
 }
function displayTracks() {      
 }
 
// Read CSV file to fetch sensor, Thingspeak channel, API key, etc.
function getCSVConfig() {  
var url = "https://drewcssv.github.io/ssvaq/todo.csv"; // CSV file containing sensors, markets, locations, etc.
var request = new XMLHttpRequest();  
request.open("GET", url, false);   
request.send(null);  

// get data for sensor display
var jsonObject = request.responseText.split(/\r?\n|\r/);
console.log("len: " + jsonObject.length);
for (var i =1; i < jsonObject.length-1; i++) {
  markers.push(jsonObject[i].split(','));
 // console.log("markers: " + markers)  
}
// get data for charts function
// put ThingSpeak Channel#, Channel Name, and API keys here.
// fieldList shows which field you want to load, and which axis to display that field on, 
// the 'T' Temperature left axis, or the 'O' Other right axis.
var channelNum;
var channelKey; // api_key=DZ07N6EQQM0GEUPE
var equals; var cKey;
for (i = 0; i < jsonObject.length-2; i++) {
  channelNum = markers[i][3];  console.log(i + "channelNum: " + channelNum);
  channelKey = markers[i][6];
  equals = channelKey.indexOf("="); // find ""="
  cKey = channelKey.substring(equals+1); // extract API key
//  console.log(i + "key: " + cKey);
  channelKeys.push({channelNumber:channelNum, name:markers[i][0],key:cKey,
  fieldList:[{field:1,axis:'O'},{field:2,axis:'O'},{field:3,axis:'O'},{field:4,axis:'O'},{field:5,axis:'O'},{field:6,axis:'T'},{field:7,axis:'H'},{field:8,axis:'O'}]});
}
// Retrived data from csv file content
//console.log(markers); 
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// start the whole enchilada..  
function initialize() {
   // var map;
    
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
     mapTypeId: 'roadmap',
     center: new google.maps.LatLng(37.465573, -122.142580)
    };   

// Display a map on the page
   map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
   map.setTilt(45);  
   
 // Display heatmap for current track data 
   
   heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData1,
    dissapating: true,
    radius: 20
   });
   
 // start the ball rolling... 
   initEvents();
   
   //getCSVConfig(); // read in CSV that contains sensor, marker and Thingspeak config
   
   console.log(channelKeys);
   console.log(channelKeys.length); 
  
   //getChannelKeys(); // push channel info to channelKeys array for plotting
  
   // display SSV Logo bottom right corner
    var imageBounds = {
    north: 37.465614,
    south: 37.464286,
    east: -122.131685,
    west: -122.132825
    };

    historicalOverlay = new google.maps.GroundOverlay(
      'https://greenbiztracker.org/business/view-file?fileHash=7efa1639b05ff2ca7f900539d3195b9c', // fetch SSV logo
      imageBounds);
      historicalOverlay.setMap(map);     
      
// get a new date (locale machine date time)
var date = new Date();
// get the date as a string
var n = date.toDateString();
// get the time as a string
var time = date.toLocaleTimeString();
    
// find the html element with the id of time
// set the innerHTML of that element to the date a space the time
document.getElementById('time').innerHTML = n + ' ' + time;
             
      // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
      
    // get some marker icons...  these are BIG (64x64)
     var bf_image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
     var g_image = 'http://maps.google.com/mapfiles/kml/paddle/grn-circle.png';
     var bl_image = 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png';
     var r_image = 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png';
     var yel_image = 'http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png';
     var pur_image = 'http://maps.google.com/mapfiles/kml/paddle/purple-circle.png';
     var org_image = 'http://maps.google.com/mapfiles/kml/paddle/orange-circle.png';
      // fillColor: '#00F', // blue
       // fillColor: '#66FF00' // green
       // fillColor: '#ff4600' // orange
       // fillColor: '#ff0031' // red
       // fillColor: '#fffd00' // yellow
       // fillColor: '#7900ff' // purple
       // fillColor: '#800000' // maroon
                
     var winContent;
   // get today's date & time
     let today = new Date().toISOString().slice(0,-5); // slice off milliseconds
     var diff = -30; // collect data from last 30 minutes
     var startDateObj = new Date(); 
     var endDateObj = new Date(startDateObj.getTime() + diff*60000).toISOString().slice(0,-5); // format for Beacon API
     var circle;
    
// This is loop to display fixed PM sensors       
// Loop through our array of markers & place each one on the map  
    for (i = 0; i < markers.length; i++) {  // loop through all sensors/locations and place markers
            var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
            var pmval = pm25[i][2];  // use US AQI standard (modified per https://airnow.gov/index.cfm?action=aqibasics.aqi)
             if (pmval > 350) {
          // build "dot"           
               circle = {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: 'maroon',  // maroon
                  fillOpacity: .4,
                  scale: 9.0,
                  strokeColor: 'white',
                  strokeWeight: 1
               };
                                     
            } else if (pmval > 250) {
                   
               circle = {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: 'maroon', // maroon
                  fillOpacity: .4,
                  scale: 9.0,
                  strokeColor: 'white',
                  strokeWeight: 1
               };
                 
            } else if (pmval > 150) {
                     
               circle = {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: 'purple', // purple
                  fillOpacity: .4,
                  scale: 9.0,
                  strokeColor: 'white',
                  strokeWeight: 1
               };
                  
             } else if (pmval > 65) {
                     
                circle = {
                   path: google.maps.SymbolPath.CIRCLE,
                   fillColor: 'red', // red
                   fillOpacity: .4,
                   scale: 9.0,
                   strokeColor: 'white',
                   strokeWeight: 1
               };
                   
             } else if (pmval > 40) {
                    
                circle = {
                   path: google.maps.SymbolPath.CIRCLE,
                   fillColor: 'orange',  // orange
                   fillOpacity: .4,
                   scale: 9.0,
                   strokeColor: 'white',
                   strokeWeight: 1
               };            
                 
            } else if (pmval > 15.5) {
                    
                circle = {
                   path: google.maps.SymbolPath.CIRCLE,
                   fillColor: 'yellow', // yellow
                   fillOpacity: .4,
                   scale: 9.0,
                   strokeColor: 'white',
                   strokeWeight: 1
               };
           } else {
               circle = {
                   path: google.maps.SymbolPath.CIRCLE,
                   fillColor: '#00FF33',  // green
                   fillOpacity: .4,
                   scale: 9.0,
                   strokeColor: 'white',
                   strokeWeight: 1
           };
        }
            bounds.extend(position);
         //   console.log('Time ' + pm25_nodata_time[i]); console.log('wTime ' + wind_nodata_time[i]);
            marker = new google.maps.Marker({
              position: position,
              draggable: true,          
              label: {
                text: markers[i][0]
              },
             // set marker color
                          
               icon: circle,
               
              animation: google.maps.Animation.DROP,
              
              map: map,
              
              title: (function(){ if(markers[i][0] == 'BackpAQ' ) {
                   return markers[i][0] + ' at ' + markers[i][5];   
                      }
                   else {
                      return markers[i][0] + ' at ' + markers[i][7]; }
                
             })() // function 
              
            }),  // marker 
                
           // Allow each marker to have an info window    
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
         
	       // Make API call to fetch JSON data (PM2.5) from Thingspeak
           $.getJSON("https://api.thingspeak.com/channels/" + markers[i][3] + markers[i][4] + markers[i][5] + markers[i][6], function(result){ 	
            var m = result;
           console.log(m);
            pm25[i] = Number(m.field2); // pm2.5 is in Field 2
           if (pmCorrection == "LRAPA") { //  PM_Val_cf1 = 0.5 * PM_Val_cf1 -.68
              pm25[i] = 0.5 * pm25[i] - 0.68;
              //console.log(pm25[i]);
            } else if (pmCorrection == "AQandU") { // PM_Val_cf1 = 0.778 * PM_Val_cf1 + 2.65;
                 pm25[i] = 0.778 * pm25[i] + 2.65;
                // console.log(pm25[i]);
            }
             AQI = aqiFromPM(pm25[i]);
               
                var AQIDescription = getAQIDescription(AQI); //A short description of the provided AQI             
                var AQIMessage = getAQIMessage(AQI); // What the provided AQI means (a longer description)
                
           }); // getJSON
         
           // fetch JSON "last_data_received" value for PM2.5 sensors
           $.getJSON("https://api.thingspeak.com/channels/" + markers[i][3] + j_endPhrase1 + j_endPhrase2 + markers[i][6], function(result){
	           
	         var me = result;
             //console.log(me);
             pm25_nodata_time[i] = Number(me.last_data_age); // time since last data received (seconds)
             //console.log('time ' + pm25_nodata_time[i]);         
            }); // getJSON
                
	      // format & populate content for infowindow    
	        csc = "createNewSmallChart(" + i + ");";
			      winContent = "<b>" + markers[i][0] + "</b>" + "<br><br><hr>" + "<b>" + "AQI:  "+ "</b>" +
         "<font color = 'green'>" + AQI + "</font>" + "<br>" + "<b>" + "PM2.5:  "+ "</b>" + pm25[i] + "<br>" + "<b>" +
         "Data Source:  "+ "</b>" +
         markers[i][8] + "<br>" + "<b>" + "Updated:  " +"</b>"+ today + "<hr>" +  "<button id=showCh onclick="+csc+">Show Chart</button>"
               	    
        // infoWindow.setContent(winContent); // load infowindow content
         infoWindow.setContent(winContent); // load infowindow content    
            
         infoWindow.open(map, marker); // load markers
      
        }; // addListener function...
        
      })(marker, i));

     // Automatically center the map fitting all markers on the screen
       map.fitBounds(bounds);
       
   } // Loop through array.... THE BIG LOOP!
  
  	google.maps.event.addListener(document.getElementById("info_map"), 'click', function() {
       alert('close1');
		      document.getElementById("info_map").style.display = "none"; 
	}); 
  
 // Listen for Google Traffic click...   
   google.maps.event.addDomListener(document.getElementById('trafficToggle'), 'click', toggleGTraffic);  

// Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
    this.setZoom(15);
    google.maps.event.removeListener(boundsListener);
});
 
}  

// display small chart with PM2.5 data for THIS sensor
function createNewSmallChart(index) {

var channelNumb = channelKeys[index].channelNumber;
channelNumb = channelNumb.replace(/\s/g, ''); // squeeze out spaces
var channelKy = channelKeys[index].key;
var sensorNam = markers[index][0];
var sensorLoc = markers[index][7];
  
console.log("channel number: " + channelNumb + ", Channel Key: ", channelKy + ", Sensor: " + sensorNam + ", Location: " + sensorLoc);

// form and send API request

document.getElementById('info_map').innerHTML += '<b>' + sensorNam + '</b><iframe id = ' + channelNumb +' border = 0 width = 100% height = 300></iframe><br><hr>';
//document.getElementById(channelNumb.toString()).src = 'https://api.thingspeak.com/channels/' + channelNumb + '/charts/2?api_key=' + channelKy + '&title=' + sensorLoc + '&average=daily&days=90&color=5555dd&width=900&height=300&xaxis=Time';
var cString = 'https://api.thingspeak.com/channels/' + channelNumb + '/charts/2?api_key=' + channelKy + '&title=' + sensorLoc + '&average=daily&days=90&color=5555dd&width=900&height=300&xaxis=Time';
//console.log("cString: " + cString);
document.getElementById(channelNumb.toString()).src = cString;

makeChart(); // http XML request to ThingSpeak

}

function makeChart(TScommand)
{
document.getElementById('info_map').style.display="inline";

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
 	if (xhttp.readyState == 4) 
	{
	document.getElementById('info_map').value += "<br><br>" + this.responseText;
	};
  xhttp.open('GET', TScommand, false);
  xhttp.send();

 }
}
//-----------------------------------------------------------------------------------------------------------

 //  ----- begin highcharts code, totally borrowed from ThingSpeakMultichannel.html
 
// converts date format from JSON
function getChartDate(d) {
    // get the data using javascript's date object (year, month, day, hour, minute, second)
    // months in javascript start at 0, so remember to subtract 1 when specifying the month
    // offset in minutes is converted to milliseconds and subtracted so that chart's x-axis is correct
    return Date.UTC(d.substring(0,4), d.substring(5,7)-1, d.substring(8,10), d.substring(11,13), d.substring(14,16), d.substring(17,19)) - (myOffset * 60000);
}
function toggle(ele) {
        toggle1(ele);
        toggle2(ele);
    }
 function toggle1(ele) {
    var cont = document.getElementById('chart-container');
        cont.style.display = cont.style.display == 'none' ? 'block' : 'none'; 
 }
 function toggle2(ele) {
   var bcont = document.getElementById('below chart');
         bcont.style.display = bcont.style.display == 'block' ? 'none' : 'block';
 }
 function togTracks() {
  var x = document.getElementById("container");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
function closeIt(){
  document.getElementById("info_map").style.display = "none";
  var myobj = document.getElementById("info_map");
  //myobj.remove();
}
function closeDiv3()
{
document.getElementById('kmlprompt').style.visibility = "hidden";
document.getElementById('screener').style.visibility = "hidden";
}

function getKMLLayer()
{
var cont = document.getElementById('chart-container');
//  cont.style.display = cont.style.display == 'none' ? 'block' : 'none'; 
document.getElementById('kmlprompt').style.visibility = "hidden";
document.getElementById('screener').style.visibility = "hidden";

    var kmlOptions = {
        preserveViewport: false
    };

    if (kmlLayer) {
        kmlLayer.setMap(null);
    }

    var url = trim(document.getElementById('layerLink').value);
    kmlLayer = new google.maps.KmlLayer(url, kmlOptions);
    kmlLayer.setMap(map);
document.getElementById('layerLink').value = "";
} //end addKML()

function addKML() {
    var kmlOptions = {
        preserveViewport: false
    };
    if (kmlLayer) {
        kmlLayer.setMap(null);
    }
    var url = document.getElementById('layerLink').value;
    kmlLayer = new google.maps.KmlLayer(url, kmlOptions);
    kmlLayer.setMap(map);
} //end addKML()

// user's timezone offset
var myOffset = new Date().getTimezoneOffset();

     // Hide all series, via 'Hide All' button.  Then user can click on serries name in legent to show series of interest.      
function HideAll(){
  for (var index=0; index<dynamicChart.series.length; index++)  // iterate through each series
  { 
    if (dynamicChart.series[index].name == 'Navigator')
      continue;
    dynamicChart.series[index].hide();
    //window.console && console.log('Series Number:',index,' Name:',dynamicChart.series[index].name);
  }            
}
// hide some of the not-so relevant series
function HideSome(){
  for (var index=0; index<dynamicChart.series.length; index++)  // iterate through each series
  { 
    var seriesName = dynamicChart.series[index].name;
    const banned = ["RSSI", "Uptime", "Latitude (deg)", "Latitude (Deg)", "Longitude (deg)", "Longitude (Deg)"];
    if(banned.indexOf(seriesName) != -1) { // if in the list..
       dynamicChart.series[index].hide(); // hide it
    }
  }            
}
 // ---------------------------------------------------------------------------------------------------     
 //  This is where the chart is generated.
 // --------------------------------------------------------------------------------------------------- 
jQuery(document).ready(function() 
{
 //Add Channel Load Menu
 var menu=document.getElementById("Channel Select");
 console.log(channelKeys.length);
 for (var channelIndex=0; channelIndex<channelKeys.length; channelIndex++)  // iterate through each channel
 {
   window.console && console.log('Name',channelKeys[channelIndex].name);
   var menuOption =new Option(channelKeys[channelIndex].name,channelIndex);
   menu.options.add(menuOption,channelIndex);
 }
 var last_date; // variable for the last date added to the chart
 window.console && console.log('Testing console');
 //make series numbers for each field
 var seriesCounter=0
 for (var channelIndex=0; channelIndex<channelKeys.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex=0; fieldIndex<channelKeys[channelIndex].fieldList.length; fieldIndex++)  // iterate through each channel
      {
        channelKeys[channelIndex].fieldList[fieldIndex].series = seriesCounter;
        
        console.log("ChannelKeys: " + channelKeys)
        seriesCounter++;
      }
  }
 //make calls to load data from each channel into channelKeys array now
 // draw the chart when all the data arrives, later asyncronously add history
 for (var channelIndex=0; channelIndex<channelKeys.length; channelIndex++)  // iterate through each channel
  {
    channelKeys[channelIndex].loaded = false;  
    loadThingSpeakChannel(channelIndex,channelKeys[channelIndex].channelNumber,channelKeys[channelIndex].key,channelKeys[channelIndex].fieldList);    
  }
       //window.console && console.log('Channel Keys',channelKeys);

 // load the most recent 2500 points (fast initial load) from a ThingSpeak channel into a data[] array and return the data[] array
 function loadThingSpeakChannel(sentChannelIndex,channelNumber,key,sentFieldList) {
   var fieldList= sentFieldList;
   var channelIndex = sentChannelIndex;
   whichContainer = "chart-container";
   console.log("channelIndex: " + channelIndex);
   console.log("*key: " + key);
   console.log("channelNumber: " + channelNumber);
   // get the Channel data with a webservice call
 	$.getJSON('https://api.thingspeak.com/channels/'+channelNumber+'/feed.json?&offset=0&results=2500;key='+key, function(data)
   {
	   // if no access
	   if (data == '-1') {
       $('#chart-container').append('This channel is not public.  To embed charts, the channel must be public or a read key must be specified.');
       window.console && console.log('Thingspeak Data Loading Error');
     }
     for (var fieldIndex=0; fieldIndex<fieldList.length; fieldIndex++)  // iterate through each field
     {
       fieldList[fieldIndex].data =[];
       for (var h=0; h<data.feeds.length; h++)  // iterate through each feed (data point)
       {
         var p = []//new Highcharts.Point();
         var fieldStr = "data.feeds["+h+"].field"+fieldList[fieldIndex].field;
		  	 var v = eval(fieldStr);
 		  	p[0] = getChartDate(data.feeds[h].created_at);
	 	  	p[1] = parseFloat(v);
	 	  	// if a numerical value exists add it
	   		if (!isNaN(parseInt(v))) { fieldList[fieldIndex].data.push(p); }
       }
       fieldList[fieldIndex].name = eval("data.channel.field"+fieldList[fieldIndex].field);
	   }
     window.console && console.log('getJSON field name:',fieldList[0].name);
     channelKeys[channelIndex].fieldList=fieldList;
     channelKeys[channelIndex].loaded=true;
     channelsLoaded++;
     window.console && console.log('channels Loaded:',channelsLoaded);
     window.console && console.log('channel index:',channelIndex);
     if (channelsLoaded==channelKeys.length){createChart(); HideSome() }
	 })
   .fail(function() { alert('getJSON request failed! '); });
 }
 // create the chart when all data is loaded
 function createChart() {
	// specify the chart options
	var chartOptions = {
	  chart: 
    {
		  renderTo: whichContainer,
      zoomType:'y',
			events: 
      {
        load: function() 
        {
				  if ('true' === 'true' && (''.length < 1 && ''.length < 1 && ''.length < 1 && ''.length < 1 && ''.length < 1)) 
          {
            // If the update checkbox is checked, get latest data every 15 seconds and add it to the chart
						setInterval(function() 
            {
             if (document.getElementById("Update").checked)
             {
              for (var channelIndex=0; channelIndex<channelKeys.length; channelIndex++)  // iterate through each channel
              {  
               (function(channelIndex)
               {
                // get the data with a webservice call
              //  $.getJSON('https://api.thingspeak.com/channels/'+channelKeys[channelIndex].channelNumber+'/feed/last.json?&offset=0&results=2500;key='+key, function(data)
                 $.getJSON('https://api.thingspeak.com/channels/'+channelKeys[channelIndex].channelNumber+'/feed/last.json?&offset=0&results=2500;key='+channelKeys[channelIndex].key, function(data)
                { 
                  for (var fieldIndex=0; fieldIndex<channelKeys[channelIndex].fieldList.length; fieldIndex++)
                  {
                    // if data exists
                    var fieldStr = "data.field"+channelKeys[channelIndex].fieldList[fieldIndex].field;
                    var chartSeriesIndex=channelKeys[channelIndex].fieldList[fieldIndex].series;
                    if (data && eval(fieldStr)) 
                    {
                      var p = [];
                      //new Highcharts.Point();
                      var v = eval(fieldStr);
                      p[0] = getChartDate(data.created_at);
                      p[1] = parseFloat(v);
                      // get the last date if possible
                      if (dynamicChart.series[chartSeriesIndex].data.length > 0) 
                      { 
                        last_date = dynamicChart.series[chartSeriesIndex].data[dynamicChart.series[chartSeriesIndex].data.length-1].x; 
                      }
                      var shift = false ; //default for shift
                      // if a numerical value exists and it is a new date, add it
                      if (!isNaN(parseInt(v)) && (p[0] != last_date)) 
                      {
                        dynamicChart.series[chartSeriesIndex].addPoint(p, true, shift);
                      }   
                    }
                    //window.console && console.log('channelKeys:',channelKeys);
                    //window.console && console.log('chartSeriesIndex:',chartSeriesIndex);
                    //window.console && console.log('channel index:',channelIndex);
                    //window.console && console.log('field index:',fieldIndex);
                    //window.console && console.log('update series name:',dynamicChart.series[chartSeriesName].name);
                    //window.console && console.log('channel keys name:',channelKeys[channelIndex].fieldList[fieldIndex].name);
                  }
                  
                  
                });
               })(channelIndex);
              }
             }
						}, 15000);
					}
				}
			}
		},
  title: {
            text: 'BackpAQ Air Quality Sensor Data'
        },
		rangeSelector: {
			buttons: [{
				count: 30,
				type: 'minute',
				text: '30M'
			}, {
				count: 12,
				type: 'hour',
				text: '12H'
      }, {
				count: 1,
				type: 'day',
				text: 'D'
      }, {
				count: 1,
				type: 'week',
				text: 'W'
      }, {
				count: 1,
				type: 'month',
				text: 'M'
      }, {
				count: 1,
				type: 'year',
				text: 'Y'
			}, {
				type: 'all',
				text: 'All'
			}],
			inputEnabled: true,
			selected: 1
		},
		plotOptions: {
		  line: {
        gapSize:5
				//color: '#d62020'
				//  },
				//  bar: {
				//color: '#d52020'
				//  },
				//  column: {
			},
			series: {
			  marker: {
				  radius: 2
				},
				animation: true,
				step: false,
        turboThrehold:1000,
				borderWidth: 0
			}
		},
    tooltip: {
      valueDecimals: 1,
      valueSuffix: 'ug/m3',
      xDateFormat:'%Y-%m-%d<br/>%H:%M:%S %p'
			// reformat the tooltips so that local times are displayed
			//formatter: function() {
      //var d = new Date(this.x + (myOffset*60000));
      //var n = (this.point.name === undefined) ? '' : '<br/>' + this.point.name;
      //return this.series.name + ':<b>' + this.y + '</b>' + n + '<br/>' + d.toDateString() + '<br/>' + d.toTimeString().replace(/\(.*\)/, "");
			//}
    },
		xAxis: {
		  type: 'datetime',
      ordinal:false,
      min: Date.UTC(2019,01,01),
			dateTimeLabelFormats : {
        hour: '%l %p',
        minute: '%l:%M %p'
      },
      title: {
        text: 'test'
			}
		},
		yAxis: [{
            title: {
                text: 'Deg F'
            },
            opposite: false,
            id: 'T'
    }, {
            title: {
                text: 'ug/m3'
            },
            opposite: true,
            id: 'O'
    }, {
            title: {
                text: '% H'
            },
            opposite: false,
            id: 'H'    
 }],
		exporting: {
		  enabled: true,
      csv: {
        dateFormat: '%d/%m/%Y %I:%M:%S %p'
        }
		},
		legend: {
		  enabled: true
		},
    navigator: {
      baseSeries: 0,  //select which series to show in history navigator, First series is 0
      adaptToUpdatedData : true,
      series: {
            includeInCSVExport: false,
            data: channelKeys[4].fieldList[4].data
        }
		},    
    series: []
    //series: [{data:[[getChartDate("2013-06-16T00:32:40Z"),75]]}]      
	};

	// add all Channel data to the chart
  for (var channelIndex=0; channelIndex<channelKeys.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex=0; fieldIndex<channelKeys[channelIndex].fieldList.length; fieldIndex++)  // add each field
    {
      window.console && console.log('Channel '+channelIndex+' field '+fieldIndex);
      chartOptions.series.push({data:channelKeys[channelIndex].fieldList[fieldIndex].data,
                                index:channelKeys[channelIndex].fieldList[fieldIndex].series,
                                yAxis:channelKeys[channelIndex].fieldList[fieldIndex].axis,
                                //visible:false,
                              name: channelKeys[channelIndex].fieldList[fieldIndex].name});
    }
  }
	// set chart labels here so that decoding occurs properly
	//chartOptions.title.text = data.channel.name;
	chartOptions.xAxis.title.text = 'Date';

	// draw the chart
  dynamicChart = new Highcharts.StockChart(chartOptions);

  // update series number to account for the navigator series (The historical series at the bottom) which is the first series.
  for (var channelIndex=0; channelIndex<channelKeys.length; channelIndex++)  // iterate through each channel
  {
    for (var fieldIndex=0; fieldIndex<channelKeys[channelIndex].fieldList.length; fieldIndex++)  // and each field
    {
      for (var seriesIndex=0; seriesIndex<dynamicChart.series.length; seriesIndex++)  // compare each series name
      {
        if (dynamicChart.series[seriesIndex].name == channelKeys[channelIndex].fieldList[fieldIndex].name)
        {
          channelKeys[channelIndex].fieldList[fieldIndex].series = seriesIndex;
        }
      }
    }
  }          
  // add all history
  //dynamicChart.showLoading("Loading History..." );
  window.console && console.log('Channels: ',channelKeys.length);
  for (var channelIndex=0; channelIndex<channelKeys.length; channelIndex++)  // iterate through each channel
  {
    window.console && console.log('channelIndex: ',channelIndex);
    (function(channelIndex)
      {
        //load only 1 set of 8000 points
        loadChannelHistory(channelIndex,channelKeys[channelIndex].channelNumber,channelKeys[channelIndex].key,channelKeys[channelIndex].fieldList,0,1); 
      }
    )(channelIndex);
  }
 }
});
      
function loadOneChannel(){ 
  // load a channel selected in the popUp menu.
  var selectedChannel=document.getElementById("Channel Select");
  var maxLoads=document.getElementById("Loads").value ;
  var channelIndex = selectedChannel.selectedIndex;
  loadChannelHistory(channelIndex,channelKeys[channelIndex].channelNumber,channelKeys[channelIndex].key,channelKeys[channelIndex].fieldList,0,maxLoads); 
} 

// load next 8000 points from a ThingSpeak channel and addPoints to a series
function loadChannelHistory(sentChannelIndex,channelNumber,key,sentFieldList,sentNumLoads,maxLoads) {
   var numLoads=sentNumLoads
   var fieldList= sentFieldList;
   var channelIndex = sentChannelIndex;
   var first_Date = new Date();
   if (typeof fieldList[0].data[0] != "undefined") first_Date.setTime(fieldList[0].data[0][0]+7*60*60*1000);//adjust for 7 hour difference from GMT (Zulu time)
   else if (typeof fieldList[1].data[0] != "undefined") first_Date.setTime(fieldList[1].data[0][0]+7*60*60*1000);
   else if (typeof fieldList[2].data[0] != "undefined") first_Date.setTime(fieldList[2].data[0][0]+7*60*60*1000);
   else if (typeof fieldList[3].data[0] != "undefined") first_Date.setTime(fieldList[3].data[0][0]+7*60*60*1000);
   else if (typeof fieldList[4].data[0] != "undefined") first_Date.setTime(fieldList[4].data[0][0]+7*60*60*1000);
   else if (typeof fieldList[5].data[0] != "undefined") first_Date.setTime(fieldList[5].data[0][0]+7*60*60*1000);
   else if (typeof fieldList[6].data[0] != "undefined") first_Date.setTime(fieldList[6].data[0][0]+7*60*60*1000);
   else if (typeof fieldList[7].data[0] != "undefined") first_Date.setTime(fieldList[7].data[0][0]+7*60*60*1000);
   var end = first_Date.toJSON();
   window.console && console.log('earliest date:',end);
   window.console && console.log('sentChannelIndex:',sentChannelIndex);
   window.console && console.log('numLoads:',numLoads);
   // get the Channel data with a webservice call
 	$.getJSON('https://api.thingspeak.com/channels/'+channelNumber+'/feed.json?&offset=0&results=2500;key='+key, function(data)
   {
	   // if no access
	   if (data == '-1') {
       $('#chart-container').append('This channel is not public.  To embed charts, the channel must be public or a read key must be specified.');
       window.console && console.log('Thingspeak Data Loading Error');
     }
     for (var fieldIndex=0; fieldIndex<fieldList.length; fieldIndex++)  // iterate through each field
     {
       //fieldList[fieldIndex].data =[];
       for (var h=0; h<data.feeds.length; h++)  // iterate through each feed (data point)
       {
         var p = []//new Highcharts.Point();
         var fieldStr = "data.feeds["+h+"].field"+fieldList[fieldIndex].field;
		  	 var v = eval(fieldStr);
 		  	p[0] = getChartDate(data.feeds[h].created_at);
	 	  	p[1] = parseFloat(v);
	 	  	// if a numerical value exists add it
	   		if (!isNaN(parseInt(v))) { fieldList[fieldIndex].data.push(p); }
       }
       fieldList[fieldIndex].data.sort(function(a,b){return a[0]-b[0]});
       dynamicChart.series[fieldList[fieldIndex].series].setData(fieldList[fieldIndex].data,false);
       //dynamicChart.series[fieldList[fieldIndex].series].addPoint(fieldList[fieldIndex].data,false);
       //fieldList[fieldIndex].name = eval("data.channel.field"+fieldList[fieldIndex].field);
       //window.console && console.log('data added to series:',fieldList[fieldIndex].series,fieldList[fieldIndex].data);
	   }
     channelKeys[channelIndex].fieldList=fieldList;
     dynamicChart.redraw()
     window.console && console.log('channel index:',channelIndex);
     numLoads++;
     if (numLoads<maxLoads) {loadChannelHistory(channelIndex,channelNumber,key,fieldList,numLoads,maxLoads);}
	 });
}

function displayPointChart() {  
const chart = Highcharts.chart('point_container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Test chart'
    },
    subtitle: {
        text: 'e'
    },
    legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical'
    },
    xAxis: {
        categories: ['Apples', 'Oranges', 'Bananas']
    },
    yAxis: {
        title: {
            text: 'Amount'
        }
    },
    series: [{
        name: 'Christmas Eve',
        data: [1, 4, 3]
    }, {
        name: 'Christmas Day before dinner',
        data: [6, 4, 2]
    }, {
        name: 'Christmas Day after dinner',
        data: [8, 4, 3]
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                }
            }
        }]
    }
});


}
  
 // const files[] was here
 
  
</script>
     <p>  <a href="javascript:login('show');">  Login Here</a></p>
</head>
 <body>     
    <div id="map_wrapper">
        <div id="popupbox"> 
<form name="login" action="" method="post" id="useridForm" onsubmit="getUserId()">
<center>Username:</center>
<center><input name="username" size="14" /></center>
<center>Password:</center>
<center><input name="password" type="password" size="14" /></center>
<center><input type="submit" name="submit" value="Login" /></center>
</form>
<br/>
<center><a href="javascript:login('hide');">close</a></center> 
</div> 
   <div id='time'>
   </div>
   
	  <div id="map">  
      <div id="container">
      
        <div id="map_canvas" class = "mapping"> </div>     
        <div id="sidebar" class="mdc-typography">
      Sample BackpAQ Track Files<br><br>
      Drag and drop these or any BackpAQ Track file onto the map<hr><br>
        <div class="file" draggable="true" data-value="0">
          <span class="material-icons">text_snippet</span>
          <div class="filename">2020-11-06.geojson</div>
        </div>
        <div class="file" draggable="true" data-value="1">
          <span class="material-icons">text_snippet</span>
          <div class="filename">2020-11-08.geojson</div>
        </div>
        <div class="file" draggable="true" data-value="2">
          <span class="material-icons">text_snippet</span>
          <div class="filename">2020-11-11.geojson</div>
        </div>
        
        <div id="chart-container" style="height: 600px;display:none;"><br>
              Highstock Chart Here<br>
        </div>
       <div id="below chart" style="display:none;"> <br><br><br><br>Choose sensor:<br>
      <select id="Channel Select">
      </select><br>Data loads:<br>
      <select id="Loads">
        <option value="1">1 Load</option>
        <option value="2">2 Loads</option>
        <option value="3">3 Loads</option>
        <option value="4">4 Loads</option>
        <option value="5" selected="selected">5 Loads</option>
        <option value="6">6 Loads</option>
        <option value="7">7 Loads</option>
        <option value="8">8 Loads</option>
        <option value="9">9 Loads</option>
        <option value="10">10 Loads</option>
        <option value="15">15 Loads</option>
        <option value="20">20 Loads</option>
        <option value="25">25 Loads</option>
        <option value="30">30 Loads</option>
        <option value="40">40 Loads</option>
        <option value="50">50 Loads</option>
      </select>
      <input id="Update" name="Update" type="checkbox"><span style="font-family: Lucida Grande;">Update Chart</span> <span id="Latency" style="font-family: Lucida Grande;"></span>
        <button style="width: 89px; margin-top: -18px; display:none;" value="Hide All" name="Hide All Button" onclick="HideAll();">Hide All</button><br>
        <button style="width: 162px; margin-top: -18px; display: none" value="Load More Data" name="Load More Data"  onclick="loadOneChannel();">Load More Historical Data </button>
        <button onclick="HideAll()">Hide Chart Data</button>
    </div>
          <div id=info_map style="display:none;">
          <button id=buttonClose onclick="closeIt();">x</button>
      </div>
    </div>
       </div>    
    </div>   
    <div id="floating-panel">
      <img src='https://github.com/drewcssv/ssvaq/blob/master/SSV%20Front%20page%20Logo.jpg?raw=true' width='200x' height='40px'>
      <img src='https://github.com/drewcssv/ssvaq/blob/master/backpaq_logo.png?raw=true' width='100px' height='40px'>
      <h3><b></b>AQView:</b>BackpAQ Community Sensor Map V0.765</h3>
      <button id ="trafficToggle">Toggle Traffic</button>
      <button onclick="displayAirnow()">Local AirNow Data</button>
      <button onclick="toggleHeatmap()">Toggle PM Heatmap</button>
      <button onclick="hideTrack()">Hide Track</button>
      <button onclick="showTrack()">Restore Track</button>   
      <input type="button" value="Show Chart" id="bt" onclick="toggle(this)">
      <br> PM Corrections: 
      <input type="radio" name="None" id="no-choice" onclick="checkRadio(name)" checked="checked"><label>None</label>
      <input type="radio" name="LRAPA" id="LRAPA-choice" onclick="checkRadio(name)"><label>LRAPA</label>
      <input type="radio" name="AQandU" id="AQandU-choice" onclick="checkRadio(name)"><label>AQandU</label>
    </div>
       
    <div id = screener></div>
     
  </body>
</html>