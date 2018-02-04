// ===================================================================================
// ================== Handler for Y-Axis Zero  checkbox ==============================
// ===================================================================================

module.exports = (chartOptions) => {
    if (document.getElementById("yaxis_zero").checked) {
        let yAxisZero = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        $.extend(true, chartOptions, yAxisZero);
    } else {
        let yAxisZero = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        };

        $.extend(true, chartOptions, yAxisZero);

    }

};


