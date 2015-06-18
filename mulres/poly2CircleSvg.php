<!-- shows the polygon 2 circle alg in an svg --->


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
    <script src="lib/raphael.js"></script>

</head>

<body>

<div id="canvas"></div>

<!--
<script src="../geolens/map.js"></script>
<div id="map"></div>

<script src="../geolens/easy-button.js"></script>
<script src="../geolens/leafletDrawMulResPanel.js"></script>

<script src="lib/leaflet-list-markers.js"></script>
<script src="data/markers.js"></script>
-->
<script>


    var path = drawCircleRaphael(7); //can be any number

    var size = 200;

    function drawCircleRaphael(nodes) {
        var paper, circle, radius;
        radius = 150;
//        radius = size - 50;
        paper = Raphael("canvas", radius * 4, radius * 4);
        var newPath = [];
        var deg;
        for (var x = 0; x < nodes; x++) {
            deg = (x / nodes) * 360;
            if (x === 0) {
                newPath.push("M " + Math.sin(deg * Math.PI / 180) * radius + " " + Math.cos(deg * Math.PI / 180) * radius);
            } else {
                newPath.push("L " +
                Math.sin(deg * Math.PI / 180) * radius + " " + Math.cos(deg * Math.PI / 180) * radius + " " +
                Math.sin(deg * Math.PI / 180) * radius + " " + Math.cos(deg * Math.PI / 180) * radius + " " +
                Math.sin(deg * Math.PI / 180) * radius + " " + Math.cos(deg * Math.PI / 180) * radius);
            }
        }
        newPath.push("Z");
        console.log(newPath);
        paper.path(newPath).attr({
            "fill": "#000"
        }).translate(200, 200);
    }


    //
    //    var map = new L.Map('map', {zoom: 5, minZoom: 0, center: L.latLng(40.573436, -105.086547)});	//set center from first location
    //
    //    map.addLayer(new L.TileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'));	//base layer
    //
    //    var markersLayer = new L.LayerGroup();	//layer contain searched elements
    //    map.addLayer(markersLayer);
    //
    //
    //    map.on('click', function(e) {
    //        console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    //    });


</script>

</body>
</html>

