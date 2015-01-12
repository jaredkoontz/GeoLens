var ActionManager = Backbone.Model.extend({

    /**
     * @memberOf ActionManager
     */
    initDrag: function (plot, coordInPlots, evt) {
        var spec = this.getVisSpec(plot, coordInPlots.x, coordInPlots.y);
        if (!spec) {
            var event = new ImMensEvent;
            event.setParam(ImMensEvent.evtTypes.clear);
            visManager.fireEvent(event);
            this.set("selStartPixs", undefined);
            this.set("activePlot", undefined);
            this.set("activeSpec", undefined);
            return;
        }

        !evt.shiftKey ? this.set("dragMode", ActionManager.dragModes.pan) :
            this.set("dragMode", ActionManager.dragModes.select);
        this.setInitDragParam(plot, spec, coordInPlots);
    },

    setInitDragParam: function (plot, spec, coordInPlots) {
        this.set("activePlot", plot);
        this.set("activeSpec", spec);
        this.set("selStartPixs", [coordInPlots.x, coordInPlots.y]);
        document.onmousemove = this.onDrag;
        document.onmouseup = this.endDrag;
    },

    onDrag: function (evt) {
        var plots = this.get("activePlot");
        var coordInPlots = plots.getCoordInPlots(evt);

        switch (this.get("dragMode")) {
            case ActionManager.dragModes.pan:
                if (!this.get("selStartPixs"))    return;
                this.pan(evt);
                break;
            case ActionManager.dragModes.select:
                if (!this.get("selStartPixs"))    return;
                this.selectArea(evt);
                break;
            default:
                break;
        }
    },

    endDrag: function (e) {
        switch (this.get("dragMode")) {
            case ActionManager.dragModes.pan:
                this.pan(e, true);
                this.set("activePlots", undefined);
                this.set("activeSpec", undefined);
                this.set("selStartPixs", undefined);
                break;
            case ActionManager.dragModes.select:
                if (this.get("activeSpec").get("cols").length == 1)
                    this.selectArea(e);
                break;
            default:
                break;
        }

        document.body.style.cursor = "default";
        document.onmousemove = null;
        document.onmouseup = null;
        this.set("dragMode", ActionManager.dragModes.none);
    },

    selectArea: function (evt) {
        var spec = this.get("activeSpec");
        document.body.style.cursor = spec.get("cols").length == 2 ? "crosshair" :
            spec.get("type") == VisSpec.visTypes.bar ? "ns-resize" : "ew-resize";
        var canvasId = this.get("activePlot").get("maskLayer");
        d3.select("#" + canvasId).selectAll(".mask").remove();

        var currentCoord = this.get("activePlot").getCoordInPlots(evt);


        var nw = {
            x: Math.max(0, Math.min(this.get("selStartPixs")[0] - spec.get("x"), currentCoord.x - spec.get("x"))),
            y: Math.max(0, Math.min(this.get("selStartPixs")[1] - spec.get("yFromTop"), currentCoord.y - spec.get("yFromTop")))
        };
        var se = {
            x: Math.min(spec.get("width"), Math.max(this.get("selStartPixs")[0] - spec.get("x"), currentCoord.x - spec.get("x"))),
            y: Math.min(spec.get("height"), Math.max(this.get("selStartPixs")[1] - spec.get("yFromTop"), currentCoord.y - spec.get("yFromTop")))
        };

        var hzF = new DimInfo, vtF = new DimInfo, brushFilter = {};
        //geo heatmap: bin index goes from low to high vertically down
        if (spec.get("type") == VisSpec.visTypes.geo) {
            hzF.setInfo(spec.get("cols")[0], spec.get("zmLevels")[0],
                spec.pixToBin(nw.x, 0, true),
                spec.pixToBin(se.x, 0, true));
            vtF.setInfo(spec.get("cols")[1], spec.get("zmLevels")[1],
                spec.pixToBin(nw.y, 1, false),
                spec.pixToBin(se.y, 1, false));
            brushFilter[spec.get("cols")[0]] = hzF;
            brushFilter[spec.get("cols")[1]] = vtF;
        } else if (spec.get("type") == VisSpec.visTypes.sp) { //binned scatterplot: bin index goes from low to high vertically up
            hzF.setInfo(spec.get("cols")[0], spec.get("zmLevels")[0],
                spec.pixToBin(nw.x, 0, true),
                spec.pixToBin(se.x, 0, true));
            vtF.setInfo(spec.get("cols")[1], spec.get("zmLevels")[1],
                spec.pixToBin(se.y, 1, false),
                spec.pixToBin(nw.y, 1, false));
            brushFilter[spec.get("cols")[0]] = hzF;
            brushFilter[spec.get("cols")[1]] = vtF;
        } else if (spec.get("type") == VisSpec.visTypes.hist) {
            hzF.setInfo(spec.get("cols")[0], spec.get("zmLevels")[0],
                spec.pixToBin(nw.x, 0, true),
                spec.pixToBin(se.x, 0, true));
            brushFilter[spec.get("cols")[0]] = hzF;
        } else if (spec.get("type") == VisSpec.visTypes.bar) {
            vtF.setInfo(spec.get("cols")[0], spec.get("zmLevels")[0],
                spec.pixToBin(nw.y, 0, false),
                spec.pixToBin(se.y, 0, false));
            brushFilter[spec.get("cols")[0]] = vtF;
        }

        var event = new ImMensEvent;
        event.setParam(ImMensEvent.evtTypes.rangeSelect, spec, brushFilter);
        visManager.fireEvent(event);

        if (spec.get("cols").length == 1) {
            return;
        }

        var maskOpacity = this.get("maskOpacity");
        d3.select("#" + canvasId).append("rect")
            .attr("fill", "black")
            .attr("fill-opacity", maskOpacity)
            .attr("pointer-events", "none")
            .attr("x", spec.get("x")).attr("y", spec.get("yFromTop"))
            .attr("width", nw.x)
            .attr("class", "mask")
            .attr("height", spec.get("height"));

        d3.select("#" + canvasId).append("rect")
            .attr("fill", "black")
            .attr("fill-opacity", maskOpacity)
            .attr("pointer-events", "none")
            .attr("class", "mask")
            .attr("x", nw.x + spec.get("x")).attr("y", spec.get("yFromTop"))
            .attr("width", se.x - nw.x)
            .attr("height", nw.y);

        d3.select("#" + canvasId).append("rect")
            .attr("fill", "black")
            .attr("fill-opacity", maskOpacity)
            .attr("pointer-events", "none")
            .attr("class", "mask")
            .attr("x", nw.x + spec.get("x")).attr("y", se.y + spec.get("yFromTop"))
            .attr("width", se.x - nw.x)
            .attr("height", spec.get("height") - se.y);

        d3.select("#" + canvasId).append("rect")
            .attr("fill", "black")
            .attr("fill-opacity", maskOpacity)
            .attr("class", "mask")
            .attr("pointer-events", "none")
            .attr("x", se.x + spec.get("x")).attr("y", spec.get("yFromTop"))
            .attr("width", spec.get("width") - se.x)
            .attr("height", spec.get("height"));

    },

    pan: function () {
        //todo
    },

    brush: function (plots, x, y) {
        if (this.get("activeSpec")) {
            return;
        }

        var spec = this.getVisSpec(plots, x, y);
        if (!spec || spec.get("cols").length == 2) {
            var event = new ImMensEvent;
            event.setParam(ImMensEvent.evtTypes.clear);
            visManager.fireEvent(event);
            return;
        }

        var xInVis = x - spec.get("x"), yInVis = y - spec.get("yFromTop");

        var brushFilter = {};
        if (spec.get("type") == VisSpec.visTypes.hist) {
            var xBin = Math.floor(spec.get("startBins")[0] + xInVis / (spec.get("pixPerBin")));
            //need to handle case where xBin is
            var f = new DimInfo;
            f.setInfo(spec.get("cols")[0], spec.get("zmLevels")[0], xBin, xBin);
            brushFilter[spec.get("cols")[0]] = f;
        } else if (spec.get("type") == VisSpec.visTypes.bar) {
            var yBin = Math.floor(spec.get("startBins")[0] + yInVis / (spec.get("pixPerBin")));
            var f = new DimInfo;
            f.setInfo(spec.get("cols")[0], spec.get("zmLevels")[0], yBin, yBin);
            brushFilter[spec.get("cols")[0]] = f;
        }

        var event = new ImMensEvent;
        event.setParam(ImMensEvent.evtTypes.brush, spec, brushFilter);
        visManager.fireEvent(event);
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

    updateRangeSlider: function (minV, maxV) {
        var mgr = this;
        $("#" + mgr.get("loValLabel")).text(0);
        $("#" + mgr.get("hiValLabel")).text(maxV);
        $("#" + mgr.get("expParamID")).slider({
            min: 0,
            max: 255,
            value: 85,
            step: 1,
            slide: function (event, ui) {
                visManager.repaintPlots();
            },
        });
        $("#" + mgr.get("colorMappingSliderID")).slider({
            range: true,
            min: 0,
            max: maxV,
            values: [0, maxV],
            slide: function (event, ui) {
                $("#" + mgr.get("loValLabel")).text(ui.values[0]);
                $("#" + mgr.get("hiValLabel")).text(ui.values[1].toFixed(0));
                visManager.repaintPlots();
            },
        });
    },

    generateControls: function () {
        var ID = this.get("divID");
        if (d3.select("#" + ID).empty()) {
            d3.select("body").append("div").attr("id", ID)
                .attr("style", "width: 100%; height: 25px; background-color: #e6e6e6; position: absolute; left: 0px; top: 0px; padding-top:15px;");
            ;
        }

        d3.select("#" + ID).append("span").text("exp").attr("style", " margin-left:20px; margin-right: 5px;");
        d3.select("#" + ID).append("span").attr("id", this.get("expParamID"))
            .attr("style", "display: inline-block; width: 255px;");

        d3.select("#" + ID).append("span").text("low").attr("id", this.get("loValLabel"))
            .attr("style", "text-align: right; display: inline-block; width: 30px; margin-left:20px; margin-right: 15px;");
        d3.select("#" + ID).append("span").attr("id", this.get("colorMappingSliderID"))
            .attr("style", "display: inline-block; width: 255px;");
        d3.select("#" + ID).append("span").text("high").attr("id", this.get("hiValLabel"))
            .attr("style", "display: inline-block; width: 30px; margin-left:15px; margin-right: 20px;");

        d3.select("#" + ID).append("input").attr("type", "button").attr("value", "benchmark").on("click", benchmark)
            .attr("style", " margin-left:30px; margin-right: 5px;");
    },

    getExpParam: function () {
        return $("#" + this.get("expParamID")).slider("value");
    },

    getLoV: function () {
        return $("#" + this.get("colorMappingSliderID")).slider("values", 0);
    },

    getHiV: function () {
        return $("#" + this.get("colorMappingSliderID")).slider("values", 1);
    },

    initialize: function () {
        this.set("divID", "visControls");
        this.set("expParamID", "visControls-Color");
        this.set("colorMappingSliderID", "visControls-Color-g");
        this.set("loValLabel", "loValLabel");
        this.set("hiValLabel", "hiValLabel");
        this.set("activePlot", undefined);
        this.set("activeSpec", undefined);	//used to keep track of range selection
        this.set("maskOpacity", 0.8);
        this.set("dragMode", ActionManager.dragModes.none);
        _.bindAll(this, 'onDrag');
        _.bindAll(this, 'endDrag');
        _.bindAll(this, 'selectArea');
        _.bindAll(this, 'pan');
    }
}, {
    dragModes: {pan: 0, resize: 1, select: 2, none: 3}
});