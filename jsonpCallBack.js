var latLons = [];
var type = "";
function setLatLonValuesAndType(latLonsFromLeaflet, typeFromLeaflet) {
    if (latLons.length != 0) {
        //there was a query area that was edited, remove old latLons and accept new one.
        while (latLons.length > 0) {
            latLons.pop();
        }
    }
    latLons = latLonsFromLeaflet;
    type = typeFromLeaflet;
}


function sendRequest() {
    //most recently drawn shape is sent
    console.log(latLons);
    console.log(type);


    jQuery.ajax({
        type: 'GET',
        url: "http://localhost:5446/", //home
//            url: "http://lion.cs.colostate.edu:5446/", //school
        dataType: 'jsonp',
        jsonpCallback: 'geolens', // for caching
        cache: true
    }).done(function (data) {
//            alert('success' + data[0].data);
        var barData = data[0].geolens;//
        callback(barData);
//            alert(get_type(data[0].message));
    }).fail(function () {
        alert('Uh Oh!');
    });
    return $ret;
}