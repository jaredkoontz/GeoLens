function d3rects() {
    //var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    //    g = svg.append("g").attr("class", "leaflet-zoom-hide");
    //
    //d3.json("json/recGeo.json", function (geoShape) {
    //
    //    //  create a d3.geo.path to convert GeoJSON to SVG
    //    var transform = d3.geo.transform({point: projectPoint}),
    //        path = d3.geo.path().projection(transform);
    //
    //    // create path elements for each of the features
    //    d3_features = g.selectAll("path")
    //        .data(geoShape.features)
    //        .enter().append("path");
    //
    //    map.on("viewreset", reset);
    //
    //    reset();
    //
    //    // fit the SVG element to leaflet's map layer
    //    function reset() {
    //
    //        bounds = path.bounds(geoShape);
    //
    //        var topLeft = bounds[0],
    //            bottomRight = bounds[1];
    //
    //        svg.attr("width", bottomRight[0] - topLeft[0])
    //            .attr("height", bottomRight[1] - topLeft[1])
    //            .style("left", topLeft[0] + "px")
    //            .style("top", topLeft[1] + "px");
    //
    //        g.attr("transform", "translate(" + -topLeft[0] + ","
    //        + -topLeft[1] + ")");
    //
    //        // initialize the path data
    //        d3_features.attr("d", path)
    //            .style("fill-opacity", 0.7)
    //            .attr('fill', 'blue');
    //    }
    //
    //    // Use Leaflet to implement a D3 geometric transformation.
    //    function projectPoint(x, y) {
    //        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    //        this.stream.point(point.x, point.y);
    //    }
    //
    //});


    //2 circles
    //
    //Initialize the SVG layer
    //map._initPathRoot();
    //
    //// We pick up the SVG from the map object
    //var svg = d3.select("#map").select("svg"),
    //    g = svg.append("g");
    //
    //d3.json("json/circles.json", function(collection) {
    //    // Add a LatLng object to each item in the dataset
    //    collection.objects.forEach(function(d) {
    //        d.LatLng = new L.LatLng(d.circle.coordinates[0],
    //            d.circle.coordinates[1])
    //    });
    //
    //    var feature = g.selectAll("circle")
    //        .data(collection.objects)
    //        .enter().append("circle")
    //        .style("stroke", "black")
    //        .style("opacity", .6)
    //        .style("fill", "red")
    //        .attr("r", 20);
    //
    //    map.on("viewreset", update);
    //    update();
    //
    //    function update() {
    //        feature.attr("transform",
    //            function(d) {
    //                return "translate("+
    //                    map.latLngToLayerPoint(d.LatLng).x +","+
    //                    map.latLngToLayerPoint(d.LatLng).y +")";
    //            }
    //        )
    //    }
    //});


    //3 rectangles
    map._initPathRoot();

    // We pick up the SVG from the map object
    var svg = d3.select("#map").select("svg"),
        g = svg.append("g");

    d3.json("json/rectangles.json", function (collection) {
        collection.objects.forEach(function (d) {
            var northEast = new L.LatLng(d.rectangle.coordinates[0][0],
                    d.rectangle.coordinates[0][1]),
                southWest = new L.LatLng(d.rectangle.coordinates[1][0],
                    d.rectangle.coordinates[1][1]);
            d.LatLngBounds = L.latLngBounds(southWest, northEast);
        });

        var feature = g.selectAll("rectangle")
            .data(collection.objects)
            .enter().append("rect")
            .style("stroke", "white")
            .style("opacity", .6)
            .style("fill", "red");
        
        map.on("viewreset", update);
        update();

        function update() {
            feature.attr("x",function(d) {
                var bounds = d.LatLngBounds;
                var southwest = bounds.getSouthWest();
                var latln1 = [southwest.lat, southwest.lng];
                return map.latLngToLayerPoint(latln1).x}
            );
            feature.attr("y",function(d) {
                var bounds = d.LatLngBounds;
                var southwest = bounds.getSouthWest();
                var latln1 = [southwest.lat, southwest.lng];
                return map.latLngToLayerPoint(latln1).y}
            );
            feature.attr("width",function(d) {
                    var bounds = d.LatLngBounds;
                    var topLeft = bounds.getNorthEast(),
                        southwest = bounds.getSouthWest();
                    var latln1 = [southwest.lat, southwest.lng];
                    var latln2 = [topLeft.lat, topLeft.lng];
                return map.latLngToLayerPoint(latln2).x - map.latLngToLayerPoint(latln1).x;
            });
            feature.attr("height",function(d) {
                var bounds = d.LatLngBounds;
                var topLeft = bounds.getNorthEast(),
                    southwest = bounds.getSouthWest();
                var latln1 = [southwest.lat, southwest.lng];
                var latln2 = [topLeft.lat, topLeft.lng];
                return map.latLngToLayerPoint(latln1).y - map.latLngToLayerPoint(latln2).y;
            });



        }
    })
}


function randomRectangles() {


    var recs = [
        [[39.7265625, -106.171875], [39.55078125, -105.8203125]],
        [[39.7265625, -105.8203125], [39.55078125, -105.46875]]
        //[[39.90234375, -106.171875], [39.7265625, -105.8203125]],
        //[[40.078125, -106.171875], [39.90234375, -105.8203125]],
        //[[39.90234375, -105.8203125], [39.7265625, -105.46875]],
        //[[40.078125, -105.8203125], [39.90234375, -105.46875]],
        //[[40.25390625, -106.171875], [40.078125, -105.8203125]],
        //[[40.4296875, -106.171875], [40.25390625, -105.8203125]],
        //[[40.25390625, -105.8203125], [40.078125, -105.46875]],
        //[[40.4296875, -105.8203125], [40.25390625, -105.46875]],
        //[[40.60546875, -106.171875], [40.4296875, -105.8203125]],
        //[[40.78125, -106.171875], [40.60546875, -105.8203125]],
        //[[40.60546875, -105.8203125], [40.4296875, -105.46875]],
        //[[40.78125, -105.8203125], [40.60546875, -105.46875]],
        //[[39.7265625, -105.46875], [39.55078125, -105.1171875]],
        //[[39.7265625, -105.1171875], [39.55078125, -104.765625]],
        //[[39.90234375, -105.46875], [39.7265625, -105.1171875]],
        //[[40.078125, -105.46875], [39.90234375, -105.1171875]],
        //[[39.90234375, -105.1171875], [39.7265625, -104.765625]],
        //[[40.078125, -105.1171875], [39.90234375, -104.765625]],
        //[[39.7265625, -104.765625], [39.55078125, -104.4140625]],
        //[[39.7265625, -104.4140625], [39.55078125, -104.0625]],
        //[[39.90234375, -104.765625], [39.7265625, -104.4140625]],
        //[[40.078125, -104.765625], [39.90234375, -104.4140625]],
        //[[39.90234375, -104.4140625], [39.7265625, -104.0625]],
        //[[40.078125, -104.4140625], [39.90234375, -104.0625]],
        //[[40.25390625, -105.46875], [40.078125, -105.1171875]],
        //[[40.4296875, -105.46875], [40.25390625, -105.1171875]],
        //[[40.25390625, -105.1171875], [40.078125, -104.765625]],
        //[[40.4296875, -105.1171875], [40.25390625, -104.765625]],
        //[[40.60546875, -105.46875], [40.4296875, -105.1171875]],
        //[[40.78125, -105.46875], [40.60546875, -105.1171875]],
        //[[40.60546875, -105.1171875], [40.4296875, -104.765625]],
        //[[40.78125, -105.1171875], [40.60546875, -104.765625]],
        //[[40.25390625, -104.765625], [40.078125, -104.4140625]],
        //[[40.4296875, -104.765625], [40.25390625, -104.4140625]],
        //[[40.25390625, -104.4140625], [40.078125, -104.0625]],
        //[[40.4296875, -104.4140625], [40.25390625, -104.0625]],
        //[[40.60546875, -104.765625], [40.4296875, -104.4140625]],
        //[[40.78125, -104.765625], [40.60546875, -104.4140625]],
        //[[40.60546875, -104.4140625], [40.4296875, -104.0625]],
        //[[40.78125, -104.4140625], [40.60546875, -104.0625]],
        //[[40.95703125, -106.171875], [40.78125, -105.8203125]],
        //[[40.95703125, -105.8203125], [40.78125, -105.46875]],
        //[[40.95703125, -105.46875], [40.78125, -105.1171875]],
        //[[40.95703125, -105.1171875], [40.78125, -104.765625]],
        //[[40.95703125, -104.765625], [40.78125, -104.4140625]],
        //[[40.95703125, -104.4140625], [40.78125, -104.0625]],
        //[[39.7265625, -104.0625], [39.55078125, -103.7109375]],
        //[[39.90234375, -104.0625], [39.7265625, -103.7109375]],
        //[[40.078125, -104.0625], [39.90234375, -103.7109375]],
        //[[40.25390625, -104.0625], [40.078125, -103.7109375]],
        //[[40.4296875, -104.0625], [40.25390625, -103.7109375]],
        //[[40.60546875, -104.0625], [40.4296875, -103.7109375]],
        //[[40.78125, -104.0625], [40.60546875, -103.7109375]],
        //[[40.95703125, -104.0625], [40.78125, -103.7109375]]
    ];

    for (var i = 0; i < recs.length; i++) {
        // define rectangle geographical bounds
        var bounds = [recs[i]];

        var properties = {
            color: "#ff7800",
            weight: .5,
            opacity: .5

        };

        // create an orange rectangle
        L.rectangle(bounds, properties).addTo(map);
    }
}