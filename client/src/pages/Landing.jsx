import React from "react";
import { useEffect, useState} from "react";
import { Link, Router } from "react-router-dom";
import { Container, Row, Col, CardGroup, Button } from "react-bootstrap";
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from "../components/EventCard";
import axios from "axios";


function Landing() {
    //State Variables
    const [recentEvents, setRecentEvents] = useState()

    //Get recent event on first load
    useEffect(() => {
        axios.get(`http://localhost:5000/event/recent/6`).then(res => {
            setRecentEvents(res.data);
        }).catch(error => {
            console.log(error);
        });
      }, [])

    return (
        <div>
            <Header />
            <Container>
            <h1>Harmonize</h1>
            <h3>Connecting musicians and organizers.</h3>
            <Container>
                <br />
                <hr />
                <h2>Recently Added Events</h2>
                <Row>
                    {recentEvents && recentEvents.map(event => {
                        return (<Col><EventCard eventId={event.event_id}/></Col>)
                    })
                    }
                </Row>
            </Container>
            <Container>
                <br />
                <hr />
                <h2>Your Events</h2>
                <Button variant='primary'>Register now to create events!</Button>
            </Container>
            </Container>
            <Footer />
        </div>
    )
}

export default Landing