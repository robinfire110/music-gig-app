import React from "react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Datepicker from "../components/Datepicker";
import { Container, Form, Col, Row, InputGroup, Button, OverlayTrigger, Popover } from "react-bootstrap";
import moment from "moment";
import TooltipButton from "../components/TooltipButton";
import FormNumber from "../components/FormNumber";

const Calculator = () => {
    /* Variables */
    //Search parameters
    const [searchParams] = useSearchParams();
    let isEvent = false;

    //States
    //Variables
    const [calcName, setCalcName] = useState();
    const [calcDate, setCalcDate] = useState(moment().format("YYYY-MM-DD"));
    const [gigPay, setGigPay] = useState();
    const [gigHours, setGigHours] = useState();
    const [gigNum, setGigNum] = useState();
    const [totalMileage, setTotalMileage] = useState();
    const [mileageCovered, setMileageCovered] = useState();
    const [gasPricePerMile, setGasPricePerMile] = useState();
    const [gasPricePerGallon, setGasPricePerGallon] = useState();
    const [vehicleMPG, setVehicleMPG] = useState();
    const [individualPractice, setIndividualPractice] = useState();
    const [rehearsalHours, setRehearsalHours] = useState();
    const [tax, setTax] = useState();
    const [otherFees, setOtherFees] = useState();
    const [totalGas, setTotalGas] = useState(0.0); 
    const [totalTax, setTotalTax] = useState(0.0); 
    const [totalHours, setTotalHours] = useState(0.0);
    const [totalPay, setTotalPay] = useState(0);
    const [hourlyWage, setHourlyWage] = useState(0.0);

    //Enable
    const [gigNumEnabled, setGigNumEnabled] = useState(false);
    const [totalMileageEnabled, setTotalMileageEnabled] = useState(false);
    const [mileageCoveredEnabled, setMileageCoveredEnabled] = useState(false);
    const [individualPracticeEnabled, setIndividualPracticeEnabled] = useState(false);
    const [rehearsalHoursEnabled, setRehearsalHoursEnabled] = useState(false);
    const [taxEnabled, setTaxEnabled] = useState(false);
    const [otherFeesEnabled, setOtherFeesEnabled] = useState(false);

    /* Effect */
    //On first load
    useEffect(() => {
        isEvent = (searchParams.get("event") == "true");
    }, [])
    
    //Runs when any fields related to calculation updates.
    useEffect(() => {
      calculateHourlyWage();
    }, [gigPay, gigHours, gigNum, totalMileage, mileageCovered, gasPricePerMile, individualPractice, rehearsalHours, tax, otherFees,
        gigNumEnabled, totalMileageEnabled, mileageCoveredEnabled, individualPracticeEnabled, rehearsalHoursEnabled, taxEnabled, otherFeesEnabled])

    //Runs when any fields related to gas price calcuation updates.
    useEffect(() => {
      calculateGasPerMile();
    }, [gasPricePerGallon, vehicleMPG])
    
    /* Functions */
    //Format number to currency
    function formatCurrency(value) {
        if (value) return Intl.NumberFormat('en-US', {style: 'currency', currency: "USD"}).format(value);
        return "$0.00";
    }

    //Calculate wage
    function calculateHourlyWage() {
        let wage = 0;
        let finalPay = 0;

        //Calculate possible income
        if (gigPay) wage = gigPay;
        if (gigNumEnabled && gigNum) wage *= gigNum;

        //Calculate mileage pay
        if (totalMileageEnabled && totalMileage && gasPricePerMile)
        {
            let gasPrice = gasPricePerMile;
            //Subtract mileage covered
            if (mileageCoveredEnabled && mileageCovered) gasPrice -= mileageCovered;
            setTotalGas(totalMileage * gasPrice);
            wage -= totalMileage * gasPrice;
        }

        //Calculate tax (if needed)
        if (taxEnabled)
        {  
            let currentTax = 0;
            if (tax) currentTax = gigPay * (tax/100);
            setTotalTax(currentTax);
            wage -= currentTax;
        } 

        //Other fees (if needed)
        if (otherFeesEnabled && otherFees) wage -= otherFees;

        //Calculate hours
        let hours = 0;
        if (gigHours) hours = gigHours;
        if (gigNumEnabled && gigNum) hours *= gigNum;
        if (individualPracticeEnabled && individualPractice) hours += individualPractice;
        if (rehearsalHoursEnabled && rehearsalHours) hours += rehearsalHours;
        setTotalHours(hours);

        //Final division
        setTotalPay(wage);
        if (hours > 0) finalPay = wage/hours;
        
        //Convert
        setHourlyWage(finalPay);
    }

    //Calculate gas per mile
    function calculateGasPerMile() {
        if (totalMileageEnabled)
        {
            if (gasPricePerGallon && vehicleMPG)
            {
                //Set
                let value = Math.round((gasPricePerGallon/vehicleMPG) * 100)/100;
                setGasPricePerMile(value);

                //Update value in box
                const input = document.getElementById('gasPricePerMile');
                //input.value = Math.round((gasPricePerGallon/vehicleMPG) * 100)/100;
                input.value = value.toFixed(2);
            }
        }
    }

    return (
        <div>
            <Header />
            <h2>Calculator</h2>
            <hr />
            <Container className="" style={{textAlign: "left"}}>
                <Row>
                    {/* Column 1: Calculator */}
                    <Col xl={8} lg={7}>
                        <h3>Basic Information</h3>
                        <hr />
                        <Form>
                            <Form.Group>
                                    <Row className="mb-3" xs={1} lg={2}>
                                        <Col lg="8">
                                            <Form.Label>Name<span style={{color: "red"}}>*</span></Form.Label>
                                            <Form.Control type="text" required={true} placeholder="Calculator Name" onChange={e => setCalcName(e.target.value)}></Form.Control>
                                        </Col>
                                        <Col lg="4">
                                            <Form.Label>Date<span style={{color: "red"}}>*</span></Form.Label>
                                            <Form.Control type="date" required={true} defaultValue={calcDate} onChange={e => setCalcDate(e.target.value)}></Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3" xs={1} lg={3}>
                                        <Col>
                                            <Form.Label>Pay per gig<span style={{color: "red"}}>*</span></Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                                                <FormNumber placeholder="Ex. 75.00" required={true} integer={false} onChange={e => setGigPay(parseFloat(e.target.value))}/>
                                                <TooltipButton text="Payment for gig in dollars."/>
                                            </InputGroup>
                                        </Col>
                                        <Col>
                                            <Form.Label>Hours per gig<span style={{color: "red"}}>*</span></Form.Label>
                                            <InputGroup>
                                                <FormNumber placeholder="Ex. 3" required={true} integer={false} onChange={e => setGigHours(parseFloat(e.target.value))}/>
                                                <TooltipButton text="Number of hours for event. Does not include rehearsal or practice hours."/>
                                            </InputGroup>
                                        </Col>
                                        <Col>
                                            <Form.Label>Number of gigs</Form.Label>
                                            <InputGroup>
                                                <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setGigNumEnabled(!gigNumEnabled)}} defaultValue={!gigNumEnabled}></Form.Check>
                                                <FormNumber placeholder="Ex. 1" disabled={!gigNumEnabled} onChange={e => setGigNum(parseInt(e.target.value))} />
                                                <TooltipButton text='Number of gigs. Used if you have multiple of the same gig at the same time (i.e. back-to-back performances). Will only account travel, additional hours and other expenses once.'/>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                            </Form.Group>
                            <hr />
                            <h3>Logistics</h3>
                            <hr />
                            <h4>Mileage</h4>
                            <Form.Group>
                                <Row className="mb-3" xs={1} lg={2}>
                                    <Col>
                                        <Row className="mb-1">
                                            <Form.Label>Total Mileage</Form.Label>
                                            <InputGroup>
                                                <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setTotalMileageEnabled(!totalMileageEnabled);}} defaultValue={!totalMileageEnabled}></Form.Check>
                                                <FormNumber placeholder="Ex. 20" integer={false} disabled={!totalMileageEnabled} onChange={e => setTotalMileage(parseFloat(e.target.value))} />
                                                <Button variant='light'>Calculate based on location</Button>
                                                <TooltipButton text='Total number of miles driven to get to event. Will multiply by "Gas Price per Mile" for final result.'/>
                                                {/* USE BOOTSTRAP MODAL OR OFF CANVAS FOR CALCULATION MENU*/}
                                            </InputGroup>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Mileage Covered (in $ per mile)</Form.Label>
                                            <InputGroup>
                                                <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setMileageCoveredEnabled(!mileageCoveredEnabled)}} defaultValue={!mileageCoveredEnabled}></Form.Check>
                                                <FormNumber placeholder="Ex. 0.21" integer={false} disabled={!mileageCoveredEnabled} onChange={e => setMileageCovered(parseFloat(e.target.value))} />
                                                <TooltipButton text="Number of miles that will be covered by organizers. Will subtract from total mileage for final result."/>
                                            </InputGroup>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Form.Label>Gas Price per Mile</Form.Label>
                                        <InputGroup>    
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <FormNumber id='gasPricePerMile' placeholder="Ex. 0.14" integer={false} disabled={!totalMileageEnabled} onChange={e => setGasPricePerMile(parseFloat(e.target.value))} />
                                            <Button variant='light'>Use Average</Button>
                                            <TooltipButton text='Price of gas per mile. Calculated using "Gas $/Gallon" and "Vehicle MPG". Click "Calculate Average" to use average values.'/>
                                        </InputGroup>
                                        <Col md={{offset: 1}}>
                                            <Row >
                                                <InputGroup>    
                                                    <InputGroup.Text>Gas $/Gallon</InputGroup.Text>
                                                    <FormNumber placeholder="Ex. 2.80" integer={false} disabled={!totalMileageEnabled} onChange={e => setGasPricePerGallon(parseFloat(e.target.value))} />
                                                    <TooltipButton text='Amount of money in dollars per gallon of gas. Divided by "Vehicle MPG" to calculate "Gas Price per Mile". Average value calculated based on state.'/>
                                                </InputGroup>
                                            </Row>
                                            <Row >
                                                <InputGroup>    
                                                    <InputGroup.Text>Vehicle MPG</InputGroup.Text>
                                                    <FormNumber placeholder="Ex. 20" integer={false} disabled={!totalMileageEnabled} onChange={e => setVehicleMPG(parseFloat(e.target.value))} />
                                                    <TooltipButton text='Miles-Per-Gallon of your vehicle. Divisor of "Gas $/Gallon" to calculate "Gas Price per Mile". Average value is 25.'/>
                                                </InputGroup>
                                            </Row>
                                        </Col>
                                        
                                    </Col>
                                </Row>
                            </Form.Group>
                            <hr />
                            <h4>Additional Hours</h4>
                            <Form.Group>
                                <Row className="mb-3" xs={1} lg={2}>
                                    <Col>
                                        <Form.Label>Individual Practice Hours</Form.Label>
                                        <InputGroup>
                                        <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setIndividualPracticeEnabled(!individualPracticeEnabled)}} defaultValue={!individualPracticeEnabled}></Form.Check>
                                        <FormNumber placeholder="Ex. 3" integer={false} disabled={!individualPracticeEnabled} onChange={e => setIndividualPractice(parseFloat(e.target.value))} />
                                        <TooltipButton text="The total hours spent practicing for event (individually, not including group rehearsal)."/>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Form.Label>Rehearsal Hours</Form.Label>
                                        <InputGroup>
                                        <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setRehearsalHoursEnabled(!rehearsalHoursEnabled)}} defaultValue={!rehearsalHoursEnabled}></Form.Check>
                                        <FormNumber placeholder="Ex. 2" integer={false} disabled={!rehearsalHoursEnabled} onChange={e => setRehearsalHours(parseFloat(e.target.value))} />
                                        <TooltipButton text="The total hours spent in rehearsal for event (not including individual practice)."/>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <hr />
                            <h4>Other Expenses</h4>
                            <Form.Group>
                                <Row className="mb-3" xs={1} lg={2}>
                                    <Col>
                                        <Form.Label>Income Tax Percentage</Form.Label>
                                        <InputGroup>
                                            <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setTaxEnabled(!taxEnabled)}} defaultValue={!taxEnabled}></Form.Check>
                                            <InputGroup.Text>%</InputGroup.Text>
                                            <FormNumber placeholder="Ex. 17.5" integer={false} disabled={!taxEnabled} onChange={e => setTax(parseFloat(e.target.value))} />
                                        <TooltipButton text='Percentage of income tax. Taken from initial "Pay per gig" before any other expenses.'/>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Form.Label>Other Fees</Form.Label>
                                        <InputGroup>
                                            <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setOtherFeesEnabled(!otherFeesEnabled)}} defaultValue={!otherFeesEnabled}></Form.Check>
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <FormNumber placeholder="Ex. 15.00" integer={false} disabled={!otherFeesEnabled} onChange={e => setOtherFees(parseFloat(e.target.value))} />
                                            <TooltipButton text="Any other additional fees (i.e. food, parking, instrument wear etc.) Will be subtracted at the end of the calculation."/>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
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
                                    <Col xl={{offset: 6}} lg={{offset: 5}} md={{offset: 8}} sm={{offset: 7}} xs={{offset: 5}}><Button variant="success" style={{paddingLeft: "15px", paddingRight: "15px"}}>Save</Button> {/* CHECK FOR ACCOUNT WHEN LOGIN WORKING */}</Col>
                                    <Col><Button variant="secondary" style={{paddingLeft: "15px", paddingRight: "15px"}}>Export</Button></Col>
                                </Row>   
                            </Container>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    )
}

export default Calculator