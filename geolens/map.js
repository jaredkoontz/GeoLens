var centralLocation = [40.573436, -105.086547];
var maxZoom = 18;
var currentZoom = 5;

//var tileUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', //dark map
//var tileUrl = 'http://{s}.tiles.mapbox.com/v3/MapID/{z}/{x}/{y}.png', //"vanilla" map
var tileUrl = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', //light map
    tileLayer = L.tileLayer(
        tileUrl,
        {
            //max zoom. How far in we can go.
            maxZoom: maxZoom,
            // This map option disables world wrapping. by default, it is false.
            continuousWorld: false,
            // This option disables loading tiles outside of the world bounds.
            noWrap: true
        }
    ),
    map = new L.Map('map', {
        layers: [tileLayer],
        center: new L.LatLng(centralLocation[0], centralLocation[1]),
        attributionControl: false,
        zoom: currentZoom
    });


//map.on('zoomend ', function (e) {
//    console.log(map.getZoom());
//    handleZoom(map);
//});


//map.on('moveend ', function (e) {
//    console.log(map.getZoom());
//    listVisibleGeoHashes();
//});



addLeafletDrawPanel();