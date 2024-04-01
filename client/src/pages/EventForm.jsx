import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import moment from "moment";
import { useCookies } from "react-cookie";
import { ClipLoader } from "react-spinners";
const { REACT_APP_BACKEND_URL } = process.env;

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
    const [userId, setUserId] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [instruments, setInstruments] = useState([])
    const [selectedInstrument, setSelectedInstrument] = useState("")
    const [selectedInstruments, setSelectedInstruments] = useState([])
    const [selectedToRemove, setSelectedToRemove] = useState([])
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    const navigate = useNavigate()
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            //fetch instruments needed for tags
            const res = await fetch(`http://${REACT_APP_BACKEND_URL}/instrument/`);
            const data = await res.json();
            setInstruments(data);

            if (id) { //If the previous page had an id, then it's going to be stored and autofill fields with info
                const res = await fetch(`http://${REACT_APP_BACKEND_URL}/event/id/${id}`);
                const data = await res.json();
                setEvent(data);
                setAddress({
                    street: data.Address.street,
                    city: data.Address.city,
                    zip: data.Address.zip,
                    state: data.Address.state
                })
                setOwnerId(data.Users.length > 0 ? data.Users[0].user_id : null);

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
            } else {
                setOwnerId(null);
            }

            //get user
            if (cookies.jwt) {
                axios.get(`http://${REACT_APP_BACKEND_URL}/account`, { withCredentials: true }).then(res => {
                    if (res.data?.user) {
                        const userData = res.data.user;
                        setUserId(userData);
                        setUserLoggedIn(true);
                    }
                })
                setLoading(false);
            }
        };
        fetchData();
    }, [cookies.jwt]);

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
                const response = await axios.put(`http://${REACT_APP_BACKEND_URL}/event/${id}`, eventData);
                navigate(`../event/${id}`)
            } else {
                //event does not exist, so make a post
                const eventData = { ...event, user_id: userId.user_id, start_time: startDateTime, end_time: endDateTime, instruments: selectedInstruments, address, isListed: isListed };
                const response = await axios.post(`http://${REACT_APP_BACKEND_URL}/event/`, eventData)
                const newEventId = response.data.newEvent.event_id;
                navigate(`../event/${newEventId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteEvent = async e => {
        e.preventDefault()
        try {
            const response = await axios.delete(`http://${REACT_APP_BACKEND_URL}/event/${id}`)
            navigate("/")
        } catch (err) {
            console.log(err)
        }
    }

    const isEventOwner = () => {
        return ownerId && userId && ownerId === userId.user_id
    }

    if (ownerId === null && userId !== null || isEventOwner()) {
        return (
            <div>
                <div className='form'>
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
                    <div style={{ marginBottom: "2em", marginTop: "2em" }}>
                        {id ? (
                            <div className="update-delete">
                                <Button className="formButton" variant="success" onClick={handleEvent} style={{ marginRight: '10px'}}>Update Event</Button>
                                <Button className="formButton" variant="danger" onClick={handleDeleteEvent} style={{ marginLeft: '10px'}}>Delete Event</Button>
                            </div>
                        ) : (
                            <Button>
                                <div className="create-event">
                                    <Button className="formButton" onClick={handleEvent}>List Event</Button>
                                </div>
                            </Button>
                        )}
                    </div>

                </div>
            </div>
        )
    } else {
        if (loading) {
            return <ClipLoader />
        }
        if (userId) {
            return (
                <div>
                    <div className="id-mismatch">
                        <h1>Unauthorized Access</h1>
                        <hr />
                        <Row><h3>Sorry, you don't have access to this form. Are you logged into the correct account?</h3></Row>
                        <Button href="/form" style={{ marginTop: "1rem", justifyItems: "center" }}>Click here to start creating a new event!</Button>
                    </div>
                </div>
            )
        } else if (userId && !userLoggedIn) {
            return (
                <div>
                    <div className="id-mismatch">
                        <h1>Ready to make an event?</h1>
                        <hr />
                        <Button href="/login" style={{ marginTop: "1rem", justifyItems: "center" }}>Click here to login to your account and get started!</Button>
                    </div>
                </div>
            )
        }
    }
}

export default EventForm