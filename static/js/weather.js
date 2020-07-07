
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
            label: 'Mean Monthly NJ Statewide Temperatures in °F',
            data: ytemps,
            fill: false,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
        scales: {
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return value + '°';
                    }
                }
            }]
        }
    }
      });
    }
  
    async function getData() {
      const response = await fetch('/static/Resources/summaryData/nj_statewide_chart2012-18.csv');
      const data = await response.text();
      const table = data.split('\n').slice(1);
      table.forEach(row => {
        const columns = row.split(',')
        const year = columns[0];
        const county = columns[1];
        const jan = columns[2];
        const feb = columns[3];
        const mar = columns[4];
        const apr = columns[5];
        const may = columns[6];
        const jun = columns[7];
        const jul = columns[8];
        const aug = columns[9];
        const sep = columns[10];
        const oct = columns[11];
        const nov = columns[12];
        const dec = columns[13];
        ytemps.push(jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec);
        xlabels.push('jan-'.concat(year), 'feb-'.concat(year), 'mar-'.concat(year), 'apr-'.concat(year), 'may-'.concat(year), 'jun-'.concat(year), 'jul-'.concat(year), 'aug-'.concat(year), 'sep-'.concat(year), 'oct-'.concat(year), 'nov-'.concat(year), 'dec-'.concat(year) );
        // console.log(year, county, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec);
        // console.log(data);
      });

    }