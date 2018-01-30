// Convert formData array to chartData object
formData.forEach(function (value, index) {
    if (!formData[index].value) {
        // Do nothing string empty
    }
    // Check if this form value has multiple datasets(has a '/') and if so
    // split the string into seperate dataset's
    else if (formData[index].value.indexOf('/') > -1) {
        // Split the field up into seperate array items
        formData[index].value = splitString(formData[index].value, '/');

        // Now put the array items into their seperate chartData.datasets arrays
        // i.e. If you had formData[index].value equal to [0] apples and [1] oranges
        // we iterate thru this array and put each element into chartData.datasets[0 or 1]
        // chartData.datasets[0] ===> apples and chartData.datasets[1] ===> oranges
        // also check if a bubble chart
        if (chartType === 'bubble') {
            formData[index].value.forEach(function (value, dataset_index) {
                let data = {};
                bubbleDataItemArray = strToNumberArray(value);
                data.x = bubbleDataItemArray[0];
                data.y = bubbleDataItemArray[1];
                data.r = bubbleDataItemArray[2];
                chartData.datasets[dataset_index] = Object.assign(chartData.datasets[dataset_index] || {}, data);
            });

        } else {
            formData[index].value.forEach(function (value, dataset_index) {
                let data = {};
                data[formData[index].name] = value;
                chartData.datasets[dataset_index] = Object.assign(chartData.datasets[dataset_index] || {}, data);
            });
        }
    } else { // Put form value (.eg, "labels" form input value) as a property into the chartData object
        let data = {};
        data[formData[index].name] = formData[index].value;
        // Dont put in the chartData.datasets object if is the labels property
        if (formData[index].name === 'labels') {
            chartData = Object.assign(chartData || {}, data);
        } else if (formData[index].name === 'options') {
            // Do nothing. Form value already in Options variable
        } else {
            chartData.datasets[0] = Object.assign(chartData.datasets[0] || {}, data);
        }
    }
}); // end forEach


var options = {
    scales: {
        xAxes: [
            {
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'x-axis info here',
                    fontsize: 26
                }
            }]
    },
    yAxes: [
        {
            ticks: {
                beginAtZero: true
            },
            scaleLabel: {
                display: true,
                labelString: 'y-axis info here',
                fontsize: 26
            }
        }]

};
