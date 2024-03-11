import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

    const handleDelete = async (id)=>{
        try {
            await axios.delete(`http://localhost:5000/event/${id}`);
            navigate("/");
        } catch (err){
            console.log(err);
        }
    }

    return (
        <div className="event-holder">
                <div className="individual-event" key={event.id}>
                    <h2>{event.event_name}</h2>
                    <h2>{event.date_posted}</h2>
                    <h2>{event.start_time}</h2>
                    <h2>{event.end_time}</h2>
                    <h2>{event.description}</h2>
                    <h2>{event.pay}</h2>
                    {/* getting the owner of the event to display */}
                    {event.Users && event.Users.length > 0 && (
                        <>
                            <h2>{event.Users[0].f_name} {event.Users[0].l_name}</h2>
                        </>
                    )}
                    {/* getting the address of the associated event. */}
                    {event.Address && (
                        <>
                            <h2>{event.Address.street} {event.Address.city} {event.Address.state} {event.Address.zip}</h2>
                        </>
                    )}
                    {/* getting all the instruments with the associated event. */}
                    {event.Instruments && event.Instruments.length > 0 && (
                        <>
                            {event.Instruments.map((instrument, index) => (
                                <h2 key={index}>{instrument.name}</h2>
                            ))}
                        </>
                    )}
                </div>
                {/* Make sure that these buttons only appear if the user_id of the event matches the user_id of the currently logged in user.
                    Otherwise, display export to calculator button */}
                <button className="update"><Link to={`/form/${event.event_id}`}>Update Event</Link></button>
                <button className="delete" onClick={() => handleDelete(event.event_id)}>Delete Event</button>

        </div>
    )
}

export default IndividualEvent