const axios = require('axios');
const { toast } = require("react-toastify");
const ExcelJS = require('exceljs');
const {saveAs} = require('file-saver')

function getBackendURL()
{
    if (process.env.NODE_ENV== "development") return "http://localhost:5000";
    else return "https://harmonize.rocks/api";
}

//Constant Variables
const maxDescriptionLength = 750; //Max length for event descriptions
const maxFNameLength = 50;
const maxLNameLength = 50;
const maxBioLength = 500; //Max length for user bios
const maxEventNameLength = 50;
const maxFinancialNameLength = 50;
const statesList = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];

//Default toast settings
const toastTheme = 'dark';
const toastPosition = 'top-center';
const toastTimeout = 1500;
const toastSuccess = { theme: toastTheme, position: toastPosition, type: "success", autoClose: toastTimeout};
const toastError = { theme: toastTheme, position: toastPosition, type: "error", autoClose: toastTimeout};
const toastInfo = { theme: toastTheme, position: toastPosition, type: "info", autoClose: toastTimeout};

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

//Get event owner
//Data can either be straight event data or event.Users
function getEventOwner(data)
{
    if (data)
    {
        const userData = data?.Users ? data.Users : data;
        for (let i = 0; i < userData.length; i++)
        {
            if (userData[i].UserStatus.status === "owner") return userData[i];
        }
    }   
    return null;
}

//Send email
async function sendEmail(to, subject, text=null, html=null)
{
    const data = {};
    data['to'] = to;
    data['subject'] = subject;
    if (text) data['text'] = text;
    if (html) data['html'] = html;
    console.log(`${getBackendURL()}/api/email`);
    await axios.post(`${getBackendURL()}/api/email`, data);
}



//Save all financials for user
async function saveSpreadsheetAll(data, filename = 'Harmonize_Export')
{
    //Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

    //Create worksheet
    const worksheet = workbook.addWorksheet("Calculator Results", {
        views: [{ state: "frozen", ySplit: 1 }]
    });

    //Fomatting
    const moneyColumns = ["C", "J", "L", "O", "P", "Q", "S"];
    moneyColumns.forEach(column => {
        worksheet.getColumn(column).numFmt = '$#,##0.00';
    });
    worksheet.getColumn("N").numFmt = '0.00##\\%'; //Format percen
    worksheet.getColumn("S").font = {bold: true};

    //Set header
    const headerRow = ["Name", "Date", "Total Wage", "# of Gigs", "Event Hours", "Practice Hours", "Rehearsal Hours", "Total Mileage", "Travel Hours", "Gas $/Gallon", "Vehicle MPG", "Gas $/Mile", "Mileage Covered", "Tax %", "Other Fees", "Tax Cut", "Travel Cost", "Total Hours", "Hourly Wage"]
    worksheet.addRow(headerRow).commit();
    worksheet.getRow(1).font = {bold: true};
    worksheet.getRow(1).numFmt = "";
    worksheet.getCell(`P1`).border = {left: {style: "thin"}};

    //Size columns
    autoSizeColumn(worksheet);
    worksheet.getColumn("A").width = 20; //Name width
    worksheet.getColumn("B").width = 11; //Date width
    worksheet.getColumn("N").width = 8; //Tax width

    //Set data
    let rowCount = 1;
    data.forEach(fin => {
        rowCount++;
        var row = worksheet.addRow([fin.fin_name, fin.date, parseFloatZero(fin.total_wage), parseIntZero(fin.even_num) === 0 ? 1 : parseIntZero(fin.even_num), parseFloatZero(fin.event_hours), parseFloatZero(fin.practice_hours), parseFloatZero(fin.rehearse_hours), parseFloatZero(fin.total_mileage), parseFloatZero(fin.travel_hours), parseFloatZero(fin.gas_price), parseFloatZero(fin.mpg), parseFloatZero(fin.gas_price/fin.mpg), parseFloatZero(fin.mileage_pay), parseFloatZero(fin.tax), parseFloatZero(fin.fees), fin.total_wage*(.01*parseFloatZero(fin.tax)), parseFloatZero(fin.gas_price/fin.mpg)*parseFloatZero(fin.total_mileage), 0, parseFloatZero(fin.hourly_wage)]);

        //Set Formulas
        worksheet.getCell(`L${rowCount}`).value = {formula: `IFERROR(J${rowCount}/K${rowCount}, 0)`}; //Gas Price Per Mile
        worksheet.getCell(`P${rowCount}`).value = {formula: `(C${rowCount}*D${rowCount})*(0.01*N${rowCount})`}; //Tax Cut
        worksheet.getCell(`Q${rowCount}`).value = {formula: `H${rowCount}*(L${rowCount}-M${rowCount})`}; //Travel Costs
        worksheet.getCell(`R${rowCount}`).value = {formula: `((E${rowCount}*D${rowCount})+F${rowCount}+G${rowCount}+I${rowCount})`}; //Total Hours
        worksheet.getCell(`S${rowCount}`).value = {formula: `IFERROR(((C${rowCount}*D${rowCount})-O${rowCount}-P${rowCount}-Q${rowCount})/R${rowCount}, 0)`}; //Total Hourly Wage

        //Border
        worksheet.getCell(`P${rowCount}`).border = {left: {style: "thin"}};
        row.commit();
    });

    //Final sum
    worksheet.getCell(`O${rowCount+2}`).value = "Total";
    worksheet.getCell(`O${rowCount+2}`).border = {top: {style: "medium"}};
    const sumRows = ["P", "Q", "R", "S"];
    sumRows.forEach(row => {
        var cell = worksheet.getCell(`${row}${rowCount+2}`);
        cell.value = {formula: `SUM(${row}2:${row}${rowCount})`};
        cell.border = {top: {style: "medium"}};
    });
    worksheet.getRow(rowCount+2).font = {bold: true};

    //Save
    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `${filename}.xlsx`);
}

module.exports = {formatCurrency, metersToMiles, parseFloatZero, parseIntZero, parseStringUndefined, getBackendURL, getEventOwner, autoSizeColumn, sendEmail, maxDescriptionLength, maxFNameLength, maxLNameLength, maxBioLength, maxEventNameLength, maxFinancialNameLength, statesList, toastSuccess, toastError, toastInfo, saveSpreadsheetAll};