function drawGeohashes(geoHashData) {
    //init svg layers
    map._initPathRoot();

    //console.log(geoHashData.geohashRecs);

    // We pick up the SVG from the map object
    var svg = d3.select("#map").select("svg"),
        g = svg.append("g");

    geoHashData.geohashRecs.forEach(function (d) {
        var hashName = Object.keys(d)[0];
        var northEast = new L.LatLng(d[hashName][0], d[hashName][1]),
            southWest = new L.LatLng(d[hashName][2], d[hashName][3]);
        d.LatLngBounds = L.latLngBounds(southWest, northEast);
        d.id = hashName;
    });

    var feature = g.selectAll("rectangle")
        .data(geoHashData.geohashRecs)
        .enter().append("rect")
        //.style("stroke", "white")
        .style("opacity", .5)
        .style("fill", "red")

        //add geohash as id.
        .attr("id", function (d) {
            return d.id;
        });


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