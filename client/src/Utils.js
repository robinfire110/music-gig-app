const { Axios } = require("axios");

function getBackendURL()
{
    if (process.env.NODE_ENV== "development") return "http://localhost:5000";
    else return "https://harmonize.rocks/api";
}

//Constant Variables
const maxDescriptionLength = 750; //Max length for event descriptions
const maxBioLength = 500; //Max length for user bios
const maxEventNameLength = 50;
const statesList = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];

//Format number to currency
function formatCurrency(value) 
{
    if (value && value !== "") return Intl.NumberFormat('en-US', {style: 'currency', currency: "USD"}).format(value);
    return "$0.00";
}

//Convert meters to miles
function metersToMiles(meters) {
    return meters*0.000621371192;
}

//Parse values (returns 0 instead of undefined/NaN for undefined values)
function parseFloatZero(value)
{
    if (value && value != NaN) return parseFloat(value);
    else return 0
}

function parseIntZero(value)
{
    if (value) return parseInt(value);
    else return 0
}

//Auto fit column width (for spreadsheet)
function autoSizeColumn(worksheet)
{
    worksheet.columns.forEach(function (column, i) {
        let maxLength = 0;
        column["eachCell"]({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength ) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength;
    });
}

//Returns undefined if string is empty
function parseStringUndefined(value)
{
    if (!value || value == "") return undefined;
    else return value;
}

module.exports = {formatCurrency, metersToMiles, parseFloatZero, parseIntZero, parseStringUndefined, getBackendURL, maxDescriptionLength, maxBioLength, maxEventNameLength, statesList};