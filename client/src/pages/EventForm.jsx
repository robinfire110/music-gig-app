import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import moment from "moment";
import { useCookies } from "react-cookie";

const EventForm = () => {
    const [event, setEvent] = useState({
        event_name: "",
        start_time: new Date(),
        end_time: new Date(),
        description: "",
        pay: null,
        event_hours: "",
    })

    const [address, setAddress] = useState({
        street: "",
        city: "",
        zip: "",
        state: ""
    })

    const [cookies, removeCookie] = useCookies([]);
    const [userId, setUserId] = useState(null); //NOTE: REPLACE WITH PROPER ACCOUNT ID WHEN IMPLEMENTED
    const [instruments, setInstruments] = useState([])
    const [selectedInstrument, setSelectedInstrument] = useState("")
    const [selectedInstruments, setSelectedInstruments] = useState([])
    const [selectedToRemove, setSelectedToRemove] = useState([])
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const navigate = useNavigate()
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            //fetch instruments needed for tags
            const res = await fetch(`http://localhost:5000/instrument/`);
            const data = await res.json();
            setInstruments(data);

            //get user
            if (cookies.jwt) {
                axios.get('http://localhost:5000/account', { withCredentials: true }).then(res => {
                    if (res.data?.user) {
                        const userData = res.data.user;
                        setUserId(userData);
                    }
                })
            }

            if (id) { //If the previous page had an id, then it's going to be stored and autofill fields with info
                const res = await fetch(`http://localhost:5000/event/id/${id}`);
                const data = await res.json();
                setEvent(data);
                setAddress({
                    street: data.Address.street,
                    city: data.Address.city,
                    zip: data.Address.zip,
                    state: data.Address.state
                })

                //autofill data selectedInstruments from id
                const selectedInstrumentsData = data.Instruments.map(instrument => instrument.name);
                setSelectedInstruments(selectedInstrumentsData);

                //autofill data start and end times from id
                const startTime = moment(data.start_time).local().format("HH:mm");
                const endTime = moment(data.end_time).local().format("HH:mm");

                setStartTime(startTime);
                setEndTime(endTime);

                //autofill data of start and end date
                const startDate = moment(data.start_time).format("YYYY-MM-DD");
                const endDate = moment(data.end_time).format("YYYY-MM-DD");

                setStartDate(startDate);
                setEndDate(endDate);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setEvent(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleDateChange = (name, value) => {
        if (name === 'start_date') {
            setStartDate(value);
        } else if (name === 'end_date') {
            setEndDate(value);
        }
    }

    //need to put together date and time from selections into format transferrable to the database
    const formatDateTime = (startDate, startTime, endDate, endTime) => {

        //combine date and time into a single string for each start and end time
        const startDateTimeString = `${startDate} ${startTime}`;
        const endDateTimeString = `${endDate} ${endTime}`;

        //format the combined string as a DATETIME object
        const formattedStartDateTime = moment(startDateTimeString, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
        const formattedEndDateTime = moment(endDateTimeString, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');

        return { start: formattedStartDateTime, end: formattedEndDateTime };
    }

    //need a separate handler for instrument changes
    const handleAddInstrument = () => {
        if (selectedInstrument) {
            setSelectedInstruments((prev) => [...prev, selectedInstrument]);
        }
    }

    const handleToggleCheckbox = (isChecked, instrument) => {
        if (isChecked) { //if the box is checked by the user, add that item
            setSelectedToRemove(prev => [...prev, instrument]);
        } else { //if the user UNCHECKS a checked box, remove that item
            setSelectedToRemove(prev => prev.filter(item => item !== instrument));
        }
    }

    const handleRemoveInstrument = () => {
        setSelectedInstruments(prev => prev.filter(instrument => !selectedToRemove.includes(instrument)));
        //clear the selectedToRemove array
        setSelectedToRemove([]);
    }

    //seperate handler for address changes
    const handleAddressChange = (name, value) => {
        setAddress(prev => ({ ...prev, [name]: value }))
    }

    const handleEvent = async e => {
        e.preventDefault()
        try {
            const isListed = 1
            const { start: startDateTime, end: endDateTime } = formatDateTime(startDate, startTime, endDate, endTime);

            //prepare data to be sent to database with event details
            const eventData = { ...event, start_time: startDateTime, end_time: endDateTime, instruments: selectedInstruments, address, isListed: isListed };

            //if an id is present, that means the event already exists and we need to put
            if (id) {
                const response = await axios.put(`http://localhost:5000/event/${id}`, eventData);
                navigate(`../event/${id}`)
            } else {
                //event does not exist, so make a post
                const eventData = { ...event, user_id: userId.user_id, start_time: startDateTime, end_time: endDateTime, instruments: selectedInstruments, address, isListed: isListed };
                const response = await axios.post(`http://localhost:5000/event/`, eventData)
                const newEventId = response.data.newEvent.event_id;
                navigate(`../event/${newEventId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    
    return (
        <div>
            <div className='form'>
                {/* Add if check here based on the passed ID, if present say Edit, if not say Create */}
                <h1>{id ? "Edit Event" : "Create Event"}</h1>
                <hr />
                <Container style={{ textAlign: "left" }}>
                    <h3>Event Information</h3>
                    <hr />
                    <Form>
                        <Form.Group>
                            <Row className="mb-3">
                                <Col lg="2"><Form.Label>Event name:</Form.Label></Col>
                                <Col lg="9"><Form.Control type="text" placeholder='Event name' value={event.event_name} onChange={handleChange} name="event_name"></Form.Control></Col>
                            </Row>
                            <Row className="mb-3">
                                <Col lg="2"><Form.Label>Description:</Form.Label></Col>
                                <Col lg="9">
                                    <Form.Control type="text" placeholder='Event Description' value={event.description} onChange={handleChange} name="description"></Form.Control>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col lg="2">
                                    <Form.Label>
                                        Address:
                                    </Form.Label>
                                </Col>
                                {/* Address Fields */}
                                <Col lg="6">
                                    <Row className="mb-3 align-items-center">
                                        <Col lg="2"><Form.Label>Street: </Form.Label></Col>
                                        <Col lg="5"><Form.Control type="text" placeholder='Street' value={address.street} onChange={(e) => handleAddressChange("street", e.target.value)} /></Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col lg="2"><Form.Label>City: </Form.Label></Col>
                                        <Col lg="5"><Form.Control type="text" placeholder='City' value={address.city} onChange={(e) => handleAddressChange("city", e.target.value)} /></Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col lg="2"><Form.Label>State: </Form.Label></Col>
                                        <Col lg="5"><Form.Control type="text" placeholder='State' value={address.state} onChange={(e) => handleAddressChange("state", e.target.value)} /></Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col lg="2"><Form.Label>Zip Code: </Form.Label></Col>
                                        <Col lg="5"><Form.Control type="text" placeholder='Zip Code' value={address.zip} onChange={(e) => handleAddressChange("zip", e.target.value)} /></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col lg="12">
                                    <h3>Event Schedule</h3>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3 align-items-center">
                            </Row>
                            <Row className="mb-3">
                                <Col lg="10">
                                    <Row className="mb-3 align-items-center">
                                        <Col lg="2" sm="4"><Form.Label>Start Time:</Form.Label></Col>
                                        <Col lg="2" sm="4">
                                            <Form.Control type="date" value={moment(startDate).format("YYYY-MM-DD")} onChange={(e) => handleDateChange('start_date', e.target.value)}></Form.Control>
                                        </Col>
                                        <Col lg="2" sm="4">
                                            <Form.Control type="time" defaultValue={startTime} onChange={(e) => setStartTime(e.target.value)}></Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Col lg="2" sm="4"><Form.Label>End Time:</Form.Label></Col>
                                        <Col lg="2" sm="4">
                                            <Form.Control type="date" value={moment(endDate).format("YYYY-MM-DD")} onChange={(e) => handleDateChange('end_date', e.target.value)}></Form.Control>
                                        </Col>
                                        <Col lg="2" sm="4">
                                            <Form.Control type="time" defaultValue={endTime} onChange={(e) => setEndTime(e.target.value)}></Form.Control>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col lg="12">
                                    <h3>Event Finance</h3>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3 align-items-center">
                                <Col lg="1" sm="2"><Form.Label>Pay:</Form.Label></Col>
                                <Col lg="2" sm="4">
                                    <Form.Control type="number" placeholder='Event Pay' value={event.pay} onChange={handleChange} name="pay"></Form.Control>
                                </Col>
                                <Col lg="1" sm="2"><Form.Label>Rehearse Hours:</Form.Label></Col>
                                <Col lg="2" sm="4">
                                    <Form.Control type="number" placeholder='Rehearsal Hours' value={event.rehearse_hours} onChange={handleChange} name="rehearse_hours"></Form.Control>
                                </Col>
                                <Col lg="1" sm="2"><Form.Label>Mileage Pay:</Form.Label></Col>
                                <Col lg="2" sm="4">
                                    <Form.Control type="number" placeholder='Pay Per Mile' value={event.mileage_pay} onChange={handleChange} name="mileage_pay"></Form.Control>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col lg="12">
                                    <h3>Instrument Select</h3>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col lg="1" sm="2"><Form.Label>Instruments:</Form.Label></Col>
                                <Col lg="3" sm="4">
                                    <Form.Select onChange={(e) => setSelectedInstrument(e.target.value)} name="instrument">
                                        <option value="" disabled selected>Select</option>
                                        {instruments.map((instrument) => (
                                            <option key={instrument.instrument_id} value={instrument.name}>
                                                {instrument.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col lg="2" sm="3">
                                    <Button onClick={handleAddInstrument}>Add Instrument</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="2">
                                    <div>
                                        Selected Instruments:
                                    </div>
                                </Col>
                                <Col lg="2" sm="2">
                                    <div>
                                        {selectedInstruments.map((instrument, index) => (
                                            <div key={index}>
                                                <input type="checkbox" style={{ marginRight: "1em" }} checked={selectedToRemove.includes(instrument)} onChange={(e) => handleToggleCheckbox(e.target.checked, instrument)} />
                                                <span key={index}>{instrument}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                                <Col lg="2" sm="6">
                                    <Button onClick={handleRemoveInstrument}>Remove Instruments</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Container>
                {/* Add if else logic: If event=true (Event is being updated), update event, else (this is a new event) list event */}
                <Button className="formButton" onClick={handleEvent} style={{ marginBottom: "2em", marginTop: "2em" }}>
                    {id ? "Update Event" : "List Event"}
                </Button>
            </div>
        </div>
    )

}

export default EventForm