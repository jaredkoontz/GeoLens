var geolensData; // a global
var lowestDepth; // lowest histogram level
var lowestTitle; // lowest histogram's title

function setDataAndVisualize() {


    d3.json("json/geohashRecAndHistTest.json", function (error, json) {
        if (error) return console.warn(error);
        var geoHashRecData = json.geolens[0];
        var histData = json.geolens[1];
        geolensData = histData;
        drawGeohashes(geoHashRecData);
        drawHistogram(histData, 0, 0);
        lowestTitle = 0;
        lowestDepth = 0;
    });
}


function handleHistClick(clickedBar,depth,title) {
    if (lowestDepth == depth) {
        //if not too low
        //getNewData from clicked data depth and title
        drawHistogram(geolensData, depth+1, title+1);
        lowestDepth++;
    }
    else{
        //remove histogram or histograms
        //add new one with click data
        var clickedDepth = depth;
        var currentDepth = lowestDepth;
        while(currentDepth > clickedDepth){
            var newHist = "histogramVis"+currentDepth;
            $("#" + newHist).remove();
            depth--;
            currentDepth--;
        }
        lowestDepth = currentDepth;
    }
}