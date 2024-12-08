// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */

const GeoTag = require("../models/geotag")

class InMemoryGeoTagStore{

    #geotags = [];

    get tagList() {
        return this.#geotags;
    }

    addGeoTag(GeoTag){
        this.#geotags.push(GeoTag);
    }

    removeGeoTag(name){
        this.#geotags = this.#geotags.filter((tag) => tag.name !== name)

    }

    getNearbyGeoTags(x,y, radius){
        return this.getNearbyGeoTags(x,y, radius).filter((tag) => {
            const distance = Math.sqrt((tag.x - x) ** 2 + (tag.y - y) ** 2);
            return distance <= radius;
        });
    }

    searchNearbyGeoTags(x, y, radius, keyword) {
        return this.getNearbyGeoTags(x, y, radius).filter((tag) => {
            return (
                tag.name.toLowerCase().includes(keyword.toLowerCase()) || tag.hash.toLowerCase().includes(keyword.toLowerCase())
            );
        });
    }

}

module.exports = InMemoryGeoTagStore;
