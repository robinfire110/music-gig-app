import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Datepicker from "../components/Datepicker";
import { Container, Form, Col, Row, InputGroup, Button, OverlayTrigger, Popover } from "react-bootstrap";
import moment from "moment";
import TooltipButton from "../components/TooltipButton";

const Calculator = () => {
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
    const [hourlyWage, setHourlyWage] = useState(0.0);

    //Enable
    const [gigNumEnabled, setGigNumEnabled] = useState(false);
    const [totalMileageEnabled, setTotalMileageEnabled] = useState(false);
    const [mileageCoveredEnabled, setMileageCoveredEnabled] = useState(false);
    const [individualPracticeEnabled, setIndividualPracticeEnabled] = useState(false);
    const [rehearsalHoursEnabled, setRehearsalHoursEnabled] = useState(false);
    const [taxEnabled, setTaxEnabled] = useState(false);
    const [otherFeesEnabled, setOtherFeesEnabled] = useState(false);

    //Effect (refresh when anything is updated)
    useEffect(() => {
      calculateHourlyWage();
    }, [gigPay, gigHours, gigNum, totalMileage, mileageCovered, gasPricePerGallon, gasPricePerMile, vehicleMPG, individualPractice, rehearsalHours, tax, otherFees,
        gigNumEnabled, totalMileageEnabled, mileageCoveredEnabled, individualPracticeEnabled, rehearsalHoursEnabled, taxEnabled, otherFeesEnabled])
    

    //Calculate wage
    function calculateHourlyWage() {
        let wage = 0;
        let totalHours = 0;
        let finalPay = 0;
        let totalTax = 0;
        if (gigPay && gigHours)
        {
            //Calculate possible income
            wage = gigPay;
            if (gigNumEnabled && gigNum) wage *= gigNum;

            //Calculate mileage pay

            //Calculate tax (if needed)
            if (taxEnabled && tax)
            {
                totalTax = gigPay * (tax/100);
                wage -= totalTax;
            } 

            //Other fees (if needed)
            if (otherFeesEnabled && otherFees) wage -= otherFees;

            //Calculate hours
            if (gigNumEnabled && gigNum) totalHours = (gigNum * gigHours);
            else totalHours = gigHours;
            if (individualPracticeEnabled && individualPractice) totalHours += individualPractice;
            if (rehearsalHoursEnabled && rehearsalHours) totalHours += rehearsalHours;

            //Final division
            finalPay = wage/totalHours;
        }

        //Convert
        setHourlyWage(Intl.NumberFormat('en-US', {style: 'currency', currency: "USD"}).format(finalPay));
    }

    return (
        <div>
            <Header />
            <h2>Calculator</h2>
            <hr />
            <Container className="" style={{textAlign: "left"}}>
            <h3>Basic Information</h3>
            <hr />
            <Form>
                <Form.Group>
                        <Row className="mb-3" xs={1} lg={2}>
                            <Col lg="8">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Calculator Name (required)" onChange={e => setCalcName(e.target.value)}></Form.Control>
                            </Col>
                            <Col lg="4">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date" defaultValue={calcDate} onChange={e => setCalcDate(e.target.value)}></Form.Control>
                            </Col>
                        </Row>
                        <Row className="mb-3" xs={1} lg={3}>
                            <Col>
                                <Form.Label>Pay per gig</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                                    <Form.Control type="number" placeholder="Ex. 100.00 (required)" onChange={e => setGigPay(parseFloat(e.target.value))}></Form.Control>
                                    <TooltipButton text="Payment for gig in dollars."/>
                                </InputGroup>
                            </Col>
                            <Col>
                                <Form.Label>Hours per gig</Form.Label>
                                <InputGroup>
                                    <Form.Control placeholder="Ex. 3 (required)" onChange={e => setGigHours(parseFloat(e.target.value))}></Form.Control>
                                    <TooltipButton text="Number of hours for event. Does not include rehearsal or practice hours."/>
                                </InputGroup>
                            </Col>
                            <Col>
                                <Form.Label>Number of gigs</Form.Label>
                                <InputGroup>
                                    <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setGigNumEnabled(!gigNumEnabled)}} defaultValue={!gigNumEnabled}></Form.Check>
                                    <Form.Control placeholder="Ex. 1" disabled={!gigNumEnabled} onChange={e => setGigNum(parseInt(e.target.value))}></Form.Control>
                                    <TooltipButton text='Number of gigs. Used if you have multiple of the same gig. Will multiply "Pay per gig" and "Hours per gig" for the final result.'/>
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
                                    <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setTotalMileageEnabled(!totalMileageEnabled)}} defaultValue={!totalMileageEnabled}></Form.Check>
                                    <Form.Control placeholder="Ex. 20" disabled={!totalMileageEnabled} onChange={e => setTotalMileage(parseFloat(e.target.value))}></Form.Control>
                                    <Button variant='light'>Calculate based on location</Button>
                                    <TooltipButton text='Total number of miles driven to get to event. Will multiply by "Gas Price per Mile" for final result.'/>
                                    {/* USE BOOTSTRAP MODAL OR OFF CANVAS FOR CALCULATION MENU*/}
                                </InputGroup>
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Mileage Covered</Form.Label>
                                <InputGroup>
                                    <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setMileageCoveredEnabled(!mileageCoveredEnabled)}} defaultValue={!mileageCoveredEnabled}></Form.Check>
                                    <Form.Control placeholder="Ex. 20" disabled={!mileageCoveredEnabled} onChange={e => setMileageCovered(parseFloat(e.target.value))}></Form.Control>
                                    <TooltipButton text="Number of miles that will be covered by organizers. Will subtract from total mileage for final result."/>
                                </InputGroup>
                            </Row>
                        </Col>
                        <Col>
                            <Form.Label>Gas Price per Mile</Form.Label>
                            <InputGroup>    
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control placeholder="Ex. 0.14" disabled={!totalMileageEnabled} onChange={e => setGasPricePerMile(parseFloat(e.target.value))}></Form.Control>
                                <Button variant='light'>Use Average</Button>
                                <TooltipButton text='Price of gas per mile. Calculated using "Gas $/Gallon" and "Vehicle MPG". Click "Calculate Average" to use average values.'/>
                            </InputGroup>
                            <Col md={{offset: 1}}>
                                <Row >
                                    <InputGroup>    
                                        <InputGroup.Text>Gas $/Gallon</InputGroup.Text>
                                        <Form.Control placeholder="Ex. 2.80" disabled={!totalMileageEnabled} onChange={e => setGasPricePerGallon(parseFloat(e.target.value))}></Form.Control>
                                        <TooltipButton text='Amount of money in dollars per gallon of gas. Divided by "Vehicle MPG" to calculate "Gas Price per Mile". Average value calculated based on state.'/>
                                    </InputGroup>
                                </Row>
                                <Row >
                                    <InputGroup>    
                                        <InputGroup.Text>Vehicle MPG</InputGroup.Text>
                                        <Form.Control placeholder="Ex. 20" disabled={!totalMileageEnabled} onChange={e => setVehicleMPG(parseFloat(e.target.value))}></Form.Control>
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
                            <Form.Control placeholder="Ex. 20" disabled={!individualPracticeEnabled} onChange={e => setIndividualPractice(parseFloat(e.target.value))}></Form.Control>
                            <TooltipButton text="The total hours spent practicing for event (individually, not including group rehearsal)."/>
                            </InputGroup>
                        </Col>
                        <Col>
                            <Form.Label>Rehearsal Hours</Form.Label>
                            <InputGroup>
                            <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setRehearsalHoursEnabled(!rehearsalHoursEnabled)}} defaultValue={!rehearsalHoursEnabled}></Form.Check>
                            <Form.Control placeholder="Ex. 20" disabled={!rehearsalHoursEnabled} onChange={e => setRehearsalHours(parseFloat(e.target.value))}></Form.Control>
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
                                <Form.Control placeholder="Ex. 17.5" disabled={!taxEnabled} onChange={e => setTax(parseFloat(e.target.value))}></Form.Control>
                            <TooltipButton text='Percentage of income tax. Taken from initial "Pay per gig" before any other expenses.'/>
                            </InputGroup>
                        </Col>
                        <Col>
                            <Form.Label>Other Fees</Form.Label>
                            <InputGroup>
                                <Form.Check type="switch" style={{marginTop: "5px", paddingLeft: "35px"}} onChange={() => {setOtherFeesEnabled(!otherFeesEnabled)}} defaultValue={!otherFeesEnabled}></Form.Check>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control placeholder="Ex. 20" disabled={!otherFeesEnabled} onChange={e => setOtherFees(parseFloat(e.target.value))}></Form.Control>
                                <TooltipButton text="Any other additional fees. Will be added at the end of the calculation."/>
                            </InputGroup>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
            <br />
            <hr />
            <Row>
                <Col>
                    <h4>Total Hourly Wage: {hourlyWage}</h4>
                </Col>
                <Col>
                    <Container style={{textAlign: "right"}}>
                        <Row xs={2} lg={2}>
                            <Col lg="10"><Button variant="success" style={{paddingLeft: "15px", paddingRight: "15px"}}>Save</Button> {/* CHECK FOR ACCOUNT WHEN LOGIN WORKING */}</Col>
                            <Col lg="1"><Button variant="secondary" style={{paddingLeft: "15px", paddingRight: "15px"}}>Export</Button></Col>
                        </Row>   
                    </Container>
                </Col>
            </Row>
            </Container>
            <br />
            <Footer />
        </div>
    )
}

export default Calculator