import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Datepicker from "../components/Datepicker";
import { Container, Form, Col, Row } from "react-bootstrap";
import moment from "moment";

const Calculator = () => {
    //States
    const [gigNumEnabled, setGigNumEnabled] = useState(false);
    const [totalMileageEnabled, setTotalMileageEnabled] = useState(false);
    const [mileageCoveredEnabled, setMileageCoveredEnabled] = useState(false);
    const [individualPracticeEnabled, setIndividualPracticeEnabled] = useState(false);
    const [rehearsalHoursEnabled, setRehearsalHoursEnabled] = useState(false);
    const [taxEnabled, setTaxEnabled] = useState(false);
    const [otherEnabled, setOtherEnabled] = useState(false);

    return (
        <div>
            <Header />
            <h2>Calculator</h2>
            <hr />
            <Container style={{textAlign: "left"}}>
            <h3>Basic Information</h3>
            <Form.Group>
                    <Row>
                        <Col>
                            <Form.Label>Name</Form.Label>
                            <Form.Control placeholder="Calculator Name (required)"></Form.Control>
                        </Col>
                        <Col lg="3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" defaultValue={moment().format("YYYY-MM-DD")}></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label>Pay per gig ($)</Form.Label>
                            <Form.Control placeholder="Ex. 100.00 (required)"></Form.Control>
                        </Col>
                        <Col>
                            <Form.Label>Hours per gig</Form.Label>
                            <Form.Control placeholder="Ex. 3 (required)"></Form.Control>
                        </Col>
                        <Col>
                            <Row>
                            <Form.Label>Number of gigs</Form.Label>
                            <Col lg="1" xs="3"><Form.Check type="switch" style={{marginTop: "5px"}} onClick={console.log("yes")}></Form.Check></Col>
                            <Col><Form.Control placeholder="Ex. 1"></Form.Control></Col>
                            </Row>
                        </Col>
                    </Row>
                
            </Form.Group>
            </Container>
            <Footer />
        </div>
    )
}

export default Calculator