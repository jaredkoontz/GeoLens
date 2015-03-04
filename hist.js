setDataAndVisualize();

function createNewSvg(newHist) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute('id', newHist);
    svg.setAttribute('class', 'histogramVis');
    document.getElementById("hists").appendChild(svg);
}


function drawHistogram(histData, depth, title) {
    var newHist = "histogramVis" + depth;

    createNewSvg(newHist);

    var windowHeight = $(document).height(); // returns height of HTML document
    var windowWidth = $(document).width(); // returns width of HTML document

    //todo, currently assuming at most 3 hists compute this value from lowest depth

    var histHeight = .20 * windowHeight;
    var histPanelWidth = .13 * windowWidth; //current panel is 15% of page, so the width of the hist of .13 got 1% padding

    var data = histData;

    var vis = d3.select("#" + newHist),
        width = histPanelWidth,
        height = histHeight,
        margins = {
            top: 20, right: 2, bottom: 5, left: 25
        },
        xRange = d3.scale.ordinal().rangeRoundBands([margins.left, width - margins.right], 0.1).domain(data.map(function (d) {
            return d.x;
        })),


        yRange = d3.scale.linear().range([height - margins.top, margins.bottom]).domain([0,
            d3.max(data, function (d) {
                return d.y;
            })
        ]),

        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(1)
            .tickSubdivide(true),

        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(1)
            .orient("left")
            .tickSubdivide(true);

    //svg height and width
    vis.style("width", width + (margins.left + margins.right))
        .style("height", height + (margins.bottom + margins.top));


    //create title
    vis.append("text")
        .attr("x", (width / 2))
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "small")
        .style("stroke", "#fff")
        .style("text-decoration", "underline")
        .text(title);


    //creates x axis
    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (height + margins.bottom) + ')')
        .style("stroke", "#fff")
        .style("font-size", "smaller")
        .call(xAxis);


    //creates y axis
    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (margins.left) + ',' + (margins.top + margins.bottom) + ')')
        .style("stroke", "#fff")
        .style("font-size", "small")
        .style("width", width)
        .style("height", height)
        .call(yAxis);

    var currentColor;

    //creates rectangles that make up histogram
    vis.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return xRange(d.x);
        })
        .attr('y', function (d) {
            return yRange(d.y) + margins.top + margins.bottom;
        })
        .attr('width', xRange.rangeBand())
        .attr('height', function (d) {
            return ((height - margins.top) - yRange(d.y));
        })
        .attr('fill', function (d) {
            return d.color;
        })
        .style("opacity",.7)
        .on('mouseover', function () {
            var focusedBar = d3.select(this);
            currentColor = focusedBar.style("fill");
            var rgb = currentColor.match(/\d+/g);
            var new_red = 255 - rgb[0];
            var new_green = 255 - rgb[1];
            var new_blue = 255 - rgb[2];
            focusedBar.style("stroke", rgbToHex(new_red, new_green, new_blue));
            focusedBar.style("stroke-width", 6);
            linkFromBrushing(focusedBar, "bar")

        })
        .on('mouseout', function () {
            var focusedBar = d3.select(this);
            focusedBar.style("stroke", "none");
            focusedBar.style("fill", currentColor);
        })
        .on("click", function (d) {
            //console.log(d + " " + depth + " " + title);
            handleHistClick(d, depth);
        });
}