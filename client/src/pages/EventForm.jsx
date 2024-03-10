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

    const [instruments, setInstruments] = useState([])
    const [selectedInstruments, setSelectedInstruments] = useState([])
    
    const navigate = useNavigate()
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            //fetch instruments needed for tags
            const res = await fetch(`http://localhost:5000/instrument/`);
            const data = await res.json();
            setInstruments(data);

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

    //need a separate handler for instrument changes
    const handleInstrumentChange = (selectedInstrument) => {
        setSelectedInstruments((prev) => [...prev, selectedInstrument]);
    }

    const handleListing = async e => {
        e.preventDefault()
        try {
            //prepare data with event details and selected instruments
            const eventData = { ...event, instruments: selectedInstruments };

            if (id) { //if id already exists, we make a put to that event id
                await axios.put(`http://localhost:5000/event/${id}`, eventData);
            } else { //if the id doesn't exist, we make a post to a new event id
                const response = await axios.post(`http://localhost:5000/event/${id}`, eventData)
                const newEventId = response.data.event_id;
                navigate(`/event/${newEventId}`); //automatically throw user to the individual event page for the new event
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
            <select onChange={(e) => handleInstrumentChange(e.target.value)}>
                <option value="" disabled>
                    Select Instrument
                </option>
                {instruments.map((instrument) => (
                    <option key={instrument.instrument_id} value={instrument.name}>
                        {instrument.name}
                    </option>
                ))}
            </select>
            <div>
                Selected Instruments: {selectedInstruments.map((instrument) => instrument).join(", ")}
            </div>
            <button className="formButton" onClick={handleListing}>
                {id ? "Update Event" : "List Event"}
            </button>
        </div>
    )
}

export default EventForm