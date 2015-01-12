var VisSpec = Backbone.Model.extend({

    /**
     * @memberOf VisSpec
     */
    defaults: function () {
        return {};
    },

    getNumVisualTiles: function () {
        return Object.keys(this.get("visualTiles")).length;
    },

    pixToBin: function (pixInVis, col, isX) {
        if (isX) {
            return this.get("startBins")[col] + Math.floor(pixInVis / this.get("pixPerBin")[col]);
        } else if (this.get("type") == VisSpec.visTypes.sp) {
            return this.get("startBins")[col] + Math.floor((this.get("height") - pixInVis) / this.get("pixPerBin")[col]);
        } else
            return this.get("startBins")[col] + Math.floor(pixInVis / this.get("pixPerBin")[col]);
    },

    resetVisualTiles: function () {
        var xTiles = [], yTiles = [];
        var cols = this.get("cols");

        var startBin = this.get("startBins")[0];
        var xBinCnt = dataManager.get("metadata")[cols[0]].totalBinCnt;
        var xBinCntPerTile = dataManager.get("metadata")[cols[0]].binsPerTile;

        if (xBinCnt / xBinCntPerTile <= 1) {
            xTiles.push([startBin, startBin + xBinCntPerTile - 1, this.get("zmLevels")[0]]);
        } else {
            while (startBin < this.get("startBins")[0] + this.get("width") / this.get("pixPerBin")[0]) {
                xTiles.push([startBin, xBinCntPerTile * ( Math.floor(startBin / xBinCntPerTile) + 1 ) - 1, this.get("zmLevels")[0]]);
                startBin = xBinCntPerTile * (Math.floor(startBin / xBinCntPerTile) + 1);
            }
        }

        if (this.get("startBins").length > 1) {
            startBin = this.get("startBins")[1];
            var yBinCnt = dataManager.get("metadata")[cols[1]].totalBinCnt;
            var yBinCntPerTile = dataManager.get("metadata")[cols[1]].binsPerTile;

            if (yBinCnt / yBinCntPerTile <= 1) {
                yTiles.push([startBin, startBin + yBinCntPerTile - 1, this.get("zmLevels")[1]]);
            } else {
                while (startBin < this.get("startBins")[1] + this.get("height") / this.get("pixPerBin")[1]) {
                    yTiles.push([startBin, yBinCntPerTile * ( Math.floor(startBin / yBinCntPerTile) + 1) - 1, this.get("zmLevels")[1]]);
                    startBin = yBinCntPerTile * (Math.floor(startBin / yBinCntPerTile) + 1);
                }
            }
        }

        this.set("visualTiles", {});
        var vTile;
        var count = 0;
        for (var i = 0; i < xTiles.length; i++) {
            var id = cols[0] + "-" + xTiles[i][0] + "-" + xTiles[i][1] + "-" + xTiles[i][2];
            if (yTiles.length == 0) {
                vTile = new VisualTile;
                vTile.addDimension(cols[0], xTiles[i][2], xTiles[i][0], xTiles[i][1]);
                vTile.setIdx(count++);
                this.get("visualTiles")[id] = vTile;
            } else {
                var id2;
                for (var j = 0; j < yTiles.length; j++) {
                    id2 = id + "x" + cols[1] + "-" + yTiles[j][0] + "-" + yTiles[j][1] + "-" + yTiles[j][2];
                    vTile = new VisualTile;
                    vTile.setIdx(count++);
                    vTile.addDimension(cols[0], xTiles[i][2], xTiles[i][0], xTiles[i][1]);
                    vTile.addDimension(cols[1], yTiles[j][2], yTiles[j][0], yTiles[j][1]);
                    this.get("visualTiles")[id2] = vTile;
                }
            }
        }
    },

    toString: function () {
        return this.get("type") + ": " + this.getSpecId();
    },

    getFirstVisualTile: function () {
        for (var key in this.get("visualTiles")) break;
        return this.get("visualTiles")[key];
    },

    //for geomaps
    getBinBounds: function () {
        var map = this.get("bgmap");
        var pixPerBin = this.get("pixPerBin");

        var swAbsPix = map.containerPointToLayerPoint([0, this.get("height")]).add(map.getPixelOrigin());
        var neAbsPix = map.containerPointToLayerPoint([this.get("width"), 0]).add(map.getPixelOrigin());

        return {
            latStart: Math.floor(neAbsPix.y / pixPerBin[0]), latEnd: Math.ceil(swAbsPix.y / pixPerBin[0]),
            lngStart: Math.floor(swAbsPix.x / pixPerBin[1]), lngEnd: Math.ceil(neAbsPix.x / pixPerBin[1])
        };
    },

    updateGeoBins: function () {
        //{min: L.Point, max: L.Point}
        //L.Point {x: 1292, y: 1865}
        var bounds = this.get("bgmap").getPixelBounds();
        var ppb = this.get("pixPerBin");
        this.set("startBins", [Math.floor(bounds.min.x / ppb[0]), Math.floor(bounds.min.y / ppb[1])]);
        this.set("endBins", [Math.floor(bounds.max.x / ppb[0]) - 1, Math.floor(bounds.max.y / ppb[1]) - 1]);
        //console.log(this.get("startBins"), this.get("endBins"));
    },

    getSpecId: function () {
        var cols = this.get("cols");
        if (cols.length == 1)
            return cols[0];
        else
            return cols[0] + "-" + cols[1];
    }
}, {
    visTypes: {hist: 0, area: 1, sp: 2, geo: 3, bar: 4}
});