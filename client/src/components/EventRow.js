import React from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getEventOwner } from "../Utils";

const EventRow = ({ event, goToEvent, formatDate, index }) => {
    let backgroundColor = "rgba(255, 255, 255, 1)"
    if (index % 2 != 0) backgroundColor = "rgba(100, 100, 100, .15)";
    const owner = getEventOwner(event);

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
                <Col lg={2}><div>{instrumentNames.length > 0 ? instrumentNames.join(", ") : <div className="text-muted">No instruments provided</div>}</div></Col>
                <Col lg={2}><div>{owner?.f_name} {owner?.l_name}</div></Col>
                <Col lg={3}><div>
                        {event.Address && (
                            <div>
                                {event.Address.street},<br />{event.Address.city} {event.Address.state}, {event.Address.zip}
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