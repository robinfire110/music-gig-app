import { React, useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
const { REACT_APP_BACKEND_URL } = process.env

function EventCard({eventId}) {
    //Get Data
    const descriptionCharacterLimit = 200;
    const [eventData, setEventData] = useState();
    const [owner, setOwner] = useState()
    
    //Call API
    useEffect(() => {
        axios.get(`http://${REACT_APP_BACKEND_URL}/event/id/${eventId}`).then(res => {
            //Set data
            setEventData(res.data);
            console.log(res.data);

            //Get owner
            res.data.Users.forEach(user => {
                if (user.UserStatus.status == "owner")
                {
                    setOwner(user);
                }
            });
        }).catch(error => {
            console.log(error);
        });
    }, [])

    return (
        <div>
        <Card className="m-2 shadow-sm" style={{backgroundColor: "#e3e3e3", width: "22rem", height: "28rem", marginLeft: "auto", marginRight: "auto", textAlign: "left"}}>
            <Card.Header>
                <Card.Title><Link to={`/event/${eventId}`} style={{color: "#000"}}><h4>{eventData && eventData.event_name}</h4></Link></Card.Title>
                <h6>Posted by:</h6> {owner && <Link to={`/profile/${owner.user_id}`} style={{color: "#000"}}>{owner.f_name} {owner.l_name}</Link>}
                <br />
                <h6>Date Posted:</h6> {eventData && moment.utc(eventData.date_posted).format("M/DD/YYYY")}
                <br />
                <h6>Event Date:</h6> {eventData && moment.utc(eventData.start_time).format("M/DD/YYYY")}
                <br />
                <h6>Event Time:</h6> {eventData && moment.utc(eventData.start_time).format("h:mm A")} - {eventData && moment.utc(eventData.end_time).format("h:mm A")}
                <br />
                <h6>Location:</h6> {eventData && eventData.Address.city}, {eventData && eventData.Address.state}
                <br />
                <h6>Instruments:</h6> {eventData && eventData.Instruments[0] ? eventData.Instruments.map(instrument => instrument.name).join(', ') : "None"}
            </Card.Header>
            <Card.Body>
                <Card.Text style={{overflow: "clip", maxHeight: "100px"}}>
                        {eventData && (eventData.description.length > descriptionCharacterLimit ?`${eventData.description.substring(0, descriptionCharacterLimit)}...` : eventData.description)}
                </Card.Text>                
            </Card.Body>
            <Card.Footer>
                <Button variant='primary' href={`/event/${eventId}`}>See more</Button>
            </Card.Footer>
        </Card>
        </div>
    )
}

export default EventCard;