// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    constructor(name, longitude, latitude, hashtag) {
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
        this.hashtag = hashtag;
    }
    toString() {
        return `${this.name} (${this.latitude}, ${this.longitude}) ${this.hashtag}`;
      }
}

module.exports = GeoTag;
