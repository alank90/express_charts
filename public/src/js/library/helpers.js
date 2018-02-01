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

