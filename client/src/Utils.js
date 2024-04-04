const { Axios } = require("axios");

//"Environment" variables
//const REACT_APP_BACKEND_URL = "/"; //REMOTE
let REACT_APP_BACKEND_URL;

function getBackendURL()
{
    return "/";
    if (window.location.hostname == "localhost") return "localhost:5000";
    else return "/";
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

//Returns undefined if string is empty
function parseStringUndefined(value)
{
    if (!value || value == "") return undefined;
    else return value;
}

module.exports = {formatCurrency, metersToMiles, parseFloatZero, parseIntZero, parseStringUndefined, getBackendURL, REACT_APP_BACKEND_URL, maxDescriptionLength, maxBioLength, maxEventNameLength, statesList};