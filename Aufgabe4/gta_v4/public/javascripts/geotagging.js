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
        


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    // Tagging form submission (POST request)
    const tagForm = document.getElementById("tagForm");
    tagForm.addEventListener("submit", (event) => {
        event.preventDefault();  // Prevent the default form submission

        const formData = new FormData(tagForm);
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            latitude: formData.get("latitude"),
            longitude: formData.get("longitude"),
        };

        console.log("Submitting Tagging Form:", data);

        fetch("/api/tag", {
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
    const discoveryForm = document.getElementById("discoveryForm");
    discoveryForm.addEventListener("submit", (event) => {
        event.preventDefault();  // Prevent the default form submission

        const formData = new FormData(discoveryForm);
        const queryParams = new URLSearchParams({
            filter: formData.get("filter"),
        });

        console.log("Submitting Discovery Form:", queryParams);

        fetch(`/api/discovery?${queryParams.toString()}`, {
            method: "GET",
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
    const discoveryWidget = document.getElementById("discoveryWidget");
    discoveryWidget.innerHTML = tags.map(tag => {
        return `<div class="tag-item">
            <h3>${tag.title}</h3>
            <p>${tag.description}</p>
        </div>`;
    }).join("");
}