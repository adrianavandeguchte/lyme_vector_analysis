// Creating map object
var myMap = L.map("map", {
  center: [40.0522, -95.8437],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
}).addTo(myMap);

// var geoData = "static/data/gz_2010_us_040_00_20m.geojson";
// d3.json(geoData, function (data) {
//    L.geoJSON(data.features, {
//      style: {color: "#000"}
//    }).addTo(myMap);
// });

// Load in geojson data
var geoData = "static/data/gz_2010_us_050_00_20m.geojson";
d3.json(geoData, function (data) {
  var fip;
  for (var i = 0; i < data.features.length; i++) {
    fip = parseInt(data.features[i].properties.STATE) + "00" + parseInt(data.features[i].properties.COUNTY);
    for (var j = 0; j < lyme_data.loc.length; j++) {
      if (lyme_data.loc[j][0] == fip) {
        data.features[i].properties.LYME_CASES = lyme_data.loc[j][1];
        break;
      }
    }
  }
  console.log(data.features);

  var geojson;

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "LYME_CASES",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 6,

    // q for quartile, e for equidistant, k for k-means
    mode: "e",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.6
    },

    // Binding a pop-up to each layer
    onEachFeature: function (feature, layer) {
      layer.bindPopup("County: " + feature.properties.NAME + "<br>Lyme Cases:<br>" +
        feature.properties.LYME_CASES);
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Lyme Cases</h1>" +
      "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function (limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});

