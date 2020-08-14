var express = require("express");
var axios = require("axios");
const { query } = require("express");
var router = express.Router();

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const OPENWEATHER_TOKEN = process.env.OPENWEATHER_TOKEN;
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ data: "Express" });
});
async function getCoordinates(city) {
  try {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.cords/${encodeURIComponent(
        city
      )}.json?access_token=${MAPBOX_TOKEN}`
    );
    return data.features[0];
  } catch (err) {
    return null;
  }
}
async function getWeather([lng, lat]) {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_TOKEN}&units=metric`
    );
    return data;
  } catch (er) {
    return null;
  }
}
//put post patch delete get
router.get("/", async function (req, res) {
  try {
    const { city } = req.query;
    console.log(req.query);
    if (!city) {
      return res.status(400).json({ error: "city query is required" });
    }
    const cord = await getCoordinates(city);
    if (!cord) {
      return res.status(401).json({ error: "city cant be found" });
    }
    const result = await getWeather(cord.geometry.coordinates);
    if (!result) {
      return res
        .status(400)
        .json({ message: "Cannot get weather for your cord" });
    }
    result["cord"] = cord.cord_name;

    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
