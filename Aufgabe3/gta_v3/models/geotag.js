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
    GeoTag(longitude, latitude, hashtag, name) {
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
        this.hashtag = hashtag;
    }
}

module.exports = GeoTag;
