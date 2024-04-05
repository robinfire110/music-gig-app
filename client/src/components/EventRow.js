import React from "react";
import { Button } from "react-bootstrap";

const EventRow = ({ event, goToEvent, formatDate }) => {
    return (
        <tr>
            <td className="venue-date"> <div className="key-item">{formatDate(event.start_time)}</div></td>
            <td> <div className="key-item">{event.event_name}</div></td>
            <td>
                <div>
                    <div>Instruments needed: </div>
                    {event.Instruments && event.Instruments.map((instrument, index) => (
                        <div className="key-item" key={index}> {instrument.name}</div>
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
    )
}

export default EventRow;