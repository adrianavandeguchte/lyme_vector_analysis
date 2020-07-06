//Data URL
const url ="http://127.0.0.1:5000/api/v1.0/deerpopLyme"
//const url = "ec2-52-0-155-79.compute-1.amazonaws.com:5000/api/v1.0/deerpopLyme"

//Set canvas size
var svgWidth = 960;
var svgHeight = 800;

//Set up svg2 chartMargins
var margin = {
    top: 20,
    right: 20,
    bottom: 90,
    left: 100
};

//Calculcate chart width/height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

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