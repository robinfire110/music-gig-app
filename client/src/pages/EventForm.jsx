import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Datepicker from "../components/Datepicker"
import Header from "../components/Header";
import { Container, Form, Col, Row, InputGroup, Button, OverlayTrigger, Popover } from "react-bootstrap";

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
    const handleInstrumentChange = (selectedInstrument) => {
        setSelectedInstruments((prev) => [...prev, selectedInstrument]);
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
                <h1>Update Event</h1>
                <hr />
                <Container style={{ textAlign: "left" }}>
                    <h3>Event Information</h3>
                    <hr />
                    <Form>
                        <Form.Group>
                            <Row className="mb-3">
                                <Col lg="2"><Form.Label>Event name: </Form.Label></Col>
                                <Col lg="6"><Form.Control type="text" placeholder='Event name' onChange={handleChange} name="event_name"></Form.Control></Col>
                                {/* <input type="text" placeholder='Event name' onChange={handleChange} name="event_name" /> */}
                            </Row>
                            <Row className="mb-3">
                                {/* Address Fields */}
                                <input type="text" placeholder='Street' onChange={(e) => handleAddressChange("street", e.target.value)} value={address.street} />
                                <input type="text" placeholder='City' onChange={(e) => handleAddressChange("city", e.target.value)} value={address.city} />
                                <input type="text" placeholder='State' onChange={(e) => handleAddressChange("state", e.target.value)} value={address.state} />
                                <input type="text" placeholder='Zip Code' onChange={(e) => handleAddressChange("zip", e.target.value)} value={address.zip} />
                            </Row>


                            {/* Date Fields */}
                            <Datepicker value={event.start_time} onChange={handleDateChange} name="start_time" />
                            <Datepicker value={event.end_time} onChange={handleDateChange} name="end_time" />



                            <input type="text" placeholder='Description' onChange={handleChange} name="description" />
                        </Form.Group>
                    </Form>

                    {/* Pay Fields */}
                    <input type="number" placeholder='Pay' onChange={handleChange} name="pay" />
                    <input type="number" placeholder="Rehearse Hours" onChange={handleChange} name="rehearse_hours" />
                    <input type="number" placeholder="Mileage Pay" onChange={handleChange} name="mileage_pay" />

                    {/* Instrument Fields */}
                    <select onChange={(e) => handleInstrumentChange(e.target.value)}>
                        <option value="" disabled>
                            Select Instrument
                        </option>
                        {instruments.map((instrument) => (
                            <option key={instrument.instrument_id} value={instrument.name}>
                                {instrument.name}
                            </option>
                        ))}
                    </select>
                    <div>
                        Selected Instruments: {selectedInstruments.map((instrument) => instrument).join(", ")}
                    </div>
                </Container>
                <button className="formButton" onClick={handleListing}>
                    {id ? "Update Event" : "List Event"}
                </button>

                {/* Set is listed to true */}
            </div>
        </div>
    )

}

export default EventForm