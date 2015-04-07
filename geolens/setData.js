/**
 *
 */


/**
 * This function gets called after the ajax call.
 * input: data from the response.
 *
 *
 */
function visualizeResponse(data, map) {
    //get rectangle coords, and start parsing geohash data.
    var geoHashRecData = data.geolens[0];
    var histData = data.geolens[1];

    geolensData = histData; //set global
    //draw the geohashes on the map
    drawGeohashes(geoHashRecData);
    //set the data and visualize it
    setData(histData, 0, 0);
    //set the depth for traversal
    currentDepth = 0; //set global
}

/**
 * The function does most of the brute work.
 * input: fullData - the entire json response
 * input: wantedDepth - The depth in the response the user is looking for
 */
function setData(fullData, wantedDepth) {
    //geohashes have been drawn on the map already, only handling the aggregation information of the json document
    var currentData = fullData.aggInfo;

    //create the new data to give to d3 to visualize
    var newData = {
        "histogram": [],
        "geohashColors": []
    };

    //booleans that are set later if we need to set colors or merge the geohashes.
    var needToSetHistogramColors = true;
    var needToMergeGeohashes = false;

    //get current path
    var path = currentPath.split(":");
    //adjust current data according to the path
    if (path.length > 1) {
        //an empty path is always placed in the back, remove it
        path.pop();

        //get the correct object to visualize based on the current path.
        for (var i = 0; i < path.length; i++) {
            currentData = currentData[path[i]];
        }

    }

    //data has been set, traverse and visualize it.
    var returnValues = traverseData(wantedDepth, currentData, needToMergeGeohashes, needToSetHistogramColors, newData);

    //are we at the lowest level and need to set colors for the histograms?
    if (returnValues.needToSetHistogramColors) {
        //set the colors of the histograms
        setHistogramColors(returnValues.newData.histogram);
    }

    //do we need to merge the geohashes?
    if (returnValues.needToMergeGeohashes) {
        //merge the geohashes
        mergeGeohashes(returnValues.newData.geohashColors);
    }

    return newData;
}


/**
 * Sets the current feature of interest.
 * Gets called when the user clicks the radio button on the histogram panel
 */
function setCurrentFeature() {
    currentFeature = $('input[name="features"]:checked').val(); //set global
    if (geolensData === undefined || geolensData === null) {
    } //gets called when the div is created, however the feature isn't selection. simply die quietly.
    else {
        //the user has chosen a feature, remove all current histograms.
        var mutableCurrentDepth = currentDepth;
        while (mutableCurrentDepth >= 0) {
            var newHist = "histogramVis" + mutableCurrentDepth;
            $("#" + newHist).remove();
            mutableCurrentDepth--;
        }

        //reset the path and depth
        currentPath = "";
        currentDepth = 0;
        //get the new data from the json document.
        var newData = setData(geolensData, 0, 0);

        //draw the overview histogram
        drawHistogram(newData.histogram, 0, "Overview");
    }
}

/**
 * This function updates the text on the histogram panel showing the
 * current path the user is viewing.
 */
function updatePathText() {
    //get the current path.
    var path = currentPath.split(":");

    var formattedPath = "Current Path: ";

    if (path.length > 1) {
        //adjust current data

        //empty one always placed in the back
        path.pop();

        //get add to the formatted path string based on the current global path.
        for (var i = path.length - 1; i >= 0; i--) {
            formattedPath += path[i] + " "
        }
    }

    else {
        //we are on the top level, label it overview
        formattedPath += "Overview";
    }

    //set the html on the geolens page to reflect the new path
    document.getElementById("currentPath").textContent = formattedPath;
}


/**
 * code for offline version.
 * reads a json document, and then sets the data.
 */
function setDataAndVisualize() {
    if (!currentFeature) currentFeature = setCurrentFeature();
    //d3.json("json/outputUS.json", function (error, json) {
    //d3.json("json/output3char.json", function (error, json) {
    d3.json("sample_outputs/outputPlay.json", function (error, json) {
        //error handling
        if (error) return console.warn(error);
        //get rectangle coords, and start parsing geohash data.
        var geoHashRecData = json.geolens[0];
        var histData = json.geolens[1];
        geolensData = histData;
        drawGeohashes(geoHashRecData);
        setData(histData, 0, 0);
        currentDepth = 0;
    });
}
setDataAndVisualize();