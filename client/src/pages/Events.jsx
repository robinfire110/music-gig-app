import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import Header from "../components/Header";

const Events = () => {

    const [events, setEvents] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                //fetch all events from server
                const res = await fetch('http://localhost:5000/event')
                const data = await res.json();
                setEvents(data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchEvents()
    }, [events])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }

    const goToEvent = (event_id) => {
        navigate(`/event/${event_id}`)
    }

    return (
        <div>
            <Header />
            <hr />
            <Container style={{ textAlign: "left" }}>
                <Form>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control type="text" placeholder="Event or Venue Name" />
                        </Col>
                        <Col>
                            <Form.Control type="date" placeholder="Date" />
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit">Search</Button>
                        </Col>
                    </Row>
                </Form>

                
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Event Name</th>
                            <th>Event Requirements</th>
                            <th>Venue Details</th>
                            <th>Go to Event</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.event_id}>
                                <td>{formatDate(event.start_time)}</td>
                                <td>{event.event_name}</td>
                                <td>{event.description}</td>
                                <td>{event.Address && (
                                    <div> {event.Address.street} <br /> {event.Address.city} <br /> {event.Address.state} {event.Address.zip}</div>
                                )}</td>
                                <td><Button onClick={() => goToEvent(event.event_id)}>View</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Container>
        </div>
    )
}

export default Events