import { React, useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

function EventCard({eventId}) {
    //Get Data
    const descriptionCharacterLimit = 210;
    const [eventData, setEventData] = useState();
    const [owner, setOwner] = useState()
    
    //Call API
    useEffect(() => {
        axios.get(`http://localhost:5000/event/id/${eventId}`).then(res => {
            //Set data
            setEventData(res.data);
            console.log(res.data);

            //Get owner
            res.data.users.forEach(user => {
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
        <Card className="mb-3" style={{backgroundColor: "#e3e3e3", width: "20rem", height: "25rem", marginLeft: "auto", marginRight: "auto", textAlign: "left"}}>
            <Card.Header>
                <Card.Title><Link to={`/event/${eventId}`} style={{color: "#000"}}><h4>{eventData && eventData.event_name}</h4></Link></Card.Title>
                <p>
                <h6>Posted by:</h6> {owner && <Link to={`/profile/${owner.user_id}`} style={{color: "#000"}}>{owner.f_name} {owner.l_name}</Link>}
                <br />
                <h6>Date Posted:</h6> {eventData && moment.utc(eventData.date_posted).format("M/DD/YYYY")}
                <br />
                <h6>Event Time:</h6> {eventData && moment.utc(eventData.start_time).format("M/DD/YYYY |  H:mm")} - {eventData && moment.utc(eventData.end_time).format("H:mm")}
                <br />
                <h6>Instruments:</h6> {eventData && eventData.Instruments[0] ? eventData.Instruments.map(instrument => instrument.name).join(', ') : "None"}
                </p>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    <p style={{overflow: "clip", maxHeight: "100px"}}>
                        {eventData && (eventData.description.length > descriptionCharacterLimit ?`${eventData.description.substring(0, descriptionCharacterLimit)}...` : eventData.description)}
                    </p>
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