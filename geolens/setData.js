/**
 *
 */
function visualizeResponse(data, map){
    //get rectangle coords, and start parsing geohash data.
    var geoHashRecData = data.geolens[0];
    var histData = data.geolens[1];
    geolensData = histData; //set global
    drawGeohashes(geoHashRecData);
    getData(histData, 0, 0);
    currentDepth = 0; //set global
}

/**
 *
 */
function getData(fullData, wantedDepth) {
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
    var returnValues = traverseData(wantedDepth,currentData,needToMergeGeohashes,needToSetHistogramColors,newData);

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
 *
 */
function mergeGeohashes(geoHashColorArray) {
    //console.log(geoHashColorArray);
    var merged = [];
    for (var i = 0; i < geoHashColorArray.length; i++) {
        merged = MergeRecursiveGeoHashColors(geoHashColorArray[i], merged);
    }
    //console.log(merged);
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    for (var hash in merged) {
        if (merged.hasOwnProperty(hash)) {
            var featureValue = merged[hash];
            //console.log(featureValue);
            max = (max < featureValue.featureColor) ? featureValue.featureColor : max;
            min = (min > featureValue.featureColor) ? featureValue.featureColor : min;
        }
    }
   computeGeoHashColors(merged, max, min);
}

/**
 *
 */
function setHistogramColors(histogram) {
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    var colorData = [];
    for (var xyCoord in histogram) {
        if (histogram.hasOwnProperty(xyCoord)) {
            var yValue = histogram[xyCoord].y;
            colorData.push(yValue); // add the data
            max = (max < yValue) ? yValue : max;
            min = (min > yValue) ? yValue : min;
        }
    } //current feature
    var index = 0;
    var normalized = normalizeHistogramByArrayContents(colorData, max, min);
    for (var hash in colorData) {
        if (colorData.hasOwnProperty(hash)) {
            histogram[index].color = getColor(normalized[hash]);
            index++;
        }
    }
}

/**
 * Recursively merge properties of two objects
 */
function MergeRecursiveGeoHashColors(obj1, obj2) {

    for (var p in obj2) {
        try {
            // Property in destination object set; update its value.
            if (obj2[p].constructor == Object) {
                obj1[p] = MergeRecursiveGeoHashColors(obj1[p], obj2[p]);

            } else {
                //obj1[p] = (obj1 + obj2[p])/2; //nan
                obj1[p].featureColor += obj2[p].featureColor; //combines the two
                obj1[p].hash = obj2[p].hash; //combines the two

            }

        } catch (e) {
            // Property in destination object not set; create it and set its value.
            obj1[p] = obj2[p];

        }
    }
    return obj1;
}

/**
 *
 */
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
        currentPath = "";
        currentDepth = 0;
        var newData = getData(geolensData, 0, 0);
        drawHistogram(newData.histogram, 0, "Overview");
    }
}

/**
 *
 */
function updatePathText() {
    var path = currentPath.split(":");
    var formattedPath = "Current Path: ";
    //adjust current data
    if (path.length > 1) {
        //empty one always placed in the back
        path.pop();
        //get the correct object to visualize based on the current path.
        for (var i = path.length - 1; i >= 0; i--) {
            formattedPath += path[i] + " "
        }
    }
    else {
        formattedPath += "Overview"
    }
    document.getElementById("currentPath").textContent = formattedPath;
}

/**
 *
 */
function handleHistClick(clickedBar, depth) {
    //get title from clicked bar
    var title = clickedBar.x;
    if (currentDepth == depth) {
        var proposedDepth = depth + 1;
        if (proposedDepth <= lowestDepth) {
            currentPath += title + ":";
            var data = getData(geolensData, proposedDepth, title);
            drawHistogram(data.histogram, proposedDepth, title);
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
    updatePathText();
}



//code for "offline" version


function setDataAndVisualize() {
    if (!currentFeature) currentFeature = setCurrentFeature();
    //d3.json("json/outputUS.json", function (error, json) {
    //d3.json("json/output3char.json", function (error, json) {
    d3.json("json/output3char.json", function (error, json) {
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
setDataAndVisualize();