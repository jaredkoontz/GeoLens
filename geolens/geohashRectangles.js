/**
 *
 */
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
        .style("opacity", .7)
        .style("fill", "red")

        //add geohash as id.
        .attr("id", function (d) {
            if (currentResolution != d.id.length) {
                currentResolution = d.id.length;
            }
            return d.id;
        });

    var currentColor;

    feature.on("mouseover", function () {
        var geohashRec = d3.select(this);
        currentColor = geohashRec.style("fill");
        var rgb = currentColor.match(/\d+/g);
        var new_red = 255 - rgb[0];
        var new_green = 255 - rgb[1];
        var new_blue = 255 - rgb[2];
        geohashRec.style("stroke", rgbToHex(new_red, new_green, new_blue));
        geohashRec.style("stroke-width", 6);
        linkFromBrushing(geohashRec, "hash");

        //todo possible code for adding geohash to rectangle
        //need to wrap it in a "g" for text to work.
        //var text = geohashRec.append('text')
        //    .attr('x', 50)
        //    .attr('y', 130)
        //    .attr('width', 150)
        //    .attr('height', 100)
        //    .append("xhtml:body")
        //    .html('<div style="width: 150px;">This is some information about whatever</div>');
        //var bar = geohashRec.append("g")
        //    .attr("transform", function(d, i) { return "translate(0," + i * geohashRec.height + ")"; });
        //
        //bar.append("text")
        //    .attr("x", function(d) { return x(d) - 3; })
        //    .attr("y", function(d) {return d.height / 2})
        //    .attr("dy", ".35em")
        //    .text(function(d) { return d; });
        //geohashRec.append("g")
        //    .attr("transform", function(d, i) { return "translate(0," + i * geohashRec.attr("height")/2  + ")"; });
        //
        //var text = geohashRec.append('text').text(d.id)
        //    .attr('x', geohashRec.attr("width")/2)
        //    .attr('y', geohashRec.attr("height")/2)
        //    .attr("dy", ".35em")
        //    .attr('fill', rgbToHex(new_red,new_green,new_blue));
    });

    feature.on("mouseout", function () {
        var geohashRec = d3.select(this);
        geohashRec.style("stroke", "none");
        unlinkFromBrushing(geohashRec, "hash");
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