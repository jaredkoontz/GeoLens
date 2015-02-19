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

function getGeohashRectById(id) {
    var svg = d3.select("#map").select("svg");
    return svg.selectAll("rect").select("id", id);
}

