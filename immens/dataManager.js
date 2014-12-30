var DataManager = Backbone.Model.extend({
	
	/**
	 * @memberOf DataManager
	 */
	updateBinOrder : function(col, projection) {
		var arr = [];
		for (var i = 0; i < projection.length; i++) {
			arr.push({count:projection[i], binIdx:i});
		}
		arr.sort(function (a, b) {
		    return b.count - a.count;
		});
		var binOrder = [];
		for (var i = 0; i < arr.length; i++) {
			binOrder.push(arr[i].binIdx);
		}
		this.get("metadata")[col].binOrder = binOrder;
	},
	
	getDataTiles : function(dimInfos) {
		var cols = [], zms = [], startBins = [], endBins = [];
		for (var dim in dimInfos){
			cols.push(dimInfos[dim].getDim());
			zms.push(dimInfos[dim].getZoom());
			startBins.push(dimInfos[dim].getStartBin());
			endBins.push(dimInfos[dim].getEndBin());
		}
		
		var result = [];
		var meta = this.get("metadata");
		
		for (var c in this.get("cache")) {
			var dims = c.split(DataManager.delimiter);
			var colIdxInTile = [];
			var match = true;
			for (var i = 0; i < cols.length; i++) {
				if (dims.indexOf(cols[i] + ":" + zms[i]) < 0) {
					match = false;
					break;
				}
				colIdxInTile.push(dims.indexOf(cols[i] + ":" + zms[i]));
			}
			
			if (!match)	continue;
			
			//check the zoom level for rest of the cols is 0
			for (var j = 0; j < dims.length; j++) {
				var temp = dims[j].split(":");
				//console.log(temp);
				if (cols.indexOf( parseInt(temp[0])) < 0 && parseInt(temp[1]) != 0) {
					match = false;
					break;
				}
			}
			if (!match)	continue;
			
			//check start bin
			for (var s in this.get("cache")[c]) {
				var tileBins = s.split(DataManager.delimiter).map(function(x){return parseInt(x);});

				var binNotFit = false;
				for (var i = 0; i < cols.length; i++) {
					if (tileBins[colIdxInTile[i]] + meta[ cols[i] ].binsPerTile - 1 < startBins[i] || 
							tileBins[colIdxInTile[i]] > endBins[i]) {
						binNotFit = true;
						break;
					}
				}
				if (binNotFit)	continue;

				result.push( this.get("cache")[c][s] );
			}
			
			if (result.length > 0)
				return result;
		}
		return result;
	},
	
	//e.g. cols: [0,1,3], zoom: [4, 4, 0], startIndices: [256, 1024, 0]
	//we assume the cols are sorted
	addTile : function(cols, zoom, startIndices, id, tile){
		var cache = this.get("cache");
		
		var key = "";
		for (var i = 0; i < cols.length; i++){
			key += cols[i]+":"+zoom[i];
			if ( i != cols.length - 1)
				key += DataManager.delimiter;
		}
		
		if (!cache.hasOwnProperty(key)){
			cache[key] = {};
		}
		var binID = startIndices.join(DataManager.delimiter);
		cache[key][binID] = tile;
		
		this.get("cacheById")[id] = tile;
	},
	
	hasTile : function(id) {
		return this.get("cacheById").hasOwnProperty(id);
	},
	
	fetchTiles : function(tiles) {
		VisManager.updateStatus(true, "Retrieving Data ...");
		var networker = new Networker();
		networker.httpGet("/imMens-static/GZipServlet?q="+tiles+"&dataset="+currentDataSet, imMensEvents.tilesReceived);
	},
	
	setMetadata: function() {
		
		var meta = [];
		
		if (currentDataSet == dataSets.Brightkite){
			//brightkite
			var months = ["Jan", "Feb", "Mar", "Apr", "May","Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var days =  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", 
						"14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
			var hours = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", 
						"14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
			
			for (var col = 0; col < 5; col++){
    			var o = {};
        		o["dim"] = col;
        		o["dType"] = col <= 1 ? col : 3 ;
        		o["binsPerTile"] = col <= 1 ? 256 : col == 2 ? 12 : col == 3 ? 31 : 24  ;
        		o["totalBinCnt"] = col <= 1 ? 512 : col == 2 ? 12 : col == 3 ? 31 : 24  ;
        		if (col == 2){ //month
        			var a = [];
        			for (var c = 0; c < months.length; c++)
        				a.push(months[c]);
        			o["binNames"] = a;
        		}
        		else if (col == 3){//day
        			var a = [];
        			for (var c = 0; c < days.length; c++)
        				a.push(days[c]);
        			o["binNames"] = a;
        		}
        		else if (col == 4){//hour
        			var a = [];
        			for (var c = 0; c < hours.length; c++)
        				a.push(hours[c]);
        			o["binNames"] = a;
        		}
        		else {
        			o["binStartValue"] = 0 ;
        			o["binWidth"] = col <=1 ? 15 : 1;
        		}
        		meta.push(o);
    		}
		}
		else {
			//faa
			var binCnts = [174, 174, 28, 20, 31, 7];
			var binCntsPerTile = [174, 174, 28, 20, 31, 7];
			var carriers = ["FL", "US", "OH", "DH", "AS","OO",
					"B6", "9E", "PI", "CO", "PA (1)", "AQ", "HA",
					"XE", "EA", "NW", "DL", "EV", "ML (1)", "MQ",
					"TW", "YV", "TZ", "HP", "WN", "UA", "F9", "AA"];
			var dayOfWeek =  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
			var years = ["1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997",
					"1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008"];
			
			for (var col = 0; col < 6; col++){
    			var o = {};
        		o["dim"] = col;
        		o["dType"] = (col < 2) ? DataManager.dataTypes.numerical : col == 2 ? DataManager.dataTypes.categorical : DataManager.dataTypes.ordinal ;
        		o["binsPerTile"] = binCntsPerTile[col];
        		o["totalBinCnt"] = binCnts[col];
        		if (col == 2){ //carriers
        			var a = [];
        			for (var c = 0; c < carriers.length; c++)
        				a.push(carriers[c]);
        			o["binNames"] = a;
        		}
        		else if (col == 3){
        			var a = [];
        			for (var c = 0; c < years.length; c++)
        				a.push(years[c]);
        			o["binNames"] = a;
        		}
        		else if (col == 5){
        			var a = [];
        			for (var c = 0; c < dayOfWeek.length; c++)
        				a.push(dayOfWeek[c]);
        			o["binNames"] = a;
        		}
        		else {
        			o["binStartValue"] =  0;
        			o["binWidth"] = col <=1 ? 15 : 1;
        		}
        		meta.push(o);
    		}
		}
		
		this.set("metadata", meta);
	},
	
	defaults : function() {
		return {
			cache: {},
			cacheById: {}
		};
	},
}, {
	dataTypes: { latitude:0, longitude:1, numerical:2, categorical:3, ordinal:4},
	delimiter: "-",
	numPerPix: 2
});