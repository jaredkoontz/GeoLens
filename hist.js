// Generate a Bates distribution of 10 random variables.
var values = d3.range(1000).map(d3.random.bates(10));

// A formatter for counts.
var formatCount = d3.format(",.0f");

var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(20))
(values);

var y = d3.scale.linear()
    .domain([0, d3.max(data, function (d) {
        return d.y;
    })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var svg = d3.select("hist").append("svg")
    .attr("width")
    .attr("height")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = svg.selectAll(".bar")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function (d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    });

bar.append("rect")
    .attr("x", 1)
    .attr("width", x(data[0].dx) - 1)
    .attr("height", function (d) {
        return height - y(d.y);
    });

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", x(data[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function (d) {
        return formatCount(d.y);
    });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

//begin immens

//
//    var visManager = new VisManager;
//    var dataManager = new DataManager;
//    var actionManager = new ActionManager;
//    var tileLoader = new TileLoader;
//
//    var dataSets = {Brightkite: 0, FAA: 1};
//
//    var currentDataSet = dataSets.Brightkite;
//
//
//    var visHt = 140, padding = 50;
//
//    var plots = new BinnedPlots({id:"plot1", width:1300 , height:650, x:20, y:40, axisSVG: "plot1-axisSVG"});
//
//
//        plots.addVisSpec( new VisSpec({
//            type:VisSpec.visTypes.hist,
//            cols: [2],
//            x: 30 + 760,
//            y: 15 + 0*(visHt+padding),
//            labelLoc: [[1060, 45]],
//            label: ["Month"],
//            width: 281,
//            height: visHt,
//            pixPerBin: [2],
//            zmLevels: [0],
//            startBins: [0],
//            endBins: [11]
//        }));
//
//        plots.addVisSpec( new VisSpec({
//            type:VisSpec.visTypes.hist,
//            cols: [3],
//            x: 30 + 760,
//            y: 25 + 1*(visHt+padding),
//            labelLoc: [[1070, 40 + 1*(visHt+padding)]],
//            label: ["Day"],
//            width: 281,
//            height: visHt,
//            pixPerBin: [2],
//            zmLevels: [0],
//            startBins: [0],
//            endBins: [30]
//        }));
//
//        plots.addVisSpec( new VisSpec({
//            type:VisSpec.visTypes.hist,
//            cols: [4],
//            x: 30 + 760,
//            y: 45 + 2*(visHt+padding),
//            labelLoc: [[1070, 50 + 400]],
//            label: ["Hour"],
//            width: 280,
//            height: visHt,
//            pixPerBin: [2],
//            zmLevels: [0],
//            startBins: [0],
//            endBins: [23]
//        }));
//
//        plots.addVisSpec( new VisSpec({
//            type:VisSpec.visTypes.geo,
//            cols: [0, 1], //projected lon first,projected lat
//            x: 20,
//            y: 45,
//            width: 700,
//            height: 510,
//            //geoBounds: new L.LatLngBounds(new L.LatLng(25.081728,-124.166399), new L.LatLng(49.577469,-70.187942)),
//            center: new L.LatLng(37.3295985,-97.1771705),
//            bgmapTileSize: 256,
//            pixPerBin: [2,2],
//            zmLevels: [4,4],
//            startBins: [296, 657], //projected lon first,projected lat
//            endBins: [767, 1023]
//        }));


//end immens
