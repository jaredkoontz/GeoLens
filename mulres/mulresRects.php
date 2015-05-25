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
    <script src="../geolens/leafletdrawPanel.js"></script>
    <script src="../geolens/setData.js"></script>
    <script src="../geolens/histogramClickHandler.js"></script>
    <script src="../geolens/utils.js"></script>
    <script src="../geolens/visualize.js"></script>
    <script src="../geolens/color.js"></script>
    <script src="mulresPanel.js"></script>
    <script src="leaflet-button-control.js"></script>


</head>

<body>

<div id="map"></div>

<script src="lib/leaflet-list-markers.js"></script>
<script src="data/rects.js"></script>
<script>

    var map = new L.Map('map', {zoom: 5, minZoom: 0, center: L.latLng(40.573436, -105.086547)});	//set center from first location

    map.addLayer(new L.TileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'));	//base layer

    var markersLayer = new L.LayerGroup();	//layer contain searched elements
    map.addLayer(markersLayer);

    ////////////populate map from cities-italy.js
    for (var i in cities) {
        var latLongs = cities[i].loc;
        var bounds = L.latLngBounds([latLongs[0], latLongs[1]], [latLongs[2], latLongs[3]]);
        L.rectangle(bounds, {color: "#ff7800", weight: 1, title: cities[i].name}).addTo(map);
    }

    map.on('zoomend ', function (e) {
        console.log(map.getZoom());
        listVisibleGeoHashes();
    });


    map.on('moveend ', function (e) {
        console.log(map.getZoom());
        listVisibleGeoHashes();
    });


    addMulResLeafletDrawPanel();




    function listVisibleGeoHashes() {
        map.eachLayer(function (layer) {
            if (layer instanceof L.Rectangle)
                if (map.getBounds().contains(layer.getBounds()))
                    console.log(layer);
        });
    }



</script>

</body>
</html>