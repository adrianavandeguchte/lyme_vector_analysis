//Data url
var url ="http://127.0.0.1:5000/api/v1.0/deerHarvestLyme"
//const url = "ec2-52-0-155-79.compute-1.amazonaws.com:5000/api/v1.0/deerHarvestLyme"

// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {

// // if the svg2 area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
//   var svgArea = d3.select("body").select("#svg3");
//
//   // clear svg2 is not empty
//   if (!svgArea.empty()) {
//     svgArea.remove();
//   }

// Chart Params
var svgWidth = 350;
var svgHeight = 250;
var circleRadius =7;
var formatComma = d3.format(",")

// Margins
var margin = { top: 20, right: 40, bottom: 60, left: 50 };

//Get width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an svg2 wrapper, append an svg2 group that will hold our chart, and shift the latter by left and top margins.
var svg2 = d3
  .select("#svg3")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg2.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.json(url,function(deerData) {

console.log(deerData)
  // Create a function to parse date and time
  var parseTime = d3.timeParse("%Y");

  // Format the data
  deerData.forEach(function(data) {
    data[1] = parseTime(data[1]);
    data[2] = +data[2];
    data[3] = +data[3];
  });

  console.log(deerData);

  // Create scaling functions
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(deerData, d => d[1]))
    .range([0, width]);

  var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(deerData, d => d[2])])
    .range([height, 0]);

  var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(deerData, d => d[3])])
    .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xTimeScale)
    .tickFormat(d3.Year);
  var leftAxis = d3.axisLeft(yLinearScale1);
  var rightAxis = d3.axisRight(yLinearScale2);

  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y1-axis to the left side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("green", true)
    .call(leftAxis);

  // Add y2-axis to the right side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("red", true)
    .attr("transform", `translate(${width}, 0)`)
    .call(rightAxis);

  // Line generators for each line
  var line1 = d3.line()
    .x(d => xTimeScale(d[1]))
    .y(d => yLinearScale1(d[2]));

  var line2 = d3.line()
    .x(d => xTimeScale(d[1]))
    .y(d => yLinearScale2(d[3]));

  // Append a path for line1
  chartGroup.append("path")
    .data([deerData])
    .attr("d", line1)
    .classed("line green", true);

  // Append a path for line2
  chartGroup.append("path")
    .data([deerData])
    .attr("d", line2)
    .classed("line red", true);

    // append circles for harvested count
    var circlesGroup = chartGroup.selectAll("circle")
    .data(deerData)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d[1]))
    .attr("cy", d => yLinearScale1(d[2]))
    .attr("r", circleRadius)
    .attr("fill", "yellowgreen")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

    // append circles for lyme case count
    var circlesGroup1 =chartGroup.selectAll("circle1")
    .data(deerData)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d[1]))
    .attr("cy", d => yLinearScale2(d[3]))
    .attr("r", circleRadius)
    .attr("fill", "orange")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

  // Append axes titles
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("har-text text", true)
    .text("Harvested Deer Count ");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .classed("deer-text text", true)
    .text("Lyme Case Count");

 // Step 1: Initialize Tooltip
 var toolTip1 = d3.tip()
 .attr("class", "tooltip")
 .offset([80, -60])
 .html(function(d) {
    var dateFormat = d3.timeFormat("%Y");
   return (`<strong>Year: ${dateFormat(d[1])}<strong><hr>Harvested Deer Count: ${formatComma(d[2])}`);
 });

// Step 2: Create the tooltip in chartGroup.
chartGroup.call(toolTip1);

// Step 3: Create "mouseover" event listener to display tooltip
circlesGroup.on("mouseover", function(d) {
 toolTip1.show(d, this);
})
// Step 4: Create "mouseout" event listener to hide tooltip
 .on("mouseout", function(d) {
   toolTip1.hide(d);
 });

 // Step 1: Initialize Tooltip
 var toolTip2 = d3.tip()
 .attr("class", "tooltip")
 .offset([80, -60])
 .html(function(d) {
    var dateFormat = d3.timeFormat("%Y");
   return (`<strong>Year: ${dateFormat(d[1])}<strong><hr>Lyme Case Count: ${formatComma(d[3])}`);
 });

// Step 2: Create the tooltip in chartGroup.
chartGroup.call(toolTip2);

// Step 3: Create "mouseover" event listener to display tooltip
circlesGroup1.on("mouseover", function(d) {
 toolTip2.show(d, this);
})
// Step 4: Create "mouseout" event listener to hide tooltip
 .on("mouseout", function(d) {
   toolTip2.hide(d);
 });

}).catch(function(error) {
  console.log(error);
});

}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
