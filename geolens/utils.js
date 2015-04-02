/**
 *
 */

/**
 *
 */
function linkFromBrushing(brushedSelection, type) {
    if (currentDepth == 2) {
        var currentColor = brushedSelection.style("fill");
        var rgb = currentColor.match(/\d+/g);
        var new_red = 255 - rgb[0];
        var new_green = 255 - rgb[1];
        var new_blue = 255 - rgb[2];
        if (type == "hash") {
            //need to highlight bars
            var correctHistogram = d3.select("#histogramVis" + currentDepth).selectAll("rect");
            correctHistogram.each(function () {
                var currentStyle = this.style.fill;
                console.log(this.style.fill);
                if (currentColor == currentStyle) {
                    this.style.stroke = rgbToHex(new_red, new_green, new_blue);
                    this.style.strokeWidth = 6;
                }
            });
        }
        else if (type == "bar") {
            //need to highlight hashes
            var svg = d3.select("#map").select("svg");
            var hashes = svg.select('g').selectAll("rect");

            hashes.each(function () {
                var currentStyle = this.style.fill;
                console.log(this.style.fill);
                if (currentColor == currentStyle) {
                    this.style.stroke = rgbToHex(new_red, new_green, new_blue);
                    this.style.strokeWidth = 6;
                }
            });
        }
    }
}

/**
 *
 */
function unlinkFromBrushing(brushedSelection, type) {
    if (currentDepth == 2) {
        var currentColor = brushedSelection.style("fill");
        if (type == "hash") {
            //need to highlight bars
            var correctHistogram = d3.select("#histogramVis" + currentDepth).selectAll("rect");
            correctHistogram.each(function () {
                var currentStyle = this.style.fill;
                console.log(this.style.fill);
                if (currentColor == currentStyle) {
                    this.style.stroke = "none";
                }
            });
        }
        else if (type == "bar") {
            //need to highlight hashes
            var svg = d3.select("#map").select("svg");
            var hashes = svg.select('g').selectAll("rect");

            hashes.each(function () {
                var currentStyle = this.style.fill;
                console.log(this.style.fill);
                if (currentColor == currentStyle) {
                    this.style.stroke = "none";
                }
            });


        }
    }
}

/**
 *
 */
var getCurrentFeature = function () {
    if (!currentFeature) {
        setCurrentFeature();
    }
    return currentFeature;
};

/**
 *
 */
function XYCoordinateAndColor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
}

/**
 *
 */
function HashColorCombo(hash, featureColor) {
    this.hash = hash;
    this.featureColor = featureColor;
}

/**
 *
 */
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

/**
 *
 */
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

/**
 *
 */
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

/**
 *
 */
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