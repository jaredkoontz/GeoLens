var geolensData; // a global
var currentDepth; // lowest histogram level
var lowestTitle; // lowest histogram's title
var lowestDepth = 2; //lowest depth of the json array. todo dont hardcode: send over or compute?
var currentFeature; //current selected feature.
//todo use this
var currentPath = "";

function setDataAndVisualize() {
    if (!currentFeature) currentFeature = setCurrentFeature();
    //console.log(currentFeature);
    d3.json("json/output.json", function (error, json) {
        //error handling
        if (error) return console.warn(error);
        //get rectangle coords, and start parsing geohash data.
        var geoHashRecData = json.geolens[0];
        var histData = json.geolens[1];
        geolensData = histData;
        drawGeohashes(geoHashRecData);
        var data = getData(histData, 0, 0);
        drawHistogram(data, 0, 0);
        lowestTitle = 0;
        currentDepth = 0;
    });
}

//current json implementation provides an avg field
//todo redo using get current path
//if has avgs or if depth == maxdepth?

//todo where to update path?
function getData(fullData, wantedDepth) {
    var currentObject = fullData.histograms;
    var newData = [];
    var path = currentPath.split(":");

    if (path.length > 1) {
        //empty one always placed in the back
        path.pop();
        //get the correct object to visualize based on the current path.
        for (var i = 0; i < path.length; i++) {
            currentObject = currentObject[path[i]];
        }
    }

    for (var currentKey in currentObject) {
        if (currentObject.hasOwnProperty(currentKey)) {
            if (wantedDepth == lowestDepth) {
                if (currentKey == getCurrentFeature()) {
                    var jsonObj = currentObject[currentKey];
                    console.log(jsonObj);
                    for (var xy in jsonObj) {
                        if (jsonObj.hasOwnProperty(xy)) {
                            var coordinates = new XYCoordinates(xy, jsonObj[xy]);
                            newData.push(coordinates);
                        }
                    }
                }
            }
            else {
                var nextChild = currentObject[currentKey].avgs;
                //get the right feature
                for (var feature in nextChild) {
                    if (nextChild.hasOwnProperty(feature)) {
                        if (feature == getCurrentFeature()) {
                            var entry = new XYCoordinates(currentKey, nextChild[feature]);
                            newData.push(entry);
                        }
                    }
                }
            }

        }
    }
    console.log(newData);
    return newData;
}

function setCurrentFeature() {
    currentFeature = $('input[name="features"]:checked').val();
    if (geolensData === undefined || geolensData === null) {
    }
    else {
        var mutableCurrentDepth = currentDepth;
        while (mutableCurrentDepth >= 0) {
            var newHist = "histogramVis" + mutableCurrentDepth;
            $("#" + newHist).remove();
            mutableCurrentDepth--;
        }
        //todo uncomment for feature changing
        //drawHistogram(getData(geolensData, 0, 0), 0, 0);
    }
}

//todo does not handle going too low.
function handleHistClick(clickedBar, depth) {
    //get title from clicked bar
    var title = clickedBar.x;
    if (currentDepth == depth) {
        //if not too low
        //getNewData from clicked data depth and title
        currentPath += title + ":";
        var data = getData(geolensData, depth + 1, title);
        drawHistogram(data, depth + 1, title);
        currentDepth++;
    }
    else {
        //remove histogram or histograms
        //add new one with click data
        var clickedDepth = depth;
        var mutableCurrentDepth = currentDepth;
        while (mutableCurrentDepth > clickedDepth) {
            var newHist = "histogramVis" + mutableCurrentDepth;
            $("#" + newHist).remove();
            depth--;
            mutableCurrentDepth--;
            //todo remove last entry from path
            //remove last colon
            var str = currentPath.substring(0, currentPath.length - 1);
            var n = str.lastIndexOf(":");
            currentPath = currentPath.substring(0, n);
        }
        currentDepth = mutableCurrentDepth;
    }

}