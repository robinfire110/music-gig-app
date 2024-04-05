import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Form, Col, Row, Button, InputGroup } from "react-bootstrap";
import moment from "moment";
import { useCookies } from "react-cookie";
import { ClipLoader } from "react-spinners";
import { maxDescriptionLength, maxEventNameLength, parseFloatZero, statesList, getBackendURL} from "../Utils";
import FormNumber from "../components/FormNumber";
import Select from 'react-select';
import { toast } from "react-toastify";

const EventForm = () => {
    const [event, setEvent] = useState({
        event_name: "",
        start_time: new moment().format("YYYY-MM-DD"),
        end_time: new moment().format("YYYY-MM-DD"),
        description: "",
        pay: null,
        event_hours: "",
        is_listed: null
    })

    const [address, setAddress] = useState({
        street: "",
        city: "",
        zip: "",
        state: "AL"
    })

    const [cookies, removeCookie] = useCookies([]);
    const [userId, setUserId] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [instruments, setInstruments] = useState([])
    const [selectedInstruments, setSelectedInstruments] = useState([])
    const [startTime, setStartTime] = useState("12:00");
    const [endTime, setEndTime] = useState("14:00");
    const [totalEventHours, setTotalEventHours] = useState(0);
    const [startDate, setStartDate] = useState(new moment().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(new moment().format("YYYY-MM-DD"));
    const [loading, setLoading] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [descriptionLength, setDescriptionLength] = useState(maxDescriptionLength);

    const navigate = useNavigate()
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            //fetch instruments needed for tags
            axios.get(`${getBackendURL()}/instrument/`).then(async (res) => {
                const data = res.data;

                //Create instruments
                setInstruments(configureInstrumentList(data));

                if (id) { //If the previous page had an id, then it's going to be stored and autofill fields with info
                    axios.get(`${getBackendURL()}/event/id/${id}`).then((res) => {
                        const data = res.data;
                        setEvent(data);
                        setAddress({
                            street: data.Address.street,
                            city: data.Address.city,
                            zip: data.Address.zip,
                            state: data.Address.state
                        })
                        setOwnerId(data.Users.length > 0 ? data.Users[0].user_id : null);

                        //autofill data selectedInstruments from id
                        setSelectedInstruments(configureInstrumentList(data.Instruments));

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
                        });
                } else {
                    setOwnerId(null);
                }
            });

            //get user
            if (cookies.jwt) {
                axios.get(`${getBackendURL()}/account`, { withCredentials: true }).then(res => {
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

    //Update total event hours
    useEffect(() => {
        const eventHours = moment(`${endDate} ${endTime}`).diff(moment(`${startDate} ${startTime}`), "hours");
        const rehearsalHours = parseFloatZero(event.rehearse_hours);
        setTotalEventHours(eventHours+rehearsalHours);
    }, [startDate, startTime, endDate, endTime, event.rehearse_hours])

    //Update description length
    /*useEffect(() => {
        const descriptionBox = document.getElementById("eventDescription");
        setDescriptionLength(maxDescriptionLength-descriptionBox.value.length);
    }, [event.description]); */
    
    //Handle most changes
    const handleChange = (e) => {
        console.log(e.target.name);
        setEvent(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    //Hand date change
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

    //Configure instrument list (to work with special select)
    const configureInstrumentList = (data) => {
        const instrumentOptionList = []
        data.forEach(instrument => {
            instrumentOptionList.push({value: instrument.name, label: instrument.name});
        });
        return instrumentOptionList
    }

    //seperate handler for address changes
    const handleAddressChange = (name, value) => {
        setAddress(prev => ({ ...prev, [name]: value }))
    }

    const handleEvent = async e => {
        e.preventDefault()
        try {
            //Check validity (will return false if not valid, HTML will take care of the rest).
            const inputs = document.getElementById("eventForm").elements;
            for (let i = 0; i < inputs.length; i++) {
                if (!inputs[i].disabled && !inputs[i].checkValidity())
                {
                    inputs[i].reportValidity();
                    console.log("NOT VALID");
                    return false
                } 
            }

            const isListed = 1
            const { start: startDateTime, end: endDateTime } = formatDateTime(startDate, startTime, endDate, endTime);

            //Prepare instrument data
            const instrumentsList = [];
            selectedInstruments.forEach(instrument => {
                instrumentsList.push(instrument.value);
            });

            //prepare data to be sent to database with event details
            const eventData = { ...event, start_time: startDateTime, end_time: endDateTime, instruments: instrumentsList, address, is_listed: isListed };

            //if an id is present, that means the event already exists and we need to put
            if (id) {
                const response = await axios.put(`${getBackendURL()}/event/${id}`, eventData);
                navigate(`../event/${id}`)
                toast("Event Updated", {position: "top-center", type: "success", theme: "dark", autoClose: 1500});
            } else {
                //event does not exist, so make a post
                const eventData = { ...event, user_id: userId.user_id, start_time: startDateTime, end_time: endDateTime, instruments: selectedInstruments, address, is_listed: isListed };
                const response = await axios.post(`${getBackendURL()}/event/`, eventData)
                const newEventId = response.data.newEvent.event_id;
                navigate(`../event/${newEventId}`);
                toast("Event Created", {position: "top-center", type: "success", theme: "dark", autoClose: 1500});
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleUnlistEvent = async e => {
        e.preventDefault()
        try {
            const listingUpdate = { is_listed: 0 }
            const response = await axios.put(`${getBackendURL()}/event/${id}`, listingUpdate)
            navigate(`../event/${id}`)
            toast("Event Unlisted", {position: "top-center", type: "success", theme: "dark", autoClose: 1500});
        } catch (err) {
            console.log(err)
        }
    }

    const handleRelistEvent = async e => {
        e.preventDefault()
        try {
            const listingUpdate = { is_listed: 1 }
            const response = await axios.put(`${getBackendURL()}/event/${id}`, listingUpdate)
            navigate(`../event/${id}`)
            toast("Event Relisted", {position: "top-center", type: "success", theme: "dark", autoClose: 1500});
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
                    <h1>{id ? "Edit Event" : "List Event"}</h1>
                    <hr />
                    <Container style={{ textAlign: "left" }}>
                        <h3>Event Information</h3>
                        <hr />
                        <Form id="eventForm">
                            <Form.Group>
                                <Row>
                                <Col lg={8}>
                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Label>Event name<span style={{color: "red"}}>*</span></Form.Label>
                                            <Form.Control maxLength={maxEventNameLength} type="text" placeholder='Event name' value={event.event_name} onChange={handleChange} name="event_name" required={true}></Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Label>Instruments</Form.Label>
                                        <Select options={instruments} isMulti required={true} onChange={(selectedOptions) => setSelectedInstruments(selectedOptions)} value={selectedInstruments} required={false}></Select>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Label style={{width: '100%'}}>
                                                <Row>
                                                    <Col lg={10}>Description</Col>
                                                    <Col className="text-end">{descriptionLength}/{maxDescriptionLength}</Col>
                                                </Row>
                                                
                                            </Form.Label>
                                            <Form.Control as="textarea" id="eventDescription" rows={7} maxLength={maxDescriptionLength} type="text" placeholder='Event Description (750 character max)' value={event.description} onChange={handleChange} name="description"></Form.Control>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className="mb-3">
                                        <Form.Label>Start Time<span style={{color: "red"}}>*</span></Form.Label>
                                        <Col>
                                            <Form.Control type="date" value={moment(startDate).format("YYYY-MM-DD")} onChange={(e) => handleDateChange('start_date', e.target.value)} required={true}></Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control type="time" defaultValue={startTime} onChange={(e) => setStartTime(e.target.value)} required={true}></Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 align-items-center">
                                        <Form.Label>End Time<span style={{color: "red"}}>*</span></Form.Label>
                                        <Col>
                                            <Form.Control type="date" value={moment(endDate).format("YYYY-MM-DD")} onChange={(e) => handleDateChange('end_date', e.target.value)} required={true}></Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control type="time" min={startTime} defaultValue={endTime} onChange={(e) => setEndTime(e.target.value)} required={true}></Form.Control>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Rehearsal Hours</Form.Label>
                                            <FormNumber maxValue={100} integer={false} placeholder='Ex. 3' value={event.rehearse_hours} onChange={(e) => {handleChange(e)}} name="rehearse_hours" />
                                        </Col>
                                        <Col>
                                            <Form.Label>Total Event Hours</Form.Label>
                                            <Form.Control type="number" placeholder='0' value={totalEventHours} name="event_hours" disabled={true}></Form.Control>
                                        </Col>
                                    </Row>
                                </Col>
                                </Row>

                                <hr />
                                <Row className="mb-3">
                                    {/* Address Fields */}
                                    <Col lg={8}>
                                        <h3>Location</h3>
                                        <Row className="my-3">
                                            <Row className="mb-3">
                                                <Col lg={9}>
                                                    <Form.Label>Street<span style={{color: "red"}}>*</span></Form.Label>
                                                    <Form.Control type="text" placeholder='Ex. 1234 Road St.' value={address.street} onChange={(e) => handleAddressChange("street", e.target.value)} required={true}/>
                                                </Col>
                                                <Col>
                                                    <Form.Label>State<span style={{color: "red"}}>*</span></Form.Label>
                                                    <Form.Select required={true} value={address.state} onChange={(e) => handleAddressChange("state", e.target.value)}>
                                                        {statesList.map((state) => {return(<option value={state} key={state}>{state}</option>)})}
                                                    </Form.Select>
                                                </Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col lg={9}>
                                                    <Form.Label>City<span style={{color: "red"}}>*</span></Form.Label>
                                                    <Form.Control type="text" placeholder='Ex. Boston' value={address.city} onChange={(e) => handleAddressChange("city", e.target.value)} required={true}/>
                                                </Col>
                                                
                                                <Col>
                                                    <Form.Label>Zip Code<span style={{color: "red"}}>*</span></Form.Label>
                                                    <FormNumber placeholder='Ex. 27413' value={address.zip} onChange={(e) => {handleAddressChange("zip", e.target.value); e.target.setCustomValidity("")}} max={5} min={5} required={true} customValidity={"Zip codes must be 5 characters (#####)."}/>
                                                </Col>
                                            </Row>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <h3>Event Finance</h3>
                                        <Row className="my-3">
                                            <Form.Label>Pay<span style={{color: "red"}}>*</span></Form.Label>
                                            <Col>
                                                <InputGroup>
                                                    <InputGroup.Text>$</InputGroup.Text>
                                                    <FormNumber maxValue={9999.99} value={event.pay} placeholder="Ex. $150.00" required={true} integer={false} onChange={handleChange} name="pay"/>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Mileage Pay</Form.Label>
                                            <Col>
                                                <InputGroup>
                                                    <InputGroup.Text>$</InputGroup.Text>
                                                    <FormNumber maxValue={1.00} placeholder='Ex. $0.17' value={event.mileage_pay} integer={false} onChange={handleChange} name="mileage_pay" />
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <hr />

                            </Form.Group>
                            {/* Add if else logic: If event=true (Event is being updated), update event, else (this is a new event) list event */}
                            <div style={{ marginBottom: "2em", marginTop: "2em" , textAlign: "center"}}>
                                {id ? (
                                    <div className="update-unlist">
                                        <Button type="submit" className="formButton" variant="success" onClick={handleEvent} style={{ marginRight: '10px'}}>Update Event</Button>
                                        {event.is_listed ? (
                                            <Button type="submit" className="formButton" variant="danger" onClick={handleUnlistEvent} style={{ marginLeft: '10px'}}>Unlist Event</Button>
                                        ) : (
                                            <Button type="submit" classname="formButton" variant="primary" onClick={handleRelistEvent} style={{marginLeft: '10px'}}>Relist Event</Button>
                                        )}
                                        
                                    </div>
                                ) : (
                                    <Button>
                                        <div className="create-event">
                                            <Button type="submit" className="formButton" onClick={handleEvent}>List Event</Button>
                                        </div>
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </Container>
                    

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