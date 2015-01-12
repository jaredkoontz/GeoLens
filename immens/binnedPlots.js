var BinnedPlots = Backbone.Model.extend({

    /**
     * @memberOf BinnedPlots
     */
    initDataTiles: function (activeSpec, excludedSpec) {

        var allRequiredTiles = {};
        var specs = this.get("visSpecs");
        var spec, vTiles, vTile;

        for (var i in specs) {
            spec = specs[i];
            if (excludedSpec && excludedSpec.indexOf(spec) >= 0)    continue;

            vTiles = spec.get("visualTiles");
            for (var vTileId in vTiles) {
                vTile = vTiles[vTileId];
                var dimInfos = vTile.getDimensionInfos();

                if (activeSpec) {
                    var cols = activeSpec.get("cols");
                    var tempDimInfo;
                    for (var a = 0; a < cols.length; a++) {
                        if (Object.keys(dimInfos).indexOf(cols[a]) >= 0)
                            continue;

                        tempDimInfo = new DimInfo;
                        tempDimInfo.setInfo(cols[a], activeSpec.get("zmLevels")[a],
                            activeSpec.get("startBins")[a], activeSpec.get("endBins")[a]);
                        dimInfos[cols[a]] = tempDimInfo;
                    }
                }

                var tiles = dataManager.getDataTiles(dimInfos);
                vTile.resetDataTiles();

                for (var j = 0; j < tiles.length; j++) {
                    if (!allRequiredTiles.hasOwnProperty(tiles[j].id))
                        allRequiredTiles[tiles[j].id] = tiles[j];
                    vTile.addDataTile(tiles[j]);
                }//add data tiles required for each visual tile
            }// for each visual tile

            var numTiles = Object.keys(vTiles).length;
            if (spec.get("fboWidthPerVTile") * numTiles > this.get("fboWidth"))
                this.set("fboWidth", spec.get("fboWidthPerVTile") * numTiles);
        }//for each spec
        //console.log(allRequiredTiles);
        this.set("allTiles", allRequiredTiles);
    },

    visualizeBg: function () {
        for (var s in this.get("visSpecs")) {
            this.get("visSpecs")[s].resetVisualTiles();
        }

        this.initDataTiles();
        this.get("bgProcessor").run();
        this.get("bgRenderer").run();
    },

    getVisSpec: function (plots, x, y) {
        var spec = undefined;
        for (var i in plots.get("visSpecs")) {
            spec = plots.get("visSpecs")[i];
            if (spec.get("x") <= x && spec.get("x") + spec.get("width") >= x &&
                spec.get("yFromTop") <= y && spec.get("yFromTop") + spec.get("height") >= y) {
                return spec;
            }
        }
        return undefined;
    },

    updateFg: function (brushFilter, excludedSpecs) {
        this.set("brushFilter", brushFilter);
        for (var s in this.get("visSpecs")) {
            if (excludedSpecs && excludedSpecs.indexOf(this.get("visSpecs")[s]) >= 0)
                continue;

            var vTiles = this.get("visSpecs")[s].get("visualTiles");
            for (var v in vTiles) {
                vTiles[v].updateDataTileWithBrushInfo(brushFilter);
            }
        }

        this.get("fgProcessor").run();
        this.get("fgRenderer").run();
    },

    processEvent: function (event) {

        var excludedSpec = event.getSource() && event.getSource().get("cols").length == 2 ?
            [event.getSource()] : undefined;

        if (this.get("activeSpec") != event.getSource()) {
            this.initDataTiles(event.getSource(), excludedSpec);
            this.set("activeSpec", event.getSource());
        }

        switch (event.getType()) {
            case ImMensEvent.evtTypes.clear:
                var canvasId = this.get("maskLayer");
                d3.select("#" + canvasId).selectAll(".mask").remove();
                this.set("brushFilter", undefined);
                this.updateFg();
                break;
            case ImMensEvent.evtTypes.brush:
                var canvasId = this.get("maskLayer");
                d3.select("#" + canvasId).selectAll(".mask").remove();
                //this.set("brushFilter", event.getValue());
                this.updateFg(event.getValue());
                break;
            case ImMensEvent.evtTypes.rangeSelect:
                //this.set("brushFilter", event.getValue());
                //this.get("fgProcessor").resetResultStore();
                this.initDataTiles(this.get("activeSpec"), excludedSpec);
                this.get("fgProcessor").resetResultStore();
                this.updateFg(event.getValue(), excludedSpec);
                break;
            case ImMensEvent.evtTypes.pan:
                //this.set("brushFilter", undefined);
                var canvasId = this.get("maskLayer");
                d3.select("#" + canvasId).selectAll(".mask").remove();
                for (var s in this.get("visSpecs")) {
                    this.get("visSpecs")[s].resetVisualTiles();
                }
                this.initDataTiles();
                this.get("fgProcessor").resetResultStore();
                this.updateFg();
                break;
        }
    },

    createCanvas: function (isBg) {

        var ID = isBg ? this.get("id") + "-bg" : this.get("id") + "-fg";
        if (d3.select("#" + ID).empty()) {
            d3.select("body").append("canvas").attr("id", ID).attr("class", "canvas")
                .attr("width", this.get("width")).attr("height", this.get("height"))
                .attr("style", "position: absolute; left: " + this.get("x") + "px; top: " + this.get("y") + "px;");
        }

        this.set(isBg ? "bgCtxt" : "fgCtxt", document.getElementById(ID).getContext("experimental-webgl", {
            depth: false,
            preserveDrawingBuffer: isBg
        }));

    },

    getCoordInPlots: function (evt) {
        var fgCanvas = document.getElementById(this.get("id") + "-fg");
        var rect = fgCanvas.getBoundingClientRect(), root = document.documentElement;
        var x_pos = evt.clientX - rect.left - root.scrollLeft;
        var y_pos = evt.clientY - rect.top - root.scrollTop;
        return {x: x_pos, y: y_pos};
    },

    addVisSpec: function (spec) {
        spec.set("yFromTop", spec.get("y"));
        spec.set("y", this.get("height") - spec.get("yFromTop") - spec.get("height"));

        var cols = spec.get("cols");
        var key = cols.join("-");
        this.get("visSpecs")[key] = spec;

        var fboWidthPerTile = dataManager.get("metadata")[cols[0]].binsPerTile;
        if (cols.length > 1 && dataManager.get("metadata")[cols[1]].binsPerTile > fboWidthPerTile)
            fboWidthPerTile = dataManager.get("metadata")[cols[1]].binsPerTile;
        //height allocated to this spec on the fbo image
        var fboHeight = cols.length == 1 ? 1 : fboWidthPerTile;

        spec.set("fboWidthPerVTile", fboWidthPerTile);
        spec.set("fboHeight", fboHeight);

        if (cols.length == 1) {
            var width = spec.get("type") == VisSpec.visTypes.bar ? spec.get("height") : spec.get("width");
            spec.set("pixPerBin", [width / fboWidthPerTile]);
            if (width / fboWidthPerTile > 15) {
                spec.set("histGap", Math.floor(width / fboWidthPerTile - 13));
            } else {
                spec.set("histGap", 1.0);
            }
        }

        if (spec.get("type") == VisSpec.visTypes.geo) {

            var divID = "geo-" + spec.get("cols").join("-");

            if (d3.select("#" + divID).empty())
                d3.select("body").append("div").attr("id", divID).attr("class", "map")
                    .attr("style", "display:block; width: " + spec.get("width") + "px; height: " + spec.get("height") + "px; position: absolute; left: " + parseInt(this.get("x") + spec.get("x")) + "px; top: " + parseInt(this.get("y") + spec.get("yFromTop")) + "px; background-color:black;")
                    .attr("pointer-events", "none");

            spec.set("bgmap", new L.Map(divID, {
                inertia: false,
                boxZoom: false,
                zoomControl: false,
                maxZoom: 4,
                minZoom: 4
            }));

            var tileLayer = new L.TileLayer(BinnedPlots.CloudmadeUrl, {
                tileSize: spec.get("bgmapTileSize"),
                minZoom: spec.get("minZm"),
                maxZoom: spec.get("maxZm"), styleId: 72337
            });

            spec.set("minZm", 4);
            spec.set("maxZm", 4);
            spec.get("bgmap").setView(spec.get("center"), spec.get("minZm")).addLayer(tileLayer);
            spec.get("bgmap").on('move', function () {
                spec.updateGeoBins();
                var event = new ImMensEvent;
                event.setParam(ImMensEvent.evtTypes.pan, spec);
                visManager.fireEvent(event);
            }).on('moveStart', function () {
                spec.updateGeoBins();
                var event = new ImMensEvent;
                event.setParam(ImMensEvent.evtTypes.pan, spec);
                visManager.fireEvent(event);
            }).on('moveend', function () {
                spec.updateGeoBins();
                var event = new ImMensEvent;
                event.setParam(ImMensEvent.evtTypes.pan, spec);
                visManager.fireEvent(event);
            }).on('mousedown', function (evt) {
                if (evt.originalEvent.shiftKey) {
                    spec.get("bgmap").dragging.disable();
                    var plot = visManager.get("charts")[0];
                    actionManager.initDrag(plot, plot.getCoordInPlots(evt.originalEvent), evt.originalEvent);
                }

            }).on('mouseup', function (evt) {
                spec.get("bgmap").dragging.enable();

            });


        }
    },

    initPlot: function () {

        //svg stuff
        d3.select("body").append("svg").attr("id", this.get("svgLayer"))
            .attr("width", this.get("width")).attr("height", this.get("height") + 10)
            .attr("style", "position: absolute;left:" + this.get("x") + "px; top:" + this.get("y") + "px;")
        ;


        this.createCanvas(true);
        this.createCanvas(false);

        var svgLayer = d3.select("#" + this.get("svgLayer"));

        var spec;
        for (var s in this.get("visSpecs")) {
            spec = this.get("visSpecs")[s];
            if (spec.get("type") != VisSpec.visTypes.geo) {
                svgLayer.append("g")
                    .attr("id", "yaxis" + spec.getSpecId())
                    .attr("class", "axis")
                    .attr("transform", "translate(" + parseInt(spec.get("x") - 2) + "," + parseInt(spec.get("yFromTop")) + ")");

                svgLayer.append("g")
                    .attr("id", "xaxis" + spec.getSpecId())
                    .attr("class", "axis")
                    .attr("transform", "translate(" + spec.get("x") + "," + parseInt(spec.get("height") + spec.get("yFromTop")) + ")");
            }

            if (spec.has("label")) {
                var hzLbl = spec.get("label")[0], vtLbl = spec.get("label")[1];
                if (hzLbl) {
                    d3.select("body").append("span").attr("class", "label").text(hzLbl)
                        .attr("style", "position: absolute; left: " + spec.get("labelLoc")[0][0] + "px; top: " + spec.get("labelLoc")[0][1] + "px;");
                }
                if (vtLbl) {
                    var centerX = spec.get("x") + spec.get("width") / 2;
                    var centerY = spec.get("yFromTop") + spec.get("width") / 2;
                    svgLayer.append("text").attr("class", "label").text(vtLbl)
                        .attr("x", spec.get("labelLoc")[1][0])
                        .attr("y", spec.get("labelLoc")[1][1])
                        .attr("transform", "rotate(-90," + centerX + ", " + centerY + ")")
                    ;
                }
            }
        }

        //svg foreground for drawing masks
        d3.select("body").append("svg").attr("id", this.get("maskLayer")).attr("class", "mask")
            .attr("width", this.get("width")).attr("height", this.get("height"))
            .attr("style", "position: absolute;left:" + this.get("x") + "px; top:" + this.get("y") + "px;border: 0px solid #ddd;")
        ;

        var plots = this;
        svgLayer = document.getElementById(this.get("svgLayer"));
        svgLayer.addEventListener('mousemove', function (evt) {
//			var rect = fgCanvas.getBoundingClientRect(), root = document.documentElement;
//			// return relative mouse position
//			var x = evt.clientX - rect.left - root.scrollLeft;
//			var y = evt.clientY - rect.top - root.scrollTop;
//			actionManager.brush(plots, x, y) ;
            var coords = plots.getCoordInPlots(evt);
            document.body.style.cursor = "default";
            actionManager.brush(plots, coords.x, coords.y);
        }, false);

        svgLayer.addEventListener('mousedown', function (evt) {
            actionManager.initDrag(plots, plots.getCoordInPlots(evt), evt);
        }, false);

        var bgProc = new WebGLProcessor({
            gl: this.get("bgCtxt"),
            binnedPlots: this,
            isBg: true,
        });

        var fgProc = new WebGLProcessor({
            gl: this.get("fgCtxt"),
            binnedPlots: this,
            isBg: false,
        });

        this.set({
            bgProcessor: bgProc,

            bgRenderer: new WebGLRenderer({
                gl: this.get("bgCtxt"),
                binnedPlots: this,
                isBg: true,
                processor: bgProc
            }),

            fgProcessor: fgProc,

            fgRenderer: new WebGLRenderer({
                gl: this.get("fgCtxt"),
                binnedPlots: this,
                isBg: false,
                processor: fgProc
            })
        });
    },

    initialize: function () {
        this.set("visSpecs", {});
        this.set("fboWidth", 0);
        this.set("rollupStats", {});
        this.set("svgLayer", "svgLayer");
        this.set("maskLayer", "maskLayer");
        this.set("activeSpec", undefined);
    }
}, {
    //MAX_LATITUDE: 85.0840591556,
    //R_MINOR: 6356752.3142,
    //R_MAJOR: 6378137,
    CloudmadeUrl: 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/72337/256/{z}/{x}/{y}.png',
    CloudmadeAttribution: 'Map data &copy; OpenStreetMap contributors, Imagery &copy; CloudMade',
});