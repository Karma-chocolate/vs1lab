// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    var latF = document.getElementById("La");
    var loF = document.getElementById("Lo");
    console.log(latF.value);
    console.log(loF.value);
    if (!latF.value || !loF.value) {
        console.log("11111");
        LocationHelper.findLocation((helper) => {

        const lat = helper.latitude;
        const long = helper.longitude;

        latF.value = lat;
        loF.value = long;

        console.log(latF.value);
        console.log(loF.value);

        document.getElementById("Dla").value = lat;
        document.getElementById("Dlo").value = long;

        latF.value = lat;
        loF.value = long;

        console.log(lat);
        console.log(long);

        const schmutz = document.getElementsByClassName("schmutz");
        for (const element of schmutz) {
            element.remove();
        }



        let map = new MapManager();
        map.initMap(lat, long);
        map.updateMarkers(lat, long);
        
        });

     } else {
        console.log("22222");
        const lat = latF.value;
        const long = loF.value;

        const mapManager = new MapManager();
        mapManager.initMap(lat,long);

        let map = document.getElementById("map");
        let tags = map.getAttribute("data-tags");

        const tagList = JSON.parse(tags);
     

       for (let tag of tagList) {
            tag.location = {latitude: tag.latitude, longitude: tag.longitude};
        }

        mapManager.updateMarkers(latitude, longitude, tagList);
    }
}
        


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});