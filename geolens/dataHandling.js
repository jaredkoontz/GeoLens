

/**
 *
 */
function traverseData(wantedDepth,currentData,needToMergeGeohashes,needToSetHistogramColors,newData) {
    for (var currentKey in currentData) {
        if (currentData.hasOwnProperty(currentKey)) {
            if (wantedDepth == lowestDepth) { //are we at the lowest depth.
                var lowestReturnValues = handleLowestDepth(currentData, currentKey, needToSetHistogramColors, newData);
                newData = lowestReturnValues.newData;
                needToSetHistogramColors = lowestReturnValues.needToSetHistogramColors;
            } //wanted depth
            else {
                var returnValues = handleNonLowestAndAggregate(currentData,currentKey,needToMergeGeohashes,newData);
                newData = returnValues.newData;
                needToMergeGeohashes = returnValues.needToMergeGeohashes;
            }
        }
    }
    return {
        newData: newData,
        needToMergeGeohashes: needToMergeGeohashes,
        needToSetHistogramColors: needToSetHistogramColors
    };
}

/**
 *
 */
function handleNonLowestAndAggregate(currentData,currentKey,needToMergeGeohashes,newData){
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
    if (currentKey != "avgs") {
        //get histogram for current data.
        var geohashData = currentData[currentKey];
        var hashesTry = geohashData.hashes;
        if (typeof hashesTry == "object") {
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
        else {
            var gotThere = false;
            while (!gotThere) {
                for (var obj in geohashData) {
                    if (geohashData.hasOwnProperty(obj)) {
                        var hashesTry = geohashData[obj].hashes;
                        if (typeof hashesTry == "object") {
                            gotThere = true;
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
                    } //end for
                    else {
                        //todo this branch
                        //traverse further
                    }

                }
            }
        }
    }
    //console.log(newData);
    return {
        newData: newData,
        needToMergeGeohashes: needToMergeGeohashes
    };
}



function handleLowestDepth(currentData,currentKey,needToSetHistogramColors,newData) {
    if (currentKey == "hists") { //get histogram data
        var histData = currentData[currentKey];
        newData.histogram = getLowestHistogramData(histData, newData.histogram);
        needToSetHistogramColors = false;
    } //histogram key
    else if (currentKey == "hashes") {
        //geohash info
        var geohashColorsData = currentData[currentKey];
        newData.geohashColors = getLowestGeoHashTilesData(geohashColorsData, newData.geohashColors);
    }
    return {
        newData: newData,
        needToSetHistogramColors: needToSetHistogramColors
    };
}
