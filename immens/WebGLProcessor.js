var WebGLProcessor = Backbone.Model.extend({

    /**
     * @memberOf WebGLProcessor
     */
    run: function () {

        var gl = this.get("gl");

        if (!this.get("frameBuffer")) {
            this.set({
                frameBuffer: gl.createFramebuffer(),
            });
        }

        if (!this.get("resultImg")) {
            this.set("resultImg", this.createFBOTexture(gl));
        }

        this.createTileTextures(gl);
        this.bindTextures(gl, this.get("frameBuffer"));


        if (!this.get("program3D")) {
            this.set("program3D", this.createProgram(gl, true, false));
        }

        this.rollup(gl);
    },

    processVisualTile: function (gl, visualTile, vSpec) {
        if (visualTile.getNumDataTile() == 0)
            return;

        visualTile.set("pixSum", 0);
        visualTile.set("dataSum", 0);

        for (var i in visualTile.getDataTiles()) {
            visualTile.set("pixSum", visualTile.get("pixSum") +
            this.get("binnedPlots").get("allTiles")[i].pixSum);
            visualTile.set("dataSum", visualTile.get("dataSum") +
            this.get("binnedPlots").get("allTiles")[i].dataSum);
        }

        var numDim = visualTile.getDataTileDimensionality();

        var prog = numDim < 4 ? this.get("program3D") : this.get("program4D");
        gl.useProgram(prog);

        var h = vSpec.get("fboHeight");
        var x0 = visualTile.getIdx();

        this.setProgramParameters(gl, prog, visualTile, vSpec);

        var binTexYPos = this.get("binYLoc");
        var cols = vSpec.get("cols");
        var binIdx = this.getBinTexIdx(cols);

        var fboImg = this.get("resultImg");
        var binTexWd = fboImg.width;
        var binTexHt = fboImg.height;
        gl.viewport(0, 0, fboImg.width, fboImg.height);

        this.drawPart(prog, gl, x0 * vSpec.get("fboWidthPerVTile") * 2 / binTexWd, binTexYPos[binIdx] * 2 / binTexHt,
            (x0 + 1) * vSpec.get("fboWidthPerVTile") * 2 / binTexWd, (binTexYPos[binIdx] + h) * 2 / binTexHt,
            binTexWd, binTexHt);
    },

    rollup: function (gl) {
        var visSpecs = this.get("binnedPlots").get("visSpecs");

        this.clear();

        var spec;
        for (var s in visSpecs) {
            spec = visSpecs[s];

            for (var vTileId in spec.get("visualTiles")) {
                this.processVisualTile(gl, spec.get("visualTiles")[vTileId], spec);
            }
        }
        if (!this.isBg())    return;

        for (var s in visSpecs) {
            var cols = visSpecs[s].get("cols");
            var binIdx = this.getBinTexIdx(cols);

            this.get("binnedPlots").get("rollupStats")[binIdx] = this.getRollupStats(gl, visSpecs[s]);
            //to do, right now only sorting the bins by project results and storing the order in datamanager
            if (dataManager.get("metadata")[visSpecs[s].get("cols")[0]].dType == DataManager.dataTypes.categorical) {
                dataManager.updateBinOrder(visSpecs[s].get("cols")[0], this.get("binnedPlots").get("rollupStats")[binIdx][3]);
            }

            if (visSpecs[s].get("cols").length == 2) {
                actionManager.updateRangeSlider(this.get("binnedPlots").get("rollupStats")[binIdx][2] * 255,
                    this.get("binnedPlots").get("rollupStats")[binIdx][0] * 255);
            }
        }
    },

    getRollupStats: function (gl, spec) {
        var w, h;
        var cols = spec.get("cols");
        if (cols.length == 1) {
            w = spec.get("fboWidthPerVTile") * spec.getNumVisualTiles(); //dataManager.get("metadata")[ cols[0] ].binsPerTile;
            h = 1;
        } else {
            w = spec.get("fboWidthPerVTile") * spec.getNumVisualTiles();
            h = spec.get("fboHeight");
        }

        var pix = new Uint8Array(w * h * 4);

        var binTexYPos = this.get("binYLoc");
        var binIdx = this.getBinTexIdx(cols);

        gl.readPixels(0, binTexYPos[binIdx], w, h, gl.RGBA, gl.UNSIGNED_BYTE, pix);

        var max = 0, min = 1000, s = 0;
        var v;

        var heatmap = [];

        for (var i = 0; i < w * h * 4; i += 4) {
            v = pix[i + 3] * Math.pow(2, 24) + pix[i + 2] * Math.pow(2, 16) + pix[i + 1] * Math.pow(2, 8) + pix[i];
            heatmap.push(v);
            s += v;
            if (v > max)
                max = v;
            if (v < min && v > 0.003 * 255) //&& v > 0.003 * 255
                min = v;
        }
        return [max / (255.0), s / (w * h * 255.0), min / 255.0, heatmap];
    },

    drawPart: function (prog, gl, x1, y1, x2, y2, wd, ht) {
        var positionLocation = gl.getAttribLocation(prog, "a_position");
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1.0 + x1, -1.0 + y1,
                -1.0 + x2, -1.0 + y1,
                -1.0 + x1, -1.0 + y2,
                -1.0 + x1, -1.0 + y2,
                -1.0 + x2, -1.0 + y1,
                -1.0 + x2, -1.0 + y2]),
            gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        //gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        // draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    },

    getYPosOnFBO: function (vSpec) {
        var cols = vSpec.get("cols");
        var idx = this.getBinTexIdx(cols);
        return this.get("binYLoc")[idx];
    },

    resetResultStore: function () {
        var gl = this.get("gl");
        var visSpecs = this.get("binnedPlots").get("visSpecs");
        var temp = Object.keys(visSpecs);
        temp.sort(function (a, b) {
            return visSpecs[a].get("type") - visSpecs[b].get("type");
        });

        var binTexYPos = {};
        var key, binIdx, count = 0;

        for (var j = 0; j < temp.length; j++) {
            key = temp[j];
            binIdx = this.getBinTexIdx(visSpecs[key].get("cols"));

            if (binTexYPos.hasOwnProperty(binIdx))    continue;

            binTexYPos[binIdx] = count;
            count += visSpecs[key].get("fboHeight");
        }

        var binTexWd = DataUtil.logCeil(this.get("binnedPlots").get("fboWidth"), 2);
        var binTexHt = DataUtil.logCeil(count, 2);
        var tex = DataUtil.createTexture(gl, binTexWd, binTexHt);
        tex.width = binTexWd;
        tex.height = binTexHt;
        //console.log("fbo size: ", binTexWd, binTexHt);
        this.set("binYLoc", binTexYPos);
        //this.set("resultImg",  tex);
        this.set("resultImg", tex);
        return tex;
    },

    setProgramParameters: function (gl, currentProgram, visTile, visSpec) {
        var cols = visSpec.get("cols");
        var idx = this.getBinTexIdx(cols);

        //assuming all tiles need to draw this vis have same dimensions/zoom levels
        var tileCols = [];
        var binCnts = [];

        var dataTile = this.get("binnedPlots").get("allTiles")[visTile.getFirstDataTileId()];

        for (var i in dataTile.meta) {
            tileCols.push(parseInt(dataTile.meta[i].dim));
            binCnts.push(dataTile.meta[i].end - dataTile.meta[i].start + 1);
        }

        gl.uniform2f(currentProgram.cols, tileCols.indexOf(cols[0]), cols.length == 1 ? tileCols.indexOf(cols[0]) : tileCols.indexOf(cols[1]));
        gl.uniform4f(currentProgram.binCnts, binCnts[0], binCnts[1], binCnts[2],
            tileCols.length < 4 ? 0 : binCnts[3]);

        gl.uniform1f(currentProgram.binXPos, visTile.getIdx() * visSpec.get("fboWidthPerVTile"));
        gl.uniform1f(currentProgram.binYPos, this.get("binYLoc")[idx]);
        gl.uniform4f(currentProgram.offsets, 1, binCnts[0], binCnts[0] * binCnts[1],
            tileCols.length < 4 ? 0 : binCnts[0] * binCnts[1] * binCnts[2]);
        gl.uniform1f(currentProgram.numDataTiles, visTile.getNumDataTile());
        gl.uniform1f(currentProgram.maxCnt, visTile.get("pixSum") / visTile.getNumDataTile());

        var textureLoc, loLoc, hiLoc, texWdLoc;
        var count = 0;
        for (var tileId in visTile.getDataTiles()) {
            var rangeInfo = visTile.getDataTiles()[tileId];

            textureLoc = count == 0 ? currentProgram.texture0 : count == 1 ? currentProgram.texture1 :
                count == 2 ? currentProgram.texture2 : count == 3 ? currentProgram.texture3 :
                    count == 4 ? currentProgram.texture4 : currentProgram.texture5;
            loLoc = count == 0 ? currentProgram.lo0 : count == 1 ? currentProgram.lo1 : count == 2 ? currentProgram.lo2 :
                count == 3 ? currentProgram.lo3 : count == 4 ? currentProgram.lo4 : currentProgram.lo5;
            hiLoc = count == 0 ? currentProgram.hi0 : count == 1 ? currentProgram.hi1 : count == 2 ? currentProgram.hi2 :
                count == 3 ? currentProgram.hi3 : count == 4 ? currentProgram.hi4 : currentProgram.hi5;
            texWdLoc = count == 0 ? currentProgram.textureWd0 : count == 1 ? currentProgram.textureWd1 :
                count == 2 ? currentProgram.textureWd2 : count == 3 ? currentProgram.textureWd3 :
                    count == 4 ? currentProgram.textureWd4 : currentProgram.textureWd5;

            //bind tile textures
            gl.activeTexture(gl.TEXTURE0 + count);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindTexture(gl.TEXTURE_2D, this.get("tileTextures")[tileId]);

            gl.uniform1i(textureLoc, count);

            if (this.isBg()) {
                gl.uniform4f(loLoc, 0, 0, 0, 0);

                gl.uniform4f(hiLoc, rangeInfo[tileCols[0]].tileEnd - rangeInfo[tileCols[0]].tileStart,
                    rangeInfo[tileCols[1]].tileEnd - rangeInfo[tileCols[1]].tileStart,
                    rangeInfo[tileCols[2]].tileEnd - rangeInfo[tileCols[2]].tileStart,
                    tileCols.length < 4 ? 0 : rangeInfo[tileCols[3]].tileEnd - rangeInfo[tileCols[3]].tileStart);
            } else {
                gl.uniform4f(loLoc, rangeInfo[tileCols[0]].relStart, rangeInfo[tileCols[1]].relStart, rangeInfo[tileCols[2]].relStart,
                    tileCols.length < 4 ? 0 : rangeInfo[tileCols[3]].relStart);

                gl.uniform4f(hiLoc, rangeInfo[tileCols[0]].relEnd, rangeInfo[tileCols[1]].relEnd, rangeInfo[tileCols[2]].relEnd,
                    tileCols.length < 4 ? 0 : rangeInfo[tileCols[3]].relEnd);
            }


            gl.uniform1f(texWdLoc, this.get("binnedPlots").get("allTiles")[tileId].width);
            gl.uniform1f(currentProgram.dataTileFactor, this.get("binnedPlots").get("allTiles")[tileId].factor);
            count++;
        }
    },

    bindTextures: function (gl, rttFramebuffer) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);

        var rollupTexture = this.get("resultImg");
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rollupTexture, 0);

//		var tex;
//		if (tileTexs.length > 16)	console.log(tileTexs.length);
//		for (var c = 0; c < 16; c++) {
//			tex = tileTexs[c];
//			gl.activeTexture(gl.TEXTURE0 + c);
//			gl.bindTexture(gl.TEXTURE_2D, null); 
//			gl.bindTexture(gl.TEXTURE_2D, tex); 
//			
//			this.get("tileIdxLookup")[tex.id] = c;
//		}
    },

    getBinTexIdx: function (cols) {
        if (cols.length == 1)
            return cols[0];
        else {
            if (cols[0] <= cols[1])
                return cols[0] + "-" + cols[1];
            else
                return cols[1] + "-" + cols[0];
        }
    },

    //x (horizontal): num visual tiles
    //y (vertical): numSpecs
    createFBOTexture: function (gl) {
        var visSpecs = this.get("binnedPlots").get("visSpecs");
        var temp = Object.keys(visSpecs);
        temp.sort(function (a, b) {
            return visSpecs[a].get("type") - visSpecs[b].get("type");
        });

        var binTexYPos = {};
        var key, binIdx, count = 0;

        for (var j = 0; j < temp.length; j++) {
            key = temp[j];
            binIdx = this.getBinTexIdx(visSpecs[key].get("cols"));

            if (binTexYPos.hasOwnProperty(binIdx))    continue;

            binTexYPos[binIdx] = count;
            count += visSpecs[key].get("fboHeight");
        }

        var binTexWd = DataUtil.logCeil(this.get("binnedPlots").get("fboWidth"), 2);
        var binTexHt = DataUtil.logCeil(count, 2);
        var tex = DataUtil.createTexture(gl, binTexWd, binTexHt);
        tex.width = binTexWd;
        tex.height = binTexHt;
        console.log("fbo size: ", binTexWd, binTexHt);
        this.set("binYLoc", binTexYPos);

        return tex;
    },

    createProgram: function (gl, is3D, packing4Bytes) {
        var p = gl.createProgram();
        gl.attachShader(p, Shaders.getVertexShader(gl));

        if (is3D) {
            switch (DataManager.numPerPix) {
                case 4:
                    gl.attachShader(p, Shaders.getQueryShader3D_1Byte(gl));
                    break;
                case 2:
                    gl.attachShader(p, Shaders.getQueryShader3D_2Bytes(gl));
                    break;
                case 1:
                    gl.attachShader(p, Shaders.getQueryShader3D_4Bytes(gl));
                    break;
            }
        } else {
            gl.attachShader(p, Shaders.getQueryShader4D_1Byte(gl));
        }

        gl.linkProgram(p);
        p.cols = gl.getUniformLocation(p, "u_cols");
        p.binCnts = gl.getUniformLocation(p, "u_binCnts");
        p.binXPos = gl.getUniformLocation(p, "u_xLoc");
        p.binYPos = gl.getUniformLocation(p, "u_yLoc");
        p.offsets = gl.getUniformLocation(p, "u_offsets");
        p.numDataTiles = gl.getUniformLocation(p, "u_numTiles");
        p.textureWd0 = gl.getUniformLocation(p, "u_texw0");
        p.textureWd1 = gl.getUniformLocation(p, "u_texw1");
        p.textureWd2 = gl.getUniformLocation(p, "u_texw2");
        p.textureWd3 = gl.getUniformLocation(p, "u_texw3");
        p.textureWd4 = gl.getUniformLocation(p, "u_texw4");
        p.textureWd5 = gl.getUniformLocation(p, "u_texw5");
        p.dataTileFactor = gl.getUniformLocation(p, "u_factor");
        p.lo0 = gl.getUniformLocation(p, "u_lo0");
        p.lo1 = gl.getUniformLocation(p, "u_lo1");
        p.lo2 = gl.getUniformLocation(p, "u_lo2");
        p.lo3 = gl.getUniformLocation(p, "u_lo3");
        p.lo4 = gl.getUniformLocation(p, "u_lo4");
        p.lo5 = gl.getUniformLocation(p, "u_lo5");
        p.hi0 = gl.getUniformLocation(p, "u_hi0");
        p.hi1 = gl.getUniformLocation(p, "u_hi1");
        p.hi2 = gl.getUniformLocation(p, "u_hi2");
        p.hi3 = gl.getUniformLocation(p, "u_hi3");
        p.hi4 = gl.getUniformLocation(p, "u_hi4");
        p.hi5 = gl.getUniformLocation(p, "u_hi5");
        p.maxCnt = gl.getUniformLocation(p, "u_maxCnt");
        p.texture0 = gl.getUniformLocation(p, "u_data0");
        p.texture1 = gl.getUniformLocation(p, "u_data1");
        p.texture2 = gl.getUniformLocation(p, "u_data2");
        p.texture3 = gl.getUniformLocation(p, "u_data3");
        p.texture4 = gl.getUniformLocation(p, "u_data4");
        p.texture5 = gl.getUniformLocation(p, "u_data5");
        return p;
    },

    createTileTextures: function (gl) {
        var plots = this.get("binnedPlots");
        var tiles = plots.get("allTiles");

        var maxPixSum = 0;
        var tileTexs = [];
        var tex, tile;

        for (var i in tiles) {
            if (this.get("tileTextures").hasOwnProperty(i)) {
                tileTexs.push(this.get("tileTextures")[i]);
                continue;
            }

            tile = tiles[i];
            tex = DataUtil.createTexture(gl, tile.width, tile.height, tile);
            tex.meta = tile.meta;
            tex.dataSum = tile.dataSum;
            tex.id = tile.id;

            tex.width = tile.width;
            tex.height = tile.height;
            tex.pixMax = tile.pixMax;
            tex.pixSum = tile.pixSum;

            this.get("tileTextures")[i] = tex;
            tileTexs.push(tex);

            if (tiles[i].pixSum > maxPixSum)
                maxPixSum = tiles[i].pixSum;
        }

        this.set("maxPixSum", maxPixSum);
        //this.set("dataTileTextures", tileTexs);
        return tileTexs;
    },

    initialize: function () {
        this.set("programs", {});
        //this.set("tileIdxLookup", {});
        _.bindAll(this, 'rollup');
        this.set("tileTextures", {});
    },

    clear: function () {
        var gl = this.get("gl");
        gl.clearColor(0.0, 0.0, 0.0, 0.0);                      // Set clear color to black, fully opaque
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
    },

    isBg: function () {
        return this.get("isBg");
    }
});