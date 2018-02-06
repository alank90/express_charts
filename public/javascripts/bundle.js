(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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


},{}],3:[function(require,module,exports){
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



},{}],4:[function(require,module,exports){
// /public/main.js
let helper = require('./library/helpers');
let yAxisZero = require('./library/yAxisZero');
let eventHandlers = require('./library/eventHandlers');

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

                    if (!(jQuery.isEmptyObject(titleOptions))) {
                        chartOptions = Object.assign(
                            chartOptions || {},
                            titleOptions
                        );
                    }
                }

                // module call to handle zeroing out 
                // the y-axis on a chart. Cant call if pie chart. Will cause 
                // throw an error
                if ((chartType !== 'pie') && (chartType !== 'doughnut')) {
                    yAxisZero(chartOptions);
                }

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
},{"./library/eventHandlers":1,"./library/helpers":2,"./library/yAxisZero":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc3JjL2pzL2xpYnJhcnkvZXZlbnRIYW5kbGVycy5qcyIsInB1YmxpYy9zcmMvanMvbGlicmFyeS9oZWxwZXJzLmpzIiwicHVibGljL3NyYy9qcy9saWJyYXJ5L3lBeGlzWmVyby5qcyIsInB1YmxpYy9zcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuICAgIC8vID09PT09PT09PT09PT0gU2ltcGxlIENsZWFyIEZvcm0gSGFuZGxlciA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vIFxyXG5cclxuICAgICQoXCIjY2xlYXJfZm9ybVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoXCIjZm9ybVwiKVswXS5yZXNldCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFRvZ2dsZSBNZW51IE9wdGlvbnMgQ2hldnJvbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xyXG4gICAgJCgnI21vcmVfb3B0aW9ucycpLm9uKCdzaG93bi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFwiLm1vcmVfb3B0aW9uc1wiKS5yZW1vdmVDbGFzcyhcImdseXBoaWNvbi1tZW51LWRvd25cIikuYWRkQ2xhc3MoXCJnbHlwaGljb24tbWVudS11cFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJyNtb3JlX29wdGlvbnMnKS5vbignaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIubW9yZV9vcHRpb25zXCIpLnJlbW92ZUNsYXNzKFwiZ2x5cGhpY29uLW1lbnUtdXBcIikuYWRkQ2xhc3MoXCJnbHlwaGljb24tbWVudS1kb3duXCIpO1xyXG4gICAgfSk7XHJcblxyXG59OyIsImV4cG9ydHMuc3BsaXRTdHJpbmcgPSBmdW5jdGlvbiAoc3RyVG9TcGxpdCwgc2VwYXJhdG9yID0gXCIsXCIpIHtcclxuICAgIGlmICghc3RyVG9TcGxpdCkge1xyXG4gICAgICAgIGFsZXJ0KFwiRXJyb3I6IE9uZSBvZiB5b3VyIHJlcXVpcmVkIGZpZWxkcyBpcyBlbXB0eS5cIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRlc3QgZm9yIGEgJywnIG9yICcvJyBpbiB0aGUgc3RyaW5nXHJcbiAgICByZXN1bHQgPSAvWyxcXC9dL2cudGVzdChzdHJUb1NwbGl0KTtcclxuICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgLy8gT25seSBvbmUgZW50cnkgaW4gRGF0YSBmb3JtXHJcbiAgICAgICAgcmV0dXJuIHN0clRvU3BsaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbmV4dCB0ZXN0IGlmIHJnYmEgdXNlZCBhbmQgaXMgaW4gbXVsdGlwbGUgZGF0YXNldHNcclxuICAgIHJlc3VsdCA9IC8oPz0uKl5yZ2JhPykoPz0uKltcXC9dKS9nLnRlc3Qoc3RyVG9TcGxpdCk7XHJcbiAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgc2VwYXJhdG9yID0gXCIvXCI7XHJcbiAgICB9IGVsc2UgaWYgKC9cXHMqLFxccyooPz1yZ2IpLy50ZXN0KHN0clRvU3BsaXQpKSB7ICAgLy8gVGVzdCBmb3IgY29uc2VjdXRpdmUgXCIscmdiXCIgaW5kaWNhdGluZyBtdWx0aXBsZSByZ2JhIHZhbHVlc1xyXG4gICAgICAgIGxldCBwYXR0ZXJuID0gL1xccyosXFxzKig/PXJnYikvOyAvLyBsb29rIGZvciBjb21tYSB3aXRoIGxvb2sgYWhlYWQgdG8gYW4gcmdiXHJcbiAgICAgICAgc2VwYXJhdG9yID0gcGF0dGVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKC9ecmdiYT8vZy50ZXN0KHN0clRvU3BsaXQpKSB7IC8vIElzIHNpbmdsZSByZ2JhIHNvIHJldHVyblxyXG4gICAgICAgICAgICByZXR1cm4gc3RyVG9TcGxpdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3BsaXQgYSBzdHJpbmcgaW50byBhbiBhcnJheSBhbmQgdHJpbSBhbnkgd2hpdGVzcGFjZVxyXG4gICAgLy8gYW5kIHN0b3JlIGl0IGJhY2tcclxuICAgIGxldCBhcnJheU9mU3RyaW5ncyA9IHN0clRvU3BsaXQuc3BsaXQoc2VwYXJhdG9yKTtcclxuICAgIGFycmF5T2ZTdHJpbmdzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG4gICAgICAgIGFycmF5T2ZTdHJpbmdzW2luZGV4XSA9IHZhbHVlLnRyaW0oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBhcnJheU9mU3RyaW5ncztcclxufTsgIC8vID09PT09PT09PT09PSBFbmQgc3BsdFN0cmluZyBGdW5jdGlvbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuLy8gRnVuY3Rpb24gdG8gY29udmVydCBzdHJpbmcgdG8gYW4gYXJyYXkgdGhlbiBjb252ZXJ0IGVhY2ggZWxlbWVudCB0byBhIG51bWJlciAgICAgICAgICAgICAgICAvL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbmV4cG9ydHMuc3RyVG9OdW1iZXJBcnJheSA9IGZ1bmN0aW9uIChzdHIsIHNlcGFyYXRvciA9ICcsJykge1xyXG4gICAgaWYgKHN0ciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgYWxlcnQoJ0Vycm9yOiBzdHJpbmcgaXMgZW1wdHkuJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gVGVzdCBmb3IgYSBjb21tYSBpbiB0aGUgc3RyaW5nXHJcbiAgICBsZXQgcmVzdWx0ID0gLywrLy50ZXN0KHN0cik7XHJcbiAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgIGFsZXJ0KGBDb21tYSBkZWxpbWl0ZXIgbWlzc2luZyBmcm9tICR7c3RyfWApO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBmb3IgcGFyZW50aGVzaXMgYW5kIHJlbW92ZSBcclxuICAgIHJlc3VsdCA9IC9eXFwoLipcXCkvLnRlc3Qoc3RyKTtcclxuICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICBzdHIgPSBzdHIuc2xpY2UoMSwgLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBhcnJheU9mTnVtYmVycyA9IHN0ci5zcGxpdChzZXBhcmF0b3IpLm1hcChOdW1iZXIpO1xyXG5cclxuICAgIHJldHVybiBhcnJheU9mTnVtYmVycztcclxufTtcclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbi8vID09PT09PT09PT0gRnVuY3Rpb24gY29udmVydCBzdHJpbmcgdG8gaW50ZWdlciBvciBpbnRlZ2VyIGFycmF5ID09PT09PT09PT09PT09IC8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbmV4cG9ydHMuc3RyVG9OdW1iZXIgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAvLyBUZXN0IGZvciBhIGNvbW1hIGluIHRoZSBzdHJpbmdcclxuICAgIGNvbnN0IHJlc3VsdCA9IC8sKy8udGVzdChzdHIpO1xyXG4gICAgaWYgKCFyZXN1bHQpIHsgLy8gSnVzdCBvbmUgc3RyaW5nIGVsZW1lbnQgdG8gY29udmVydCBhbiBpbnRlZ2VyXHJcbiAgICAgICAgbGV0IG51bSA9ICsgc3RyOyAvLyB1bmFyeSArIG9wZXJhdGlvbiBkb2VzIHR5cGUgY29udmVyc2lvblxyXG4gICAgICAgIGlmIChpc05hTihudW0pKSB7IC8vIGNoZWNrIGlmIGNvbnZlcnNpb24gc3VjY2Vzc2Z1bFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW50aW9uLiBVbmFibGUgdG8gY29udmVydCAke3N0cn0gdG8gYSBudW1iZXIgaW4gZnVuY3Rpb24gc3RyVG9OdW1iZXJgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVtO1xyXG4gICAgfSBlbHNlIHsgLy8gd2UgaGF2ZSBtdWx0aXBsZSBzdHJpbmcgdmFsdWVzIHRvIGNvbnZlcnQgdG8gYW4gYXJyYXkgb2YgbnVtYmVyc1xyXG4gICAgICAgIGxldCBudW0gPSBzdHIuc3BsaXQoJywnKS5tYXAoTnVtYmVyKTtcclxuICAgICAgICBpZiAoaXNOYU4obnVtWzBdKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW50aW9uLiBVbmFibGUgdG8gY29udmVydCAke3N0cn0gdG8gYSBudW1iZXJgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVtO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gRnVuY3Rpb24gcmVtb3ZlIGFsbCB3aGl0ZXNwYWNlIGZyb20gc3RyaW5nXHJcbmV4cG9ydHMucmVtb3ZlV2hpdGVTcGFjZSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIHN0ci5yZXBsYWNlKC9cXHMrL2csICcnKTtcclxuICAgIHJldHVybiBzdHI7XHJcbn07XHJcblxyXG4vLyBGdW5jdGlvbiBpdGVyYXRlcyB0aHJ1IGFuIGFycmF5KGRhdGFzZXRzKSBhbmQgcGVyZm9ybXMgYXBwcm9wcmlhdGVcclxuLy8gYWN0aW9ucyBvbiBhcnJheSBvYmplY3QgZWxlbWVudHMgKGUuZy4sIGJvcmRlckNvbG9yOiByZWQsIGJsdWUgYmVpbmdcclxuLy8gc3BsaXQgaW50byBhbiBhcnJheSlcclxuZXhwb3J0cy5jb252ZXJ0RGF0YUFycmF5RWxlbWVudHMgPSAoZGF0YUFycmF5LGNoYXJ0VHlwZSkgPT4ge1xyXG4gICAgaWYgKGRhdGFBcnJheS5sZW5ndGggPiAxKSB7IC8vIHdlIGhhdmUgbXVsdGlwbGUgZGF0YXNldHNcclxuICAgICAgICBkYXRhQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGRhdGFzZXRfaW5kZXgpIHtcclxuICAgICAgICAgICAgLy8gQ29udmVydCBjaGFydERhdGEuZGF0YXNldHNbXS5kYXRhIG9iamVjdCB0byBhbiBhcnJheSBvZiBudW1iZXJzIFxyXG4gICAgICAgICAgICBpZiAoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5kYXRhID0gZXhwb3J0cy5zdHJUb051bWJlckFycmF5KGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb252ZXJ0IHN0cmluZyB0byBudW1iZXJcclxuICAgICAgICAgICAgaWYgKGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5ib3JkZXJXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmJvcmRlcldpZHRoID0gZXhwb3J0cy5zdHJUb051bWJlcihkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uYm9yZGVyV2lkdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBjb21tYSBzZXBhcmF0ZWQgdmFsdWVcclxuICAgICAgICAgICAgaWYgKGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgIGlmICgvLCsvLnRlc3QoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmJhY2tncm91bmRDb2xvcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5zcGxpdFN0cmluZyhkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9IGVsc2UgeyAgIC8vIHRoZXJlIGlzIG9ubHkgb25lIGRhdGFzZXRcclxuICAgICAgICB2YXIgZGF0YXNldF9pbmRleCA9IDA7XHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgY2hhcnREYXRhLmRhdGFzZXRzW10uZGF0YSBvYmplY3QgdG8gYW4gYXJyYXkgb2YgbnVtYmVycyBcclxuICAgICAgICBpZiAoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmRhdGEgJiYgY2hhcnRUeXBlICE9PSAnYnViYmxlJykge1xyXG4gICAgICAgICAgICBkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uZGF0YSA9IGV4cG9ydHMuc3RyVG9OdW1iZXIoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5ib3JkZXJXaWR0aCkge1xyXG4gICAgICAgICAgICBkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uYm9yZGVyV2lkdGggPSBleHBvcnRzLnN0clRvTnVtYmVyKGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5ib3JkZXJXaWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0YUFycmF5W2RhdGFzZXRfaW5kZXhdLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICBpZiAoLywrLy50ZXN0KGRhdGFBcnJheVtkYXRhc2V0X2luZGV4XS5iYWNrZ3JvdW5kQ29sb3IpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5zcGxpdFN0cmluZyhkYXRhQXJyYXlbZGF0YXNldF9pbmRleF0uYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gRW5kIEZ1bmN0aW9uIERlZmluaXRpb25zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuXHJcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vID09PT09PT09PT09PT09PT09PSBIYW5kbGVyIGZvciBZLUF4aXMgWmVybyAgY2hlY2tib3ggPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChjaGFydE9wdGlvbnMpID0+IHtcclxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInlheGlzX3plcm9cIikuY2hlY2tlZCkge1xyXG4gICAgICAgIGxldCB5QXhpc1plcm8gPSB7XHJcbiAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJC5leHRlbmQodHJ1ZSwgY2hhcnRPcHRpb25zLCB5QXhpc1plcm8pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgeUF4aXNaZXJvID0ge1xyXG4gICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgIHlBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2luQXRaZXJvOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkLmV4dGVuZCh0cnVlLCBjaGFydE9wdGlvbnMsIHlBeGlzWmVybyk7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblxyXG4iLCIvLyAvcHVibGljL21haW4uanNcclxubGV0IGhlbHBlciA9IHJlcXVpcmUoJy4vbGlicmFyeS9oZWxwZXJzJyk7XHJcbmxldCB5QXhpc1plcm8gPSByZXF1aXJlKCcuL2xpYnJhcnkveUF4aXNaZXJvJyk7XHJcbmxldCBldmVudEhhbmRsZXJzID0gcmVxdWlyZSgnLi9saWJyYXJ5L2V2ZW50SGFuZGxlcnMnKTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIExldCdzIGRlY2xhcmUgc29tZSB2YXJpYWJsZXNcclxuICAgIGxldCBjb3VudGVyID0gMDsgICAvLyBLZWVwcyB0cmFjayBvZiBpZiBjYW52YXMgaGFzIGFscmVhZHkgYmVlbiBkcmF3blxyXG4gICAgbGV0IGNoYXJ0RGF0YSA9IHt9O1xyXG4gICAgbGV0IGNoYXJ0VHlwZSA9ICcnO1xyXG4gICAgbGV0IGNoYXJ0T3B0aW9ucyA9IHt9O1xyXG4gICAgbGV0IHhPcHRpb25zID0ge307XHJcbiAgICBsZXQgeU9wdGlvbnMgPSB7fTtcclxuICAgIGxldCB0aXRsZU9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09IE1haW4gRXZlbnQgSGFuZGxlciBmb3IgRXhwcmVzcyBDaGFydCBNYWtlciA9PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAvLyA9PSBUaGlzIGhhbmRsZXIgZ2VuZXJhdGVzIHRoZSBjaGFydERhdGEgb2JqZWN0IHRoYXQgQ2hhcnQuanMgd2lsbCB1c2UgdG8gZHJhdyB0aGUgY2hhcnQ9PT09PT09IC8vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXHJcbiAgICAkKFwiI2Zvcm1cIikudmFsaWRhdG9yKCkub24oXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG4gICAgICAgICAgICAvLyBEbyBub3RoaW5nLiBUaGVyZSB3YXMgYW4gZXJyb3IuIFRoaXMgaXMgcmVxdWlyZWQgZm9yIHZhbGlkYXRvcigpIHRvIHdvcmtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBIaWRlIGluaXRpYWwgSW1hZ2UgYW5kIEhlbHAgdGFiLCBhbmQgbWFrZSB2aXNpYmxlIG15Q2hhcnQgb2JqZWN0XHJcbiAgICAgICAgICAgIGlmIChjb3VudGVyID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2NoYXJ0X2ltYWdlXCIpLmFkZENsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICQoXCIub3Blbl9oZWxwXCIpLmFkZENsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICQoXCIuc3ViX3RpdGxlXCIpLmFkZENsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICQoXCIjbXlDaGFydFwiKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJChcIiNwcmludF9jaGFydFwiKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBGaXJzdCBncmFiIGZvcm0gZGF0YSBvZmYgdGhlIHBhZ2VcclxuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSAkKCdmb3JtJykuc2VyaWFsaXplQXJyYXkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCBDaGFydCBUeXBlIFNlcGVyYXRlIGZyb20gRm9ybSBEYXRhXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXJ0VHlwZUNvbnRyb2wgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJ0X3R5cGVcIik7XHJcbiAgICAgICAgICAgIGNoYXJ0VHlwZSA9IGNoYXJ0VHlwZUNvbnRyb2wub3B0aW9uc1tjaGFydFR5cGVDb250cm9sLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIENsZWFyIHRoZSBjaGFydERhdGEgZGF0YSBPYmplY3QgZm9yIENoYXJ0IGNvbnN0cnVjdG9yIHRvIHJldXNlIGZyb20gaW5pdGlhbCBjaGFydCBkcmF3XHJcbiAgICAgICAgICAgIGNoYXJ0RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIGRhdGFzZXRzOiBbXVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gQ29udmVydCBmb3JtRGF0YSBhcnJheSB0byBjaGFydERhdGEgb2JqZWN0XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmb3JtRGF0YVtpbmRleF0udmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBEbyBub3RoaW5nIHN0cmluZyBlbXB0eVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBmb3JtIHZhbHVlIGhhcyBtdWx0aXBsZSBkYXRhc2V0cyhoYXMgYSAnLycpIGFuZCBpZiBzb1xyXG4gICAgICAgICAgICAgICAgLy8gc3BsaXQgdGhlIHN0cmluZyBpbnRvIHNlcGVyYXRlIGRhdGFzZXQnc1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKGZvcm1EYXRhW2luZGV4XS52YWx1ZS5pbmRleE9mKCcvJykgPiAtMSkgJiYgIShmb3JtRGF0YVtpbmRleF0ubmFtZS5pbmNsdWRlcygnQXhpcycpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNwbGl0IHRoZSBmaWVsZCB1cCBpbnRvIHNlcGVyYXRlIGFycmF5IGl0ZW1zXHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybURhdGFbaW5kZXhdLnZhbHVlID0gaGVscGVyLnNwbGl0U3RyaW5nKGZvcm1EYXRhW2luZGV4XS52YWx1ZSwgJy8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm93IHB1dCB0aGUgYXJyYXkgaXRlbXMgaW50byB0aGVpciBzZXBlcmF0ZSBjaGFydERhdGEuZGF0YXNldHMgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaS5lLiBJZiB5b3UgaGFkIGZvcm1EYXRhW2luZGV4XS52YWx1ZSBlcXVhbCB0byBbMF0gYXBwbGVzIGFuZCBbMV0gb3Jhbmdlc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGl0ZXJhdGUgdGhydSB0aGlzIGFycmF5IGFuZCBwdXQgZWFjaCBlbGVtZW50IGludG8gY2hhcnREYXRhLmRhdGFzZXRzWzAgb3IgMV1cclxuICAgICAgICAgICAgICAgICAgICAvLyBjaGFydERhdGEuZGF0YXNldHNbMF0gPT09PiBhcHBsZXMgYW5kIGNoYXJ0RGF0YS5kYXRhc2V0c1sxXSA9PT0+IG9yYW5nZXNcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbHNvIGNoZWNrIGlmIGEgYnViYmxlIGNoYXJ0IGFuZCBmb3JtYXQgZGF0YSBvYmplY3QgYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRUeXBlID09PSAnYnViYmxlJyAmJiBmb3JtRGF0YVtpbmRleF0ubmFtZSA9PT0gJ2RhdGEnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbZm9ybURhdGFbaW5kZXhdLm5hbWVdID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YVtpbmRleF0udmFsdWUuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGRhdGFzZXRfaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZURhdGFJdGVtQXJyYXkgPSBoZWxwZXIuc3RyVG9OdW1iZXJBcnJheSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGVEYXRhU2V0ID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGVEYXRhU2V0LnggPSBidWJibGVEYXRhSXRlbUFycmF5WzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlRGF0YVNldC55ID0gYnViYmxlRGF0YUl0ZW1BcnJheVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZURhdGFTZXQuciA9IGJ1YmJsZURhdGFJdGVtQXJyYXlbMl07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtmb3JtRGF0YVtpbmRleF0ubmFtZV0ucHVzaChidWJibGVEYXRhU2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydERhdGEuZGF0YXNldHNbMF0gPSBPYmplY3QuYXNzaWduKGNoYXJ0RGF0YS5kYXRhc2V0c1swXSB8fCB7fSwgZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGFbaW5kZXhdLnZhbHVlLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBkYXRhc2V0X2luZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtmb3JtRGF0YVtpbmRleF0ubmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5kYXRhc2V0c1tkYXRhc2V0X2luZGV4XSA9IE9iamVjdC5hc3NpZ24oY2hhcnREYXRhLmRhdGFzZXRzW2RhdGFzZXRfaW5kZXhdIHx8IHt9LCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybURhdGFbaW5kZXhdLm5hbWUuaW5jbHVkZXMoJ0F4aXMnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYW4gQXhpcyBsYWJlbCBvciBmb250IHNpemUgZm9ybSB2YWx1ZSB3ZSBuZWVkIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIHB1dCBpbiB0aGUgY2hhcnRPcHRpb25zIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybURhdGFbaW5kZXhdLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAneEF4aXNMYWJlbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeEF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogZm9ybURhdGFbaW5kZXhdLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBmb3JtRGF0YVtpbmRleCArIDFdLnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAneUF4aXNMYWJlbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogZm9ybURhdGFbaW5kZXhdLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBmb3JtRGF0YVtpbmRleCArIDFdLnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGFydEF4aXNUaXRsZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZU9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICd0b3AnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBmb3JtRGF0YVtpbmRleF0udmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBmb3JtRGF0YVtpbmRleCArIDFdLnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd4QXhpc0ZvbnQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3lBeGlzRm9udCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGl0bGVGb250JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHsgLy8gUHV0IGZvcm0gdmFsdWUgKC5lZywgXCJsYWJlbHNcIiBmb3JtIGlucHV0IHZhbHVlKSBhcyBhIHByb3BlcnR5IGludG8gdGhlIGNoYXJ0RGF0YSBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbZm9ybURhdGFbaW5kZXhdLm5hbWVdID0gZm9ybURhdGFbaW5kZXhdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIERvbnQgcHV0IGluIHRoZSBjaGFydERhdGEuZGF0YXNldHMgb2JqZWN0IGlmIGlzIHRoZSBsYWJlbHMgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybURhdGFbaW5kZXhdLm5hbWUgPT09ICdsYWJlbHMnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YSA9IE9iamVjdC5hc3NpZ24oY2hhcnREYXRhIHx8IHt9LCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1EYXRhW2luZGV4XS5uYW1lID09PSAnb3B0aW9ucycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG8gbm90aGluZy4gRm9ybSB2YWx1ZSBhbHJlYWR5IGluIE9wdGlvbnMgdmFyaWFibGVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hhcnRUeXBlID09PSBcImJ1YmJsZVwiKSB7ICAvLyBPbmx5IG9uZSBkYXRhc2V0IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnREYXRhLmRhdGFzZXRzWzBdID0gT2JqZWN0LmFzc2lnbihjaGFydERhdGEuZGF0YXNldHMgfHwge30sIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0RGF0YS5kYXRhc2V0c1swXSA9IE9iamVjdC5hc3NpZ24oY2hhcnREYXRhLmRhdGFzZXRzWzBdIHx8IHt9LCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pOyAvLyBlbmQgZm9yRWFjaFxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgLy8gIE5vdyB3ZSBoYXZlIHRvIGRvIHNvbWUgY29udmVydGluZyBpLmUuLCBjaGFydERhdGEubGFiZWxzIG11c3QgYmUgY29udmVydGVkIHRvIGFycmF5IFxyXG4gICAgICAgICAgICAvLyAgZnJvbSBzdHJpbmcgZXRjLi4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hhcnREYXRhLmxhYmVscykge1xyXG4gICAgICAgICAgICAgICAgY2hhcnREYXRhLmxhYmVscyA9IGhlbHBlci5zcGxpdFN0cmluZyhjaGFydERhdGEubGFiZWxzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBzZWUgaWYgdGhlcmUgYXJlIG11bHRpcGxlIGRhdGFzZXRzIGFuZCBpZiBzbywgbG9vcCB0aHJ1IHRoZSBkYXRhc2V0cyBcclxuICAgICAgICAgICAgLy8gc2VuZGluZyBhcHByb3ByaWF0ZSBvYmplY3QgdmFsdWVzIChlLmcuLCBkYXRhc2V0cy5kYXRhIGFuZCBkYXRhc2V0cy5ib3JkZXJXaWR0aCkgdG8gdGhlXHJcbiAgICAgICAgICAgIC8vIGhlbHBlci5zcGxpdFN0cmluZyBtZXRob2QuIFNvIHdlIGNhbGwgb3VyIGNvbnZlcnREYXRhQXJyYXlFbGVtZW50cyBcclxuICAgICAgICAgICAgaGVscGVyLmNvbnZlcnREYXRhQXJyYXlFbGVtZW50cyhjaGFydERhdGEuZGF0YXNldHMsIGNoYXJ0VHlwZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gTm93IHJlYWR5IHRvIGRyYXcgdGhlIGNhbnZhcyB3aXRoIHRoZSBjaGFydCBkYXRhXHJcbiAgICAgICAgICAgIC8vIGZyb20gdGhlIGZvcm0uXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShjaGFydERhdGEuZGF0YXNldHNbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgRXJyb3IuIFJlY2hlY2sgeW91ciBmb3JtIGRhdGEuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlDaGFydFwiKS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgLy8gRG8gc29tZSBjb252ZXJ0aW5nIGZyb20gYSBzdHJpbmcgdG8gYSBKU09OIHRvIEpTIG9iamVjdCBzbyB3ZSBjYW4gYXNzaWduIHRvIFxyXG4gICAgICAgICAgICAgICAgLy8gbXlDaGFydC5vcHRpb25zIGxhdGVyLi5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnNGb3JtVmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJ0X29wdGlvbnNcIikudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBsZXQganNvbiA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIG9wdGlvbnMgd2VyZSBpbnB1dCBhbmQgaWYgc28gZmlyc3QgY29uc3RydWN0XHJcbiAgICAgICAgICAgICAgICAvLyBtb3JlT3B0aW9ucyBPYmplY3QgZnJvbSBmcmVlIGZvcm0gZmllbGQsIHRoZW4geCZ5T3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gb2JqZWN0cyBmcm9tIGZvcm0gYW5kIG1lcmdlIHRoZW0gaW50byBjaGFydE9wdGlvbnMuc2NhbGVzXHJcbiAgICAgICAgICAgICAgICAvLyB2aWEgT2JqZWN0LmFzc2lnbiBtZXRob2RcclxuICAgICAgICAgICAgICAgIGlmICgob3B0aW9uc0Zvcm1WYWx1ZSAhPT0gJycpIHx8ICgkKCcjeF9heGlzX2xhYmVsJykudmFsKCkpIHx8ICh0aXRsZU9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNGb3JtVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbiA9IEpTT04uc3RyaW5naWZ5KGV2YWwoXCIoXCIgKyBvcHRpb25zRm9ybVZhbHVlICsgXCIpXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9yZU9wdGlvbnMgPSBKU09OLnBhcnNlKGpzb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBjaGFydE9wdGlvbnMsIG1vcmVPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoeE9wdGlvbnMuc2NhbGVzKSB8fCAoeU9wdGlvbnMuc2NhbGVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEdWUgdG8gb2JqZWN0IGRlZmF1bHRpbmcgdG8gc2hhbGxvdyBjb3B5IHcvT2JqZWN0LmFzc2lnbiB3ZSBtdXN0IGRvIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbiBvYmplY3QgbWVyZ2Ugdy9qUXVlcnkgJC5leHRlbmQgbWV0aG9kIHcvdHJ1ZSBvcHRpb24gZm9yIGRlZXAgY29weVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBjaGFydE9wdGlvbnMsIHhPcHRpb25zLCB5T3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShqUXVlcnkuaXNFbXB0eU9iamVjdCh0aXRsZU9wdGlvbnMpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRPcHRpb25zIHx8IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGVPcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1vZHVsZSBjYWxsIHRvIGhhbmRsZSB6ZXJvaW5nIG91dCBcclxuICAgICAgICAgICAgICAgIC8vIHRoZSB5LWF4aXMgb24gYSBjaGFydC4gQ2FudCBjYWxsIGlmIHBpZSBjaGFydC4gV2lsbCBjYXVzZSBcclxuICAgICAgICAgICAgICAgIC8vIHRocm93IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICBpZiAoKGNoYXJ0VHlwZSAhPT0gJ3BpZScpICYmIChjaGFydFR5cGUgIT09ICdkb3VnaG51dCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeUF4aXNaZXJvKGNoYXJ0T3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIGEgY2hhcnQgZXhpc3RzIHRvIGRlc3Ryb3lcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudGVyID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG15Q2hhcnQuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG15Q2hhcnQgPSBuZXcgQ2hhcnQoY3R4LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogY2hhcnRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGNoYXJ0RGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBjaGFydE9wdGlvbnNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcclxuXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IC8vID09PT09PT09PT09PSBlbmQgZWxzZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuICAgIH0pO1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vICAgIFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PSBFbmQgLm9uIFwiY2xpY2tcIiBNYWluIEV2ZW50IEhhbmRsZXIgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xyXG5cclxuICAgIC8vIFNvbWUgbWlzY2VsbGVuZW91cyBldmVudCBoYW5kbGVycyBmb3IgdGhlIGFwcC5cclxuICAgIGV2ZW50SGFuZGxlcnMoKTtcclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxufSk7IC8vIEVuZCAuZG9jdW1lbnQucmVhZHkoKSJdfQ==
