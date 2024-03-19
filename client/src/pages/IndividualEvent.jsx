import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Col, Row, InputGroup, Button } from "react-bootstrap"; // Bootstrap imports
import Header from "../components/Header";
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
    })

    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                //fetch the id from host running server, this will be changed in hosted version
                const res = await fetch(`http://localhost:5000/event/id/${id}`)
                const data = await res.json();
                setEvent(data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchEvent()
    }, [id])

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
        return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    return (
        <div>
            <Header />
            <hr />
            <Container className="event-holder">
                <Container className="individual-event-left" key={event.id} style={{ textAlign: "left" }}>
                    <Form>
                        <Form.Group>
                            <Row className="mb-3" xs={1} lg={2}>
                                <Col lg="3">
                                    <h5>Posted By: </h5>
                                </Col>
                                <Col lg="8">
                                    {event.Users && event.Users.length > 0 && (
                                        <div className="key-item"> {event.Users[0].f_name} {event.Users[0].l_name}</div>
                                    )}
                                </Col>
                            </Row>
                            <Row className="mb-3" xs={1} lg={2}>
                                <Col lg="3">
                                    <h5>Contact:</h5>
                                </Col>
                                <Col lg="8">
                                    {event.Users && event.Users.length > 0 && (
                                        <div className="key-item"> {event.Users[0].email} </div>
                                    )}
                                </Col>
                            </Row>
                        </Form.Group>
                        <hr />
                        <h3>Event Information</h3>
                        <hr />
                        <Form.Group>
                            <Row className="mb-3" xs={1} lg={2}>
                                <Col lg="3">
                                    <h5>Date: </h5>
                                </Col>
                                <Col lg="8">
                                    <div className="key-item"> {formatDate(event.start_time)}</div>
                                </Col>
                                <Col lg="4">
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
                                <Col lg="4">
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
                                <Col lg="4">
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
                        </Form.Group>
                    </Form>
                </Container>
                <Container className="individual-event-right" key={event.id}>
                    <Form>
                        <Form.Group>
                            <Row className="mb-3" xs={1} lg={1}>
                                <Col>
                                    <div className="key-item"> {event.event_name}</div>
                                </Col>
                                <Col>
                                    <div className="key-item"> {event.description}</div>
                                </Col>
                                </Row>
                        </Form.Group>
                        <hr />
                        <h3>Musicians Needed:</h3>
                        <hr />
                        <Form.Group>
                            <Row className="mb-3" xs={1} lg={1}>
                                <Col>
                                    {event.Instruments && event.Instruments.map((instrument, index) => (
                                        <div key={index}><div className="key-item"> {instrument.name}</div></div>
                                    ))}
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Container>
            </Container>
            <button className="update"><Link to={`/form/${event.event_id}`}>Update Event</Link></button>
            <button className="delete" onClick={() => handleDelete(event.event_id)}>Delete Event</button>
        </div>
    )
}

export default IndividualEvent