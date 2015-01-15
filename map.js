var centralLocation = [40.573436, -105.086547];
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib}),
    map = new L.Map('map', {
        layers: [osm],
        center: new L.LatLng(centralLocation[0], centralLocation[1]),
        zoom: 10
    });

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    draw: {
        position: 'topleft',
        polygon: {
            title: 'Draw a polygon!',
            allowIntersection: false,
            drawError: {
                color: '#FF0000',
                timeout: 1000
            },
            shapeOptions: {
                color: '#8A2BE2'
            },
            showArea: true
        },
        //remove unsed icons
        polyline: false,
        circle: false,
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
    //alert(e.shapeOptions.size);

    if (type === 'marker') {
        layer.bindPopup('A popup!');
    }

    drawnItems.addLayer(layer);
});