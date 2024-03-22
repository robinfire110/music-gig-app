import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Datepicker from "../components/Datepicker";
import { Container, Form, Col, Row, InputGroup, Button, OverlayTrigger, Popover, Modal, Alert, Collapse } from "react-bootstrap";
import moment from "moment";
import TooltipButton from "../components/TooltipButton";
import FormNumber from "../components/FormNumber";
import axios, { spread } from "axios";
import {BarLoader, ClipLoader} from 'react-spinners'

const Calculator = () => {
    /* Variables */
    //Account
    const [userId, setUserId] = useState(1); /* UPDATE WITH PROPER ACCOUNT WHEN IMPLEMENTED */
    const [userZip, setUserZip] = useState("27413");

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
    const [saveStatus, setSaveStatus] = useState();

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
    const [modalOriginZip, setModalOriginZip] = useState(userZip);
    const [modalDestinationZip, setModalDestinationZip] = useState("");

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

        //Load data
        if (paramId) loadFromDatabase();
        else setIsLoading(false);

        //Get gas prices
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
    //Format number to currency
    function formatCurrency(value) 
    {
        if (value && value !== "") return Intl.NumberFormat('en-US', {style: 'currency', currency: "USD"}).format(value);
        return "$0.00";
    }

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

        //Set isLoading
        setIsLoading(false);
    }

    //Load from database (both fin_id and event_id)
    async function loadFromDatabase()
    {
        //Check if event
        if (!isEvent)
        {
            //Get data
            await axios.get(`http://localhost:5000/financial/user_id/fin_id/${userId}/${paramId}`).then(res => {
                const data = res.data[0];
                if (data && data?.fin_id) setFinId(data.fin_id);

                //Financial exists!
                if (data) loadData(data);
                else //Financial does not exists, redirect to blank page.
                {
                    setParamId(0);
                    setIsLoading(false);
                    navigate(`/calculator`);
                }
            });
        }
        else
        {
            //Check for already existing event financial
            await axios.get(`http://localhost:5000/financial/user_id/event_id/${userId}/${paramId}`).then(async res => {
                const data = res.data[0];
                if (data) //If financial for event exists, load that data.
                {
                    console.log("Event Financial exists, loading...");
                    loadEventData(false); //Get event data for later use
                    setFinId(data.fin_id);
                    loadData(data);
                } 
                else
                {
                    loadEventData(true);
                    setIsNewEvent(true);
                } 
            });
        }
    }

    //Load event data
    async function loadEventData(fillFields)
    {
        console.log("Event Data", eventData);
        if (eventData)
        {
            if (fillFields)
            {
                loadData(eventData);
                if (userZip && eventData.zip) calculateBasedOnLocation(userZip.slice(0, 5), eventData.zip.slice(0, 5));
            }
        } 
        else
        {
            await axios.get(`http://localhost:5000/event/id/${paramId}`).then(res => {
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
                    if (userZip && eventData?.zip) calculateBasedOnLocation(userZip?.slice(0, 5), eventData.zip?.slice(0, 5));
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

    function metersToMiles(meters) {
        return meters*0.000621371192;
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
                    if (eventData && eventData.zip == destinationZip && originZip == userZip)
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
            let value = Math.round((gasPricePerGallon/vehicleMPG) * 100)/100;
            setGasPricePerMile(value.toFixed(2));
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
            console.log(isNewEvent);
            //Save to database
            if ((!isEvent && paramId) || (isEvent && !isNewEvent)) //If exists, update
            {
                console.log(`UPDATE ${finId} ${paramId}`)
                console.log(data);
                await axios.put(`http://localhost:5000/financial/${finId}`, data).then(res => {
                    setSaveStatus({type: "update", status: "OK"});
                }).catch(error => {
                    setSaveStatus({type: "update", status: "ERROR"});
                    console.log(error);
                });
            }
            else //If new, post.
            {
                console.log("ADD");
                await axios.post(`http://localhost:5000/financial/${userId}`, data).then(res => {
                    //SetID
                    setParamId(res.data.fin_id);
                    setFinId(res.data.fin_id);
                    setIsNewEvent(false);

                    //Update URL
                    if (!isEvent) navigate(`/calculator/${res.data.fin_id}`);
                    setSaveStatus({type: "save", status: "OK"});
                }).catch(error => {
                    setSaveStatus({type: "save", status: "ERROR"});
                    console.log(error);
                });
            };

            //Reset save status
            setTimeout(() => {
                setSaveStatus(undefined);
            }, 5000);
        }
        else
        {
            //Export to spreadsheet
        }

    }

    if (isLoading)
    {
        return (
            <div>
                <Header />
                <br />
                <ClipLoader />
                <br />
                <Footer />
            </div>
        )
    }
    else
    {
    return (
        <div>
            <Header />
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
                                            <FormNumber id='gasPricePerMile' value={gasPricePerMile} placeholder="Ex. 0.14" integer={false} disabled={!totalMileageEnabled} onChange={e => setGasPricePerMile(e.target.value)} />
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
                                <Col lg={3} md={2} sm={3} xs={3}><Button type="submit" variant="success" onClick={() => {saveFinancial(false)}} style={{paddingLeft: "10px", paddingRight: "10px"}} disabled={userId == -1}>{(!isEvent && paramId) || (isEvent && !isNewEvent) ? "Update" : "Save"}</Button> {/* CHECK FOR ACCOUNT WHEN LOGIN WORKING */}</Col> 
                                <Col lg={3} md={2} sm={3} xs={3}><Button variant="secondary" onClick={() => {saveFinancial(true)}} style={{paddingLeft: "10px", paddingRight: "10px"}}>Export</Button></Col>
                                {isEvent ? <Col lg={5} md={5} sm={5} xs={5}><Button variant="secondary" onClick={() => {loadEventData(true)}} style={{paddingLeft: "10px", paddingRight: "10px"}}>Reload Data</Button></Col> : ""}
                            </Row>
                        </Row>
                        {saveStatus && saveStatus.status == "OK" ? <Alert variant="success"dismissible show={saveStatus?.status == "OK"} onClose={() => setSaveStatus(undefined)}>Data sucessfully {saveStatus.type == "save" ? "saved" : saveStatus.type == "update" ? "updated" : "exported"}. </Alert> : ""}
                        {saveStatus && saveStatus.status == "ERROR" ? <Alert variant="danger"dismissible show={saveStatus?.status == "ERROR"} onClose={() => setSaveStatus(undefined)}>An error occured while {saveStatus.type == "save" ? "saving" : saveStatus.type == "updating" ? "updated" : "exporting"}. Please ensure all data is correct and try again.</Alert> : ""}
                        </Container>
                        </div>
                    </Col>
                </Row>
                </Form>
            </Container>
            <Footer />
        </div>
    )
    }
}

export default Calculator