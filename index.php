<!DOCTYPE html
    PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en-US">
<head profile="http://www.w3.org/2005/10/profile">
    <link rel="icon"
          type="image/png"
          href="images/favicon.ico">
    <title>GeoLens</title>
    <meta http-equiv="content-type"
          content="text/html;charset=utf-8"/>

    <!-- leaflet -->
    <link rel="stylesheet" href="lib/js/leaflet.draw.css">
    <link rel="stylesheet" href="lib/js/leaflet.css">
    <link rel="stylesheet" href="css/geolens.css">
    <style type="text/css"></style>

    <!--lib-->
    <script src="lib/js/d3.min.js"></script>
    <script src="lib/js/leaflet.js"></script>
    <script src="lib/js/leaflet.draw-src.js"></script>
    <script src="lib/js/jquery-1.11.1.min.js"></script>

    <!-- homebrewed -->
    <script src="geolens/globals.js"></script>
    <script src="geolens/jsonpCallBack.js"></script>
    <script src="geolens/dataHandling.js"></script>
    <script src="geolens/dataMerging.js"></script>
    <script src="geolens/geohashRectangles.js"></script>
    <script src="geolens/leafletdrawPanel.js"></script>
    <script src="geolens/setData.js"></script>
    <script src="geolens/histogramClickHandler.js"></script>
    <script src="geolens/utils.js"></script>
    <script src="geolens/visualize.js"></script>
    <script src="geolens/color.js"></script>
    <script src="geolens/zoom.js"></script>

    <?php
    if ($_GET["json"]) {
        //want to view a precomputed example
        include("php/precomputedExamples.php");
    } else {
        //todo
        //if(didn't go through the entry page, check to see galileo is up){
        //}
        //else{
        //Galileo is up.
        //}
    }
    ?>


</head>

<body>
<!-- the leaflet map -->
<div id="map">
</div>
<script src="geolens/map.js"></script>
<!-- the histogram panel -->
<div id="histPanel">
    <br/>
    <?php //todo need to create these with php ?>
    <!-- current features -->
    <form action="#" id="featureForm">
        <input type="radio" name="features" value="t" checked="checked" onchange="setCurrentFeature()"/>Temperature
        <input type="radio" name="features" value="p" onchange="setCurrentFeature()"/>Pressure
    </form>
    <hr/>
    <!-- current path -->
    <div id="currentPath">Current Path: Overview</div>
    <hr/>
    <!-- the histograms -->
    <div id="hists">
        <script src="geolens/hist.js"></script>
    </div>
</div>

</body>
</html>
