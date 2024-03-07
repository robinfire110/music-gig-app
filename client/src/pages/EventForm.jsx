import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Datepicker from "../components/Datepicker"

const EventForm = () => {
    const [event, setEvent] = useState({
        event_name: "",
        start_time: new Date(),
        end_time: new Date(),
        description: "",
        pay: null,
        event_hours: "",
    })

    const navigate = useNavigate()

    //TODO: For some reason, this is not being stored correctly on the page.
    const { id } = useParams();
    console.log(id)

    useEffect(() => {
        const fetchData = async () => {
            if (id) { //If the previous page had an id, then it's going to be stored and allow us to put to that id
                const res = await fetch(`http://localhost:5000/event/id/${id}`);
                const data = await res.json();
                setEvent(data);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (name, value) => {
        setEvent(prev => ({ ...prev, [name]: value }))
    }

    const handleListing = async e => {
        e.preventDefault()
        try {
            if (id) { //if id already exists, we make a put to that event id
                await axios.put(`http://localhost:5000/event/${id}`, event);
            } else { //if the id doesn't exist, we make a post to a new event id
                await axios.post(`http://localhost:5000/event/${id}`, event);
            };
            navigate(`/event/${id}`) //automatically throw user to the individual event page for the event
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='form'>
            <h1>Update Event</h1>
            <input type="text" placeholder='Event name' onChange={handleChange} name="event_name" />
            <Datepicker value={event.start_time} onChange={(value) => handleChange("start_time", value)}/>
            <Datepicker value={event.end_time} onChange={(value) => handleChange("end_time", value)}/>
            <input type="text" placeholder='Description' onChange={handleChange} name="description" />
            <input type="number" placeholder='Pay' onChange={handleChange} name="pay" />
            <input type="number" placeholder='Event Hours' onChange={handleChange} name="event_hours" />
            <button className="formButton" onClick={handleListing}>List Event</button>
        </div>
    )
}

export default EventForm