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

    // Some miscelleneous event handlers for the app.
    eventHandlers();

    // ----------------------------------------------------------------------------------------------------------- //

}); // End .document.ready()