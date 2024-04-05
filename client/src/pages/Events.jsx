import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import EventRow from "../components/EventRow";
import "../styles/Events.css";
import { getBackendURL } from "../Utils";
import Select from 'react-select';

const Events = () => {

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("")
    const [loading, setLoading] = useState(true);
    const [instruments, setInstruments] = useState([])
    const [selectedInstruments, setSelectedInstruments] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                //fetch all events from server
                const res = await fetch(`${getBackendURL()}/api/event`)
                const data = await res.json();
                //Filter out all events from data whose is_listed is false
                const filteredData = data.filter(event => event.is_listed === true || event.is_listed === 1)
                setEvents(filteredData)
                //setting this for managing what data is currently being filtered
                setFilteredEvents(filteredData)
                setLoading(false);
            } catch (err) {
                console.log(err)
            }
        }

        const fetchInstruments = async () => {
            //fetch instruments needed for tags
            const res = await fetch(`${getBackendURL()}/api/instrument/`);
            const data = await res.json();

            //Create instruments
            setInstruments(configureInstrumentList(data));
        }
        fetchEvents()
        fetchInstruments()
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
            const eventInstruments = event.Instruments ? event.Instruments.map(instrument => instrument.name.toLowerCase()) : [];
            const containsSearchQuery = !searchQuery || event.event_name.toLowerCase().includes(searchQuery.toLowerCase());
            const isInDateRange = (!startDate || eventDate > new Date(startDate)) && (!endDate || eventDate <= new Date(endDate))
            const matchesSelectedInstruments = selectedInstruments.length === 0 || selectedInstruments.some(selected => eventInstruments.includes(selected.value.toLowerCase()))

            return containsSearchQuery && isInDateRange && matchesSelectedInstruments;
        });
        setFilteredEvents(filteredEvents);
    };

    //Configure instrument list (to work with special select)
    const configureInstrumentList = (data) => {
        const instrumentOptionList = []
        data.forEach(instrument => {
            instrumentOptionList.push({value: instrument.name, label: instrument.name});
        });
        return instrumentOptionList
    }

    return (
        <div>
            <hr />
            <Container style={{ textAlign: "left" }}>
                <Form onSubmit={handleSearch}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control type="text" placeholder="Event Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </Col>
                        <Col>
                            <Form.Control type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </Col>
                        <Col>
                            <Form.Control type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </Col>
                        <Col lg="4">
                            <Select placeholder="Instruments..." options={instruments} isMulti onChange={(selectedOptions) => setSelectedInstruments(selectedOptions)} value={selectedInstruments} required={false}></Select>
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit">Search</Button>
                        </Col>
                    </Row>
                </Form>

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center" }}><ClipLoader /></div>
                ) : (
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
                )}


            </Container>
        </div>
    )
}

export default Events