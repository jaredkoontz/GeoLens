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