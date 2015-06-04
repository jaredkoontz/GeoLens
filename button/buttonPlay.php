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
    <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">


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


</head>

<body>

<div id="map"></div>
<script src="../geolens/map.js"></script>
<script src="easy-button.js"></script>

<script>
    L.easyButton('fa-eye',
        function (){alert('hello!')},
        'Increase Resolution If Possible'
    );
    L.easyButton('fa-eye-slash',
        function (){alert('hello!')},
        'Decrease Resolution If Possible'
    );

</script>

</body>
</html>