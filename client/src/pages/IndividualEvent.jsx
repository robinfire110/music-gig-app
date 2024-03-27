import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Col, Row, Button } from "react-bootstrap"; // Bootstrap imports
import { useCookies } from "react-cookie";
import "../styles/IndividualEvent.css";

const IndividualEvent = () => {
    const [event, setEvent] = useState({
        event_name: "",
        date_posted: "",
        start_time: "",
        end_time: "",
        description: "",
        pay: null,
        event_hours: "",
        Users: []
    })

    const [cookies, removeCookie] = useCookies([]);
    const [userId, setUserId] = useState(null) //Current user's id set here
    const [ownerId, setOwnerId] = useState(null) //get the owner's id here
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        //get user
        const fetchUserData = async () => {
            if (cookies.jwt) {
                try {
                    axios.get('http://localhost:5000/account', { withCredentials: true }).then(res => {
                        if (res.data?.user) {
                            const userData = res.data.user;
                            setUserId(userData);
                        }
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }


        const fetchEvent = async () => {
            try {
                //fetch the id from host running server, this will be changed in hosted version
                const res = await fetch(`http://localhost:5000/event/id/${id}`)
                const data = await res.json();
                setEvent(data)
                setOwnerId(data.Users.length > 0 ? data.Users[0].user_id : null);
            } catch (err) {
                console.log(err)
            }
        }
        fetchUserData();
        fetchEvent();
    }, [id])

    const isEventOwner = () => {
        return ownerId && userId && ownerId === userId.user_id
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/event/${id}`);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        const timeZoneSet = {
            hour: 'numeric',
            minute: '2-digit',
        }
        return time.toLocaleTimeString([], timeZoneSet);
    }

    return (
        <div>
            <hr />
            <Container className="name-date-summary" key={event.id}>
                <Row>
                    <Col style={{ display: 'flex', justifyContent: 'left' }}>
                        <div className="key-item" style={{ fontSize: "30px" }}> {event.event_name} - {formatDate(event.start_time)}</div>
                    </Col>
                    {/* Add logic here to check user's login status and compare id, if matched display update button, if not display send to calculator button */}
                    <Col style={{ display: 'flex', justifyContent: 'right', gap: '20px' }}>
                        {/* Check if current user is event owner */}
                        {isEventOwner() ? (
                            <Link to={`/form/${id}`} style={{ color: "#fff" }}>
                                <Button className="editEvent">Edit Event</Button>
                            </Link>
                        ) : (
                            <Link to={`/calculator/${event.event_id}?event=true`} style={{ color: "#fff" }}>
                                <Button className="sendToCalc">Send to Calculator</Button>
                            </Link>
                        )}
                    </Col>
                </Row>
            </Container>
            <Container className="event-holder">
                <Container className="individual-event-left" key={event.id} style={{ textAlign: "left" }}>
                    <Row className="mb-3" xs={1} lg={2}>
                        <Col lg="2">
                            <h5>Posted By: </h5>
                        </Col>
                        <Col lg="8">
                            {event.Users && event.Users.length > 0 && (
                                <div className="key-item"> {event.Users && <Link to={`/profile/${event.Users[0].user_id}`} style={{ color: "#000" }}>{event.Users[0].f_name} {event.Users[0].l_name}</Link>}</div>
                            )}
                        </Col>
                    </Row>
                    <Row className="mb-3" xs={1} lg={2}>
                        <Col lg="2">
                            <h5>Contact:</h5>
                        </Col>
                        <Col lg="8">
                            {event.Users && event.Users.length > 0 && (
                                <div className="key-item"> {event.Users[0].email} </div>
                            )}
                        </Col>
                    </Row>
                    <hr />
                    <h3>Event Information</h3>
                    <hr />
                    <Row className="mb-3" xs={1} lg={2}>
                        <Col lg="3">
                            <h5>Date: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {formatDate(event.start_time)}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Time: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {formatTime(event.start_time)} - {formatTime(event.end_time)}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Location: </h5>
                        </Col>
                        <Col lg="8">
                            {event.Address && (
                                <div className="key-item"> {event.Address.street} <br /> {event.Address.city} <br /> {event.Address.state} {event.Address.zip}</div>
                            )}
                        </Col>
                        <Col lg="3">
                            <h5>Pay: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> ${event.pay}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Rehearsal Hours: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {event.rehearse_hours}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Event Hours: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {event.event_hours}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Total Hours: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {event.event_hours + event.rehearse_hours}</div>
                        </Col>
                    </Row>
                </Container>
                <Container className="individual-event-right" key={event.id}>
                    <Row className="mb-3" xs={1} lg={1}>
                        <Col>
                            <div className="key-item"> {event.event_name}</div>
                        </Col>
                        <Col>
                            <div className="key-item"> {event.description}</div>
                        </Col>
                    </Row>
                    <h4>Musicians Needed:</h4>
                    <hr />
                    <Row className="mb-3" xs={1} lg={1}>
                        <Col>
                            {event.Instruments && event.Instruments.map((instrument, index) => (
                                <div key={index}><div className="key-item"> {instrument.name}</div></div>
                            ))}
                        </Col>
                    </Row>
                </Container>
            </Container>

            {/* NEW <Container> to hold applications from musician users if the user's id matches the event owner's id 
                OR just make it a big apply button if they're not the owner (they're a musician looking to apply)
            */}
            <Container className="application-container">

            </Container>
        </div>
    )
}

export default IndividualEvent