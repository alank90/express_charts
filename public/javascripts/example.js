const sampleData = {
    datasets: [{
        label: ['Deer Population'],
        data: [{
          x: 100,
          y: 0,
          r: 10
        }, {
          x: 60,
          y: 30,
          r: 20
        }, {
          x: 40,
          y: 60,
          r: 25
        }, {
          x: 80,
          y: 80,
          r: 50
        }, {
          x: 20,
          y: 30,
          r: 25
        }, {
          x: 0,
          y: 100,
          r: 5
        }],
        backgroundColor: "#FF9966"
      }]
    };

const chartOptions = {
    title: {
      display: true,
      text: 'Custom Chart Title'
    }
  };

const ctx = document.getElementById("sample_chart");
const myChart = new Chart(ctx, {
    type: 'bubble',
    data: sampleData,
    options: chartOptions
});

console.log(myChart.data);
console.log(myChart.options);

