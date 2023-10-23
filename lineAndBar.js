var statesGA = ['Georgia', 'South Carolina', 'Florida', 'Tennessee', 'North Carolina', 'Alabama'],
    colors = {
        'Georgia': d3.schemeCategory10[0],
        'South Carolina': d3.schemeCategory10[1],
        'Florida': d3.schemeCategory10[2],
        'Tennessee': d3.schemeCategory10[3],
        'North Carolina': d3.schemeCategory10[4],
        'Alabama': d3.schemeCategory10[5],
    };
d3.csv("https://raw.githubusercontent.com/fuyuGT/CS7450-data/main/state_crime.csv")
    .then(function (data) {
        console.log("data", data);
        var dataNest = d3.nest()
            .key(function (d) {
                return d.State;
            })
            .key(function (d) {
                return +d.Year;
            })
            .rollup(function (leaves) {
                return {
                    "states": leaves,
                    "sum": d3.sum(leaves, function (d) {
                        return d['Data.Totals.Violent.All'];
                    })
                }
            })
            .entries(data);


        dataFiltered = dataNest.filter(function (d) { return statesGA.includes(d.key) })
        console.log("dataFiltered", dataFiltered);

        var svg = d3.select("#line")
            .append("svg")
            .attr("width", width + margin.left + margin.right + 80)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xScale = d3
            .scaleTime()
            .domain([new Date("1960"), new Date("2019")])
            .range([0, width]);

        var yScale = d3
            .scaleLog()
            .domain([2500, 200000])
            .range([height, 0]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(d3.timeYear.every(5)));

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale));

        var formatTime = d3.timeParse("%Y");

        var line = d3.line()
            .x(function (d) {
                return xScale(formatTime(d.key))
            })
            .y(function (d) {
                return yScale(d.value.sum)
            });

        svg.selectAll("lines")
            .data(dataFiltered)
            .enter()
            .append("g")
            .attr("class", "path")
            .append("path")
            .attr("d", function (d) {
                return line(d.values)
            })
            .attr("stroke", function (d) {
                return colors[d.key]
            })
            .style("stroke-width", 3)
            .style("fill", "none");

        var legend = svg.selectAll(".legend")
            .data(dataFiltered)
            .enter().append("g")
            .attr("class", "legend");

        legend.append("circle")
            .attr("class", "legend")
            .attr("cx", width + 15)
            .attr("cy", function (d, i) {
                return 12 + i * 20
            })
            .attr("r", 6)
            .attr("width", 30)
            .attr("height", 20)
            .style("fill", function (d) {
                return colors[d.key]
            }
            );

        legend.append("text")
            .attr("class", "legend")
            .attr("x", width + 25)
            .attr("y", function (d, i) {
                return 14 + i * 20
            })
            .attr("font-size", "15px")
            .text(function (d) {
                return d.key
            })
            .style("alignment-baseline", "middle");

        svg.append("text")
            .attr("class", "title")
            .attr("x", width / 2)
            .attr("y", -10)
            .style("text-anchor", "middle")
            .attr("font-size", "18px")
            .style("font-weight", "bold")
            .text("Violent Crimes Around Georgia by State 1960-2019");

        svg.append("text")
            .attr("class", "title")
            .attr("x", width / 2)
            .attr("y", +8)
            .style("text-anchor", "middle")
            .attr("font-size", "14px")
            .style("font-weight", "bold")
            .text("Hover on dots to see details in Bar Chart");

        svg.append("text")
            .style("text-anchor", "middle")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .style("fill", "black")
            .style("font-size", 12)
            .text("Year");

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

        var svg1 = d3
            .select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var mouseoverHandler = function (d, i) {
            console.log('mouseoverHandler', d, i);
            var Syear = d3.select(this)._groups[0][0].__data__.value.states[0].Year;
            var Sstate = d3.select(this)._groups[0][0].__data__.value.states[0].State;
            console.log(Syear);
            console.log(Sstate);

            var dataBar = []
            data.map(function (d) {
                if (d.Year == Syear && d.State == Sstate) {
                    dataBar.push({
                        state: d.State,
                        year: d.Year,
                        crime: 'Assault',
                        value: +d['Data.Totals.Violent.Assault']
                    })
                    dataBar.push({
                        state: d.State,
                        year: d.Year,
                        crime: 'Murder',
                        value: +d['Data.Totals.Violent.Murder'],
                    })
                    dataBar.push({
                        state: d.State,
                        year: d.Year,
                        crime: 'Rape',
                        value: +d['Data.Totals.Violent.Rape'],
                    })
                    dataBar.push({
                        state: d.State,
                        year: d.Year,
                        crime: 'Robbery',
                        value: +d['Data.Totals.Violent.Robbery'],
                    })
                }
            });

            var maxCount = d3.max(dataBar, function (d) {
                return d.value;
            })

            console.log('maxCount', maxCount);

            d3.select(this)
                .attr("r", 10);

            var xBarScale = d3
                .scaleLinear()
                .domain([0, maxCount])
                .range([0, width]);

            var yBarScale = d3.scaleBand()
                .range([height, 0])
                .domain(['Assault', 'Murder', 'Rape', 'Robbery'])
                .padding(0.05);

            svg1.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xBarScale));

            svg1.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yBarScale));

            var formatTime = d3.timeParse("%Y");

            console.log('dataBar', dataBar)

            svg1.selectAll("rect")
                .data(dataBar)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", function (d) {
                    return yBarScale(d.crime);
                })
                .attr("width", function (d) {
                    console.log('d', d.value)
                    return xBarScale(d.value)
                })
                .attr("height", yBarScale.bandwidth())
                .attr("fill", function (d) {
                    return colors[d.state];
                })

            svg1.append("text")
                .attr("class", "title")
                .attr("x", width / 2)
                .attr("y", -15)
                .style("text-anchor", "middle")
                .attr("font-size", "18px")
                .style("font-weight", "bold")
                .text(Sstate + " Region Violent Crime in " + Syear);

            svg1.append("text")
                .attr("class", "x axis")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom)
                .style("text-anchor", "middle")
                .attr("font-size", "18px");

            svg1.append("text")
                .attr("class", "y axis")
                .attr("x", -height / 2 - margin.top)
                .attr("y", -50)
                .style("text-anchor", "middle")
                .attr("transform", "rotate(270)")
                .attr("font-size", "18px");

            svg1.append("text")
                .style("text-anchor", "middle")
                .attr("class", "axis-label")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .style("fill", "black")
                .style("font-size", 12)
                .text("Crime Count");
        }

        var mouseoutHandler = function (d, i) {
            svg1.selectAll("*").remove();

            d3.select(this)
                .attr("r", 5)
                .attr("fill", function () {
                    return colors[d.key];
                })
        }

        svg.selectAll("myDots")
            .data(dataFiltered)
            .enter()
            .append('g')
            .style("fill", function (d) { return colors[d.key] })
            .style("stroke-width", 2)
            .style("stroke", "white")
            .selectAll("myPoints")
            .data(function (d) { return d.values })
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(formatTime(d.key)) })
            .attr("cy", function (d) { return yScale(d.value.sum) })
            .attr("r", 5)
            .on("mouseover", mouseoverHandler)
            .on("mouseout", mouseoutHandler)
    });