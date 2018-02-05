(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


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


},{}],2:[function(require,module,exports){
module.exports = () => {
    // ================================================================================================ //
    // ============= Simple Clear Form Handler ======================================================== //
    // ================================================================================================ // 

    $("#clear_form").on("click", function (e) {
        e.preventDefault();
        $("#form")[0].reset();
    });

    // =============================================================================================== //
    // ============================= Toggle Menu Options Chevron ===================================== //
    // =============================================================================================== //
    $('#more_options').on('shown.bs.collapse', function () {
        $(".more_options").removeClass("glyphicon-menu-down").addClass("glyphicon-menu-up");
    });

    $('#more_options').on('hidden.bs.collapse', function () {
        $(".more_options").removeClass("glyphicon-menu-up").addClass("glyphicon-menu-down");
    });

};
},{}],3:[function(require,module,exports){
exports.splitString = function (strToSplit, separator = ",") {
    if (!strToSplit) {
        alert("Error: One of your required fields is empty.");
        return false;
    }

    // Test for a ',' or '/' in the string
    result = /[,\/]/g.test(strToSplit);
    if (result === false) {
        // Only one entry in Data form
        return strToSplit;
    }

    // next test if rgba used and is in multiple datasets
    result = /(?=.*^rgba?)(?=.*[\/])/g.test(strToSplit);
    if (result) {
        separator = "/";
    } else if (/\s*,\s*(?=rgb)/.test(strToSplit)) {   // Test for consecutive ",rgb" indicating multiple rgba values
        let pattern = /\s*,\s*(?=rgb)/; // look for comma with look ahead to an rgb
        separator = pattern;
    } else {
        if (/^rgba?/g.test(strToSplit)) { // Is single rgba so return
            return strToSplit;
        }
    }

    // Split a string into an array and trim any whitespace
    // and store it back
    let arrayOfStrings = strToSplit.split(separator);
    arrayOfStrings.forEach(function (value, index) {
        arrayOfStrings[index] = value.trim();
    });

    return arrayOfStrings;
};  // ============ End spltString Function =================================================== //

// =========================================================================================== //
// Function to convert string to an array then convert each element to a number                //
// =========================================================================================== //
exports.strToNumberArray = function (str, separator = ',') {
    if (str === undefined) {
        alert('Error: string is empty.');
        return false;
    }
    // Test for a comma in the string
    let result = /,+/.test(str);
    if (!result) {
        alert(`Comma delimiter missing from ${str}`);
        return false;
    }

    // Check for parenthesis and remove 
    result = /^\(.*\)/.test(str);
    if (result) {
        str = str.slice(1, -1);
    }

    let arrayOfNumbers = str.split(separator).map(Number);

    return arrayOfNumbers;
};

// ============================================================================= //
// ========== Function convert string to integer or integer array ============== //
// ============================================================================= //
exports.strToNumber = function (str) {
    // Test for a comma in the string
    const result = /,+/.test(str);
    if (!result) { // Just one string element to convert an integer
        let num = + str; // unary + operation does type conversion
        if (isNaN(num)) { // check if conversion successful
            console.log(`Attention. Unable to convert ${str} to a number in function strToNumber`);
            return false;
        }
        return num;
    } else { // we have multiple string values to convert to an array of numbers
        let num = str.split(',').map(Number);
        if (isNaN(num[0])) {
            console.log(`Attention. Unable to convert ${str} to a number`);
            return false;
        }
        return num;
    }
};

// Function remove all whitespace from string
exports.removeWhiteSpace = function (str) {
    str.replace(/\s+/g, '');
    return str;
};

// Function iterates thru an array(datasets) and performs appropriate
// actions on array object elements (e.g., borderColor: red, blue being
// split into an array)
exports.convertDataArrayElements = (dataArray,chartType) => {
    if (dataArray.length > 1) { // we have multiple datasets
        dataArray.forEach(function (value, dataset_index) {
            // Convert chartData.datasets[].data object to an array of numbers 
            if (dataArray[dataset_index].data) {
                dataArray[dataset_index].data = exports.strToNumberArray(dataArray[dataset_index].data);
            }
            // convert string to number
            if (dataArray[dataset_index].borderWidth) {
                dataArray[dataset_index].borderWidth = exports.strToNumber(dataArray[dataset_index].borderWidth);
            }
            // Check for comma separated value
            if (dataArray[dataset_index].backgroundColor) {
                if (/,+/.test(dataArray[dataset_index].backgroundColor)) {
                    dataArray[dataset_index].backgroundColor = exports.splitString(dataArray[dataset_index].backgroundColor);
                }
            }

        });

    } else {   // there is only one dataset
        var dataset_index = 0;

        // Convert chartData.datasets[].data object to an array of numbers 
        if (dataArray[dataset_index].data && chartType !== 'bubble') {
            dataArray[dataset_index].data = exports.strToNumber(dataArray[dataset_index].data);
        }

        if (dataArray[dataset_index].borderWidth) {
            dataArray[dataset_index].borderWidth = exports.strToNumber(dataArray[dataset_index].borderWidth);
        }

        if (dataArray[dataset_index].backgroundColor) {
            if (/,+/.test(dataArray[dataset_index].backgroundColor)) {
                dataArray[dataset_index].backgroundColor = exports.splitString(dataArray[dataset_index].backgroundColor);
            }
        }
    }

};


    // ============================================================================================ //
    // ================== End Function Definitions ================================================ //
    // ============================================================================================ //


},{}],4:[function(require,module,exports){
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



},{}],5:[function(require,module,exports){
// /public/main.js
let helper = require('./library/helpers');
let yAxisZero = require('./library/yAxisZero');
let eventHandlers = require('./library/eventHandlers');
let captionControl = require('./library/captionControl');
console.log(captionControl);

$(document).ready(function () {
    // Let's declare some variables
    let counter = 0;   // Keeps track of if canvas has already been drawn
    let chartData = {};
    let chartType = '';
    let chartOptions = {};
    let xOptions = {};
    let yOptions = {};
    let titleOptions = {};
    
    // ============================================================================================== //
    // ========================= Main Event Handler for Express Chart Maker ========================= //
    // == This handler generates the chartData object that Chart.js will use to draw the chart======= //
    // ============================================================================================== //
    $("#form").validator().on("submit", function (e) {
        if (e.isDefaultPrevented()) {
            // Do nothing. There was an error. This is required for validator() to work
        } else {
            e.preventDefault();

            // Hide initial Image and Help tab, and make visible myChart object
            if (counter === 0) {
                $("#chart_image").addClass('hidden');
                $(".open_help").addClass('hidden');
                $(".sub_title").addClass('hidden');
                $("#myChart").removeClass('hidden');
                counter += 1;
            }
            $("#print_chart").removeClass('hidden');

            // First grab form data off the page
            const formData = $('form').serializeArray();
            
            // Get Chart Type Seperate from Form Data
            const chartTypeControl = document.getElementById("chart_type");
            chartType = chartTypeControl.options[chartTypeControl.selectedIndex].value;


            // Clear the chartData data Object for Chart constructor to reuse from initial chart draw
            chartData = {
                datasets: []
            };

            // Convert formData array to chartData object
            formData.forEach(function (value, index) {
                if (!formData[index].value) {
                    // Do nothing string empty
                }
                // Check if this form value has multiple datasets(has a '/') and if so
                // split the string into seperate dataset's
                else if ((formData[index].value.indexOf('/') > -1) && !(formData[index].name.includes('Axis'))) {
                    // Split the field up into seperate array items
                    formData[index].value = helper.splitString(formData[index].value, '/');

                    // Now put the array items into their seperate chartData.datasets arrays
                    // i.e. If you had formData[index].value equal to [0] apples and [1] oranges
                    // we iterate thru this array and put each element into chartData.datasets[0 or 1]
                    // chartData.datasets[0] ===> apples and chartData.datasets[1] ===> oranges
                    // also check if a bubble chart and format data object accordingly
                    if (chartType === 'bubble' && formData[index].name === 'data') {
                        let data = {};
                        data[formData[index].name] = [];

                        formData[index].value.forEach(function (value, dataset_index) {
                            bubbleDataItemArray = helper.strToNumberArray(value);
                            bubbleDataSet = {};
                            bubbleDataSet.x = bubbleDataItemArray[0];
                            bubbleDataSet.y = bubbleDataItemArray[1];
                            bubbleDataSet.r = bubbleDataItemArray[2];

                            data[formData[index].name].push(bubbleDataSet);
                        });

                        chartData.datasets[0] = Object.assign(chartData.datasets[0] || {}, data);

                    }
                    else {
                        formData[index].value.forEach(function (value, dataset_index) {
                            let data = {};
                            data[formData[index].name] = value;
                            chartData.datasets[dataset_index] = Object.assign(chartData.datasets[dataset_index] || {}, data);
                        });
                    }

                } else if (formData[index].name.includes('Axis')) {
                    // We have an Axis label or font size form value we need 
                    // to put in the chartOptions object
                    switch (formData[index].name) {
                        case 'xAxisLabel':
                            xOptions = {
                                scales: {
                                    xAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: formData[index].value,
                                            fontSize: formData[index + 1].value
                                        }
                                    }]
                                }
                            };

                            break;
                        case 'yAxisLabel':
                            yOptions = {
                                scales: {
                                    yAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: formData[index].value,
                                            fontSize: formData[index + 1].value
                                        }
                                    }]
                                }
                            };
                            break;
                        case 'chartAxisTitle':
                            titleOptions = {
                                title: {
                                    display: true,
                                    position: 'top',
                                    text: formData[index].value,
                                    fontSize: formData[index + 1].value
                                }
                            };
                            break;
                        case 'xAxisFont':
                            // do nothing
                            break;
                        case 'yAxisFont':
                            // do nothing
                            break;
                        case 'titleFont':
                            // do nothing
                            break;
                    }

                }
                else { // Put form value (.eg, "labels" form input value) as a property into the chartData object
                    let data = {};
                    data[formData[index].name] = formData[index].value;
                    // Dont put in the chartData.datasets object if is the labels property
                    if (formData[index].name === 'labels') {
                        chartData = Object.assign(chartData || {}, data);
                    } else if (formData[index].name === 'options') {
                        // Do nothing. Form value already in Options variable
                    }
                    else if (chartType === "bubble") {  // Only one dataset item
                        chartData.datasets[0] = Object.assign(chartData.datasets || {}, data);
                    } else {
                        chartData.datasets[0] = Object.assign(chartData.datasets[0] || {}, data);
                    }
                }
            }); // end forEach


            // =====================================================================================
            //  Now we have to do some converting i.e., chartData.labels must be converted to array 
            //  from string etc.. ==================================================================

            if (chartData.labels) {
                chartData.labels = helper.splitString(chartData.labels);
            }

            // We need to see if there are multiple datasets and if so, loop thru the datasets 
            // sending appropriate object values (e.g., datasets.data and datasets.borderWidth) to the
            // helper.splitString method. So we call our convertDataArrayElements 
            helper.convertDataArrayElements(chartData.datasets, chartType);


            // Now ready to draw the canvas with the chart data
            // from the form.
            try {
                if (!(chartData.datasets[0])) {
                    throw new Error("Input Error. Recheck your form data.");
                }

                const ctx = document.getElementById("myChart").getContext('2d');
                // Do some converting from a string to a JSON to JS object so we can assign to 
                // myChart.options later..
                const optionsFormValue = document.getElementById("chart_options").value;
                let json = '';

                // Check if options were input and if so first construct
                // moreOptions Object from free form field, then x&yOptions
                // objects from form and merge them into chartOptions.scales
                // via Object.assign method
                if ((optionsFormValue !== '') || ($('#x_axis_label').val()) || (titleOptions)) {
                    if (optionsFormValue) {
                        json = JSON.stringify(eval("(" + optionsFormValue + ")"));
                        moreOptions = JSON.parse(json);
                        $.extend(true, chartOptions, moreOptions);
                    }

                    if ((xOptions.scales) || (yOptions.scales)) {
                        // Due to object defaulting to shallow copy w/Object.assign we must do 
                        // an object merge w/jQuery $.extend method w/true option for deep copy
                        $.extend(true, chartOptions, xOptions, yOptions);
                    }

                    if (titleOptions) {
                        chartOptions = Object.assign(
                            chartOptions || {},
                            titleOptions
                        );
                    }
                }

                // module call to handle zeroing out 
                // the y-axis on a chart
                yAxisZero(chartOptions);

                // Check to see if a chart exists to destroy
                if (counter > 1) {
                    myChart.destroy();
                }

                myChart = new Chart(ctx, {
                    type: chartType,
                    data: chartData,
                    options: chartOptions
                });

                counter += 1;

                captionControl(myChart);
                

            } catch (error) {
                alert(error);
            }
        } // ============ end else ================================= //
    });
    // ================================================================================================ //    
    // ================ End .on "click" Main Event Handler ============================================ //
    // ================================================================================================ //

    // Some miscelleneous event handlers for the app.
    eventHandlers();

    // ----------------------------------------------------------------------------------------------------------- //

}); // End .document.ready()
},{"./library/captionControl":1,"./library/eventHandlers":2,"./library/helpers":3,"./library/yAxisZero":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc3JjL2pzL2xpYnJhcnkvY2FwdGlvbkNvbnRyb2wuanMiLCJwdWJsaWMvc3JjL2pzL2xpYnJhcnkvZXZlbnRIYW5kbGVycy5qcyIsInB1YmxpYy9zcmMvanMvbGlicmFyeS9oZWxwZXJzLmpzIiwicHVibGljL3NyYy9qcy9saWJyYXJ5L3lBeGlzWmVyby5qcyIsInB1YmxpYy9zcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKG15Q2hhcnQpID0+IHtcclxuICAgIHZhciBvcmlnaW5hbCA9IENoYXJ0LmRlZmF1bHRzLmdsb2JhbC5sZWdlbmQub25DbGljaztcclxuICAgIENoYXJ0LmRlZmF1bHRzLmdsb2JhbC5sZWdlbmQub25DbGljayA9IGZ1bmN0aW9uIChlLCBsZWdlbmRJdGVtKSB7XHJcbiAgICAgICAgdXBkYXRlX2NhcHRpb24obGVnZW5kSXRlbSk7XHJcbiAgICAgICAgb3JpZ2luYWwuY2FsbCh0aGlzLCBlLCBsZWdlbmRJdGVtKTtcclxuICAgIH07XHJcbiAgICBsZXQgaXRlcmF0b3IgPSBteUNoYXJ0LmRhdGEuZGF0YXNldHM7XHJcbiAgICBsZXQgbGFiZWxPYmplY3QgPSB7fTtcclxuICAgIGxldCBsYWJlbHMgPSB7fTtcclxuICAgIGl0ZXJhdG9yLmZvckVhY2goZnVuY3Rpb24gKGFycmF5SXRlbSkge1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGFycmF5SXRlbS5sYWJlbDtcclxuICAgICAgICBsYWJlbE9iamVjdFtsYWJlbF0gPSB0cnVlO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIGxhYmVscyA9IE9iamVjdC5hc3NpZ24oe30sIGxhYmVsT2JqZWN0KTtcclxuICAgXHJcblxyXG4gICAgbGV0IGNhcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcHRpb25cIik7XHJcblxyXG4gICAgbGV0IHVwZGF0ZV9jYXB0aW9uID0gZnVuY3Rpb24gKGxlZ2VuZCkge1xyXG4gICAgICAgIGxhYmVsc1tsZWdlbmQudGV4dF0gPSBsZWdlbmQuaGlkZGVuO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGxhYmVsc1tsZWdlbmQudGV4dF0pO1xyXG4gICAgICAgIGxldCBzZWxlY3RlZCA9IE9iamVjdC5rZXlzKGxhYmVscykuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxhYmVsc1trZXldO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgdGV4dCA9IHNlbGVjdGVkLmxlbmd0aCA/IHNlbGVjdGVkLmpvaW4oXCIgJiBcIikgOiBcIm5vdGhpbmdcIjtcclxuICAgICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcclxuICAgICAgICBjYXB0aW9uLmlubmVySFRNTCA9IFwiVGhlIGNoYXJ0IGlzIGRpc3BsYXlpbmcgXCIgKyB0ZXh0O1xyXG4gICAgfTtcclxuXHJcbn07XHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xyXG4gICAgLy8gPT09PT09PT09PT09PSBTaW1wbGUgQ2xlYXIgRm9ybSBIYW5kbGVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy8gXHJcblxyXG4gICAgJChcIiNjbGVhcl9mb3JtXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJChcIiNmb3JtXCIpWzBdLnJlc2V0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gVG9nZ2xlIE1lbnUgT3B0aW9ucyBDaGV2cm9uID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAkKCcjbW9yZV9vcHRpb25zJykub24oJ3Nob3duLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIubW9yZV9vcHRpb25zXCIpLnJlbW92ZUNsYXNzKFwiZ2x5cGhpY29uLW1lbnUtZG93blwiKS5hZGRDbGFzcyhcImdseXBoaWNvbi1tZW51LXVwXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnI21vcmVfb3B0aW9ucycpLm9uKCdoaWRkZW4uYnMuY29sbGFwc2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIi5tb3JlX29wdGlvbnNcIikucmVtb3ZlQ2xhc3MoXCJnbHlwaGljb24tbWVudS11cFwiKS5hZGRDbGFzcyhcImdseXBoaWNvbi1tZW51LWRvd25cIik7XHJcbiAgICB9KTtcclxuXHJcbn07IiwiZXhwb3J0cy5zcGxpdFN0cmluZyA9IGZ1bmN0aW9uIChzdHJUb1NwbGl0LCBzZXBhcmF0b3IgPSBcIixcIikge1xyXG4gICAgaWYgKCFzdHJUb1NwbGl0KSB7XHJcbiAgICAgICAgYWxlcnQoXCJFcnJvcjogT25lIG9mIHlvdXIgcmVxdWlyZWQgZmllbGRzIGlzIGVtcHR5LlwiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGVzdCBmb3IgYSAnLCcgb3IgJy8nIGluIHRoZSBzdHJpbmdcclxuICAgIHJlc3VsdCA9IC9bLFxcL10vZy50ZXN0KHN0clRvU3BsaXQpO1xyXG4gICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAvLyBPbmx5IG9uZSBlbnRyeSBpbiBEYXRhIGZvcm1cclxuICAgICAgICByZXR1cm4gc3RyVG9TcGxpdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBuZXh0IHRlc3QgaWYgcmdiYSB1c2VkIGFuZCBpcyBpbiBtdWx0aXBsZSBkYXRhc2V0c1xyXG4gICAgcmVzdWx0ID0gLyg/PS4qXnJnYmE/KSg/PS4qW1xcL10pL2cudGVzdChzdHJUb1NwbGl0KTtcclxuICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICBzZXBhcmF0b3IgPSBcIi9cIjtcclxuICAgIH0gZWxzZSBpZiAoL1xccyosXFxzKig/PXJnYikvLnRlc3Qoc3RyVG9TcGxpdCkpIHsgICAvLyBUZXN0IGZvciBjb25zZWN1dGl2ZSBcIixyZ2JcIiBpbmRpY2F0aW5nIG11bHRpcGxlIHJnYmEgdmFsdWVzXHJcbiAgICAgICAgbGV0IHBhdHRlcm4gPSAvXFxzKixcXHMqKD89cmdiKS87IC8vIGxvb2sgZm9yIGNvbW1hIHdpdGggbG9vayBhaGVhZCB0byBhbiByZ2JcclxuICAgICAgICBzZXBhcmF0b3IgPSBwYXR0ZXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoL15yZ2JhPy9nLnRlc3Qoc3RyVG9TcGxpdCkpIHsgLy8gSXMgc2luZ2xlIHJnYmEgc28gcmV0dXJuXHJcbiAgICAgICAgICAgIHJldHVybiBzdHJUb1NwbGl0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTcGxpdCBhIHN0cmluZyBpbnRvIGFuIGFycmF5IGFuZCB0cmltIGFueSB3aGl0ZXNwYWNlXHJcbiAgICAvLyBhbmQgc3RvcmUgaXQgYmFja1xyXG4gICAgbGV0IGFycmF5T2ZTdHJpbmdzID0gc3RyVG9TcGxpdC5zcGxpdChzZXBhcmF0b3IpO1xyXG4gICAgYXJyYXlPZlN0cmluZ3MuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcbiAgICAgICAgYXJyYXlPZlN0cmluZ3NbaW5kZXhdID0gdmFsdWUudHJpbSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGFycmF5T2ZTdHJpbmdzO1xyXG59OyAgLy8gPT09PT09PT09PT09IEVuZCBzcGx0U3RyaW5nIEZ1bmN0aW9uID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xyXG4vLyBGdW5jdGlvbiB0byBjb252ZXJ0IHN0cmluZyB0byBhbiBhcnJheSB0aGVuIGNvbnZlcnQgZWFjaCBlbGVtZW50IHRvIGEgbnVtYmVyICAgICAgICAgICAgICAgIC8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuZXhwb3J0cy5zdHJUb051bWJlckFycmF5ID0gZnVuY3Rpb24gKHN0ciwgc2VwYXJhdG9yID0gJywnKSB7XHJcbiAgICBpZiAoc3RyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBhbGVydCgnRXJyb3I6IHN0cmluZyBpcyBlbXB0eS4nKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBUZXN0IGZvciBhIGNvbW1hIGluIHRoZSBzdHJpbmdcclxuICAgIGxldCByZXN1bHQgPSAvLCsvLnRlc3Qoc3RyKTtcclxuICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgYWxlcnQoYENvbW1hIGRlbGltaXRlciBtaXNzaW5nIGZyb20gJHtzdHJ9YCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGZvciBwYXJlbnRoZXNpcyBhbmQgcmVtb3ZlIFxyXG4gICAgcmVzdWx0ID0gL15cXCguKlxcKS8udGVzdChzdHIpO1xyXG4gICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgIHN0ciA9IHN0ci5zbGljZSgxLCAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGFycmF5T2ZOdW1iZXJzID0gc3RyLnNwbGl0KHNlcGFyYXRvcikubWFwKE51bWJlcik7XHJcblxyXG4gICAgcmV0dXJuIGFycmF5T2ZOdW1iZXJzO1xyXG59O1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuLy8gPT09PT09PT09PSBGdW5jdGlvbiBjb252ZXJ0IHN0cmluZyB0byBpbnRlZ2VyIG9yIGludGVnZXIgYXJyYXkgPT09PT09PT09PT09PT0gLy9cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuZXhwb3J0cy5zdHJUb051bWJlciA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIC8vIFRlc3QgZm9yIGEgY29tbWEgaW4gdGhlIHN0cmluZ1xyXG4gICAgY29uc3QgcmVzdWx0ID0gLywrLy50ZXN0KHN0cik7XHJcbiAgICBpZiAoIXJlc3VsdCkgeyAvLyBKdXN0IG9uZSBzdHJpbmcgZWxlbWVudCB0byBjb252ZXJ0IGFuIGludGVnZXJcclxuICAgICAgICBsZXQgbnVtID0gKyBzdHI7IC8vIHVuYXJ5ICsgb3BlcmF0aW9uIGRvZXMgdHlwZSBjb252ZXJzaW9uXHJcbiAgICAgICAgaWYgKGlzTmFOKG51bSkpIHsgLy8gY2hlY2sgaWYgY29udmVyc2lvbiBzdWNjZXNzZnVsXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBdHRlbnRpb24uIFVuYWJsZSB0byBjb252ZXJ0ICR7c3RyfSB0byBhIG51bWJlciBpbiBmdW5jdGlvbiBzdHJUb051bWJlcmApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudW07XHJcbiAgICB9IGVsc2UgeyAvLyB3ZSBoYXZlIG11bHRpcGxlIHN0cmluZyB2YWx1ZXMgdG8gY29udmVydCB0byBhbiBhcnJheSBvZiBudW1iZXJzXHJcbiAgICAgICAgbGV0IG51bSA9IHN0ci5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xyXG4gICAgICAgIGlmIChpc05hTihudW1bMF0pKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBdHRlbnRpb24uIFVuYWJsZSB0byBjb252ZXJ0ICR7c3RyfSB0byBhIG51bWJlcmApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudW07XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBGdW5jdGlvbiByZW1vdmUgYWxsIHdoaXRlc3BhY2UgZnJvbSBzdHJpbmdcclxuZXhwb3J0cy5yZW1vdmVXaGl0ZVNwYWNlID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgc3RyLnJlcGxhY2UoL1xccysvZywgJycpO1xyXG4gICAgcmV0dXJuIHN0cjtcclxufTtcclxuXHJcbi8vIEZ1bmN0aW9uIGl0ZXJhdGVzIHRocnUgYW4gYXJyYXkoZGF0YXNldHMpIGFuZCBwZXJmb3JtcyBhcHByb3ByaWF0ZVxyXG4vLyBhY3Rpb25zIG9uIGFycmF5IG9iamVjdCBlbGVtZW50cyAoZS5nLiwgYm9yZGVyQ29sb3I6IHJlZCwgYmx1ZSBiZWluZ1xyXG4vLyBzcGxpdCBpbnRvIGFuIGFycmF5KVxyXG5leHBvcnRzLmNvbnZlcnREYXRhQXJyYXlFbGVtZW50cyA9IChkYXRhQXJyYXksY2hhcnRUeXBlKSA9PiB7XHJcbiAgICBpZiAoZGF0YUFycmF5Lmxlbmd0aCA+IDEpIHsgLy8gd2UgaGF2ZSBtdWx0aXBsZSBkYXRhc2V0c1xyXG4gICAgICAgIGRhdGFBcnJheS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgZGF0YXNldF9pbmRleCkge1xyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGNoYXJ0RGF0YS5kYXRhc2V0c1tdLmRhdGEgb2JqZWN0IHRvIGFuIGFycmF5IG9mIG51bWJlcnMgXHJcbiAgICAgICAgICAgIGlmIChkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmRhdGEgPSBleHBvcnRzLnN0clRvTnVtYmVyQXJyYXkoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgICAgICBpZiAoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmJvcmRlcldpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uYm9yZGVyV2lkdGggPSBleHBvcnRzLnN0clRvTnVtYmVyKGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5ib3JkZXJXaWR0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGNvbW1hIHNlcGFyYXRlZCB2YWx1ZVxyXG4gICAgICAgICAgICBpZiAoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKC8sKy8udGVzdChkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uYmFja2dyb3VuZENvbG9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLnNwbGl0U3RyaW5nKGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0gZWxzZSB7ICAgLy8gdGhlcmUgaXMgb25seSBvbmUgZGF0YXNldFxyXG4gICAgICAgIHZhciBkYXRhc2V0X2luZGV4ID0gMDtcclxuXHJcbiAgICAgICAgLy8gQ29udmVydCBjaGFydERhdGEuZGF0YXNldHNbXS5kYXRhIG9iamVjdCB0byBhbiBhcnJheSBvZiBudW1iZXJzIFxyXG4gICAgICAgIGlmIChkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uZGF0YSAmJiBjaGFydFR5cGUgIT09ICdidWJibGUnKSB7XHJcbiAgICAgICAgICAgIGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5kYXRhID0gZXhwb3J0cy5zdHJUb051bWJlcihkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmJvcmRlcldpZHRoKSB7XHJcbiAgICAgICAgICAgIGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5ib3JkZXJXaWR0aCA9IGV4cG9ydHMuc3RyVG9OdW1iZXIoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmJvcmRlcldpZHRoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgICAgIGlmICgvLCsvLnRlc3QoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmJhY2tncm91bmRDb2xvcikpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLnNwbGl0U3RyaW5nKGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuICAgIC8vID09PT09PT09PT09PT09PT09PSBFbmQgRnVuY3Rpb24gRGVmaW5pdGlvbnMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xyXG5cclxuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gPT09PT09PT09PT09PT09PT09IEhhbmRsZXIgZm9yIFktQXhpcyBaZXJvICBjaGVja2JveCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKGNoYXJ0T3B0aW9ucykgPT4ge1xyXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieWF4aXNfemVyb1wiKS5jaGVja2VkKSB7XHJcbiAgICAgICAgbGV0IHlBeGlzWmVybyA9IHtcclxuICAgICAgICAgICAgc2NhbGVzOiB7XHJcbiAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkLmV4dGVuZCh0cnVlLCBjaGFydE9wdGlvbnMsIHlBeGlzWmVybyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCB5QXhpc1plcm8gPSB7XHJcbiAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW5BdFplcm86IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKHRydWUsIGNoYXJ0T3B0aW9ucywgeUF4aXNaZXJvKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuXHJcbiIsIi8vIC9wdWJsaWMvbWFpbi5qc1xyXG5sZXQgaGVscGVyID0gcmVxdWlyZSgnLi9saWJyYXJ5L2hlbHBlcnMnKTtcclxubGV0IHlBeGlzWmVybyA9IHJlcXVpcmUoJy4vbGlicmFyeS95QXhpc1plcm8nKTtcclxubGV0IGV2ZW50SGFuZGxlcnMgPSByZXF1aXJlKCcuL2xpYnJhcnkvZXZlbnRIYW5kbGVycycpO1xyXG5sZXQgY2FwdGlvbkNvbnRyb2wgPSByZXF1aXJlKCcuL2xpYnJhcnkvY2FwdGlvbkNvbnRyb2wnKTtcclxuY29uc29sZS5sb2coY2FwdGlvbkNvbnRyb2wpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gTGV0J3MgZGVjbGFyZSBzb21lIHZhcmlhYmxlc1xyXG4gICAgbGV0IGNvdW50ZXIgPSAwOyAgIC8vIEtlZXBzIHRyYWNrIG9mIGlmIGNhbnZhcyBoYXMgYWxyZWFkeSBiZWVuIGRyYXduXHJcbiAgICBsZXQgY2hhcnREYXRhID0ge307XHJcbiAgICBsZXQgY2hhcnRUeXBlID0gJyc7XHJcbiAgICBsZXQgY2hhcnRPcHRpb25zID0ge307XHJcbiAgICBsZXQgeE9wdGlvbnMgPSB7fTtcclxuICAgIGxldCB5T3B0aW9ucyA9IHt9O1xyXG4gICAgbGV0IHRpdGxlT3B0aW9ucyA9IHt9O1xyXG4gICAgXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09IE1haW4gRXZlbnQgSGFuZGxlciBmb3IgRXhwcmVzcyBDaGFydCBNYWtlciA9PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAvLyA9PSBUaGlzIGhhbmRsZXIgZ2VuZXJhdGVzIHRoZSBjaGFydERhdGEgb2JqZWN0IHRoYXQgQ2hhcnQuanMgd2lsbCB1c2UgdG8gZHJhdyB0aGUgY2hhcnQ9PT09PT09IC8vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAkKFwiI2Zvcm1cIikudmFsaWRhdG9yKCkub24oXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG4gICAgICAgICAgICAvLyBEbyBub3RoaW5nLiBUaGVyZSB3YXMgYW4gZXJyb3IuIFRoaXMgaXMgcmVxdWlyZWQgZm9yIHZhbGlkYXRvcigpIHRvIHdvcmtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBIaWRlIGluaXRpYWwgSW1hZ2UgYW5kIEhlbHAgdGFiLCBhbmQgbWFrZSB2aXNpYmxlIG15Q2hhcnQgb2JqZWN0XHJcbiAgICAgICAgICAgIGlmIChjb3VudGVyID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2NoYXJ0X2ltYWdlXCIpLmFkZENsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICQoXCIub3Blbl9oZWxwXCIpLmFkZENsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICQoXCIuc3ViX3RpdGxlXCIpLmFkZENsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICQoXCIjbXlDaGFydFwiKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJChcIiNwcmludF9jaGFydFwiKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBGaXJzdCBncmFiIGZvcm0gZGF0YSBvZmYgdGhlIHBhZ2VcclxuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSAkKCdmb3JtJykuc2VyaWFsaXplQXJyYXkoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEdldCBDaGFydCBUeXBlIFNlcGVyYXRlIGZyb20gRm9ybSBEYXRhXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJ0VHlwZUNvbnRyb2wgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJ0X3R5cGVcIik7XHJcbiAgICAgICAgICAgIGNoYXJ0VHlwZSA9IGNoYXJ0VHlwZUNvbnRyb2wub3B0aW9uc1tjaGFydFR5cGVDb250cm9sLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIENsZWFyIHRoZSBjaGFydERhdGEgZGF0YSBPYmplY3QgZm9yIENoYXJ0IGNvbnN0cnVjdG9yIHRvIHJldXNlIGZyb20gaW5pdGlhbCBjaGFydCBkcmF3XHJcbiAgICAgICAgICAgIGNoYXJ0RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIGRhdGFzZXRzOiBbXVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gQ29udmVydCBmb3JtRGF0YSBhcnJheSB0byBjaGFydERhdGEgb2JqZWN0XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmb3JtRGF0YVtpbmRleF0udmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBEbyBub3RoaW5nIHN0cmluZyBlbXB0eVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBmb3JtIHZhbHVlIGhhcyBtdWx0aXBsZSBkYXRhc2V0cyhoYXMgYSAnLycpIGFuZCBpZiBzb1xyXG4gICAgICAgICAgICAgICAgLy8gc3BsaXQgdGhlIHN0cmluZyBpbnRvIHNlcGVyYXRlIGRhdGFzZXQnc1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKGZvcm1EYXRhW2luZGV4XS52YWx1ZS5pbmRleE9mKCcvJykgPiAtMSkgJiYgIShmb3JtRGF0YVtpbmRleF0ubmFtZS5pbmNsdWRlcygnQXhpcycpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNwbGl0IHRoZSBmaWVsZCB1cCBpbnRvIHNlcGVyYXRlIGFycmF5IGl0ZW1zXHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybURhdGFbaW5kZXhdLnZhbHVlID0gaGVscGVyLnNwbGl0U3RyaW5nKGZvcm1EYXRhW2luZGV4XS52YWx1ZSwgJy8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm93IHB1dCB0aGUgYXJyYXkgaXRlbXMgaW50byB0aGVpciBzZXBlcmF0ZSBjaGFydERhdGEuZGF0YXNldHMgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaS5lLiBJZiB5b3UgaGFkIGZvcm1EYXRhW2luZGV4XS52YWx1ZSBlcXVhbCB0byBbMF0gYXBwbGVzIGFuZCBbMV0gb3Jhbmdlc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGl0ZXJhdGUgdGhydSB0aGlzIGFycmF5IGFuZCBwdXQgZWFjaCBlbGVtZW50IGludG8gY2hhcnREYXRhLmRhdGFzZXRzWzAgb3IgMV1cclxuICAgICAgICAgICAgICAgICAgICAvLyBjaGFydERhdGEuZGF0YXNldHNbMF0gPT09PiBhcHBsZXMgYW5kIGNoYXJ0RGF0YS5kYXRhc2V0c1sxXSA9PT0+IG9yYW5nZXNcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbHNvIGNoZWNrIGlmIGEgYnViYmxlIGNoYXJ0IGFuZCBmb3JtYXQgZGF0YSBvYmplY3QgYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRUeXBlID09PSAnYnViYmxlJyAmJiBmb3JtRGF0YVtpbmRleF0ubmFtZSA9PT0gJ2RhdGEnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbZm9ybURhdGFbaW5kZXhdLm5hbWVdID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YVtpbmRleF0udmFsdWUuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGRhdGFzZXRfaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZURhdGFJdGVtQXJyYXkgPSBoZWxwZXIuc3RyVG9OdW1iZXJBcnJheSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGVEYXRhU2V0ID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGVEYXRhU2V0LnggPSBidWJibGVEYXRhSXRlbUFycmF5WzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlRGF0YVNldC55ID0gYnViYmxlRGF0YUl0ZW1BcnJheVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZURhdGFTZXQuciA9IGJ1YmJsZURhdGFJdGVtQXJyYXlbMl07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtmb3JtRGF0YVtpbmRleF0ubmFtZV0ucHVzaChidWJibGVEYXRhU2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydERhdGEuZGF0YXNldHNbMF0gPSBPYmplY3QuYXNzaWduKGNoYXJ0RGF0YS5kYXRhc2V0c1swXSB8fCB7fSwgZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGFbaW5kZXhdLnZhbHVlLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBkYXRhc2V0X2luZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtmb3JtRGF0YVtpbmRleF0ubmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5kYXRhc2V0c1tkYXRhc2V0X2luZGV4XSA9IE9iamVjdC5hc3NpZ24oY2hhcnREYXRhLmRhdGFzZXRzW2RhdGFzZXRfaW5kZXhdIHx8IHt9LCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybURhdGFbaW5kZXhdLm5hbWUuaW5jbHVkZXMoJ0F4aXMnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYW4gQXhpcyBsYWJlbCBvciBmb250IHNpemUgZm9ybSB2YWx1ZSB3ZSBuZWVkIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIHB1dCBpbiB0aGUgY2hhcnRPcHRpb25zIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybURhdGFbaW5kZXhdLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAneEF4aXNMYWJlbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogZm9ybURhdGFbaW5kZXhdLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBmb3JtRGF0YVtpbmRleCArIDFdLnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAneUF4aXNMYWJlbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogZm9ybURhdGFbaW5kZXhdLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBmb3JtRGF0YVtpbmRleCArIDFdLnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGFydEF4aXNUaXRsZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZU9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICd0b3AnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBmb3JtRGF0YVtpbmRleF0udmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBmb3JtRGF0YVtpbmRleCArIDFdLnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd4QXhpc0ZvbnQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3lBeGlzRm9udCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGl0bGVGb250JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHsgLy8gUHV0IGZvcm0gdmFsdWUgKC5lZywgXCJsYWJlbHNcIiBmb3JtIGlucHV0IHZhbHVlKSBhcyBhIHByb3BlcnR5IGludG8gdGhlIGNoYXJ0RGF0YSBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbZm9ybURhdGFbaW5kZXhdLm5hbWVdID0gZm9ybURhdGFbaW5kZXhdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIERvbnQgcHV0IGluIHRoZSBjaGFydERhdGEuZGF0YXNldHMgb2JqZWN0IGlmIGlzIHRoZSBsYWJlbHMgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybURhdGFbaW5kZXhdLm5hbWUgPT09ICdsYWJlbHMnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YSA9IE9iamVjdC5hc3NpZ24oY2hhcnREYXRhIHx8IHt9LCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1EYXRhW2luZGV4XS5uYW1lID09PSAnb3B0aW9ucycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG8gbm90aGluZy4gRm9ybSB2YWx1ZSBhbHJlYWR5IGluIE9wdGlvbnMgdmFyaWFibGVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hhcnRUeXBlID09PSBcImJ1YmJsZVwiKSB7ICAvLyBPbmx5IG9uZSBkYXRhc2V0IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLmRhdGFzZXRzWzBdID0gT2JqZWN0LmFzc2lnbihjaGFydERhdGEuZGF0YXNldHMgfHwge30sIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5kYXRhc2V0c1swXSA9IE9iamVjdC5hc3NpZ24oY2hhcnREYXRhLmRhdGFzZXRzWzBdIHx8IHt9LCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pOyAvLyBlbmQgZm9yRWFjaFxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgLy8gIE5vdyB3ZSBoYXZlIHRvIGRvIHNvbWUgY29udmVydGluZyBpLmUuLCBjaGFydERhdGEubGFiZWxzIG11c3QgYmUgY29udmVydGVkIHRvIGFycmF5IFxyXG4gICAgICAgICAgICAvLyAgZnJvbSBzdHJpbmcgZXRjLi4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hhcnREYXRhLmxhYmVscykge1xyXG4gICAgICAgICAgICAgICAgY2hhcnREYXRhLmxhYmVscyA9IGhlbHBlci5zcGxpdFN0cmluZyhjaGFydERhdGEubGFiZWxzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBzZWUgaWYgdGhlcmUgYXJlIG11bHRpcGxlIGRhdGFzZXRzIGFuZCBpZiBzbywgbG9vcCB0aHJ1IHRoZSBkYXRhc2V0cyBcclxuICAgICAgICAgICAgLy8gc2VuZGluZyBhcHByb3ByaWF0ZSBvYmplY3QgdmFsdWVzIChlLmcuLCBkYXRhc2V0cy5kYXRhIGFuZCBkYXRhc2V0cy5ib3JkZXJXaWR0aCkgdG8gdGhlXHJcbiAgICAgICAgICAgIC8vIGhlbHBlci5zcGxpdFN0cmluZyBtZXRob2QuIFNvIHdlIGNhbGwgb3VyIGNvbnZlcnREYXRhQXJyYXlFbGVtZW50cyBcclxuICAgICAgICAgICAgaGVscGVyLmNvbnZlcnREYXRhQXJyYXlFbGVtZW50cyhjaGFydERhdGEuZGF0YXNldHMsIGNoYXJ0VHlwZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gTm93IHJlYWR5IHRvIGRyYXcgdGhlIGNhbnZhcyB3aXRoIHRoZSBjaGFydCBkYXRhXHJcbiAgICAgICAgICAgIC8vIGZyb20gdGhlIGZvcm0uXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShjaGFydERhdGEuZGF0YXNldHNbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgRXJyb3IuIFJlY2hlY2sgeW91ciBmb3JtIGRhdGEuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlDaGFydFwiKS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgLy8gRG8gc29tZSBjb252ZXJ0aW5nIGZyb20gYSBzdHJpbmcgdG8gYSBKU09OIHRvIEpTIG9iamVjdCBzbyB3ZSBjYW4gYXNzaWduIHRvIFxyXG4gICAgICAgICAgICAgICAgLy8gbXlDaGFydC5vcHRpb25zIGxhdGVyLi5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnNGb3JtVmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJ0X29wdGlvbnNcIikudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBsZXQganNvbiA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIG9wdGlvbnMgd2VyZSBpbnB1dCBhbmQgaWYgc28gZmlyc3QgY29uc3RydWN0XHJcbiAgICAgICAgICAgICAgICAvLyBtb3JlT3B0aW9ucyBPYmplY3QgZnJvbSBmcmVlIGZvcm0gZmllbGQsIHRoZW4geCZ5T3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gb2JqZWN0cyBmcm9tIGZvcm0gYW5kIG1lcmdlIHRoZW0gaW50byBjaGFydE9wdGlvbnMuc2NhbGVzXHJcbiAgICAgICAgICAgICAgICAvLyB2aWEgT2JqZWN0LmFzc2lnbiBtZXRob2RcclxuICAgICAgICAgICAgICAgIGlmICgob3B0aW9uc0Zvcm1WYWx1ZSAhPT0gJycpIHx8ICgkKCcjeF9heGlzX2xhYmVsJykudmFsKCkpIHx8ICh0aXRsZU9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNGb3JtVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbiA9IEpTT04uc3RyaW5naWZ5KGV2YWwoXCIoXCIgKyBvcHRpb25zRm9ybVZhbHVlICsgXCIpXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9yZU9wdGlvbnMgPSBKU09OLnBhcnNlKGpzb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBjaGFydE9wdGlvbnMsIG1vcmVPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoeE9wdGlvbnMuc2NhbGVzKSB8fCAoeU9wdGlvbnMuc2NhbGVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEdWUgdG8gb2JqZWN0IGRlZmF1bHRpbmcgdG8gc2hhbGxvdyBjb3B5IHcvT2JqZWN0LmFzc2lnbiB3ZSBtdXN0IGRvIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbiBvYmplY3QgbWVyZ2Ugdy9qUXVlcnkgJC5leHRlbmQgbWV0aG9kIHcvdHJ1ZSBvcHRpb24gZm9yIGRlZXAgY29weVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBjaGFydE9wdGlvbnMsIHhPcHRpb25zLCB5T3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGl0bGVPcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydE9wdGlvbnMgfHwge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZU9wdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbW9kdWxlIGNhbGwgdG8gaGFuZGxlIHplcm9pbmcgb3V0IFxyXG4gICAgICAgICAgICAgICAgLy8gdGhlIHktYXhpcyBvbiBhIGNoYXJ0XHJcbiAgICAgICAgICAgICAgICB5QXhpc1plcm8oY2hhcnRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgYSBjaGFydCBleGlzdHMgdG8gZGVzdHJveVxyXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXIgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXlDaGFydC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbXlDaGFydCA9IG5ldyBDaGFydChjdHgsIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBjaGFydFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY2hhcnREYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGNoYXJ0T3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY291bnRlciArPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhcHRpb25Db250cm9sKG15Q2hhcnQpO1xyXG4gICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAvLyA9PT09PT09PT09PT0gZW5kIGVsc2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICB9KTtcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvLyAgICBcclxuICAgIC8vID09PT09PT09PT09PT09PT0gRW5kIC5vbiBcImNsaWNrXCIgTWFpbiBFdmVudCBIYW5kbGVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuXHJcbiAgICAvLyBTb21lIG1pc2NlbGxlbmVvdXMgZXZlbnQgaGFuZGxlcnMgZm9yIHRoZSBhcHAuXHJcbiAgICBldmVudEhhbmRsZXJzKCk7XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbn0pOyAvLyBFbmQgLmRvY3VtZW50LnJlYWR5KCkiXX0=
