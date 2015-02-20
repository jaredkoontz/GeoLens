var getCurrentFeature = function () {
    if (!currentFeature) {
        setCurrentFeature();
    }
    return currentFeature;
};


function XYCoordinates(x, y) {
    this.x = x;
    this.y = y;
}


function HashColorCombo(hash, featureColor) {
    this.hash = hash;
    this.featureColor = featureColor;
}


function getGeohashRectByIdAndChangeColor(id,hexColor) {
    console.log(id);
    d3.select("#map")
        .select("svg")
        .selectAll("rect")
        .filter(function(d) { return d.id == id})
        .style("fill", hexColor);
}


function getLowestHistogramData(histData, histogramData) {
    for (var currentFeature in histData) {
        if (histData.hasOwnProperty(currentFeature)) {
            if (currentFeature == getCurrentFeature()) { //get data for current desired feature
                var feature = histData[currentFeature];
                for (var xy in feature) {
                    if (feature.hasOwnProperty(xy)) {
                        var coordinates = new XYCoordinates(xy, feature[xy]); //create coordinates for d3
                        histogramData.push(coordinates); // add the data
                    }
                }
            } //current feature
        } //own property check
    } //end for
    return histogramData;
}


function computeGeoHashColors(colorData, max, min) {
    //normalize values.
    //iterate through and set color values.
    var normalized = normalize(colorData,max,min);
    //console.log(normalized);
    //console.log(colorData);
    for (var hash in colorData) {
        if (colorData.hasOwnProperty(hash)) {
            var hexColor = singleHueBrewerValues(normalized[hash].featureColor);
            getGeohashRectByIdAndChangeColor(normalized[hash].hash,hexColor);
        }
    }
}


function normalize(array,max,min)
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

