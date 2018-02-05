

module.exports = (myChart) => {
    var original = Chart.defaults.global.legend.onClick;
    Chart.defaults.global.legend.onClick = function (e, legendItem) {
        update_caption(legendItem);
        original.call(this, e, legendItem);
    };
    let iterator = myChart.data.datasets;
    let labelObject = {};
    let labels = {};
    iterator.forEach(function (arrayItem) {
        let label = arrayItem.label;
        labelObject[label] = true;

    });

    labels = Object.assign({}, labelObject);
   

    let caption = document.getElementById("caption");

    let update_caption = function (legend) {
        labels[legend.text] = legend.hidden;
        console.log(labels[legend.text]);
        let selected = Object.keys(labels).filter(function (key) {
            return labels[key];
        });

        let text = selected.length ? selected.join(" & ") : "nothing";
        console.log(text);
        caption.innerHTML = "The chart is displaying " + text;
    };

};

