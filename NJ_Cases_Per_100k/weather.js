
const xlabels = [];
const ytemps = [];

chartIt();

async function chartIt() {
  const ctx = document.getElementById('chart').getContext('2d');
  await getData();
  console.log(xlabels);
  console.log(ytemps);
  const myChart = new Chart(ctx, {
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
    const response = await fetch('nj_doh_incident_rate.csv');
    const data = await response.text();
    const table = data.split('\n').slice(1);
    table.forEach(row => {
      const columns = row.split(',')
      const year = columns[0];
      console.log(year );
      const cases = columns[1];
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