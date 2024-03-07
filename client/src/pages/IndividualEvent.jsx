import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

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

    return (
        <div className="event-holder">
                <div className="individual-event" key={event.id}>
                    <h2>{event.event_name}</h2>
                    <h2>{event.date_posted}</h2>
                    <h2>{event.start_time}</h2>
                    <h2>{event.end_time}</h2>
                    <h2>{event.description}</h2>
                    <h2>{event.pay}</h2>
                    {event.Users && event.Users.length > 0 && (
                        <>
                            <h2>{event.Users[0].f_name}</h2>
                            <h2>{event.Users[0].l_name}</h2>
                        </>
                    )}
                </div>
                <button className="update"><Link to={`/form/${event.event_id}`}>Update Event</Link></button>
        </div>
    )
}

export default IndividualEvent