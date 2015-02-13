function drawHistograms(histData) {
    var windowHeight = $(document).height(); // returns height of HTML document
    var windowWidth = $(document).width(); // returns width of HTML document
    //todo, currently assuming at most 3 hists


    var histHeight = .20 * windowHeight;
    var histPanelWidth = .13 * windowWidth; //current panel is 15% of page, so the width of the hist of .13 got 1% padding

    console.log(histData.histograms);
    console.log(histHeight);

    var data = histData.histograms;


    var vis = d3.select('#histogramVis'), //could be "next available slot"?
        width = histPanelWidth,
        height = histHeight,
        margins = {
            top: 5, right: 2, bottom: 5, left: 25
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

    vis.style("width", width+(margins.left + margins.right))
        .style("height", height + (margins.bottom + margins.top));


    //creates x axis
    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (height - margins.bottom) + ')')
        .style("stroke", "#fff")
        .style("font-size", "small")
        .call(xAxis);
    //creates y axis
    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (margins.left) + ',0)')
        .style("stroke", "#fff")
        .style("font-size", "small")
        .style("width", width)
        .style("height", height)
        .call(yAxis);


    //creates rectangles that make up histogram
    vis.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return xRange(d.x);
        })
        .attr('y', function (d) {
            return yRange(d.y);
        })
        .attr('width', xRange.rangeBand())
        .attr('height', function (d) {
            return ((height - margins.bottom) - yRange(d.y));
        })
        .attr('fill', 'grey')
        .on('mouseover', function (d) {
            console.log(d);
            d3.select(this)
                .attr('fill', 'blue');
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .attr('fill', 'grey');
        });
}