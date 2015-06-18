<!-- shows the polygon 2 circle alg on a leaflet map --->


<!DOCTYPE html
    PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en-US">
<head profile="http://www.w3.org/2005/10/profile">
    <link rel="icon"
          type="image/png"
          href="../images/favicon.ico">
    <title>MulRes Play</title>
    <meta http-equiv="content-type"
          content="text/html;charset=utf-8"/>

    <!-- leaflet -->
    <link rel="stylesheet" href="../lib/js/leaflet.draw.css">
    <link rel="stylesheet" href="../lib/js/leaflet.css">
    <link rel="stylesheet" href="../css/geolens.css">

    <link rel="stylesheet" href="lib/leaflet-list-markers.css"/>

    <style type="text/css"></style>

    <!--lib-->
    <script src="../lib/js/d3.min.js"></script>
    <script src="../lib/js/leaflet.js"></script>
    <script src="../lib/js/leaflet.draw-src.js"></script>
    <script src="../lib/js/jquery-1.11.1.min.js"></script>


    <!-- homebrewed -->
    <script src="../geolens/globals.js"></script>
    <script src="../geolens/jsonpCallBack.js"></script>
    <script src="../geolens/dataHandling.js"></script>
    <script src="../geolens/dataMerging.js"></script>
    <script src="../geolens/geohashRectangles.js"></script>
    <script src="../geolens/leafletDrawPanel.js"></script>
    <script src="../geolens/setData.js"></script>
    <script src="../geolens/histogramClickHandler.js"></script>
    <script src="../geolens/utils.js"></script>
    <script src="../geolens/visualize.js"></script>
    <script src="../geolens/color.js"></script>
</head>

<body>

<div id="map"></div>
<script>








//    var radius = 110;             // radius in miles of wanted circle ..... US
    var radius = 70;             // radius in miles of wanted circle ..... wyco
//    var radius = 30;             // radius in miles of wanted circle ..... noco

    var numberOfPoints = 100;   //number of points we want to use to approximate the circle


    var centralLocation = [39.8282, -98.5795];
//    var centralLocation = [40.573436, -105.086547];
    var maxZoom = 18;
    var currentZoom = 5;

    var map = L.map('map').setView([centralLocation[0], centralLocation[1]], currentZoom);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
    }).addTo(map);


    var markersLayer = new L.LayerGroup();	//layer contain searched elements
    map.addLayer(markersLayer);


    var d2r = Math.PI / 180;   // degrees to radians
    var r2d = 180 / Math.PI;   // radians to degrees
    var earthsRadius = 3963; // 3963 is the radius of the earth in miles



    var polyPoints = drawCircle(centralLocation[0], centralLocation[1], numberOfPoints, radius);
    var polygon = new L.Polygon(polyPoints);
    map.addLayer(polygon);

//    for (var i = 3; i <= numberOfPoints; i++) { //i starts at 3 because 2 points is a line, and 1 point is, well, a point
//        var polyPoints = drawCircle(centralLocation[0], centralLocation[1], i, radius);
//        var polygon = new L.Polygon(polyPoints);
//        map.addLayer(polygon);
//    }

    function drawCircle(inputLong, inputLat, numberOfPoints, radius) {
        // find the radius in lat/lon
        var rlat = (radius / earthsRadius) * r2d;
        var rlng = rlat / Math.cos(inputLat * d2r);

        var poly = [];
        var latitude;
        var longitude;
        for (var i = 0; i < numberOfPoints + 1; i++) // one extra here makes sure we connect the points
        {
            var theta = Math.PI * (i / (numberOfPoints / 2));
            latitude = inputLong + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
            longitude = inputLat + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
            var point = new L.LatLng(latitude, longitude);

//            console.log(point);
            poly.push(point);
        }

        writeJava(poly);

        return poly;
    }


    function writeJava(poly) {
        console.log("return new Coordinates[]{");
        for (var index = 0; index < poly.length - 1; ++index) {
            if (index === poly.length - 2)
                console.log(" new Coordinates(" + poly[index].lat + "f, " + poly[index].lng + "f) ");
            else
                console.log(" new Coordinates(" + poly[index].lat + "f, " + poly[index].lng + "f), ");
        }
        console.log("};");
    }

</script>

</body>
</html>

