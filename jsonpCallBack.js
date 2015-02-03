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
    console.log(latLons);
    console.log(type);
}