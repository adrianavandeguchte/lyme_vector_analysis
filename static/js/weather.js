
var xlabels = [];
var ytemps = [];

chartIt();

async function chartIt() {
  var ctx = document.getElementById('timeSeries').getContext('2d');
  await getData();
  console.log(xlabels);
  console.log(ytemps);
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xlabels,
      datasets: [{
        label: 'NJ Cases Per 100 K',
        data: ytemps,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {

      annotation: {
        annotations: [
          {
            drawTime: "afterDatasetsDraw",
            type: "line",
            mode: "vertical",
            scaleID: "x-axis-0",
            value: xlabels[5],
            borderColor: "black",
            borderWidth: 5,
            label: {
              backgroundColor: "red",
              content: "Test Label",
              enabled: true
            }
          }
        ]},
            scales: {
            yAxes: [{
              ticks: {
                callback: function (value, index, values) {
                  return value + 'k';
                }
              }
            }]
          },
          get scales() {
            return this._scales;
          },
          set scales(value) {
            this._scales = value;
          },

      }

    });




  async function getData() {
    var response = await fetch('/incidentYears');
    var data = await response.text();
    console.log(data);
    var table = data.split('\n').slice(1);
    table.forEach(row => {
      var columns = row.split(',')
      var year = columns[0];
      console.log(year );
      var cases = columns[1];
      console.log(cases);
      ytemps.push(cases);
      xlabels.push(year);
    });
  }
}

// new Chart(chartIt, {
//      type: 'line',
//      data: chartData(response.data),
//      label: 'Progress',
//      options: options,
//      lineAtIndex: [2,4,8],
//  })
