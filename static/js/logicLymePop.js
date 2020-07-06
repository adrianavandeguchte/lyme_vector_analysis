//Data URL
const url ="http://127.0.0.1:5000/api/v1.0/deerpopLyme"
//const url = "ec2-52-0-155-79.compute-1.amazonaws.com:5000/api/v1.0/deerpopLyme"

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

<<<<<<< HEAD
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

=======
//Append chart area to canvas
const svg2 = d3.select('#my_chart')
    .append('svg2')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

//Append chart group 
var chartGroup = svg2.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

//Function  x-scale  
function xScale(data) {
  //Create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[4])*.9, d3.max(data, d => d[4])*1.1 ])
    .range([0, width]);

  return xLinearScale;
}

//Function y-scale  
function yScale(data) {
    //Create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[5])*0.9, d3.max(data, d => d[5])*1.1])
      .range([height, 0]);
  
    return yLinearScale;
  }
    
 //Function - Update Tooltip  
function updateToolTip(circlesGroup) {

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`County:  ${d[2]} <br>Total Sq Miles: ${d[3]} <br>Deer Population/Sq Mile: ${d[4]} <br>Lyme Cases: ${d[5]}`);
    });
>>>>>>> deer_lyme_harvest_chart

  circlesGroup.call(toolTip);

  //Tooltip show - onmouseover event
  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
     })

    //Tooltip hide - onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//Read the data
d3.json(url,function(data) {

  console.log(data)

<<<<<<< HEAD
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
=======
  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Atlantic", "Cumberland", "Mercer", "Passaic","Somerset","Warren"])
    .range(d3.schemeSet1);
 
  //1: Create Scales
    // xLinearScale function  
    var xLinearScale = xScale(data);

    // yLinearScale function  
    var yLinearScale = yScale(data) ;

  // 2: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  // 3: Append Axes to Chart
    // append x axis
    var xAxis = chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append('g')
        .attr("id", "y-axis")
        .call(leftAxis);

    // 4: Create Circles  

    var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[4]))
        .attr('cy', d => yLinearScale(d[5]))
        .attr("r", function (d) { return d[3]*.15; } )
        .style("fill", function (d) { return myColor(d[2]); } )
        .attr("opacity", ".6");

  // 4: Create Axes Labels

      // Create group for  x-axis labels
      var xlabelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 20})`);
      
      // Create group for  y-axis labels
      var ylabelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 40})`);
      
      //Create x-axis lables and define position
      var deerCountLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 30)
          .attr("value", "deerCount") // value to grab for event listener
          .classed("active", true)
          .text("Deer Count per Square Mile");

      //Create y-axis lables and define position
      var lymeCountLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", 0 - (width/2) + 700)
          .attr("y", 0 - (height / 2)-110)
          .attr("value", "lymeCount") // value to grab for event listener
          .classed("active", true)
          .text("Lyme Case Count");

    // 5. UpdateToolTip function above csv import
      circlesGroup = updateToolTip(circlesGroup);
  });
>>>>>>> deer_lyme_harvest_chart
