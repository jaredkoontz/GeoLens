function drawGeohashes(geoHashData) {
    //init svg layers
    map._initPathRoot();

    //console.log(geoHashData.geohashRecs);

    // We pick up the SVG from the map object
    var svg = d3.select("#map").select("svg"),
        g = svg.append("g");


    var currentObject = geoHashData.geohashRecs;
    for (var currentKey in currentObject) {


    }
    geoHashData.geohashRecs.forEach(function (d) {
        console.log(d);
        var hashname = Object.keys(d)[0];
        var northEast = new L.LatLng(d[hashname][0], d[hashname][1]),
            southWest = new L.LatLng(d[hashname][2], d[hashname][3]);
        d.LatLngBounds = L.latLngBounds(southWest, northEast);
    });

    var feature = g.selectAll("rectangle")
        .data(geoHashData.geohashRecs)
        .enter().append("rect")
        .style("stroke", "white")
        .style("opacity", .6)
        .style("fill", "red");

    feature.on("mouseover", function (d) {
        d3.select(this).style("fill", "white");
    });

    feature.on("mouseout", function (d) {
        d3.select(this).style("fill", "red");
    });

    map.on("viewreset", update);
    update();

    function update() {

        feature.attr("x", function (d) {
                var bounds = d.LatLngBounds;
                var southwest = bounds.getSouthWest();
                var bottomRight = [southwest.lat, southwest.lng];
                return map.latLngToLayerPoint(bottomRight).x
            }
        );
        feature.attr("y", function (d) {
                var bounds = d.LatLngBounds;
                var northeast = bounds.getNorthEast();
                var topLeft = [northeast.lat, northeast.lng];
                return map.latLngToLayerPoint(topLeft).y
            }
        );
        feature.attr("width", function (d) {
            var bounds = d.LatLngBounds;
            var northeast = bounds.getNorthEast(),
                southwest = bounds.getSouthWest();
            var bottomRight = [southwest.lat, southwest.lng];
            var topLeft = [northeast.lat, northeast.lng];
            return map.latLngToLayerPoint(topLeft).x - map.latLngToLayerPoint(bottomRight).x;
        });
        feature.attr("height", function (d) {
            var bounds = d.LatLngBounds;
            var northeast = bounds.getNorthEast(),
                southwest = bounds.getSouthWest();
            var bottomRight = [southwest.lat, southwest.lng];
            var topLeft = [northeast.lat, northeast.lng];
            return map.latLngToLayerPoint(bottomRight).y - map.latLngToLayerPoint(topLeft).y;
        });
    }
}


//todo remove this
//
//function randomRectangles() {
//
//
//    var recs = [
//        [[39.7265625, -106.171875], [39.55078125, -105.8203125]],
//        [[39.7265625, -105.8203125], [39.55078125, -105.46875]],
//        [[39.90234375, -106.171875], [39.7265625, -105.8203125]],
//        [[40.078125, -106.171875], [39.90234375, -105.8203125]]
//        //[[39.90234375, -105.8203125], [39.7265625, -105.46875]],
//        //[[40.078125, -105.8203125], [39.90234375, -105.46875]],
//        //[[40.25390625, -106.171875], [40.078125, -105.8203125]],
//        //[[40.4296875, -106.171875], [40.25390625, -105.8203125]],
//        //[[40.25390625, -105.8203125], [40.078125, -105.46875]],
//        //[[40.4296875, -105.8203125], [40.25390625, -105.46875]],
//        //[[40.60546875, -106.171875], [40.4296875, -105.8203125]],
//        //[[40.78125, -106.171875], [40.60546875, -105.8203125]],
//        //[[40.60546875, -105.8203125], [40.4296875, -105.46875]],
//        //[[40.78125, -105.8203125], [40.60546875, -105.46875]],
//        //[[39.7265625, -105.46875], [39.55078125, -105.1171875]],
//        //[[39.7265625, -105.1171875], [39.55078125, -104.765625]],
//        //[[39.90234375, -105.46875], [39.7265625, -105.1171875]],
//        //[[40.078125, -105.46875], [39.90234375, -105.1171875]],
//        //[[39.90234375, -105.1171875], [39.7265625, -104.765625]],
//        //[[40.078125, -105.1171875], [39.90234375, -104.765625]],
//        //[[39.7265625, -104.765625], [39.55078125, -104.4140625]],
//        //[[39.7265625, -104.4140625], [39.55078125, -104.0625]],
//        //[[39.90234375, -104.765625], [39.7265625, -104.4140625]],
//        //[[40.078125, -104.765625], [39.90234375, -104.4140625]],
//        //[[39.90234375, -104.4140625], [39.7265625, -104.0625]],
//        //[[40.078125, -104.4140625], [39.90234375, -104.0625]],
//        //[[40.25390625, -105.46875], [40.078125, -105.1171875]],
//        //[[40.4296875, -105.46875], [40.25390625, -105.1171875]],
//        //[[40.25390625, -105.1171875], [40.078125, -104.765625]],
//        //[[40.4296875, -105.1171875], [40.25390625, -104.765625]],
//        //[[40.60546875, -105.46875], [40.4296875, -105.1171875]],
//        //[[40.78125, -105.46875], [40.60546875, -105.1171875]],
//        //[[40.60546875, -105.1171875], [40.4296875, -104.765625]],
//        //[[40.78125, -105.1171875], [40.60546875, -104.765625]],
//        //[[40.25390625, -104.765625], [40.078125, -104.4140625]],
//        //[[40.4296875, -104.765625], [40.25390625, -104.4140625]],
//        //[[40.25390625, -104.4140625], [40.078125, -104.0625]],
//        //[[40.4296875, -104.4140625], [40.25390625, -104.0625]],
//        //[[40.60546875, -104.765625], [40.4296875, -104.4140625]],
//        //[[40.78125, -104.765625], [40.60546875, -104.4140625]],
//        //[[40.60546875, -104.4140625], [40.4296875, -104.0625]],
//        //[[40.78125, -104.4140625], [40.60546875, -104.0625]],
//        //[[40.95703125, -106.171875], [40.78125, -105.8203125]],
//        //[[40.95703125, -105.8203125], [40.78125, -105.46875]],
//        //[[40.95703125, -105.46875], [40.78125, -105.1171875]],
//        //[[40.95703125, -105.1171875], [40.78125, -104.765625]],
//        //[[40.95703125, -104.765625], [40.78125, -104.4140625]],
//        //[[40.95703125, -104.4140625], [40.78125, -104.0625]],
//        //[[39.7265625, -104.0625], [39.55078125, -103.7109375]],
//        //[[39.90234375, -104.0625], [39.7265625, -103.7109375]],
//        //[[40.078125, -104.0625], [39.90234375, -103.7109375]],
//        //[[40.25390625, -104.0625], [40.078125, -103.7109375]],
//        //[[40.4296875, -104.0625], [40.25390625, -103.7109375]],
//        //[[40.60546875, -104.0625], [40.4296875, -103.7109375]],
//        //[[40.78125, -104.0625], [40.60546875, -103.7109375]],
//        //[[40.95703125, -104.0625], [40.78125, -103.7109375]]
//    ];
//
//    for (var i = 0; i < recs.length; i++) {
//        // define rectangle geographical bounds
//        var bounds = [recs[i]];
//
//        var properties = {
//            color: "#fff",
//            weight: 1,
//            opacity: 0
//
//        };
//
//        // create an orange rectangle
//        L.rectangle(bounds, properties).addTo(map);
//    }
//}