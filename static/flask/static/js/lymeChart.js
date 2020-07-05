// set the dimensions and margins of the graph
const width = 400;
const height = 200;
const margin = 10;
const padding = 10;
const adj = 30;

var svg = d3.select("#lymeChart").append("svg")
    // .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-"
          + adj + " -"
          + adj + " "
          + (width + adj *3) + " "
          + (height + adj*3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content lymeChart-canvas", true);

var parseTime = d3.timeParse("%Y");

//Read the data
d3.json("/lymepeople", function (err, lyme_people) {
    // List of groups (here I have one group per column)
    var selection = d3.map(lyme_people, function (d) {
        return (d.county)
    }).keys()

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(selection)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        }) // text showed in the menu
        .attr("value", function (d) {
            return d;
        }) // corresponding value returned by the button
    // Format the data
    lyme_people.forEach(function (d) {
        d.year = parseTime(d.year);
        d.cases = +d.cases;
    });
    // Filtering to the correct selection:
    var humanData = lyme_people.filter(function (d) {
        return d.county == selection[0]
    })

    d3.json("/lymedogs", function (err, lyme_dogs) {
        // Format the data
        lyme_dogs.forEach(function (d) {
            d.year = parseTime(d.year);
            d.cases = +d.positive_cases;
        });
        // Filtering to the correct selection:
        var dogs = lyme_dogs.filter(function (d) {
            return d.county == selection[0]
        })
        // combine both datasets into single var
        var bothSets = [{
            set: "Human",
            values: humanData
        }, {
            set: "Canine",
            values: dogs
        }]
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(dogs, function (d) {
                return d.year;
            }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(dogs, function (d) {
                return +d.cases;
            })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        var line = d3.line()
            .x(function (d) {
                return x(d.year);
            })
            .y(function (d) {
                return y(d.cases);
            });
        let id = 0;
        var ids = function () {
            return "line-" + id++;
        }
        // Add the line
        var lines = svg.selectAll("lines")
            .data(bothSets)
            .enter()
            .append("g");

        lines.append("path")
            .attr("class", ids)
            .attr("d", function (d) {
                return line(d.values);
            });
        lines.append("text")
            .attr("class", "serie_label")
            .datum(function (d) {
                return {
                    set: d.set,
                    value: d.values[d.values.length - 1]
                };
            })
            .attr("transform", function (d) {
                return "translate(" + (x(d.value.year) + 10) +
                    "," + (y(d.value.cases) + 5) + ")";
            })
            .attr("x", 5)
            .text(function (d) {
                return d.set;
            });

        // sets up update functions
        function update(selected) {
          // applies new filter to data and builds new updatedSets
            dogUpdate = lyme_dogs.filter(function (d) {
                return d.county == selected
            })
            humanUpdate = lyme_people.filter(function (d) {
                return d.county == selected
            })

            updatedSets = [{
                set: "Human",
                values: humanUpdate
            }, {
                set: "Canine",
                values: dogUpdate
            }]
            // clears svg canvas
            d3.selectAll(".lymeChart-canvas").remove();
            // rebuilds svg canvas
            var svg = d3.select("#lymeChart").append("svg")
                // .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "-"
                      + adj + " -"
                      + adj + " "
                      + (width + adj *3) + " "
                      + (height + adj*3))
                .style("padding", padding)
                .style("margin", margin)
                .classed("svg-content lymeChart-canvas", true);
            // sets new x axis
            var x = d3.scaleTime()
                .domain(d3.extent(dogUpdate, function (d) {
                   return d.year;
                }))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));


            // sets new Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(dogUpdate, function (d) {
                    return +d.cases;
                })])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));
            var line = d3.line()
                .x(function (d) {
                    return x(d.year);
                })
                .y(function (d) {
                    return y(d.cases);
                });
            let id = 0;
            var ids = function () {
                return "line-" + id++;
            }

            // sets new lines
            var lines = svg.selectAll("lines")
                    .data(updatedSets)
                    .enter()
                    .append("g");

                    lines.append("path")
                    .attr("class", ids)
                    .attr("d", function(d) { return line(d.values); });
                    lines.append("text")
                      .attr("class","serie_label")
                      .datum(function(d) {
                          return {
                              set: d.set,
                              value: d.values[d.values.length - 1]}; })
                      .attr("transform", function(d) {
                              return "translate(" + (x(d.value.year) + 10)
                              + "," + (y(d.value.cases) + 5 ) + ")";})
                      .attr("x", 5)
                      .text(function(d) { return d.set; });

        }
        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function (d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update(selectedOption)
        });
    });
});
