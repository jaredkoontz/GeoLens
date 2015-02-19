var geolensData; // a global
var currentDepth; // lowest histogram level
var lowestDepth = 2; //lowest depth of the json array. todo dont hardcode: send over or compute?
var currentFeature; //current selected feature.
var currentPath = "";

function setDataAndVisualize() {
    if (!currentFeature) currentFeature = setCurrentFeature();
    d3.json("json/output.json", function (error, json) {
        //error handling
        if (error) return console.warn(error);
        //get rectangle coords, and start parsing geohash data.
        var geoHashRecData = json.geolens[0];
        var histData = json.geolens[1];
        geolensData = histData;
        drawGeohashes(geoHashRecData);
        getData(histData, 0, 0);
        currentDepth = 0;
    });
}


function getData(fullData, wantedDepth) {
    //console.log(currentPath);
    var currentData = fullData.aggInfo;
    var newData = [];
    var path = currentPath.split(":");

    if (path.length > 1) {
        //empty one always placed in the back
        path.pop();
        //get the correct object to visualize based on the current path.
        for (var i = 0; i < path.length; i++) {
            currentData = currentData[path[i]];
        }
    }

    for (var currentKey in currentData) {
        if (currentData.hasOwnProperty(currentKey)) {
            if (wantedDepth == lowestDepth) { //are we at the lowest depth.
                if (currentKey == "hists") { //get histogram data
                    var histData = currentData[currentKey];
                    for (var currentFeature in histData) {
                        if (histData.hasOwnProperty(currentFeature)) {
                            if (currentFeature == getCurrentFeature()) { //get data for current desired feature
                                var feature = histData[currentFeature];
                                for (var xy in feature) {
                                    if (feature.hasOwnProperty(xy)) {
                                        var coordinates = new XYCoordinates(xy, feature[xy]); //create coordinates for d3
                                        newData.push(coordinates); // add the data
                                    }
                                }
                            } //current feature
                        } //own property check
                    } //end for
                } //histogram key
            } //wanted depth
            else {
                //we are not at the end, grab the histogram averages.
                var nextChild = currentData[currentKey].avgs;
                //get the right feature
                for (var average in nextChild) {
                    if (nextChild.hasOwnProperty(average)) {
                        if (average == getCurrentFeature()) {
                            var entry = new XYCoordinates(currentKey, nextChild[average]); //create coordinates for d3
                            newData.push(entry); // add the data
                        }
                    }
                }
            }
        }
    }
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
        console.log("called");
        currentPath = "";
        currentDepth = 0;
        drawHistogram(getData(geolensData, 0, 0), 0, "Overview");
    }
}

//todo does not handle going too low.
function handleHistClick(clickedBar, depth) {
    //get title from clicked bar
    var title = clickedBar.x;
    if (currentDepth == depth) {
        var proposedDepth = depth + 1;
        if (proposedDepth <= lowestDepth) {
            currentPath += title + ":";
            var data = getData(geolensData, proposedDepth, title);
            drawHistogram(data, proposedDepth, title);
            currentDepth++;
        }
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
            //remove last colon
            var str = currentPath.substring(0, currentPath.length - 1);
            var n = str.lastIndexOf(":");
            currentPath = currentPath.substring(0, n + 1);
        }
        currentDepth = mutableCurrentDepth;
    }
}