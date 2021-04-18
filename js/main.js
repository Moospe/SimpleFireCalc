// JavaScript source code
let yearcap = [];

$(function () { 
    $('#form').on('submit', function (e) {
        e.preventDefault();

        let formdata = $("#form").serializeArray();
        let data = {};
        $(formdata).each(function (index, obj) {

            if (data[obj.name] === undefined)
                data[obj.name];

            data[obj.name] = Number(obj.value);
            
        });

        target = (data.yearCost / data.efficiency) * 100

        yearcap = [data.capital]
        data.raise = (data.raise / 100) + 1
        data.efficiency = (data.efficiency / 100) + 1
        data.savings = data.savings / 100

        while (data.capital < target) {
            data.income = data.income * data.raise;
            data.capital = (data.capital + (data.income * data.savings)) * data.efficiency;

            yearcap.push(data.capital);
        }
        console.log(yearcap);
        drawGraph(yearcap);
    });
    $('.outcome').text(yearcap.length);
});

// set the dimensions and margins of the graph
let margin = { top: 10, right: 30, bottom: 30, left: 50 },
    width = $("#dataViz").width() - margin.left - margin.right,
    height = $("#dataViz").height() - margin.top - margin.bottom;

function drawGraph (dataRaw) {
    let dataNew = []
    for (i = 0; i < dataRaw.length; i++) {
        dataNew.push({ "x": i, "y": dataRaw[i] })
    }

    var div = d3.select("#dataViz").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.select("#dataViz svg").remove("svg");

    // append the svg object to the body of the page
    let svg = d3.select("#dataViz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.left + margin.right)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
        .domain(d3.extent(dataNew, function (d) { return d.x; }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain(d3.extent(dataNew, function (d) { return +d.y; }))
        .range([height, 0]);
    svg.append("g")
        .attr("transform", "translate(-5,0)")
        .call(d3.axisLeft(y).tickSizeOuter(0));

    // Add the area
    svg.append("path")
        .datum(dataNew)
        .attr("fill", "#69b3a2")
        .attr("fill-opacity", .3)
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(function (d) { return x(d.x) })
            .y0(height)
            .y1(function (d) { return y(d.y) })
        )

    // Add the line
    svg.append("path")
        .datum(dataNew)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(function (d) { return x(d.x) })
            .y(function (d) { return y(d.y) })
        )

    // Add the line
    svg.selectAll("myCircles")
        .data(dataNew)
        .enter()
        .append("circle")
        .attr("class", "circleBasicTooltip")
        .attr("fill", "red")
        .attr("stroke", "none")
        .attr("cx", function (d) { return x(d.x) })
        .attr("cy", function (d) { return y(d.y) })
        .attr("r", 3)
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d3.format(",d")(d.y) + "<br/>")
                .style("left", (d3.event.pageX) + 10 + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

}