var latLons = [];
var type = "";
var layer;

/**
 *
 */
function setLatLonValuesAndType(latLonsFromLeaflet, typeFromLeaflet, layerCreated) {
    if (latLons.length != 0) {
        //there was a query area that was edited, remove old latLons and accept new one.
        while (latLons.length > 0) {
            latLons.pop();
        }
    }
    latLons = latLonsFromLeaflet;
    type = typeFromLeaflet;
    layer = layerCreated;
}

/**
 *
 */
function sendJsonpRequest(index, val, map, callback) {
    //most recently drawn shape is sent
    var $ret = 0;
    console.log(latLons);
    console.log(type);
    console.log(layer);


    //todo pass coordinator of query in cookies
    //todo pass lat longs and type in query.

    $.ajax({
        type: 'GET',
        url: "http://localhost:5446/", //home
//            url: "http://lion.cs.colostate.edu:5446/", //school
        dataType: 'jsonp',
        jsonpCallback: 'geolens', // for caching
        cache: false,
        async: false
    }).done(function (data) {
        map.removeLayer(layer);
        var barData = data[0];//
        callback(barData);
    }).fail(function () {
        alert('Uh Oh!');
    });
    return $ret;
}

