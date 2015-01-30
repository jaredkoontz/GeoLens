var centralLocation = [40.573436, -105.086547];
var maxZoom = 18;
var currentZoom = 5;

var tileUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
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

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    draw: {
        position: 'topleft',
        polygon: {
            title: 'Draw a polygon',
            allowIntersection: false,
            drawError: {
                color: '#FF0000',
                timeout: 1000
            },
            shapeOptions: {
                color: '#8A2BE2'
            },
            showArea: false
        },
        rectangle: {
            title: 'Draw a rectangle',
            shapeOptions: {
                color: '#8A2BE2'
            }
        },
        //remove unsed icons
        polyline: false,
        circle: false, //todo add circle back
        marker: false
    },
    edit: {
        featureGroup: drawnItems
    }

});
map.addControl(drawControl);

map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;
    setLatLonValuesAndType(layer.getLatLngs(),type);
    drawnItems.addLayer(layer);

    //todo fire runners to dim poly buttons
});

