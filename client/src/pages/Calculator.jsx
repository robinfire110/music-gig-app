import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Datepicker from "../components/Datepicker";
import { Container, Form, Col, Row, InputGroup, Button, OverlayTrigger, Popover } from "react-bootstrap";
import moment from "moment";
import TooltipButton from "../components/TooltipButton";
import FormNumber from "../components/FormNumber";
import axios, { spread } from "axios";

const Calculator = () => {
    /* Variables */
    //Account
    const [userId, setUserId] = useState(1); /* UPDATE WITH PROPER ACCOUNT WHEN IMPLEMENTED */

    //Params
    const navigate = useNavigate();
    const [paramId, setParamId] = useState(useParams().id);
    const [finId, setFinId] = useState();
    const [eventId, setEventId] = useState();

    //Search parameters
    const [searchParams] = useSearchParams();
    const [isEvent, setIsEvent] = useState(searchParams.get("event") == "true");
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
    const [zip, setZip] = useState();

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
        console.log(isEvent);
        if (isEvent) setEventId(paramId);
        else setFinId(paramId);

        //Load data
        if (paramId) loadFromDatabase();

        //Get gas prices
        if (!gasPrices)
        {
            axios.get(`http://localhost:5000/gas`).then(res => {
                let map = {};
                for (let i = 0; i < res.data.length; i++)
                {
                    map[res.data[i].location] = res.data[i].averagePrice;
                }   
                setGasPrices(map);
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
        if (value) return Intl.NumberFormat('en-US', {style: 'currency', currency: "USD"}).format(value);
        return "$0.00";
    }

    //Load data
    function loadData(data)
    {
        if (data.fin_name) setCalcName(data.fin_name);
        if (data.date) setCalcDate(data.calc)
        if (data.zip) setZip(data.zip);
        if (data.hourly_wage) setHourlyWage(data.hourly_wage);
        if (data.total_wage && data.total_wage > 0) setGigPay(data.total_wage);
        if (data.event_hours && data.event_hours > 0) setGigHours(data.event_hours);
        if (data.gig_num && data.gig_num > 0) setGigNum(data.gig_num); 
        if (data.total_mileage && data.total_mileage > 0) setTotalMileage(data.total_mileage); 
        if (data.travel_hours && data.travel_hours > 0) setTravelHours(data.travel_hours); 
        if (data.mileage_pay && data.mileage_pay > 0) setMileageCovered(data.mileage_pay); 
        if (data.gas_price && data.gas_price > 0) setGasPricePerGallon(data.gas_price);
        if (data.mpg && data.mpg > 0) setVehicleMPG(data.mpg);
        if (data.practice_hours && data.practice_hours > 0) setPracticeHours(data.practice_hours); 
        if (data.rehearse_hours && data.rehearse_hours > 0) setRehearsalHours(data.rehearse_hours); 
        if (data.tax && data.tax > 0) setTax(data.tax); 
        if (data.fees && data.fees > 0) setOtherFees(data.fees);

        //Set switches
        setGigNumEnabled(data.gig_num && data.gig_num > 0);
        setTotalMileageEnabled(data.total_mileage && data.total_mileage > 0);
        setTravelHoursEnabled(data.travel_hours && data.travel_hours > 0);
        setMileageCoveredEnabled(data.mileage_pay && data.mileage_pay > 0);
        setPracticeHoursEnabled(data.practice_hours && data.practice_hours > 0);
        setRehearsalHoursEnabled(data.rehearse_hours && data.rehearse_hours > 0);
        setTaxEnabled(data.tax && data.tax > 0);
        setOtherFeesEnabled(data.fees && data.fees > 0);
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
                if (data.fin_id) setFinId(data.fin_id);

                //Financial exists!
                if (data) loadData(data);
                else //Financial does not exists, redirect to blank page.
                {
                    setParamId(0);
                    navigate(`/calculator`);
                }
            });
        }
        else
        {
            //Check for already existing event financial
            await axios.get(`http://localhost:5000/financial/user_id/event_id/${userId}/${paramId}`).then(async res => {
                const data = res.data[0];
                if (data && data.fin_id) setFinId(data.fin_id);

                if (data) loadData(data);
                else loadEventData();
            });
            
        }
    }

    //Load event data
    async function loadEventData()
    {
        await axios.get(`http://localhost:5000/event/id/${paramId}`).then(res => {
            const data = res.data;
            let eventData = {
                fin_name: data?.event_name,
                total_wage: data?.pay,
                event_hours: data?.event_hours,
                rehearse_hours: data?.rehearse_hours,
                mileage_pay: data?.mileage_pay,
                zip: data?.Address.zip
            };
            setIsNewEvent(true);
            loadData(eventData);
        });
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
        setTotalHours(hours);

        //Final division
        setTotalPay(wage);
        if (hours > 0) finalPay = wage/hours;
        
        //Convert
        setHourlyWage(finalPay);
    }

    //Calculate gas per mile
    function calculateGasPerMile() 
    {
        if (totalMileageEnabled)
        {
            if (gasPricePerGallon && vehicleMPG)
            {
                //Set
                let value = Math.round((gasPricePerGallon/vehicleMPG) * 100)/100;
                setGasPricePerMile(value.toFixed(2));
            }
            else
            {
                setGasPricePerMile(0);
            }
        }
    }

    //Set average gas price
    function setAverageGasPrice()
    {
        //Set data
        if (gasPrices)
        {
            /* Check if login, use local state. Else, use default. */
            setGasPricePerGallon(Math.round(gasPrices["defaultAverage"] * 100) / 100);
            setVehicleMPG(gasPrices["defaultMPG"]);
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
        
        //Save (in correct place)
        if (!spreadsheet)
        {
            //Save to database
            if ((!isEvent && paramId) || (isEvent && !isNewEvent)) //If exists, update
            {
                console.log(`UPDATE ${finId} ${paramId}`)
                console.log(data);
                await axios.put(`http://localhost:5000/financial/${finId}`, data).then(res => {
                    //alert(`Updated ${finId}`);
                }).catch(error => {
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
                    //if (!isEvent) window.history.pushState(null, document.title, document.URL+`/${res.data.fin_id}`);
                    if (!isEvent) navigate(`/calculator/${res.data.fin_id}`, {replace: true});
                    //alert(`Added ${res.data.fin_id}!`);
                }).catch(error => {
                    console.log(error);
                });
            };
        }
        else
        {
            //Export to spreadsheet
        }

    }

    return (
        <div>
            <Header />
            <h2>Calculator</h2>
            <hr />
            <Container className="" style={{textAlign: "left"}}>
            <Form>
                <Row>
                    {/* Column 1: Calculator */}
                    <Col xl={8} lg={7}>
                        <h3>Basic Information</h3>
                        <hr />
                            <Form.Group>
                                    <Row className="mb-3" xs={1} lg={2}>
                                        <Col lg="8">
                                            <Form.Label>Name<span style={{color: "red"}}>*</span></Form.Label>
                                            <Form.Control id="financialName" value={calcName} type="text" required={true} placeholder="Calculator Name" onChange={e => setCalcName(e.target.value)}></Form.Control>
                                        </Col>
                                        <Col lg="4">
                                            <Form.Label>Date<span style={{color: "red"}}>*</span></Form.Label>
                                            <Form.Control id="financialDate" value={calcDate} type="date" required={true} onChange={e => setCalcDate(e.target.value)}></Form.Control>
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
                                                <FormNumber id="gigNum" value={gigNum} placeholder="Ex. 1" disabled={!gigNumEnabled} onChange={e => setGigNum(e.target.value)} />
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
                                                <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setTotalMileageEnabled(!totalMileageEnabled); setAverageGasPrice();}} checked={totalMileageEnabled}></Form.Check>
                                                <FormNumber id="totalMileage" value={totalMileage} placeholder="Ex. 20" integer={false} disabled={!totalMileageEnabled} onChange={e => setTotalMileage(e.target.value)} />
                                                <Button variant='light' disabled={!totalMileageEnabled} onClick={() => {setTravelHoursEnabled(true);}}>Calculate based on location</Button>
                                                <TooltipButton text='Total number of miles driven to get to event. Will multiply by "Gas Price per Mile" for final result.'/>
                                                {/* USE BOOTSTRAP MODAL OR OFF CANVAS FOR CALCULATION MENU*/}
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
                                            <Button variant='light' disabled={!totalMileageEnabled} onClick={() => {setAverageGasPrice()}}>Use Average</Button>
                                            <TooltipButton text='Price of gas per mile. Calculated using "Gas $/Gallon" and "Vehicle MPG". Click "Calculate Average" to use average values.'/>
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
                        <Row>
                            <Col>
                                <Container>
                                    <Row>
                                    <Col lg={2} md={2} sm={2} xs={2}>
                                            <h5>Payment: </h5>
                                        </Col>
                                        <Col>
                                        <h5 style={{whiteSpace: "pre-wrap", textAlign: "right"}}>{formatCurrency(gigPay)}{gigNumEnabled && gigNum ? ` x ${gigNum} = ${formatCurrency(gigPay*gigNum)}` : ""}</h5>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={7} md={9} sm={8} xs={7}>
                                            {taxEnabled ? <h5>Tax Cut ({tax ? tax : "0"}%):</h5> : ""}
                                            {totalMileageEnabled ? <h5>Total Travel Cost:</h5> : ""}
                                            {otherFeesEnabled ? <h5>Other Fees:</h5> : ""}
                                            <hr style={{margin: "0px ", textAlign: "right", width: "0px"}}/>
                                            <h5><br /></h5>
                                            <h5>Total Hours: </h5>
                                        </Col>
                                        <Col lg={1} md={1} sm={1} xs={1}>
                                            <div style={{whiteSpace: "pre-wrap"}}>
                                            {taxEnabled ? <h5>-</h5> : ""}
                                            {totalMileageEnabled ? <h5>-</h5> : ""}
                                            {otherFeesEnabled ? <h5>-</h5> : ""}
                                            <h5><br /></h5>
                                            <h5>÷</h5>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div style={{whiteSpace: "pre-wrap", textAlign: "right"}}>
                                                {taxEnabled ? <h5>{formatCurrency(totalTax)}</h5> : ""}
                                                {totalMileageEnabled ? <h5>{totalMileage ? formatCurrency(totalGas) : formatCurrency(0)}</h5> : ""}
                                                {otherFeesEnabled ? <h5>{formatCurrency(otherFees)}</h5> : ""}
                                                <hr style={{margin: "0px ", textAlign: "right"}}/>
                                                <h5>{formatCurrency(totalPay)}</h5>
                                                <h5>{totalHours}</h5>
                                            </div>
                                            
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col lg={8} xs={7}><h4>Total Hourly Wage:</h4></Col>
                                        <Col style={{textAlign: "right"}}><h4>{formatCurrency(hourlyWage)}</h4></Col>
                                    </Row>
                                                
                                </Container>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Container>
                                <Row>
                                    {isEvent ? <Col><Button variant="secondary" onClick={() => {loadEventData()}} style={{paddingLeft: "10px", paddingRight: "10px"}}>Reload Data</Button></Col> : ""}
                                    <Col xl={{offset: 6}} lg={{offset: 5}} md={{offset: 8}} sm={{offset: 7}} xs={{offset: 5}}><Button variant="success" onClick={() => {saveFinancial(false)}} style={{paddingLeft: "10px", paddingRight: "10px"}} disabled={userId == -1}>{(!isEvent && paramId) || (isEvent && !isNewEvent) ? "Update" : "Save"}</Button> {/* CHECK FOR ACCOUNT WHEN LOGIN WORKING */}</Col>
                                    <Col><Button variant="secondary" onClick={() => {saveFinancial(true)}} style={{paddingLeft: "10px", paddingRight: "10px"}}>Export</Button></Col>
                                </Row>   
                            </Container>
                        </Row>
                    </Col>
                </Row>
                </Form>
            </Container>
            <Footer />
        </div>
    )
}

export default Calculator