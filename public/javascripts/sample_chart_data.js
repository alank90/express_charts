let chartData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor:
            'rgba(255, 99, 132, 0.2)',
        borderColor:
            'rgba(255,99,132,1)',
        borderWidth: 1
    }]
};


const ctx = document.getElementById("myChart").getContext('2d');

let myChart = new Chart(ctx, {
    type: 'bar',
    data: chartData
});