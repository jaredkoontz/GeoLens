function linkFromBrushing(brushedSelection, type) {
    var currentColor = brushedSelection.style("fill");
    var rgb = currentColor.match(/\d+/g);
    var red = 255 - rgb[0];
    var green = 255 - rgb[1];
    var blue = 255 - rgb[2];
    if (type == "hash") {
        //need to highlight bars
        console.log("hash");
        //console.log(brushedSelection);
        //highlight single bar
        var correctHistogram = d3.select("#histogramVis" + currentDepth).selectAll("rect");

        console.log(correctHistogram);
        console.log(rgb);
    }
    else if (type == "bar") {
        //need to highlight hashes
        console.log("bar");
        //console.log(brushedSelection);
        //highlight multiple hashes

    }

}


var getCurrentFeature = function () {
    if (!currentFeature) {
        setCurrentFeature();
    }
    return currentFeature;
};


function XYCoordinateAndColor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
}


function HashColorCombo(hash, featureColor) {
    this.hash = hash;
    this.featureColor = featureColor;
}


function normalizeByArrayIndex(histData, max, min) {
    var normalizedArr = [];
    for (var i = 0, len = histData.length; i < len; i++) {
        var numerator = ([i] - min);
        var denominator = (max - min);
        var normalized = numerator / denominator;
        normalizedArr.push(normalized);
    }
    return normalizedArr;
}


function computeGeoHashColors(colorData, max, min) {
    var normalized = normalizeGeoHashByArrayContents(colorData, max, min);
    //console.log(normalized);
    for (var hash in colorData) {
        if (colorData.hasOwnProperty(hash)) {
            var hexColor = getColor(normalized[hash].featureColor);
            getGeohashRectByIdAndChangeColor(normalized[hash].hash, hexColor);
        }
    }
}


function normalizeGeoHashByArrayContents(array, max, min) {
    var normalizedArr = [];
    for (var i = 0, len = array.length; i < len; i++) {
        var numerator = (array[i].featureColor - min);
        var denominator = (max - min);
        var normalized = numerator / denominator;
        normalizedArr.push(new HashColorCombo(array[i].hash, normalized));
    }
    return normalizedArr;
}


function normalizeHistogramByArrayContents(array, max, min) {
    var normalizedArr = [];
    for (var i = 0, len = array.length; i < len; i++) {
        var numerator = (array[i] - min);
        var denominator = (max - min);
        var normalized = numerator / denominator;
        normalizedArr.push(normalized);
    }
    return normalizedArr;
}