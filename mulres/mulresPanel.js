
function addMulResLeafletDrawPanel(){

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
    //edit: false;

});

var drawControlEditOnly = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: false
});



var foo = new L.Control.Attribution({

});

map.addControl(drawControl);
    map.addControl(foo);

map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;
    setLatLonValuesAndType(layer.getLatLngs(), type, layer);
    drawnItems.addLayer(layer);
    //drawControl.removeFrom(map);
    //drawControlEditOnly.addTo(map);
});


map.on('draw:delete', function (e) {
//map.on('draw:deletestop', function(e) {
//        console.log("something was deleted; showing draw control");
//        console.log(drawnItems);
    //drawControlEditOnly.removeFrom(map);
    //drawControl.addTo(map);
    //drawControl.addTo(map);
});

}