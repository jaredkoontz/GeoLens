var VisManager = Backbone.Model.extend({
		
	/**
	 * @memberOf VisManager
	 */
	
	generateVis : function() {
		
		VisManager.updateStatus(false);
		d3.selectAll(".vis").style("display","block");
		
		var plots = this.get("charts");
		for (var i = 0; i < plots.length; i++) {
			plots[i].initPlot();
			plots[i].visualizeBg();
			plots[i].updateFg();
		}
	},
	
	fireEvent : function(imEvt) {
		this.get("charts")[0].processEvent(imEvt);
	},
	
	displayConstructionUI : function() {
		VisManager.updateStatus(false);
		d3.selectAll(".spec").style("display","block");
		generateTileSpecs();
	},
	
	defaults : function() {
		return {
			charts : [],
		};
	},

	
	initialize : function() {
		if (!this.get("charts")) {
			this.set({
				charts : [],
			});
		}
		_.bindAll(this, 'repaintPlots');
	},
	
	addCharts: function(c){
		this.get("charts").push(c);
	},
	
	repaintPlots : function(){
		var plots = this.get("charts");
		for (var i = 0; i < plots.length; i++) {
			plots[i].get("fgRenderer").run();
		}
	},
	
	addGeoHeatmap: function(m){
		this.get("geoHeatmaps").push(m);
	},
	
},{
	updateStatus : function(visible, msg) {
		
		if (visible){
			if (!d3.select("#status").empty())
				d3.select("#status").remove();
			d3.select("body").append("div").attr("id", "status").attr("class", "leaflet-control");
			d3.select("#status").style("display","inline-block");
		}
		else
			d3.select("#status").style("display","none");
		
		if (msg)
			d3.select("#status").text(msg);
	}
});



