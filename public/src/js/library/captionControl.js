

module.exports = () => {
    let iterator = myChart.data.datasets;
    iterator.forEach(function (arrayItem) {
        let label = arrayItem.label;
        let labelObject = {
            label: true
        };

        var labels = Object.assign(labels, labelObject);

    });
    console.log(arrayItem.label);

};