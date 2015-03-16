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

randomRectangles();

map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;
    drawnItems.addLayer(layer);


    //todo fire runners to dim poly buttons
});


function randomRectangles() {


    var recs = [
        [[39.7265625, -106.171875], [39.55078125, -105.8203125]],
        [[39.7265625, -105.8203125], [39.55078125, -105.46875]],
        [[39.90234375, -106.171875], [39.7265625, -105.8203125]],
        [[40.078125, -106.171875], [39.90234375, -105.8203125]],
        [[39.90234375, -105.8203125], [39.7265625, -105.46875]],
        [[40.078125, -105.8203125], [39.90234375, -105.46875]],
        [[40.25390625, -106.171875], [40.078125, -105.8203125]],
        [[40.4296875, -106.171875], [40.25390625, -105.8203125]],
        [[40.25390625, -105.8203125], [40.078125, -105.46875]],
        [[40.4296875, -105.8203125], [40.25390625, -105.46875]],
        [[40.60546875, -106.171875], [40.4296875, -105.8203125]],
        [[40.78125, -106.171875], [40.60546875, -105.8203125]],
        [[40.60546875, -105.8203125], [40.4296875, -105.46875]],
        [[40.78125, -105.8203125], [40.60546875, -105.46875]],
        [[39.7265625, -105.46875], [39.55078125, -105.1171875]],
        [[39.7265625, -105.1171875], [39.55078125, -104.765625]],
        [[39.90234375, -105.46875], [39.7265625, -105.1171875]],
        [[40.078125, -105.46875], [39.90234375, -105.1171875]],
        [[39.90234375, -105.1171875], [39.7265625, -104.765625]],
        [[40.078125, -105.1171875], [39.90234375, -104.765625]],
        [[39.7265625, -104.765625], [39.55078125, -104.4140625]],
        [[39.7265625, -104.4140625], [39.55078125, -104.0625]],
        [[39.90234375, -104.765625], [39.7265625, -104.4140625]],
        [[40.078125, -104.765625], [39.90234375, -104.4140625]],
        [[39.90234375, -104.4140625], [39.7265625, -104.0625]],
        [[40.078125, -104.4140625], [39.90234375, -104.0625]],
        [[40.25390625, -105.46875], [40.078125, -105.1171875]],
        [[40.4296875, -105.46875], [40.25390625, -105.1171875]],
        [[40.25390625, -105.1171875], [40.078125, -104.765625]],
        [[40.4296875, -105.1171875], [40.25390625, -104.765625]],
        [[40.60546875, -105.46875], [40.4296875, -105.1171875]],
        [[40.78125, -105.46875], [40.60546875, -105.1171875]],
        [[40.60546875, -105.1171875], [40.4296875, -104.765625]],
        [[40.78125, -105.1171875], [40.60546875, -104.765625]],
        [[40.25390625, -104.765625], [40.078125, -104.4140625]],
        [[40.4296875, -104.765625], [40.25390625, -104.4140625]],
        [[40.25390625, -104.4140625], [40.078125, -104.0625]],
        [[40.4296875, -104.4140625], [40.25390625, -104.0625]],
        [[40.60546875, -104.765625], [40.4296875, -104.4140625]],
        [[40.78125, -104.765625], [40.60546875, -104.4140625]],
        [[40.60546875, -104.4140625], [40.4296875, -104.0625]],
        [[40.78125, -104.4140625], [40.60546875, -104.0625]],
        [[40.95703125, -106.171875], [40.78125, -105.8203125]],
        [[40.95703125, -105.8203125], [40.78125, -105.46875]],
        [[40.95703125, -105.46875], [40.78125, -105.1171875]],
        [[40.95703125, -105.1171875], [40.78125, -104.765625]],
        [[40.95703125, -104.765625], [40.78125, -104.4140625]],
        [[40.95703125, -104.4140625], [40.78125, -104.0625]],
        [[39.7265625, -104.0625], [39.55078125, -103.7109375]],
        [[39.90234375, -104.0625], [39.7265625, -103.7109375]],
        [[40.078125, -104.0625], [39.90234375, -103.7109375]],
        [[40.25390625, -104.0625], [40.078125, -103.7109375]],
        [[40.4296875, -104.0625], [40.25390625, -103.7109375]],
        [[40.60546875, -104.0625], [40.4296875, -103.7109375]],
        [[40.78125, -104.0625], [40.60546875, -103.7109375]],
        [[40.95703125, -104.0625], [40.78125, -103.7109375]]
    ];

    for (var i = 0; i < recs.length; i++) {
        // define rectangle geographical bounds
        var bounds = [recs[i]];

        var properties = {
            color: "#ff7800",
            weight: .5,
            opacity: .5

        };

        // create an orange rectangle
        L.rectangle(bounds, properties).addTo(map);
    }
}
