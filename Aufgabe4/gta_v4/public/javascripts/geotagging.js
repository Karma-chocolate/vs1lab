// File origin: VS1LAB A2

const { get } = require("../../routes");

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

            const latitude = helper.latitude;
            const longitude = helper.longitude;

            latF.value = latitude;
            loF.value = longitude;

            document.getElementById("Dla").value = latitude;
            document.getElementById("Dlo").value = longitude;

            console.log(latitude);
            console.log(longitude);

            const schmutz = document.getElementsByClassName("schmutz");
            for (const element of schmutz) {
                element.remove();
            }



            let mapManager = new MapManager();
            mapManager.initMap(latitude, longitude);
            mapManager.updateMarkers(latitude, longitude);

        });

     } else {
        console.log("scheise");

        const latitude = latF.value;
        const longitude = loF.value;

        console.log(latF.value);
        console.log(loF.value);

        let mapManager = new MapManager();
        mapManager.initMap(latitude, longitude);

        const map = document.getElementById("map");
        const tags = map.getAttribute("data-tags");


        const tagList = JSON.parse(tags);
        console.log(tagList);

        for (const tag of tagList) {
            tag.location = { latitude: tag.latitude, longitude: tag.longitude };
        }

        console.log(tagList)
        mapManager.updateMarkers(latitude, longitude, tagList);

    }
}
        
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    const taggingForm = document.getElementById("tag-form");
    taggingForm.addEventListener("submit", TaggingSubmit);

    const discoveryForm = document.getElementById("discovery-form");
    discoveryForm.addEventListener("submit", DiscoverySubmit);

});


    /*async function TaggingSubmit(event) {
        console.log("ich mag kekse")
        event.preventDefault;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch("/api/geotags", {
            method: "POST",
            body: JSON.stringify({ 
                name: document.getElementById("Na").value,
                latitude: document.getElementById("La").value,
                longitude: document.getElementById("Lo").value,
                hashtag: document.getElementById("Ha").value,
            }),
            headers: myHeaders
        })
        return await response.json();
    }

    /*async function DiscoverySubmit(event) {
        console.log("ich mag kekse2")
        event.preventDefault;

        latitude = document.getElementById("Dla").value;
        longitude = document.getElementById("Dlo").value;
        searchTerm = document.getElementById("Dse").value;

        const response = await fetch(
            `/api/geotags?latitude=${latitude}&longitude=${longitude}&searchterm=${searchTerm}`
        )

        return await response.json();
    }*/

/*
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    // Tagging form submission (POST request)
    const tagForm = document.getElementById("tag-form");
    tagForm.addEventListener("submit", (event) => {
        event.preventDefault();  // Prevent the default form submission

        const data = {
            name: document.getElementById("Na"),
            latitude: document.getElementById("La"),
            longitude: document.getElementById("Lo"),
            hashtag: document.getElementById("Ha")
        };

        console.log("Submitting Tagging Form:", data);

        fetch("/tagging", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                console.log("Tag successfully added:", result);
                // Update map and discovery widget after adding a new tag
                updateMapAndDiscoveryWidget();
            })
            .catch(error => {
                console.error("Error submitting the tagging form:", error);
            });
    });

    // Discovery form submission (GET request)
    const discoveryForm = document.getElementById("discovery-form");
    discoveryForm.addEventListener("submit", (event) => {
        event.preventDefault();  // Prevent the default form submission

        const formData = new FormData(discoveryForm);
        const queryParams = new URLSearchParams({
            filter: formData.get("filter"),
        });

        console.log("Submitting Discovery Form:", queryParams);

        fetch("/discovery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(result => {
                console.log("Discovery results:", result);
                updateMapAndDiscoveryWidget(result);  // Pass the result to update map and widget
            })
            .catch(error => {
                console.error("Error submitting the discovery form:", error);
            });
    });
});

// Function to update the discovery widget and map after a form submission
function updateMapAndDiscoveryWidget(tags = []) {
    const mapManager = new MapManager();
    const latitude = document.getElementById("La").value;
    const longitude = document.getElementById("Lo").value;

    // Update the markers on the map
    mapManager.updateMarkers(latitude, longitude, tags);

    // Update the discovery widget (you can customize this part as per your widget's structure)
    const discoveryWidget = document.getElementById("discovery-form");
    discoveryWidget.innerHTML = tags.map(tag => {
        return `<div class="tag-item">
            <h3>${tag.title}</h3>
            <p>${tag.description}</p>
        </div>`;
    }).join("");
}
*/
