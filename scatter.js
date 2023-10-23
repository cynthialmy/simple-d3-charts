d3.csv("https://raw.githubusercontent.com/fuyuGT/CS7450-data/main/state_crime.csv")
    .then(function (data) {
        console.log("data", data);

        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", width + margin.left + margin.right + 80)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var maxX = d3.max(data, function (d) {
            return d['Data.Population'];
        })

        var maxY = d3.max(data, function (d) {
            return d['Data.Totals.Property.All'];
        })

        // Add X axis
        var x = d3.scaleLog()
            .domain([100000, 50000000])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLog()
            .domain([1000, 2500000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(d['Data.Population']);
            })
            .attr("cy", function (d) {
                return y(d['Data.Totals.Property.All']);
            })
            .attr("r", 1.5)
            .style("fill", d3.schemeCategory10[6])

        svg.append("text")
            .attr("class", "title")
            .attr("x", width / 2)
            .attr("y", -30)
            .style("text-anchor", "middle")
            .attr("font-size", "18px")
            .style("font-weight", "bold")
            .text("Property Crimes vs Population 1960-2019");

        var legend = svg.selectAll(".legend")
            .append("g")
            .attr("class", "legend");

        legend.append("circle")
            .attr("class", "legend")
            .attr("cx", width + 15)
            .attr("cy", 12)
            .attr("r", 6)
            .attr("width", 30)
            .attr("height", 20)
            .style("fill", d3.schemeCategory10[6]);

        legend.append("text")
            .attr("class", "legend")
            .attr("x", width + 25)
            .attr("y", 14)
            .attr("font-size", "15px")
            .text('Property Crime')
            .style("alignment-baseline", "middle");

        legend.append("circle")
            .attr("class", "legend")
            .attr("cx", width + 15)
            .attr("cy", 32)
            .attr("r", 6)
            .attr("width", 30)
            .attr("height", 20)
            .style("fill", colors['Violent']);

        legend.append("text")
            .attr("class", "legend")
            .attr("x", width + 25)
            .attr("y", 34)
            .attr("font-size", "15px")
            .text('Violent Crime')
            .style("alignment-baseline", "middle");

        svg.append("text")
            .style("text-anchor", "middle")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .style("fill", "black")
            .style("font-size", 12)
            .text("Population");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - height / 2)
            .attr("y", 0 - margin.left / 2)
            .attr("dy", -10)
            .style("text-anchor", "middle")
            .style("fill", "black")
            .style("font-size", 12)
            .text("Crime Count");

    });