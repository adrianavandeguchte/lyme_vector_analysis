// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var parseTime = d3.timeParse("%Y");

//Read the data
d3.csv("static/js/lymePeople.csv").then(function(data) {

  // Filtering to the correct selection:
    data = data.filter(function(d) {return d.county == "Statewide"})
      // Format the data
      data.forEach(function(d) {
        d.year =  parseTime(d.year);
        d.cases = +d.cases;
      });

    console.log(data);
    humanData = data
    console.log(humanData);
    //Read the data
    d3.csv("static/js/lymeDogs.csv").then(function(dogs) {

      // Filtering to the correct selection:
        dogs = dogs.filter(function(d) {return d.county == "Statewide"})
          // Format the data
          dogs.forEach(function(d) {
            d.year =  parseTime(d.year);
            d.cases = +d.positive_cases;
          });
          console.log(dogs);
          dogData = dogs

          bothSets = [{set:"Human",values:humanData},{set:"Canine",values:dogData}]
          console.log("bothSets",bothSets);
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(dogData, function(d) { return d.year; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(dogData, function(d) { return +d.cases; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
      const line = d3.line()
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(d.cases); });
    let id = 0;
    const ids = function () {
    return "line-"+id++;
}
    // Add the line
    const lines = svg.selectAll("lines")
        .data(bothSets)
        .enter()
        .append("g");

        lines.append("path")
        .attr("class", ids)
        .attr("d", function(d) { return line(d.values); });
    });
});
