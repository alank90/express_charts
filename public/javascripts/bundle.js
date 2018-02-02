(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
// /public/main.js
let helper = require('./library/helpers');

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
            // helper.splitString method.
            chartData.datasets = convertDataArrayElements(chartData.datasets);


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

                // ===================================================================================
                // ================== Handler for Y-Axis Zero  checkbox ==============================
                // ===================================================================================
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



                // Check to see if a chart exists to destroy
                if (counter > 1) {
                    myChart.destroy();
                }

                myChart = new Chart(ctx, {
                    type: chartType,
                    data: chartData,
                    options: chartOptions
                });

                // console.log(myChart.options);

                counter += 1;

            } catch (error) {
                alert(error);
            }
        } // ============ end else ================================= //
    });
    // ================================================================================================ //    
    // ================ End .on "click" Main Event Handler ============================================ //
    // ================================================================================================ //


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


    // ----------------------------------------------------------------------------------------------------------- //

    // =============================================================================================== //
    // ============= Function definitions below here ================================================= //
    // =============================================================================================== //
    // Function iterates thru an array(datasets) and performs appropriate
    // actions on array object elements (e.g., borderColor: red, blue being
    // split into an array)
    convertDataArrayElements = function (dataArray) {
        if (dataArray.length > 1) { // we have multiple datasets
            dataArray.forEach(function (value, dataset_index) {
                // Convert chartData.datasets[].data object to an array of numbers 
                if (dataArray[dataset_index].data) {
                    dataArray[dataset_index].data = helper.strToNumberArray(dataArray[dataset_index].data);
                }
                // convert string to number
                if (dataArray[dataset_index].borderWidth) {
                    dataArray[dataset_index].borderWidth = helper.strToNumber(dataArray[dataset_index].borderWidth);
                }
                // Check for comma separated value
                if (dataArray[dataset_index].backgroundColor) {
                    if (/,+/.test(dataArray[dataset_index].backgroundColor)) {
                        dataArray[dataset_index].backgroundColor = helper.splitString(dataArray[dataset_index].backgroundColor);
                    }
                }

            });

        } else {   // there is only one dataset
            var dataset_index = 0;

            // Convert chartData.datasets[].data object to an array of numbers 
            if (dataArray[dataset_index].data && chartType !== 'bubble') {
                dataArray[dataset_index].data = helper.strToNumber(dataArray[dataset_index].data);
            }

            if (dataArray[dataset_index].borderWidth) {
                dataArray[dataset_index].borderWidth = helper.strToNumber(dataArray[dataset_index].borderWidth);
            }

            if (dataArray[dataset_index].backgroundColor) {
                if (/,+/.test(dataArray[dataset_index].backgroundColor)) {
                    dataArray[dataset_index].backgroundColor = helper.splitString(dataArray[dataset_index].backgroundColor);
                }
            }
        }
        return dataArray;
    };


    // ============================================================================================ //
    // ================== End Function Definitions ================================================ //
    // ============================================================================================ //



}); // End .document.ready()
},{"./library/helpers":1}]},{},[2]);
