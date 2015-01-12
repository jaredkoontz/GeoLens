var TileLoader = Backbone.Model.extend({

    retrieveTiles: function (tiles, idx, path, isPNG) {

        var cols, zms, bins;
        var canvas, ctxt, img;


        var getGZip = function (url, callback) {
            return d3.xhr(url, "application/json", callback);
        };

        var retrieveGZips = function (tiles, idx, path) {
            var tileId = tiles[idx].trim();
            var tile, meta, tileSize, imgSize, numPerPix = DataManager.numPerPix;
            var imgTile, cols, zms, bins;
            getGZip(path + "/" + tileId + ".tile", function (request) {
                tile = JSON.parse(request.responseText);
                meta = tile.meta;
                tileSize = 1;
                for (var col in meta) {
                    tileSize *= meta[col].end - meta[col].start + 1;
                }
                imgSize = DataUtil.logCeil(Math.ceil(Math.sqrt(tileSize / numPerPix)), 2);
                imgTile = DataUtil.json2img(tile.data, numPerPix, imgSize, tile.globalMax);
                imgTile.meta = meta;
                imgTile.id = tile.tileId;

                cols = [];
                zms = [];
                bins = [];
                for (var j in meta) {
                    cols.push(meta[j].dim);
                    zms.push(meta[j].zmlevel);
                    bins.push(meta[j].start);
                }

                dataManager.addTile(cols, zms, bins, tile.tileId, imgTile);

                if (idx < tiles.length - 1)
                    retrieveGZips(tiles, ++idx, path);

                else {
                    specifyVis();
                    d3.select("#loading").style("display", "none");
                    actionManager.generateControls();
                    visManager.generateVis();
                }
            });
        };


        var retrieveJSONs = function (tiles, idx, path, meta) {
            var tile = tiles[idx].trim();
            var imgSize, numPerPix = 2, tileSize;
            d3.json(path + "/" + tile + ".json", function (jsonTile) {

                tileSize = 1;
                for (var col in meta[tile].meta) {
                    tileSize *= meta[tile].meta[col].end - meta[tile].meta[col].start + 1;
                }

                imgSize = DataUtil.logCeil(Math.ceil(Math.sqrt(tileSize / numPerPix)), 2);

                imgTile = DataUtil.json2img(jsonTile.data, numPerPix, imgSize, meta[tile].globalMax, tile);
                imgTile.meta = meta[tile].meta;
                imgTile.id = tile;

                cols = [];
                zms = [];
                bins = [];
                for (var j in meta[tile].meta) {
                    cols.push(meta[tile].meta[j].dim);
                    zms.push(meta[tile].meta[j].zmlevel);
                    bins.push(meta[tile].meta[j].start);
                }

                dataManager.addTile(cols, zms, bins, tile, imgTile);

                if (idx < tiles.length - 1)
                    retrieveJSONs(tiles, ++idx, path, meta);

                else {
                    specifyVis();
                    d3.select("#loading").style("display", "none");
                    actionManager.generateControls();
                    visManager.generateVis();
                }
            });
        };

        var retrievePNGs = function (tiles, idx, path, meta) {
            var pngTile = new Image();
            var tile = tiles[idx].trim();
            pngTile.src = path + tile + ".png";

            pngTile.onerror = function () {
                console.log(texture.src + " does not exist");
            };

            pngTile.onload = function () {

                canvas = document.createElement("canvas");
                canvas.width = pngTile.width;
                canvas.height = pngTile.height;
                ctxt = canvas.getContext("2d");
                ctxt.drawImage(pngTile, 0, 0);
                img = pngTile;

                img.id = tile;
                img.dataSum = meta[tile].dataSum;
                img.factor = meta[tile].factor;
                img.pixMax = meta[tile].pixMax;
                img.pixSum = meta[tile].pixSum;
                img.meta = meta[tile].meta;

                cols = [];
                zms = [];
                bins = [];
                for (var j in img.meta) {
                    cols.push(img.meta[j].dim);
                    zms.push(img.meta[j].zmlevel);
                    bins.push(img.meta[j].start);
                }

                dataManager.addTile(cols, zms, bins, tile, img);
                if (idx < tiles.length - 1)
                    retrievePNGs(tiles, ++idx, path, meta);

                else {
                    d3.select("#loading").style("display", "none");
                    specifyVis();
                    actionManager.generateControls();
                    visManager.generateVis();
                }
            };
        };

        if (isPNG) {
            //load meta data first
            var x = [0, 256, 512, 768, 1024, 1280, 1536, 1792, 2048];
            var y = [0, 256, 512, 768, 1024, 1280, 1536, 1792, 2048];
            var allTiles = [];
            for (var i = 0; i < x.length - 1; i++) {
                for (var j = 0; j < y.length - 1; j++) {
                    allTiles.push("0-" + x[i] + "-" + parseInt(x[i + 1] - 1) + "-4x1-" + y[j] + "-" + parseInt(y[j + 1] - 1) + "-4x2-0-11-0");
                    allTiles.push("0-" + x[i] + "-" + parseInt(x[i + 1] - 1) + "-4x1-" + y[j] + "-" + parseInt(y[j + 1] - 1) + "-4x3-0-30-0");
                    allTiles.push("0-" + x[i] + "-" + parseInt(x[i + 1] - 1) + "-4x1-" + y[j] + "-" + parseInt(y[j + 1] - 1) + "-4x4-0-23-0");
                }
            }
            allTiles.push("2-0-11-0x3-0-30-0x4-0-23-0");
            d3.json(path + "meta.json", function (meta) {
                retrievePNGs(allTiles, 0, path, meta);
            });
        } else {
            retrieveGZips(tiles, idx, path);
        }
    },

});