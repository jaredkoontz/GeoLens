var fakeBarData = [
    {'x': "1", 'y': 5},
    {'x': "20", 'y': 20},
    {'x': "40", 'y': 10},
    {'x': "60", 'y': 40},
    {'x': "80", 'y': 5},
    {'x': "100", 'y': 60}
];

var vis = d3.select('#histogramVis'), //could be "next available slot"?
    width = 150,
    height = 75,
    margins = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    },
    xRange = d3.scale.ordinal().rangeRoundBands([margins.left, width - margins.right], 0.1).domain(fakeBarData.map(function (d) {
        return d.x;
    })),


    yRange = d3.scale.linear().range([height - margins.top, margins.bottom]).domain([0,
        d3.max(fakeBarData, function (d) {
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


vis.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (height - margins.bottom) + ')')
    .call(xAxis);

vis.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (margins.left) + ',0)')
    .call(yAxis);

vis.selectAll('rect')
    .data(fakeBarData)
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
        d3.select(this)
            .attr('fill', 'blue');
    })
    .on('mouseout', function (d) {
        d3.select(this)
            .attr('fill', 'grey');
    });