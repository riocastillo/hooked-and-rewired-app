
document.querySelector('.start').addEventListener('click', startTracking)

//global variables
let distanceArray = []
let timerId

const runSound = document.getElementById('runSound')
runSound.loop = false
const StopRunSound = document.getElementById('StopRunSound')
StopRunSound.loop = false

function startTracking() {
    runSound.play()
    const status = document.querySelector('#status');
    // const mapLink = document.querySelector('#map-link');
    // mapLink.href = '';
    // mapLink.textContent = '';

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log('lat:', latitude, 'long:', longitude)

        status.textContent = `Found you! current latitude: ${latitude}°, current longitude: ${longitude}°`;
        // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
        //pushing the lat+long object into the distance arr
        distanceArray.push({ latitude: latitude, longitude: longitude })
    }

    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
    //if there is no geolocation API, then send this msg
    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        //if there is a location, then we will automatically run and get the current position of every 3 seconds
        timerId = setInterval(() => {
            status.textContent = 'Locating…';
            //telling it to start tracking
            navigator.geolocation.getCurrentPosition(success, error, options);
        }, 3000)
    }
    //getCurrentPosition needs this passed into it
    options = {
        enableHighAccuracy: false,
        timeout: 5000,
        //the position you find acceptable to return
        maximumAge: 0
    };
}

// JavaScript program to calculate Distance Between
// Two Points on Earth, from geeks 4 geeks

function distance(lat1, lat2, lon1, lon2) {

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in miles
    let r = 3956;

    // calculate the result
    return (c * r);
}

document.querySelector('.button_base').addEventListener('click', () => {
    StopRunSound.play()
    //distanceArr has all of the coordinates as objects, in pairs as lat and long
    //we're passing the current pair and grabbing the lat
    // then we're telling it to referecne the distanceArr and use the currentidex that we're all, and then add one to it

    let distanceCollection = []

    //looping through the global array and setting safety checks to ensure that there is always more than one coordinate pair inside of the array and that we arent at the last set of coordinates
    let correctSize = distanceArray.length > 1
    if (correctSize) {
        distanceArray.forEach((currentValue, currentIndex) => {
            let notLastEntry = currentIndex + 1 != distanceArray.length
            if (notLastEntry) {
                // calcute the difference between the two points
                let deltaDistance = distance(
                    //grabbing the latitude of the object inside of the array
                    currentValue.latitude,
                    //grabing the latitude of the next object inside of the array
                    distanceArray[currentIndex + 1].latitude,
                    //doing the same thing as it did with the first latitude  
                    currentValue.longitude,
                    //doing the same thing as it did with the second latitude 
                    distanceArray[currentIndex + 1].longitude
                )
                distanceCollection.push(deltaDistance)
            }
        }
        )
    }
    // going through the distanceCollection array and combining the values and sum of the distance collection
    //totalSum is the accumalator, looping through the array
    //currentValue will be the first entry of the array
    let totalDistance = distanceCollection.reduce((totalSum, currentValue) => totalSum + currentValue)
    console.log('totalDistance:', totalDistance)
    //we are stopping the timer loop 
    clearInterval(timerId)
    //getting todays current date
    let today = new Date();
    console.log('date:', today)
    fetch('/miles', {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            miles: totalDistance,
            date: today.toUTCString(),
            coordinates: distanceArray,
        }),
    })
        .then((response) => {
            console.log('response=' + response)
            if (response.ok) return response.text();
        })
        .then((text) => {
            console.log('text=' + text)
            window.location.reload(true);
        });

})


function toggle() {
    let links = document.getElementById("links");
    let blob = document.getElementById("blob");
    blob.classList.toggle("open");
    if (links.style.display == "block") {
        links.style.display = "none";
    } else {
        links.style.display = "block";
    }
};

//array of coordinates - lat and long and the map zoom level, the higher you go the closer you get, 18 is usally the max num 
var mymap = L.map('map').setView([51.505, -0.09], 3);
var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});
mymap.addLayer(Esri_WorldStreetMap)

//array of coordinates 
//get the locations that the user sends as points 
//record those in your coordinates and then create an array of those coordinates
// create a red polyline from an array of LatLng points
//we would keep a running track to the coordinates, and append the most recent set of coordinates to the line 
let coordinateArray = []
let count = 0
let coordinateData = JSON.parse(document.querySelector("#events").dataset.coordinates)
coordinateData.forEach((coordinate) => {
    let extraDistance = count/10000
    coordinateArray.push([coordinate.latitude + extraDistance, coordinate.longitude])
    count++
})
console.log(coordinateArray)

var polyline = L.polyline(coordinateArray, { color: 'red' }).addTo(mymap);
console.log(polyline)

// zoom the map to the polyline
mymap.fitBounds(polyline.getBounds());

setTimeout(() => { mymap.invalidateSize() }, 1000)

