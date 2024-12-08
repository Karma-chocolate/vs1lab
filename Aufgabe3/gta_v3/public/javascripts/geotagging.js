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
    let latF = document.getElementById("lat");
    let loF = document.getElementById("Lo");

    if (!latF.value || !loF.value) {
        LocationHelper.findLocation((helper) => {


        let lat = helper.latitude;
        let long = helper.longitude;

        document.getElementById("La").value = lat;
        document.getElementById("Dla").value = lat;
        document.getElementById("Lo").value = long;
        document.getElementById("Dlo").value = long;



        const imgElement = document.getElementById("mapView");
        imgElement.remove();


        const mapChange = document.getElementById("picture");
        mapChange.id = "map";


        let map = new MapManager();
        map.initMap(lat, long);
        map.updateMarkers(lat, long);
        });

    } else {
        let long = loF.value;
        let lat = latF.value;

        let mapManager = new MapManager();
        map.initMap(lat,long);

        let map = document.getElementById("map");
        let tags = map.getAttribute("data-tags");

        let tagList = JSON.parse(tags);

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