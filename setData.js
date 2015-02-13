function setDataAndVisualize() {
    var geolensData; // a global

    d3.json("json/geohashRecAndHistTest.json", function (error, json) {
        if (error) return console.warn(error);
        var geoHashRecData = json.geolens[0];
        var histData = json.geolens[1];
        drawGeohashes(geoHashRecData);
        drawHistograms(histData);
    });
}


