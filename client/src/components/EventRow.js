import React from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const EventRow = ({ event, goToEvent, formatDate, index }) => {
    let backgroundColor = "rgba(255, 255, 255, 1)"
    if (index % 2 != 0) backgroundColor = "rgba(100, 100, 100, .15)";

    //Instruments
    const instrumentNames = event.Instruments.map((instrument) => {
        return instrument.name;
    })

    return (
        <Container>
            <Link to={`/event/${event.event_id}`} style={{color: "rgba(0, 0, 0, 1)", textDecoration: "none"}}>
            <Row style={{background: backgroundColor}} className="py-2 align-items-center">
                <Col lg={1}><div>{formatDate(event.start_time)}</div></Col>
                <Col lg={2}><div>{event.event_name}</div></Col>
                <Col lg={1}><div>${event.pay}</div></Col>
                <Col lg={3}><div>{instrumentNames.length > 0 ? instrumentNames.join(", ") : "No instruments provided"}</div></Col>
                <Col lg={4}><div>
                        {event.Address && (
                            <div>
                                <div> <strong>Address:</strong> {event.Address.street}, {event.Address.city} {event.Address.state}, {event.Address.zip}</div>
                            </div>
                        )}
                    </div></Col>
                <Col lg={1}><Button size="sm" onClick={() => goToEvent(event.event_id)}>View</Button></Col>
            </Row>
            </Link>
        </Container>
    )
}

export default EventRow;

{/*
        <tr>
            <td className="venue-date"> <div>{formatDate(event.start_time)}</div></td>
            <td> <div>{event.event_name}</div></td>
            <td>
                <div>
                    <div>Instruments needed: </div>
                    {event.Instruments && event.Instruments.map((instrument, index) => (
                        <div key={index}> {instrument.name}</div>
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
        */}