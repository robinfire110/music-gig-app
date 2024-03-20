import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import Header from "../components/Header";
import "../styles/Events.css";

const Events = () => {

    const [events, setEvents] = useState([]);
    let [filteredEvents, setFilteredEvents] = useState([]);
    let [searchQuery, setSearchQuery] = useState("");
    let [dateFilter, setDateFilter] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                //fetch all events from server
                const res = await fetch('http://localhost:5000/event')
                const data = await res.json();
                setEvents(data)
                //setting this for managing what data is currently being filtered
                setFilteredEvents(data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchEvents()
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    }

    const goToEvent = (event_id) => {
        navigate(`/event/${event_id}`)
    }

    const handleSearch = (event) => {
        event.preventDefault();
        let filteredEvents = events.filter(event => event.event_name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (dateFilter) {
            filteredEvents = filteredEvents.filter(event => event.start_time.includes(dateFilter));
        }
        
        setFilteredEvents(filteredEvents);
    };

    const handleDateFilter = (event) => {
        setDateFilter(event.target.value);
    }

    return (
        <div>
            <Header />
            <hr />
            <Container style={{ textAlign: "left" }}>
                <Form onSubmit={handleSearch}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control type="text" placeholder="Event Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                        </Col>
                        <Col>
                            <Form.Control type="date" placeholder="Date" value={dateFilter} onChange={handleDateFilter} />
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((event) => (
                            <tr key={event.event_id}>
                                <td className="venue-date"> <div className="key-item">{formatDate(event.start_time)}</div></td>
                                <td> <div className="key-item">{event.event_name}</div></td>
                                <td>
                                    <div>
                                        <div>Number of musicians: <div className="key-item">{event.Instruments && event.Instruments.length}</div></div>
                                        <div>Instruments needed: </div>
                                        {event.Instruments && event.Instruments.map((instrument, index) => (
                                            <div className="key-item"> {instrument.name}</div>
                                        ))}
                                    </div>
                                </td>
                                <td className="venue-details">
                                    {event.Address && (
                                    <div>
                                        <div> <strong>Address:</strong> {event.Address.street}, {event.Address.city} {event.Address.state}, {event.Address.zip}</div>
                                        <div> <strong>Time: </strong> {event.event_hours} hours </div>
                                        <div> <strong>Total Pay: </strong> ${event.pay} </div>
                                    </div>
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