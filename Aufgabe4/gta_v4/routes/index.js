// File origin: VS1LAB A3, A4

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
router.use(express.json());

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const geoTagStore = new GeoTagStore();

const GeoTagExamples = require('../models/geotag-examples');
const InMemoryGeoTagStore = require('../models/geotag-store');
const geoTagExamples = new GeoTagExamples(geoTagStore);

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

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

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get("/api/geotags", (req,res) => {
  const { latitude, longitude, searchterm} = req.query;

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

  let jsonResponse = { geotags: results };
  res.status(200).json(jsonResponse);
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post("/api/geotags", (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newGT = new GeoTag(name, latitude, longitude, hashtag);
  geoTagStore.addGeoTag(newGT);

  //let location = "/api/geotags/" + newGT.id; // newGT ID fehlt
  res.location(`/api/geotags/${newGT.id}`);
  res.status(201).json(newGT);
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get("/api/geotags/:id", (req, res) => {
  const id = req.params.id;
  let result = geoTagStore.geoTagById(id);

  if (result) {
    res.json(result);
  } else {
    res.status(404).json("Object not found");
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put("/api/geotags/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, latitude, longitude, hashtag } = req.body;
  const newGT = new GeoTag(name, latitude, longitude, hashtag);

  geoTagStore.removeGeoTagByID(id); //map.delete() hat eigene Kontrolle ob Objekt vorhanden
  geoTagStore.addGeoTagByID(id, newGT);

  //kein location() weil ID unverändert
  res.location(`/api/geotags/${newGT.id}`);
  res.status(202).json(newGT);
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete("/api/geotags/:id", (req, res) => {
  const id = Number(req.params.id);
  let geoTag = geoTagStore.geoTagById(id);

  geoTagStore.removeGeoTagByID(id);
  // res.location(`/api/geotags`);

  res.status(202).json(geoTag);
});

module.exports = router;
