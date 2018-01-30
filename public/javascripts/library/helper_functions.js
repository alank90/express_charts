// ----------------------------------------------------------------------------------------------------------- //

    // =============================================================================================== //
    // ============= Function definitions below here ================================================= //
    // =============================================================================================== //
   let helper_functions =  function splitString(strToSplit, separator = ",") {
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
    function strToNumberArray(str, separator = ',') {
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
    }

    // ============================================================================= //
    // ========== Function convert string to integer or integer array ============== //
    // ============================================================================= //
    function strToNumber(str) {
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
    }

    // Function remove all whitespace from string
    function removeWhiteSpace(str) {
        str.replace(/\s+/g, '');
        return str;
    }


    // Function iterates thru an array(datasets) and performs appropriate
    // actions on array object elements (e.g., borderColor: red, blue being
    // split into an array)
    function convertDataArrayElements(dataArray) {
        if (dataArray.length > 1) { // we have multiple datasets
            dataArray.forEach(function (value, dataset_index) {
                // Convert chartData.datasets[].data object to an array of numbers 
                if (dataArray[dataset_index].data) {
                    dataArray[dataset_index].data = strToNumberArray(dataArray[dataset_index].data);
                }
                // convert string to number
                if (dataArray[dataset_index].borderWidth) {
                    dataArray[dataset_index].borderWidth = strToNumber(dataArray[dataset_index].borderWidth);
                }
                // Check for comma separated value
                if (dataArray[dataset_index].backgroundColor) {
                    if (/,+/.test(dataArray[dataset_index].backgroundColor)) {
                        dataArray[dataset_index].backgroundColor = splitString(dataArray[dataset_index].backgroundColor);
                    }
                }

            });

        } else {   // there is only one dataset
            var dataset_index = 0;

            // Convert chartData.datasets[].data object to an array of numbers 
            if (dataArray[dataset_index].data && chartType !== 'bubble') {
                dataArray[dataset_index].data = strToNumber(dataArray[dataset_index].data);
            }

            if (dataArray[dataset_index].borderWidth) {
                dataArray[dataset_index].borderWidth = strToNumber(dataArray[dataset_index].borderWidth);
            }

            if (dataArray[dataset_index].backgroundColor) {
                if (/,+/.test(dataArray[dataset_index].backgroundColor)) {
                    dataArray[dataset_index].backgroundColor = splitString(dataArray[dataset_index].backgroundColor);
                }
            }
        }
        return dataArray;
    }
    // ============================================================================================ //
    // ================== End Function Definitions ================================================ //
    // ============================================================================================ //

module.exports = helper_functions;