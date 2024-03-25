import React, { useRef } from "react";
import { useEffect, useState} from "react";
import { Link, Router } from "react-router-dom";
import { Container, Row, Col, CardGroup, Button } from "react-bootstrap";
import {BrowserView, isBrowser, isMobile} from 'react-device-detect';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from "../components/EventCard";
import axios from "axios";
import HorizontalScrollButton from "../components/HorizontalScrollButton";

function Landing() {
    //State Variables
    const [recentEvents, setRecentEvents] = useState()
    const [horizontalScrollStyle, setHorizontalScrollStyle] = useState();

    //Functions
    const navRef = useRef();
    function handleNav(dir)
    {
        const scrollAmount = 500;
        if (navRef)
        {
            if (dir == "left") navRef.current.scrollLeft -= scrollAmount;
            else navRef.current.scrollLeft += scrollAmount;
        }
    }

    //Get recent event on first load
    useEffect(() => {
        axios.get(`http://localhost:5000/event/recent/10`).then(res => {
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
            <br />
            <h3>Connecting musicians and organizers.</h3>
            <Container>
                <br />
                <hr />
                <h2>Recently Added Events</h2>
                <br />
                <br />
                <div style={{display: "flex", flexDirection: "row"}}>
                    {isBrowser && <HorizontalScrollButton dir="left" onClick={() => handleNav("left")} />}
                    {isBrowser && 
                        <div style={{display: "flex", flexWrap: "nowrap", overflowX: "hidden", WebkitOverflowScrolling: "touch", scrollBehavior: "smooth"}} ref={navRef}>
                            {recentEvents && recentEvents.map(event => {
                                return (<Col key={event.event_id} style={{flex: "0 0 auto"}}><EventCard eventId={event.event_id}/></Col>)
                            })
                            }
                        
                        </div>
                    }
                    {isMobile && 
                        <div style={{display: "flex", flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollBehavior: "smooth"}} ref={navRef}>
                            {recentEvents && recentEvents.map(event => {
                                return (<Col key={event.event_id} style={{flex: "0 0 auto"}}><EventCard eventId={event.event_id}/></Col>)
                            })
                            }
                        
                        </div>
                    }
                    
                    {isBrowser && <HorizontalScrollButton dir="right" onClick={() => handleNav("right")} />}
                </div>
                
                {/*
                <Row>
                    {recentEvents && recentEvents.map(event => {
                        return (<Col key={event.event_id}><EventCard eventId={event.event_id}/></Col>)
                    })
                    }
                </Row>
                */}
            </Container>
            <Container>
                <br />
                <hr />
                <h2>Your Events</h2>
                <br />
                <br />
                <Button variant='primary'>Register now to create events!</Button>
            </Container>
            </Container>
            <Footer />
        </div>
    )
}

export default Landing