// JavaScript source code
let yearcap = [];

var NL = d3.formatLocale({
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["\u20AC ", ""],
    "dateTime": "%a %b %e %X %Y",
    "date": "%m/%d/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
})


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

    d3.select("#dataViz svg").remove("svg");
    d3.select("#dataViz .tooltip").remove(".tooltip");

    var div = d3.select("#dataViz").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("display", "none");
      

    // append the svg object to the body of the page
    let svg = d3.select("#dataViz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.left + margin.right)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    let x = d3.scaleLinear()
        .domain(d3.extent(dataNew, function (d) { return d.x; }))
        .range([0, width]);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain(d3.extent(dataNew, function (d) { return +d.y; }))
        .range([height, 0]);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(-5,0)")
        .call(d3.axisLeft(y).tickSizeOuter(0));

    // Add the area
    svg.append("path")
        .datum(dataNew)
        .attr("fill", "#B7D1F6")
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
        .attr("stroke", "#B7D1F6")
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
        .attr("fill", "#8DACE2")
        .attr("stroke", "none")
        .attr("cx", function (d) { return x(d.x) })
        .attr("cy", function (d) { return y(d.y) })
        .attr("r", 4)
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9)
                .style("display", "block");
            div.html("Kapitaal: " + NL.format("$,.2f")(d.y) + "<br/> jaar: " + d.x)
                .style("left", (d3.event.pageX) + 10 + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);

            div.transition()
                .delay(500)
                .style("display", "none");
        });

}