import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import { Container, Form, Col, Row, InputGroup, Button, Modal, Alert, OverlayTrigger } from "react-bootstrap";
import moment from "moment";
import TooltipButton from "../components/TooltipButton";
import FormNumber from "../components/FormNumber";
import axios from "axios";
import {BarLoader, ClipLoader} from 'react-spinners'
import * as ExcelJS from "exceljs"
import {saveAs} from "file-saver"
import {formatCurrency, getCurrentUser, metersToMiles, parseFloatZero, parseIntZero} from "../Utils";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const Calculator = () => {
    /* Variables */
    //Account
    const [cookies, , removeCookie] = useCookies([]);
    const [user, setUser] = useState(false);

    //Params
    const navigate = useNavigate();
    const [paramId, setParamId] = useState(useParams().id);
    const [finId, setFinId] = useState();
    const [eventId, setEventId] = useState();
    const [eventData, setEventData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [currentState, setCurrentState] = useState("average_gas");
    const [currentVehicle, setCurrentVehicle] = useState("average_mpg");
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [gasModalOpen, setGasModalOpen] = useState(false);

    //Search parameters
    const [searchParams] = useSearchParams();
    const [isEvent, setIsEvent] = useState(searchParams.get("event") === "true");
    const [isNewEvent, setIsNewEvent] = useState(false);

    //States
    //Variables
    const [calcName, setCalcName] = useState();
    const [calcDate, setCalcDate] = useState(moment().format("YYYY-MM-DD"));
    const [gigPay, setGigPay] = useState();
    const [gigHours, setGigHours] = useState();
    const [gigNum, setGigNum] = useState();
    const [totalMileage, setTotalMileage] = useState();
    const [mileageCovered, setMileageCovered] = useState();
    const [travelHours, setTravelHours] = useState();
    const [gasPricePerMile, setGasPricePerMile] = useState();
    const [gasPricePerGallon, setGasPricePerGallon] = useState();
    const [vehicleMPG, setVehicleMPG] = useState();
    const [practiceHours, setPracticeHours] = useState();
    const [rehearsalHours, setRehearsalHours] = useState();
    const [tax, setTax] = useState();
    const [otherFees, setOtherFees] = useState();
    const [totalGas, setTotalGas] = useState(0.0); 
    const [totalTax, setTotalTax] = useState(0.0); 
    const [totalHours, setTotalHours] = useState(0.0);
    const [totalPay, setTotalPay] = useState(0);
    const [hourlyWage, setHourlyWage] = useState(0.0);
    const [gasPrices, setGasPrices] = useState();
    const [zip, setZip] = useState("");
    const [zipCodeError, setZipCodeError] = useState(false);
    const [modalOriginZip, setModalOriginZip] = useState("");
    const [modalDestinationZip, setModalDestinationZip] = useState("");
    const [saveStatus, setSaveStatus] = useState(false);

    //Enable
    const [gigNumEnabled, setGigNumEnabled] = useState(false);
    const [totalMileageEnabled, setTotalMileageEnabled] = useState(false);
    const [travelHoursEnabled, setTravelHoursEnabled] = useState(false);
    const [mileageCoveredEnabled, setMileageCoveredEnabled] = useState(false);
    const [practiceHoursEnabled, setPracticeHoursEnabled] = useState(false);
    const [rehearsalHoursEnabled, setRehearsalHoursEnabled] = useState(false);
    const [taxEnabled, setTaxEnabled] = useState(false);
    const [otherFeesEnabled, setOtherFeesEnabled] = useState(false);

    /* Effect */
    //On first load
    useEffect(() => {
        //Check for event
        if (isEvent) setEventId(paramId);
        else setFinId(paramId);

        //Get Gas Prices
        if (!gasPrices)
        {
            axios.get(`http://localhost:5000/gas`).then(res => {
                let map = {};
                for (let i = 0; i < res.data.length; i++)
                {
                    map[res.data[i].location] = res.data[i].average_price;
                }   
                setGasPrices(map);
                setAverageGasPrice(map);
            });
        }

        //Get user
        axios.get('http://localhost:5000/account', {withCredentials: true}).then(res => {
            if (res.data?.user)
            {
                const userData = res.data.user;
                setModalOriginZip(userData.zip);
                setUser(userData);

                //Load data
                console.log(user);
                if (paramId)
                {
                    loadFromDatabase(userData).then(() => {
                        setIsLoading(false);
                    });
                } 
                else setIsLoading(false);
            }
            else 
            {
                setUser(undefined);
                if (paramId)
                {
                    loadFromDatabase().then(() => {
                        setIsLoading(false);
                    });
                } 
                else setIsLoading(false);
            }
            console.log("User Data", res.data);
        });
    }, []);
    
    //Runs when any fields related to calculation updates.
    useEffect(() => {
      calculateHourlyWage();
    }, [gigPay, gigHours, gigNum, totalMileage, mileageCovered, gasPricePerMile, travelHours, practiceHours, rehearsalHours, tax, otherFees,
        gigNumEnabled, totalMileageEnabled, mileageCoveredEnabled, travelHoursEnabled, practiceHoursEnabled, rehearsalHoursEnabled, taxEnabled, otherFeesEnabled])

    //Runs when any fields related to gas price calcuation updates.
    useEffect(() => {
      calculateGasPerMile();
    }, [gasPricePerGallon, vehicleMPG])
    
    /* Functions */
    //Load data
    function loadData(data)
    {
        if (data?.fin_name) setCalcName(data.fin_name);
        if (data?.date) setCalcDate(data.date)
        if (data?.zip) setZip(data.zip);
        if (data?.hourly_wage) setHourlyWage(data.hourly_wage);
        if (data?.total_wage > 0) setGigPay(data.total_wage);
        if (data?.event_hours > 0) setGigHours(data.event_hours);
        if (data?.gig_num > 0) setGigNum(data.gig_num); 
        if (data?.total_mileage > 0) setTotalMileage(data.total_mileage); 
        if (data?.travel_hours > 0) setTravelHours(data.travel_hours); 
        if (data?.mileage_pay > 0) setMileageCovered(data.mileage_pay); 
        if (data?.gas_price > 0) setGasPricePerGallon(data.gas_price);
        if (data?.mpg > 0) setVehicleMPG(data.mpg);
        if (data?.practice_hours > 0) setPracticeHours(data.practice_hours); 
        if (data?.rehearse_hours > 0) setRehearsalHours(data.rehearse_hours); 
        if (data?.tax > 0) setTax(data.tax); 
        if (data?.fees > 0) setOtherFees(data.fees);

        //Set switches
        setGigNumEnabled(data?.gig_num > 0);
        setTotalMileageEnabled(data?.total_mileage > 0);
        setTravelHoursEnabled(data?.travel_hours > 0);
        setMileageCoveredEnabled(data?.mileage_pay > 0);
        setPracticeHoursEnabled(data?.practice_hours > 0);
        setRehearsalHoursEnabled(data?.rehearse_hours > 0);
        setTaxEnabled(data?.tax > 0);
        setOtherFeesEnabled(data?.fees > 0);
    }

    //Load from database (both fin_id and event_id)
    async function loadFromDatabase(currentUser=user)
    {
        //Check if event
        if (!isEvent)
        {
            //Get data
            await axios.get(`http://localhost:5000/financial/user_id/fin_id/${currentUser?.user_id}/${paramId}`).then(res => {
                const data = res.data[0];
                if (data && data?.fin_id) setFinId(data.fin_id);

                //Financial exists!
                if (data) loadData(data);
                else //Financial does not exists, redirect to blank page.
                {
                    setParamId(0);
                    navigate(`/calculator`); 
                    toast("You do not have access to this data.", { theme: 'dark', position: "top-center", type: "error" })
                }
            });
        }
        else
        {
            //Check for already existing event financial
            await axios.get(`http://localhost:5000/financial/user_id/event_id/${currentUser?.user_id}/${paramId}`).then(async res => {
                const data = res.data[0];
                if (data) //If financial for event exists, load that data.
                {
                    console.log("Event Financial exists, loading...");
                    await loadEventData(false, currentUser); //Get event data for later use
                    setFinId(data.fin_id);
                    loadData(data);
                    toast("Loaded from previously saved data.", { theme: 'dark', position: "top-center", type: "info" });
                } 
                else
                {
                    await loadEventData(true, currentUser);
                    setIsNewEvent(true);
                } 
            });
        }
    }

    //Load event data
    async function loadEventData(fillFields, currentUser=user)
    {
        console.log("Event Data", eventData);
        if (eventData)
        {
            if (fillFields)
            {
                loadData(eventData);
                if (currentUser?.zip && eventData.zip) await calculateBasedOnLocation(currentUser?.zip.slice(0, 5), eventData.zip.slice(0, 5));
            }
        } 
        else
        {
            await axios.get(`http://localhost:5000/event/id/${paramId}`).then(async res => {
            if (res.data)
            {
                const data = res.data;
                let eventData = {
                    event_id: data?.event_id,
                    fin_name: data?.event_name,
                    total_wage: data?.pay,
                    event_hours: data?.event_hours,
                    rehearse_hours: data?.rehearse_hours,
                    mileage_pay: data?.mileage_pay,
                    zip: data?.Address.zip
                };

                setEventData(eventData);
                setModalDestinationZip(eventData?.zip);
                if (fillFields)
                {   
                    if (currentUser?.zip && eventData?.zip) await calculateBasedOnLocation(currentUser?.zip?.slice(0, 5), eventData.zip?.slice(0, 5));
                    loadData(eventData);
                    setAverageGasPrice();
                } 
            }
            else
            {
                console.log("NO EVENT FOUND")
            }
            }).catch(error => {
                console.log(error)
            });
        }
        
    }

    async function calculateBasedOnLocation(originZip, destinationZip)
    {
        setIsGettingLocation(true);
        axios.get(`http://localhost:5000/api/distance_matrix/${originZip}/${destinationZip}/`).then(res => {
            console.log("Event Location Data", res.data);
            if (res.data)
            {
                if (res.data.status == "OK" && res.data.rows[0].elements[0].status == "OK")
                {
                    const distance = res.data.rows[0].elements[0].distance.value;
                    const duration = res.data.rows[0].elements[0].duration.value;
                    const distanceInMiles = metersToMiles(distance).toFixed(2);
                    const durationInHours = ((duration/60)/60).toFixed(2);
                    setTotalMileageEnabled(true);
                    setTravelHoursEnabled(true);
                    setTotalMileage(distanceInMiles);
                    setTravelHours(durationInHours);
                    setLocationModalOpen(false);
                    setIsGettingLocation(false);

                    //Set state
                    //This works, but I'm debating if we want it or not. It may be a bit disorienting. I tried to add a setting, but I couldn't find a good place to put it.
                    /*
                    let string = res.data.origin_addresses[0]
                    setCurrentState(string.substring(string.indexOf(",")+2, string.indexOf(",")+4))
                    */

                    //Add to event (if event)
                    if (eventData && eventData.zip == destinationZip && originZip == user?.zip)
                    {
                        const newData = eventData;
                        newData["total_mileage"] = distanceInMiles;
                        newData["travel_hours"] = durationInHours;
                        setEventData(newData);
                    }
                }
                else
                {
                    //Signal Modal If Something Wrong
                    setZipCodeError(true);
                    setIsGettingLocation(false);
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    //Get Zip Codes from Modal
    async function getZipCodes()
    {
        //Get elements
        const elementOriginZip = document.getElementById("modalOriginZip");
        const elementDestinationZip = document.getElementById("modalDestinationZip");
        if (!isGettingLocation)
        {
            if (modalOriginZip.length == 5 && modalDestinationZip.length == 5)
            {
                calculateBasedOnLocation(modalOriginZip, modalDestinationZip);
            }
            else
            {
                if (modalOriginZip.length != 5) elementOriginZip.setCustomValidity("Zip codes must be 5 characters (#####).");
                else if (modalDestinationZip.length != 5) elementDestinationZip.setCustomValidity("Zip codes must be 5 characters (#####).");
            }
        }
    }

    //Calculate wage
    function calculateHourlyWage() 
    {
        let wage = 0;
        let finalPay = 0;

        //Calculate possible income
        if (gigPay) wage = parseFloat(gigPay);
        if (gigNumEnabled && gigNum) wage *= parseInt(gigNum);

        //Calculate mileage pay
        if (totalMileageEnabled && totalMileage && gasPricePerMile)
        {
            let gasPrice = parseFloat(gasPricePerMile);
            //Subtract mileage covered
            if (mileageCoveredEnabled && mileageCovered) gasPrice -= parseFloat(mileageCovered);
            gasPrice = parseFloat(totalMileage) * gasPrice;
            setTotalGas(gasPrice);
            wage -= gasPrice;
        }

        //Calculate tax (if needed)
        if (taxEnabled)
        {  
            let currentTax = 0;
            if (tax) currentTax = parseFloat(gigPay) * (parseFloat(tax)/100);
            setTotalTax(currentTax);
            wage -= currentTax;
        } 

        //Other fees (if needed)
        if (otherFeesEnabled && otherFees) wage -= parseFloat(otherFees);

        //Calculate hours
        let hours = 0;
        if (gigHours) hours = parseFloat(gigHours);
        if (gigNumEnabled && gigNum) hours *= parseFloat(gigNum);
        if (practiceHoursEnabled && practiceHours) hours += parseFloat(practiceHours);
        if (rehearsalHoursEnabled && rehearsalHours) hours += parseFloat(rehearsalHours);
        if (travelHoursEnabled && travelHours) hours += parseFloat(travelHours);
        setTotalHours(hours.toFixed(2));

        //Final division
        setTotalPay(wage);
        if (hours > 0) finalPay = wage/hours;
        
        //Convert
        setHourlyWage(finalPay);
    }

    //Calculate gas per mile
    function calculateGasPerMile() 
    {
        if (gasPricePerGallon && vehicleMPG)
        {
            //Set
            let value = (gasPricePerGallon/vehicleMPG);
            setGasPricePerMile(value);
        }
        else
        {
            setGasPricePerMile("");
        }
    }

    //Set average gas price
    function setAverageGasPrice(dataOverride=undefined, state=currentState, vehicle=currentVehicle)
    {
        let data = gasPrices;
        console.log(`State: ${state} | Vehicle: ${vehicle}`);
        if (dataOverride) data = dataOverride;

        //Set data
        if (data)
        {
            /* Check if login, use local state. Else, use default. */
            setGasPricePerGallon(Math.round(data[state] * 100) / 100);
            setVehicleMPG(data[vehicle]);
            setGasModalOpen(false);
        }
    }

    async function saveFinancial(spreadsheet)
    {
        if (!saveStatus)
        {
            //Get data
            const data = {
                fin_name: calcName,
                date: moment(calcDate).format("YYYY-MM-DD"),
                total_wage: gigPay,
                event_hours: gigHours,
                event_num: gigNum,
                hourly_wage: hourlyWage,
                rehearse_hours: rehearsalHours,
                practice_hours: practiceHours,
                travel_hours: travelHours,
                total_mileage: totalMileage,
                mileage_pay: mileageCovered,
                zip: zip,
                gas_price: gasPricePerGallon,
                mpg: vehicleMPG,
                tax: tax,
                fees: otherFees,
            }
            if (isNewEvent && isEvent) data["event_id"] = paramId;
            
            //Check validity (will return false if not valid, HTML will take care of the rest).
            const inputs = document.getElementById("calculatorForm").elements;
            for (let i = 0; i < inputs.length; i++) {
                if (!inputs[i].disabled && !inputs[i].checkValidity())
                {
                    console.log("NOT VALID");
                    return false
                } 
            }

            //Save (in correct place)
            if (!spreadsheet)
            {
                //Set save status
                setSaveStatus(true);

                //Save to database
                if ((!isEvent && paramId) || (isEvent && !isNewEvent)) //If exists, update
                {
                    console.log(`UPDATE ${finId} ${paramId}`)
                    await axios.put(`http://localhost:5000/financial/${finId}`, data).then(res => {
                        toast("Calculator data updated sucessfuly", { theme: 'dark', position: "top-center", type: "success" });
                        setSaveStatus(false);
                    }).catch(error => {
                        toast("An error occured while updating. Please ensure all fields are filled out correctly and try again.", { theme: 'dark', position: "top-center", type: "error" });
                        setSaveStatus(false);
                        console.log(error);
                    });
                }
                else //If new, post.
                {
                    console.log("ADD");
                    await axios.post(`http://localhost:5000/financial/${user?.user_id}`, data).then(res => {
                        //SetID
                        setParamId(res.data.fin_id);
                        setFinId(res.data.fin_id);
                        setIsNewEvent(false);

                        //Update URL
                        if (!isEvent) navigate(`/calculator/${res.data.fin_id}`);
                        toast("Calculator data saved sucessfuly", { theme: 'dark', position: "top-center", type: "success" });
                        setSaveStatus(false);
                    }).catch(error => {
                        toast("An error occured while saving. Please ensure all fields are filled out correctly and try again.", { theme: 'dark', position: "top-center", type: "error" });
                        setSaveStatus(false);
                        console.log(error);
                    });
                };
            }
            else
            {
                saveSpreadsheet();
            }
        }
    }

    //Auto fit column width
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

    async function saveSpreadsheetAll()
    {
        await axios.get(`http://localhost:5000/financial/user_id/${user?.user_id}`).then(async res => {
            const data = res.data;
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
                var row = worksheet.addRow([fin.fin_name, fin.date, parseFloatZero(fin.total_wage), parseIntZero(gigNum) == 0 ? 1 : parseIntZero(gigNum), parseFloatZero(fin.event_hours), parseFloatZero(fin.practice_hours), parseFloatZero(fin.rehearse_hours), parseFloatZero(fin.total_mileage), parseFloatZero(fin.travel_hours), parseFloatZero(fin.gas_price), parseFloatZero(fin.mpg), parseFloatZero(fin.gas_price/fin.mpg), parseFloatZero(fin.mileage_pay), parseFloatZero(fin.tax), parseFloatZero(fin.fees), fin.total_wage*(.01*parseFloatZero(fin.tax)), parseFloatZero(fin.gas_price/fin.mpg)*parseFloatZero(fin.total_mileage), 0, parseFloatZero(fin.hourly_wage)]);
            
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
            saveAs(new Blob([buf]), `Harmonize_Export.xlsx`);

        }).catch(error => {
            console.log(error)
        })
    }

    async function saveSpreadsheet()
    {
        try 
        {
            //Create workbook
            const workbook = new ExcelJS.Workbook();
            workbook.created = new Date();
            workbook.modified = new Date();

            //Create worksheet
            const worksheet = workbook.addWorksheet("Calculator Results");

            //Set Rows
            const rows = [];
            rows.push(worksheet.addRow(["Name", "Date", "Total Wage", "Number of Gigs"]));
            rows.push(worksheet.addRow([calcName, calcDate, parseFloatZero(gigPay), parseIntZero(gigNum) == 0 ? 1 : parseIntZero(gigNum), "", "Payment", parseFloatZero(gigPay)]));
            rows[1].getCell(3).numFmt = '$#,##0.00'; //Format cell as currency
            rows.push(worksheet.addRow(["", "", "", "", "", "Tax Cut", parseFloatZero(totalTax)])); //Results row
            rows.push(worksheet.addRow(["Event Hours", "Individual Practice Hours", "Rehearsal Hours", "", "", "Travel Cost", parseFloatZero(totalGas)]));
            rows.push(worksheet.addRow([parseFloatZero(gigHours), parseFloatZero(practiceHours), parseFloatZero(rehearsalHours), "", "", "Other Fees", parseFloatZero(otherFees)]));
            rows.push(worksheet.addRow([""])); //Results row
            rows.push(worksheet.addRow(["Total Mileage", "Travel Hours", "Mileage Covered", "", "", "Total Hours", parseFloatZero(totalHours)]));
            rows.push(worksheet.addRow([parseFloatZero(totalMileage), parseFloatZero(travelHours), parseFloatZero(mileageCovered), "", "", "Total Hourly Wage", parseFloatZero(hourlyWage)]));
            rows[7].getCell(3).numFmt = '$#,##0.00'; //Format cell as currency
            rows.push(worksheet.addRow([""])); //Results row
            rows.push(worksheet.addRow(["Gas Price per Gallon", "Vehicle MPG", "Gas Price per Mile"]));
            rows.push(worksheet.addRow([parseFloatZero(gasPricePerGallon), parseFloatZero(vehicleMPG), parseFloatZero(gasPricePerMile)]));
            rows[10].getCell(1).numFmt = '$#,##0.00'; //Format cell as currency
            rows[10].getCell(3).numFmt = '$#,##0.00'; //Format cell as currency
            rows.push(worksheet.addRow([""])); //Results row
            rows.push(worksheet.addRow(["Tax Percentage (%)", "Other Fees"]));
            rows.push(worksheet.addRow([parseFloatZero(tax), parseFloatZero(otherFees)]));
            rows[13].getCell(1).numFmt = '0.00##\\%'; //Format cell as currency
            rows[13].getCell(2).numFmt = '$#,##0.00'; //Format cell as currency

            //Bold
            const boldRows = [1, 4, 7, 10, 13];
            boldRows.forEach(row => {
                rows[row-1].font = {bold: true};
            });
            worksheet.getColumn("F").font = {bold: true};
            worksheet.getColumn("G").font = {bold: false};

            //Merge Cells
            worksheet.mergeCells("F1:G1");
            worksheet.getCell('F1').value = 'Results';
            worksheet.getCell('F1').alignment = {horizontal: "center"};
            worksheet.getCell('F1').font = {bold: true};
            
            //Format
            worksheet.getColumn("G").numFmt = '$#,##0.00';
            worksheet.getCell('G7').numFmt = "0.00";

            //Borders
            worksheet.getCell("F5").border = {bottom: {style: "thin"}};
            worksheet.getCell("G5").border = {bottom: {style: "thin"}};
            worksheet.getCell("F7").border = {bottom: {style: "thin"}};
            worksheet.getCell("G7").border = {bottom: {style: "thin"}};

            //Set formulas
            worksheet.getCell("G2").value = {formula: 'C2*D2'}; //Payment
            worksheet.getCell("G3").value = {formula: '=G2*(0.01*A14)'}; //Tax Cut
            worksheet.getCell("G4").value = {formula: 'A8*(C11-C8)'}; //Travel Cost
            worksheet.getCell("G5").value = {formula: 'B14'}; //Other Fees 
            worksheet.getCell("G6").value = {formula: 'G2-G3-G4-G5'}; //Total Income
            worksheet.getCell("G7").value = {formula: '(A5*D2)+B5+C5+B8'}; //Total Hours
            worksheet.getCell("G8").value = {formula: 'IFERROR(G6/G7, 0)'}; //Total Hourly Wage
            worksheet.getCell("C11").value = {formula: 'IFERROR(A11/B11, 0)'}; //Gas Price per Mile

            //Fit Column Width
            autoSizeColumn(worksheet);

            const buf = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buf]), `${calcName.replace(/ /g,"_")}.xlsx`);
            toast("Calculator data exported", { theme: 'dark', position: "top-center", type: "success" });
        }
        catch(error)
        {
            console.log(error);
            toast("An error occured while exporting. Please ensure all fields are filled out correctly and try again.", { theme: 'dark', position: "top-center", type: "error" });
        }
        
    }

    if (isLoading)
    {
        return (
            <div>
                <ClipLoader />
            </div>
        )
    }
    else
    {
    return (
        <div>
            <h2>Calculator</h2>
            <hr />
            <Container className="" style={{textAlign: "left"}}>   
            <Form id="calculatorForm" onSubmit={e => e.preventDefault()}>
                <Row>
                    {/* Column 1: Calculator */}
                    <Col xl={8} lg={7}>
                        <h3>Basic Information</h3>
                        <hr />
                            <Form.Group>
                                    <Row className="mb-3" xs={1} lg={2}>
                                        <Col lg="8">
                                            <Form.Label>Name<span style={{color: "red"}}>*</span></Form.Label>
                                            <Form.Control id="financialName" value={calcName || ""} type="text" required={true} placeholder="Calculator Name" onChange={e => setCalcName(e.target.value)}></Form.Control>
                                        </Col>
                                        <Col lg="4">
                                            <Form.Label>Date<span style={{color: "red"}}>*</span></Form.Label>
                                            <Form.Control id="financialDate" value={calcDate || ""} type="date" required={true} onChange={e => setCalcDate(e.target.value)}></Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3" xs={1} lg={3}>
                                        <Col>
                                            <Form.Label>Pay per gig<span style={{color: "red"}}>*</span></Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                                                <FormNumber id="gigPay" value={gigPay} placeholder="Ex. 75.00" required={true} integer={false} onChange={e => setGigPay(e.target.value)}/>
                                                <TooltipButton text="Payment for gig in dollars."/>
                                            </InputGroup>
                                        </Col>
                                        <Col>
                                            <Form.Label>Hours per gig<span style={{color: "red"}}>*</span></Form.Label>
                                            <InputGroup>
                                                <FormNumber id="gigHours" value={gigHours} placeholder="Ex. 3" required={true} integer={false} onChange={e => setGigHours(e.target.value)}/>
                                                <TooltipButton text="Number of hours for event. Does not include rehearsal or practice hours."/>
                                            </InputGroup>
                                        </Col>
                                        <Col>
                                            <Form.Label>Number of gigs</Form.Label>
                                            <InputGroup>
                                                <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setGigNumEnabled(!gigNumEnabled)}} checked={gigNumEnabled}></Form.Check>
                                                <FormNumber id="gigNum" value={gigNum || ""} placeholder="Ex. 1" disabled={!gigNumEnabled} onChange={e => setGigNum(e.target.value)} />
                                                <TooltipButton text='Number of gigs. Used if you have multiple of the same gig at the same time (i.e. back-to-back performances). Will only add travel, additional hours and other expenses once.'/>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                            </Form.Group>
                            <hr />
                            <h3>Travel</h3>
                            <Form.Group>
                                <Row className="mb-3" xs={1} lg={2}>
                                    <Col>
                                        <Row className="mb-1">
                                            <Form.Label>Total Mileage</Form.Label>
                                            <InputGroup>
                                                <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setTotalMileageEnabled(!totalMileageEnabled);}} checked={totalMileageEnabled}></Form.Check>
                                                <FormNumber id="totalMileage" value={totalMileage} placeholder="Ex. 20" integer={false} disabled={!totalMileageEnabled} onChange={e => setTotalMileage(e.target.value)} />
                                                <Button variant='light' onClick={() => {setLocationModalOpen(!locationModalOpen)}}>Use Location</Button>
                                                <TooltipButton text='Total number of miles driven to get to event. Will multiply by "Gas Price per Mile" for final result. Click "Use Location" to calculate based off Zip Code.'/>
                                                <Modal show={locationModalOpen} onHide={() => {setLocationModalOpen(false); setZipCodeError(false)}} centered={true}>
                                                    <Form onSubmit={e => e.preventDefault()}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Calculate Mileage by Location</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                                {zipCodeError ? <Alert variant="danger" dismissible>An error occured, please ensure zip codes are correct</Alert> : ""}
                                                                <InputGroup>
                                                                    <InputGroup.Text>Origin Zip</InputGroup.Text>
                                                                    <FormNumber id="modalOriginZip" value={modalOriginZip} onChange={e => {setModalOriginZip(e.target.value); if (!isGettingLocation) e.target.setCustomValidity("")}} placeholder={"Ex. 27413"} required={true} autoFocus={true} min={5} max={5}></FormNumber>
                                                                    <TooltipButton text="Zip code of where you are coming from."/>
                                                                </InputGroup>
                                                                <InputGroup>
                                                                    <InputGroup.Text>Destination Zip</InputGroup.Text>
                                                                    <FormNumber id="modalDestinationZip" value={modalDestinationZip} onChange={e => {setModalDestinationZip(e.target.value); if (!isGettingLocation) e.target.setCustomValidity("")}} placeholder={"Ex. 27413"} required={true} min={5} max={5}></FormNumber>
                                                                    <TooltipButton text="Zip code of where you are going."/>
                                                                </InputGroup>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                        <Button type="submit" variant="primary" onClick={() => {getZipCodes(); setZipCodeError(false)}}>
                                                            {isGettingLocation ? <BarLoader color="#FFFFFF" height={4} /> : "Calculate"}
                                                        </Button>
                                                        </Modal.Footer>
                                                    </Form>
                                                </Modal>

                                            </InputGroup>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Travel Hours</Form.Label>
                                            <InputGroup>
                                                <Form.Check id="travelHoursSwitch" checked={travelHoursEnabled} type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setTravelHoursEnabled(!travelHoursEnabled)}}></Form.Check>
                                                <FormNumber id="travelHours" value={travelHours} placeholder="Ex. 2.5" integer={false} disabled={!travelHoursEnabled} onChange={e => setTravelHours(e.target.value)} />
                                                <TooltipButton text="Number of hours spent traveling. Will be added to total hours."/>
                                            </InputGroup>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Mileage Covered (in $ per mile)</Form.Label>
                                            <InputGroup>
                                                <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setMileageCoveredEnabled(!mileageCoveredEnabled)}} checked={mileageCoveredEnabled}></Form.Check>
                                                <FormNumber id="mileageCovered" value={mileageCovered} placeholder="Ex. 0.21" integer={false} disabled={!mileageCoveredEnabled} onChange={e => setMileageCovered(e.target.value)} />
                                                <TooltipButton text="Number of miles that will be covered by organizers. Will subtract from total mileage for final result."/>
                                            </InputGroup>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Form.Label>Gas Price per Mile</Form.Label>
                                        <InputGroup>    
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <FormNumber id='gasPricePerMile' value={gasPricePerMile == "" ? gasPricePerMile : gasPricePerMile.toFixed(2)} placeholder="Ex. 0.14" integer={false} disabled={!totalMileageEnabled} onChange={e => setGasPricePerMile(e.target.value)} />
                                            <Button variant='light' disabled={!totalMileageEnabled} onClick={() => {setGasModalOpen(true)}}>Use Average</Button>
                                            <TooltipButton text='Price of gas per mile. Calculated using "Gas $/Gallon" and "Vehicle MPG". Click "Calculate Average" to use average values.'/>
                                            <Modal show={gasModalOpen} onHide={() => setGasModalOpen(false)} centered={true}>
                                                    <Form onSubmit={e => e.preventDefault()}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Use Average Gas $ Per Mile</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                        <p>Average gas price obtained from <a href="https://gasprices.aaa.com/state-gas-price-averages/" target="_blank">AAA daily average.</a></p>
                                                        <InputGroup>
                                                            <InputGroup.Text>Select State</InputGroup.Text>
                                                            <Form.Select id="selectState" value={currentState} onChange={(e) => {setCurrentState(e.target.value)}}>
                                                                <option key={"average_gas"} value={"average_gas"}>Average</option>
                                                                {gasPrices ? Object.keys(gasPrices).map((element) => {if (element.length == 2) return <option key={element} value={element}>{element}</option>}) : ""}
                                                            </Form.Select>
                                                            <TooltipButton text='Select State to use average values. Select "Average" for average gas price across the United States.'/>
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <InputGroup.Text>Select Vehicle Type</InputGroup.Text>
                                                                <Form.Select id="selectVehicleType" value={currentVehicle} onChange={(e) => {setCurrentVehicle(e.target.value)}}>
                                                                    <option key={"average_mpg"} value={"average_mpg"}>Average</option>
                                                                    {gasPrices ? Object.keys(gasPrices).map((element) => {
                                                                        if (element != "average_gas" && element != "average_mpg" && element.length > 2)
                                                                        {
                                                                            let displayElement = element.replace("_mpg", "").replace("_", "/").replace("van", "Van").replace("suv", "SUV");
                                                                            displayElement = displayElement[0].toUpperCase() + displayElement.slice(1);
                                                                            return <option key={element} value={element}>{displayElement}</option>
                                                                        } 
                                                                    }) : ""}
                                                                </Form.Select>
                                                            <TooltipButton text='Select your type of vehicle. Will determine average MPG value. Choose "Average" for average MPG value.'/>
                                                        </InputGroup>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                        <Button type="submit" variant="primary" onClick={() => setAverageGasPrice()}>Select</Button>
                                                        </Modal.Footer>
                                                    </Form>
                                                </Modal>

                                        </InputGroup>
                                        <Col md={{offset: 1}}>
                                            <Row >
                                                <InputGroup>    
                                                    <InputGroup.Text>Gas $/Gallon</InputGroup.Text>
                                                    <FormNumber id="gasPricePerGallon" value={gasPricePerGallon} placeholder="Ex. 2.80" integer={false} disabled={!totalMileageEnabled} onChange={e => setGasPricePerGallon(e.target.value)} />
                                                    <TooltipButton text='Amount of money in dollars per gallon of gas. Divided by "Vehicle MPG" to calculate "Gas Price per Mile". Average value calculated based on state.'/>
                                                </InputGroup>
                                            </Row>
                                            <Row >
                                                <InputGroup>    
                                                    <InputGroup.Text>Vehicle MPG</InputGroup.Text>
                                                    <FormNumber id="vehicleMPG" value={vehicleMPG} placeholder="Ex. 20" integer={false} disabled={!totalMileageEnabled} onChange={e => setVehicleMPG(e.target.value)} />
                                                    <TooltipButton text='Miles-Per-Gallon of your vehicle. Divisor of "Gas $/Gallon" to calculate "Gas Price per Mile". Average value is 25.'/>
                                                </InputGroup>
                                            </Row>
                                        </Col>
                                        
                                    </Col>
                                </Row>
                            </Form.Group>
                            <hr />
                            <h3>Additional Hours</h3>
                            <Form.Group>
                                <Row className="mb-3" xs={1} lg={2}>
                                    <Col>
                                        <Form.Label>Individual Practice Hours</Form.Label>
                                        <InputGroup>
                                        <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setPracticeHoursEnabled(!practiceHoursEnabled)}} checked={practiceHoursEnabled}></Form.Check>
                                        <FormNumber id="practiceHours" value={practiceHours} placeholder="Ex. 3" integer={false} disabled={!practiceHoursEnabled} onChange={e => setPracticeHours(e.target.value)} />
                                        <TooltipButton text="The total hours spent practicing for event (individually, not including group rehearsal)."/>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Form.Label>Rehearsal Hours</Form.Label>
                                        <InputGroup>
                                        <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setRehearsalHoursEnabled(!rehearsalHoursEnabled)}} checked={rehearsalHoursEnabled}></Form.Check>
                                        <FormNumber id="rehearsalHours" value={rehearsalHours} placeholder="Ex. 2" integer={false} disabled={!rehearsalHoursEnabled} onChange={e => setRehearsalHours(e.target.value)} />
                                        <TooltipButton text="The total hours spent in rehearsal for event (not including individual practice)."/>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <hr />
                            <h3>Other Expenses</h3>
                            <Form.Group>
                                <Row className="mb-3" xs={1} lg={2}>
                                    <Col>
                                        <Form.Label>Income Tax Percentage</Form.Label>
                                        <InputGroup>
                                            <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setTaxEnabled(!taxEnabled)}} checked={taxEnabled}></Form.Check>
                                            <InputGroup.Text>%</InputGroup.Text>
                                            <FormNumber id="tax" value={tax} placeholder="Ex. 17.5" integer={false} disabled={!taxEnabled} onChange={e => setTax(e.target.value)} />
                                        <TooltipButton text='Percentage of income tax. Taken from initial "Pay per gig" before any other expenses.'/>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Form.Label>Other Fees</Form.Label>
                                        <InputGroup>
                                            <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setOtherFeesEnabled(!otherFeesEnabled)}} checked={otherFeesEnabled}></Form.Check>
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <FormNumber id="otherFees" value={otherFees} placeholder="Ex. 15.00" integer={false} disabled={!otherFeesEnabled} onChange={e => setOtherFees(e.target.value)} />
                                            <TooltipButton text="Any other additional fees (i.e. food, parking, instrument wear etc.) Will be subtracted at the end of the calculation."/>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form.Group>
                        <br />
                    </Col>
                    {/* Column 2: Results */}
                    <Col>
                        <h3>Results</h3>
                        <hr />
                        <div>
                        <Container>
                        <Row>
                            <Col>
                                
                                    <Row>
                                    <Col lg={2} md={2} sm={2} xs={2}>
                                            <h5 style={{display: "block"}}>Payment: </h5>
                                        </Col>
                                        <Col>
                                        <h5 style={{whiteSpace: "pre-wrap", textAlign: "right", display: "block"}}>{formatCurrency(gigPay)}{gigNumEnabled && gigNum ? ` x ${gigNum} = ${formatCurrency(gigPay*gigNum)}` : ""}</h5>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={7} md={9} sm={8} xs={7}>
                                            {taxEnabled ? <h5 style={{display: "block"}}>Tax Cut ({tax ? tax : "0"}%):</h5> : ""}
                                            {totalMileageEnabled ? <h5 style={{display: "block"}}>Total Travel Cost:</h5> : ""}
                                            {otherFeesEnabled ? <h5 style={{display: "block"}}>Other Fees:</h5> : ""}
                                            <hr style={{margin: "0px ", textAlign: "right", width: "0px"}}/>
                                            <h5 style={{display: "block"}}><br /></h5>
                                            <h5 style={{display: "block"}}>Total Hours: </h5>
                                        </Col>
                                        <Col lg={1} md={1} sm={1} xs={1}>
                                            <div style={{whiteSpace: "pre-wrap"}}>
                                            {taxEnabled ? <h5 style={{display: "block"}}>-</h5> : ""}
                                            {totalMileageEnabled ? <h5 style={{display: "block"}}>-</h5> : ""}
                                            {otherFeesEnabled ? <h5 style={{display: "block"}}>-</h5> : ""}
                                            <h5 style={{display: "block"}}><br /></h5>
                                            <h5 style={{display: "block"}}>÷</h5>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div style={{whiteSpace: "pre-wrap", textAlign: "right", display: "block"}}>
                                                {taxEnabled ? <h5 style={{display: "block"}}>{formatCurrency(totalTax)}</h5> : ""}
                                                {totalMileageEnabled ? <h5 style={{display: "block"}}>{totalMileage ? formatCurrency(totalGas) : formatCurrency(0)}</h5> : ""}
                                                {otherFeesEnabled ? <h5 style={{display: "block"}}>{formatCurrency(otherFees)}</h5> : ""}
                                                <hr style={{margin: "0px ", textAlign: "right"}}/>
                                                <h5 style={{display: "block"}}>{formatCurrency(totalPay)}</h5>
                                                <h5 style={{display: "block"}}>{totalHours}</h5>
                                            </div>
                                            
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col lg={8} xs={7}><h4>Total Hourly Wage:</h4></Col>
                                        <Col style={{textAlign: "right"}}><h4>{formatCurrency(hourlyWage)}</h4></Col>
                                    </Row>           
                                
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Row>
                                <Col lg={3} md={2} sm={3} xs={3}><Button type="submit" variant="success" onClick={() => {saveFinancial(false)}} style={{paddingLeft: "10px", paddingRight: "10px"}} disabled={!user}>{saveStatus ? <BarLoader color="#FFFFFF" height={4} width={50} /> : (!isEvent && paramId) || (isEvent && !isNewEvent) ? "Update" : "Save"}</Button></Col> 
                                <Col lg={3} md={2} sm={3} xs={3}><Button type="submit" variant="secondary" onClick={() => {saveFinancial(true)}} style={{paddingLeft: "10px", paddingRight: "10px"}}>Export</Button></Col>
                                {isEvent ? <Col lg={5} md={5} sm={5} xs={5}><Button variant="secondary" onClick={() => {loadEventData(true)}} style={{paddingLeft: "10px", paddingRight: "10px"}}>Reload Data</Button></Col> : ""}
                            </Row>
                        </Row>
                        </Container>
                        </div>
                    </Col>
                </Row>
                </Form>
            </Container>
        </div>
    )
    }
}

export default Calculator