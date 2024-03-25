import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import EventRow from "../components/EventRow";
import "../styles/Events.css";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const Events = () => {

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("")

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
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    const goToEvent = (event_id) => {
        navigate(`/event/${event_id}`)
    }

    const handleSearch = (event) => {
        event.preventDefault();
        let filteredEvents = events.filter(event => {
            const eventDate = new Date(event.start_time);
            return (!startDate || eventDate >= new Date(startDate)) && (!endDate || eventDate <= new Date(endDate))
        });
        
        if (searchQuery) {
            filteredEvents = filteredEvents.filter(event => event.event_name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        
        setFilteredEvents(filteredEvents);
    };

    return (
        <div>
            <hr />
            <Container style={{ textAlign: "left" }}>
                <Form onSubmit={handleSearch}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control type="text" placeholder="Event Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                        </Col>
                        <Col>
                            <Form.Control type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </Col>
                        <Col>
                            <Form.Control type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
                            <EventRow key={event.event_id} event={event} goToEvent={goToEvent} formatDate={formatDate} />
                        ))}
                    </tbody>
                </table>
            </Container>
        </div>
    )
}

export default Events