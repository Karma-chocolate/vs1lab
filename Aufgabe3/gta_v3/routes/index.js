// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const geoTagStore = new GeoTagStore();

const GeoTagExamples = require('../models/geotag-examples');
const geoTagExamples = new GeoTagExamples(geoTagStore);

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  res.render('index', { 
    taglist: [], 
    latitude: req.body.latitude, 
    longitude: req.body.longitude,
    markers: null,
   });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */
router.post('/tagging', (req, res) => {   
  const { name, latitude, longitude, hashtag, searchterm } = req.body;

  const newGeoTag = new GeoTag(name, longitude, latitude, hashtag);

  geoTagStore.addGeoTag(newGeoTag);

  const search = searchterm;
  const radius = 500;
  let results;

  results = geoTagStore.getNearbyGeoTags({ latitude: latitude, longitude: longitude }, radius);
  //console.log(2, results);
  
  res.render('index', {  
    latitude: latitude, 
    longitude: longitude,
    markers: null,
    taglist: results,
    markers: JSON.stringify(results)
   });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */
router.post('/discovery', (req, res) => {  
  const { latitude, longitude, searchterm } = req.body;
  const search = searchterm;
  const radius = 500;
  let results;

  console.log(search);

  if (search) {
    results = geoTagStore.searchNearbyGeoTags(
      { latitude: latitude, longitude: longitude },
      radius,
      search
    );
    //console.log(1, results);

  } else {
    results = geoTagStore.getNearbyGeoTags({ latitude: latitude, longitude: longitude }, radius);
    //console.log(2, results);
  }

  console.log(results);

  res.render("index", {
    latitude: latitude,
    longitude: longitude,
    taglist: results,
    markers: JSON.stringify(results)
  });
});

module.exports = router;
