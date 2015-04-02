/**
 *
 */


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