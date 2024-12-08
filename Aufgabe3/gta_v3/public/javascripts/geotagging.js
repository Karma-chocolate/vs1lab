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
    const latF = document.getElementById("La");
    const loF = document.getElementById("Lo");
    if (!latF.value || !loF.value) {
        console.log("dumme");
        LocationHelper.findLocation((helper) => {

            const lat = helper.latitude;
            const long = helper.longitude;

            latF.value = lat;
            loF.value = long;

            document.getElementById("Dla").value = lat;
            document.getElementById("Dlo").value = long;

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
        console.log("scheise");

        const lat = latF.value;
        const long = loF.value;

        console.log(latF.value);
        console.log(loF.value);


        const map = document.getElementById("map");
        const tags = map.getAttribute("data-tags");


        const tagList = JSON.parse(tags);
        console.log(tagList);

        for (const tag of tagList) {
            tag.location = { latitude: tag.latitude, longitude: tag.longitude };
        }

        let mapManager = new MapManager();
        mapManager.initMap(lat, long);

        mapManager.updateMarkers(latitude, longitude, tagList);
    }
}
        


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});