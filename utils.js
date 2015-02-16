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


