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
    var currentData = fullData.aggInfo;
    var newData = {
        "histogram": [],
        "geohashColors": []
    };

    var needToSetHistogramColors = true;
    var needToMergeGeohashes = false;
    //todo move to own method
    //"getPath"
    var path = currentPath.split(":");
    //adjust current data
    if (path.length > 1) {
        //empty one always placed in the back
        path.pop();
        //get the correct object to visualize based on the current path.
        for (var i = 0; i < path.length; i++) {
            currentData = currentData[path[i]];
        }
    }
    var tree = [];

    for (var currentKey in currentData) {
        if (currentData.hasOwnProperty(currentKey)) {
            if (wantedDepth == lowestDepth) { //are we at the lowest depth.
                if (currentKey == "hists") { //get histogram data
                    var histData = currentData[currentKey];
                    newData.histogram = getLowestHistogramData(histData,newData.histogram);
                    needToSetHistogramColors = false;
                } //histogram key
                else if (currentKey == "hashes") {
                    //geohash info
                    var geohashColorsData = currentData[currentKey];
                    newData.geohashColors = getLowestGeoHashTilesData(geohashColorsData,newData.geohashColors);
                }
            } //wanted depth
            else {
                //we are not at the end, grab the histogram averages.
                var nextChild = currentData[currentKey].avgs;
                //get the right feature
                for (var average in nextChild) {
                    if (nextChild.hasOwnProperty(average)) {
                        if (average == getCurrentFeature()) {
                            var entry = new XYCoordinateAndColor(currentKey, nextChild[average], ""); //create coordinates for d3
                            newData.histogram.push(entry); // add the data
                        }
                    }
                }

                //get histogram for current data.
                var geohashData = currentData[currentKey];
                var hashesTry = geohashData.hashes;
                if( typeof hashesTry == "object" ){
                    needToMergeGeohashes = true;
                    var thisFeature = [];
                    for (var hash in hashesTry) {
                        if (hashesTry.hasOwnProperty(hash)) {
                            for (var possibleFeatures in hashesTry[hash]) {
                                if (hashesTry[hash].hasOwnProperty(possibleFeatures)) {
                                    if (possibleFeatures == getCurrentFeature()) { //get data for current desired feature
                                        var featureValue = hashesTry[hash][possibleFeatures];
                                        var hashColorCombo = new HashColorCombo(hash, featureValue);
                                        thisFeature.push(hashColorCombo);
                                    }
                                } //current feature
                            } //iterate possible features
                        } //own property check
                    } //end for
                    newData.geohashColors.push(thisFeature);
                }
                else{
                    //todo this branch
                }

                //console.log(currentKey);
                //tree.push(currentData[currentKey]);
                //traverse(currentData);
                //var there = false;
                //while(!there) {
                //    console.log(currentData);
                //    if ('hashes' in currentData) {
                //        var geohashColorsData = currentData[currentKey];
                //        newData.geohashColors = getLowestGeoHashTilesData(geohashColorsData,newData.geohashColors);
                //    }
                //    else{
                //        var nextStep = currentData[currentKey];
                //        if(nextStep ===undefined ){
                //            for (var foo in currentData) {
                //                if (currentData.hasOwnProperty(foo)) {
                //                    currentData = currentData[foo];
                //                }
                //            }
                //        }
                //        else{
                //            currentData = currentData[currentKey];
                //        }
                //    }
                //}
                //for (var hash in geohashColorsData) {
                //    if (geohashColorsData.hasOwnProperty(hash)) {
                //        for (var possibleFeatures in geohashColorsData[hash]) {
                //            if (geohashColorsData[hash].hasOwnProperty(possibleFeatures)) {
                //                if (possibleFeatures == getCurrentFeature()) { //get data for current desired feature
                //                    var featureValue = geohashColorsData[hash][possibleFeatures];
                //                    var hashColorCombo = new HashColorCombo(hash, featureValue);
                //                    colorData.push(hashColorCombo); // add the data
                //                    max = (max < featureValue) ? featureValue : max;
                //                    min = (min > featureValue) ? featureValue : min;
                //                }
                //            } //current feature
                //        } //iterate possible features
                //    } //own property check
                //} //end for
                //colorData = computeGeoHashColors(colorData, max, min); //compute colors from data.
                //return colorData;
            }
        }
    }
    //console.log(tree);
    //var merged = MergeRecursiveGeoHashColors(tree[0], tree[1]);
    //console.log(merged);
    if(needToSetHistogramColors){
        setHistogramColors(newData.histogram);
    }
    if(needToMergeGeohashes){
        newData.geohashColors = mergeGeohashes(newData.geohashColors);
    }
    return newData;
}


function mergeGeohashes(geoHashColorArray) {
    console.log(geoHashColorArray);
    var merged = [];
    for(var i = 0 ; i < geoHashColorArray.length;i++) {
        merged = MergeRecursiveGeoHashColors(geoHashColorArray[i], merged);
    }
    console.log(merged);
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
    console.log(max);
    console.log(min);
    return computeGeoHashColors(merged, max, min);
}

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
    var normalized = normalizeHistogramByArrayContents(colorData,max,min);
    for (var hash in colorData) {
        if (colorData.hasOwnProperty(hash)) {
            histogram[index].color = getColor(normalized[hash]);
            index ++;
        }
    }
    return colorData;
}

/*
 * Recursively merge properties of two objects
 */
function MergeRecursiveGeoHashColors(obj1, obj2) {

    for (var p in obj2) {
        try {
            // Property in destination object set; update its value.
            if ( obj2[p].constructor==Object ) {
                obj1[p] = MergeRecursiveGeoHashColors(obj1[p], obj2[p]);

            } else {
                //obj1[p] = (obj1 + obj2[p])/2; //nan
                obj1[p].featureColor += obj2[p].featureColor; //combines the two
                obj1[p].hash = obj2[p].hash; //combines the two

            }

        } catch(e) {
            // Property in destination object not set; create it and set its value.
            obj1[p] = obj2[p];

        }
    }
    return obj1;
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
        currentPath = "";
        currentDepth = 0;
        var newData = getData(geolensData, 0, 0);
        drawHistogram(newData.histogram, 0, "Overview");
    }
}


//traverse down and get geohash info
//called with every property and it's value


function traverse(jsonObj) {
    if( typeof jsonObj == "object" ) {
        $.each(jsonObj, function(k,v) {
            // k is either an array index or object key
            console.log(jsonObj);
            traverse(v);
        });
    }
    else {
        // jsonOb is a number or string
        console.log(jsonObj);
    }
}


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
}