//Data URL
url="Resources/summaryData/deerpop_lyme_2018.csv"

//Set canvas size
var svg2Width = 960;
var svg2Height = 800;

//Set up svg2 chartMargins
var margin = {
    top: 20,
    right: 20,
    bottom: 90,
    left: 100
};

//Calculcate chart width/height
var width = svg2Width - margin.left - margin.right;
var height = svg2Height - margin.top - margin.bottom;

// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 60, left: 30},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

//append the svg2 object to the body of the page
var svg2 = d3.select("#svg2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Append chart area to canvas
// const svg2 = d3.select('#my_chart').append('svg2')
//     .attr('width', svg2Width)
//     .attr('height', svg2Height);


//Read the data
d3.csv(url, function(data) {

    console.log(url);
    console.log(data);

  // --------------  AXIS  AND SCALE   -----------------//

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 200])
    .range([ 0, width ]);
  svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(3));

  // Add X axis label:
  svg2.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+50 )
      .text("Deer Population per Square Mile");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([50, 250])
    .range([ height, 0]);
  svg2.append("g")
    .call(d3.axisLeft(y));

  // Add Y axis label:
  svg2.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      .text("Lyme Case Count")
      .attr("text-anchor", "start")

  // Add a scale for bubble size
  var z = d3.scaleLinear() //.scaleSqrt()
    .domain([50, 600])
    .range([2, 30]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Atlantic", "Cumberland", "Mercer", "Passaic","Somerset","Warren"])
    .range(d3.schemeSet1);


  // ------------  TOOLTIP  ------------------//

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#my_chart")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    console.log(d)

    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("County: " + d.county + "<br>Total Sq Miles: " + d.sq_mile + "<br>Deer Population/Sq Mile: " + d.deer_pop + "<br>Lyme Cases: " + d.lyme_cases)
      .style("left", (d3.deer_pop)+ "px")//mouse(this)[0]+30) + "px")
      .style("top", (d3.lyme_cases) + "px")//.mouse(this)[1]+30) + "px")
    //   .style("left", (d3.mouse(this)[0]+30) + "px")
    //   .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.deer_pop)+ "px")//mouse(this)[0]+30) + "px")
      .style("top", (d3.lyme_cases) + "px")//.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }


  // ---------------   HIGHLIGHT GROUP -----------------//

  // What to do when one group is hovered
  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)
  }


  // ---------------   CIRCLES   ----------------//

  // Add dots
  svg2.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "bubbles " + d.county })
      .attr("cx", function (d) { return d.deer_pop; } )
      .attr("cy", function (d) { return d.lyme_cases; } )
      .attr("r", function (d) { return z(d.sq_mile); } )
      .style("fill", function (d) { return myColor(d.county); } )
    // -3- Trigger the functions for hover
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )



    // -------------    LEGEND   ---------------//

    // Add legend: circles
    var valuesToShow = [100, 150, 250]
    var xCircle = 390
    var xLabel = 440
    svg2
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d){ return height - 70 - z(d) } )
        .attr("r", function(d){ return z(d) })
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    svg2
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
        .attr('x1', function(d){ return xCircle + z(d) } )
        .attr('x2', xLabel)
        .attr('y1', function(d){ return height - 70 - z(d) } )
        .attr('y2', function(d){ return height - 70 - z(d) } )
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg2
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return height - 70 - z(d) } )
        .text( function(d){ return d } )
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svg2.append("text")
      .attr('x', xCircle)
      .attr("y", height - 100 +50)
      .text("Deer Population")
      .attr("text-anchor", "middle")

    // Add one dot in the legend for each name.
    var size = 20
    var allgroups = ["Atlantic", "Cumberland", "Mercer", "Passaic","Somerset","Warren"]
    svg2.selectAll("myrect")
      .data(allgroups)
      .enter()
      .append("circle")
        .attr("cx", 390)
        .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 10)
        .style("fill", function(d){ return myColor(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svg2.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
      .attr("x", 390 + size*.8)
      .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return myColor(d)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)
  })
