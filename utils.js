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


function getGeohashRectByIdAndChangeColor(id,hexColor) {
    d3.select("#map")
        .select("svg")
        .selectAll("rect")
        .filter(function(d) { return d.id == id})
        .style("fill", hexColor);
}



function getLowestHistogramData(potentialHistData, createdData) {
    for (var currentFeature in potentialHistData) {
        if (potentialHistData.hasOwnProperty(currentFeature)) {
            if (currentFeature == getCurrentFeature()) { //get data for current desired feature
                var feature = potentialHistData[currentFeature];
                for (var xy in feature) {
                    if (feature.hasOwnProperty(xy)) {
                        var coordinates = new XYCoordinateAndColor(xy, feature[xy], ""); //create coordinates for d3
                        createdData.push(coordinates); // add the data
                    }
                }
            } //current feature
        } //own property check
    } //end for
    //set colors for histograms.
    var min = 0;
    var max = createdData.length;
    var normalized = normalizeByArrayIndex(createdData,max,min);
    var index = 0;
    for (var normalizedValue in normalized) {
        if (normalized.hasOwnProperty(normalizedValue)) {
            createdData[index].color = getColor(normalized[normalizedValue]);
            index++;
        }
    }
    return createdData;
}

function normalizeByArrayIndex(histData, max, min) {
        var normalizedArr = [];
        for( var i = 0, len = histData.length; i < len; i++ )
        {
            var numerator = ([i]- min);
            var denominator = (max - min);
            var normalized = numerator/denominator;
            normalizedArr.push(normalized);
        }
        return normalizedArr;
}


function computeGeoHashColors(colorData, max, min) {
    var normalized = normalizeGeoHashByArrayContents(colorData,max,min);
    for (var hash in colorData) {
        if (colorData.hasOwnProperty(hash)) {
            var hexColor = getColor(normalized[hash].featureColor);
            getGeohashRectByIdAndChangeColor(normalized[hash].hash,hexColor);
        }
    }
}


function normalizeGeoHashByArrayContents(array,max,min)
{
    var normalizedArr = [];
    for( var i = 0, len = array.length; i < len; i++ )
    {
        var numerator = (array[i].featureColor - min);
        var denominator = (max - min);
        var normalized = numerator/denominator;
        normalizedArr.push(new HashColorCombo(array[i].hash,normalized));
    }
    return normalizedArr;
}


function normalizeHistogramByArrayContents(array,max,min)
{
    var normalizedArr = [];
    for( var i = 0, len = array.length; i < len; i++ )
    {
        var numerator = (array[i] - min);
        var denominator = (max - min);
        var normalized = numerator/denominator;
        normalizedArr.push(normalized);
    }
    return normalizedArr;
}



function getLowestGeoHashTilesData(geohashColorsData, colorData) {
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;

    for (var hash in geohashColorsData) {
        if (geohashColorsData.hasOwnProperty(hash)) {
            for (var possibleFeatures in geohashColorsData[hash]) {
                if (geohashColorsData[hash].hasOwnProperty(possibleFeatures)) {
                    if (possibleFeatures == getCurrentFeature()) { //get data for current desired feature
                        var featureValue = geohashColorsData[hash][possibleFeatures];
                        var hashColorCombo = new HashColorCombo(hash, featureValue);
                        colorData.push(hashColorCombo); // add the data
                        max = (max < featureValue) ? featureValue : max;
                        min = (min > featureValue) ? featureValue : min;
                    }
                } //current feature
            } //iterate possible features
        } //own property check
    } //end for
    colorData = computeGeoHashColors(colorData, max, min); //compute colors from data.
    return colorData;
}

