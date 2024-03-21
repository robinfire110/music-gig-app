import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Datepicker from "../components/Datepicker"
import Header from "../components/Header";
import { Container, Form, Col, Row, InputGroup, Button, OverlayTrigger, Popover } from "react-bootstrap";
import moment from "moment";
import DateTimePicker from "react-datetime-picker";

const EventForm = () => {
    const [event, setEvent] = useState({
        event_name: "",
        start_time: new Date(),
        end_time: new Date(),
        description: "",
        pay: null,
        event_hours: "",
    })

    const [instruments, setInstruments] = useState([])
    const [selectedInstrument, setSelectedInstrument] = useState("")
    const [selectedInstruments, setSelectedInstruments] = useState([])

    const [address, setAddress] = useState({
        street: "",
        city: "",
        zip: "",
        state: ""
    })

    const navigate = useNavigate()
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            //fetch instruments needed for tags
            const res = await fetch(`http://localhost:5000/instrument/`);
            const data = await res.json();
            setInstruments(data);

            if (id) { //If the previous page had an id, then it's going to be stored and allow us to put to that id
                const res = await fetch(`http://localhost:5000/event/id/${id}`);
                const data = await res.json();
                setEvent(data);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setEvent(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleDateChange = (name, date) => {
        setEvent((prev) => ({ ...prev, [name]: date }))
    }

    //need a separate handler for instrument changes
    const handleAddInstrument = () => {
        if (selectedInstrument) {
            setSelectedInstruments((prev) => [...prev, selectedInstrument]);
        }
    }

    //seperate handler for address changes
    const handleAddressChange = (name, value) => {
        setAddress(prev => ({ ...prev, [name]: value }))
    }

    const handleListing = async e => {
        e.preventDefault()
        try {
            //prepare data with event details and selected instruments
            const eventData = { ...event, instruments: selectedInstruments, address };

            if (id) { //if id already exists, we make a put to that event id
                await axios.put(`http://localhost:5000/event/${id}`, eventData);
                navigate(`/event/${id}`) //automatically throw user to the individual event page for the event
            } else { //if the id doesn't exist, we make a post to a new event id
                console.log(eventData);
                const response = await axios.post(`http://localhost:5000/event/`, eventData)
                const newEventId = response.data.event_id;
                navigate(`/event/${newEventId}`); //automatically throw user to the individual event page for the new event
            };
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Header />
            <div className='form'>
                {/* Add if check here based on the passed ID, if present say Edit, if not say Create */}
                <h1>Edit Event</h1>
                <hr />
                <Container style={{ textAlign: "left" }}>
                    <h3>Event Information</h3>
                    <hr />
                    <Form>
                        <Form.Group>
                            <Row className="mb-3">
                                <Col lg="2"><Form.Label>Event name:</Form.Label></Col>
                                <Col lg="5"><Form.Control type="text" placeholder='Event name' onChange={handleChange} name="event_name"></Form.Control></Col>
                                {/* <input type="text" placeholder='Event name' onChange={handleChange} name="event_name" /> */}
                            </Row>
                            <Row className="mb-3">
                                <Col lg="2"><Form.Label>Description:</Form.Label></Col>
                                <Col lg="5">
                                    <Form.Control type="text" placeholder='Event Description' onChange={handleChange} name="description"></Form.Control>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col lg="2"><Form.Label>Address:</Form.Label></Col>
                                {/* Address Fields */}
                                <Col lg="5">
                                    <Row>
                                        <Form.Control type="text" placeholder='Street' onChange={(e) => handleAddressChange("street", e.target.value)} value={address.street} />
                                    </Row>
                                    <Row>
                                        <Form.Control type="text" placeholder='City' onChange={(e) => handleAddressChange("city", e.target.value)} value={address.city} />
                                    </Row>
                                    <Row>
                                        <Form.Control type="text" placeholder='State' onChange={(e) => handleAddressChange("state", e.target.value)} value={address.state} />
                                    </Row>
                                    <Row>
                                        <Form.Control type="text" placeholder='Zip Code' onChange={(e) => handleAddressChange("zip", e.target.value)} value={address.zip} />
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col lg="2"><Form.Label>Date:</Form.Label></Col>
                                <Col lg="2">
                                    <Form.Control type="date" defaultValue={moment().format("YYYY-MM-DD")}></Form.Control>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col lg="2">
                                    <Form.Label>Time:</Form.Label>
                                </Col>
                                <Col lg="10">
                                    <Col lg="2">
                                        <Form.Control type="time" defaultValue={moment().format("YYYY-MM-DD")}></Form.Control>
                                    </Col>
                                    <Col lg="2">
                                        <Form.Control type="time" defaultValue={moment().format("YYYY-MM-DD")}></Form.Control>
                                    </Col>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col lg="1"><Form.Label>Pay:</Form.Label></Col>
                                <Col lg="2">
                                    <Form.Control type="number" placeholder='Event Pay' onChange={handleChange} name="pay"></Form.Control>
                                </Col>
                                <Col lg="1"><Form.Label>Rehearse Hours:</Form.Label></Col>
                                <Col lg="2">
                                    <Form.Control type="number" placeholder='Rehearsal Hours' onChange={handleChange} name="rehearse_hours"></Form.Control>
                                </Col>
                                <Col lg="1"><Form.Label>Mileage Pay:</Form.Label></Col>
                                <Col lg="2">
                                    <Form.Control type="number" placeholder='Pay Per Mile' onChange={handleChange} name="mileage_pay"></Form.Control>
                                </Col>
                            </Row>
                            <Row className="mb-3">

                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col lg="1"><Form.Label>Instruments:</Form.Label></Col>
                                <Col lg="2">
                                    <Form.Select onChange={(e) => setSelectedInstrument(e.target.value)} name="Instrument">
                                        <option value="" disabled selected>Select</option>
                                        {instruments.map((instrument) => (
                                            <option key={instrument.instrument_id} value={instrument.name}>
                                                {instrument.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col sm="2">
                                    <Button onClick={handleAddInstrument}>Add Instrument</Button>
                                </Col>
                                <Col sm="2">
                                    <div>
                                        Selected Instruments:
                                    </div>
                                </Col>
                                <Col sm="5">
                                    <div>
                                        {selectedInstruments.map((instrument, index) => (
                                            <span key={index} className="key-item">{instrument}</span>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Container>
                {/* Add if else logic: If event=true (Event is being updated), update event, else (this is a new event) list event */}
                <Button className="formButton" onClick={handleListing}>
                    {id ? "Update Event" : "List Event"}
                </Button>

                {/* Set is listed to true */}
            </div>
        </div>
    )

}

export default EventForm