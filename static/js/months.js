
d3.json("/incidentMonths", function (err, monthData) {
console.log(monthData);

var values = monthData.map(d => d.cases);
var months = monthData.map(d => d.month);

console.log(months);

var data = [{
  type: "pie",
  values: values,
  labels:  months,
  textinfo: "label+percent",
  textposition: "outside",
  automargin: true
}]

var layout = {
  height: 400,
  width: 400,
  margin: {"t": 0, "b": 0, "l": 0, "r": 0},
  showlegend: false
  }
Plotly.newPlot('incidentPie', data, layout)
});
