import React, { useRef } from "react";
import { useEffect, useState} from "react";
import { Link, Router } from "react-router-dom";
import { Container, Row, Col, CardGroup, Button, Carousel } from "react-bootstrap";
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from "../components/EventCard";
import axios from "axios";
import EventHorizontalScroll from "../components/EventHorizontalScroll";
import { ClipLoader } from "react-spinners";
import { useCookies } from "react-cookie";

function Landing() {
    //Account
    const [cookies, , removeCookie] = useCookies([]);
    const [user, setUser] = useState(false);

    //State Variables
    const [recentEvents, setRecentEvents] = useState()
    const [relevantEvents, setRelevantEvents] = useState();
    const [userEvents, setUserEvents] = useState();
    const [isLoading, setIsLoading] = useState(true);

    //Get recent event on first load
    useEffect(() => {
        //Get user
        axios.get('http://localhost:5000/account', {withCredentials: true}).then(async res => {
            //Get data based on user
            if (res.data?.user)
            {
                //Get user data
                axios.get(`http://localhost:5000/user/id/${res.data.user.user_id}`).then(async res => {
                    const userData = res.data;
                    setUser(userData);

                    //Set user events
                    const userEventList = [];
                    userData.Events.forEach(event => {
                        if (event.UserStatus.status == "owner")
                        {
                            userEventList.push(event);
                        }
                    });
                    if (userEventList.length > 0) setUserEvents(userEventList);

                    //Get list of instrument ids
                    const instruments = userData.Instruments;
                    let instrumentSearch = [];
                    instruments.forEach(instrument => {
                        instrumentSearch.push(instrument.instrument_id);
                    })

                    //Get event data
                    if (instrumentSearch.length > 0)
                    {
                        axios.get(`http://localhost:5000/event/instrument/${instrumentSearch.join("|")}?sort=true&limit=${25}`).then(res => {
                            //Get list of locations
                            const instrumentEventSearch = res.data;
                            const zipList = [];
                            res.data.forEach(event => {
                                zipList.push(event.Address.zip);
                            });

                            //Sort by location
                            axios.get(`http://localhost:5000/api/distance_matrix/${userData.zip}/${zipList.join("|")}`).then(res => {
                                const distanceMatrixData = res.data.rows[0].elements;
                                //Add to data
                                for (let i = 0; i < instrumentEventSearch.length; i++)
                                {
                                    if (distanceMatrixData[i].status == "OK" && distanceMatrixData[i].distance)
                                    {
                                        instrumentEventSearch[i]["distance"] = distanceMatrixData[i].distance.value;
                                    }
                                    else 
                                    {
                                        instrumentEventSearch[i]["distance"] = 9999;
                                    }
                                }

                                //Sort
                                instrumentEventSearch.sort((a, b) => a.distance - b.distance);
                                console.log(instrumentEventSearch);
                                setRelevantEvents(instrumentEventSearch);
                                setIsLoading(false);
                            }).catch(error => {
                                console.log(error);
                                setIsLoading(false);
                            });
                        }).catch(error => {
                            console.log(error);
                            setIsLoading(false);
                        });
                    }
                    else
                    {
                        //Get recent
                        axios.get(`http://localhost:5000/event/recent/10`).then(res => {
                            setRecentEvents(res.data);
                            setIsLoading(false);
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    setIsLoading(false);
                });                
            }
            else //Get non logged in data
            {
                axios.get(`http://localhost:5000/event/recent/10`).then(res => {
                    setRecentEvents(res.data);
                    setIsLoading(false);
                }).catch(error => {
                    console.log(error);
                });
            }
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
        });     
    }, [])


    //Get layout based on logged in status
    function getLayout()
    {
        //If logged in
        if (user)
        {
            return (
                <>
                <h2>Events For You</h2>
                <br />
                <br />
                {isLoading ? <ClipLoader /> : <EventHorizontalScroll data={relevantEvents ? relevantEvents : recentEvents} persistantArrows={true}/>}
                <br />
                <Button variant='secondary' href="/eventsearch">View all events</Button>
                <hr />
                <h2>Your Listed Events</h2>
                <br />
                <br />
                {isLoading ? <ClipLoader /> : userEvents ? <EventHorizontalScroll data={userEvents} persistantArrows={true}/> : <Button variant='primary' href="/form">Create an event!</Button>}
                <br />
                <br />
                {isLoading ? null : userEvents && <Button variant='secondary' href="/login">Manage Events</Button>}
                </>
            )
        }
        else
        {
            return (
                <>
                <h2>Recently Added Events</h2>
                <br />
                <br />
                {isLoading ? <ClipLoader /> : <EventHorizontalScroll data={recentEvents} persistantArrows={true}/>}
                <br />
                <hr />
                <h2>Your Listed Events</h2>
                <br />
                <br />
                {!isLoading && <Button variant='primary' href="/account">Login/Register now to create events!</Button>}
                </>
            )
        }
    }

    //Loading
    return (
        <div>
            <Container>
                <h1>Harmonize</h1>
                <br />
                <h3>Connecting musicians and organizers.</h3>
                <br />
                <br />

                {/* 
                <Carousel interval={1000}>
                    <Carousel.Item>
                    <img width={"100%"} height={"100px"} src="https://media.istockphoto.com/id/1221351454/photo/portrait-of-a-japanese-guitar-player-at-home-studio.jpg?s=612x612&w=0&k=20&c=egLdt2l-RGUxBzdLLMeK1WHpZ9hFnUdfUHUsvfAIcXg="></img>
                    <Carousel.Caption>Test</Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                    <img src="https://www.shutterstock.com/image-photo/man-musical-art-concept-260nw-410543464.jpg"></img>
                    </Carousel.Item>
                </Carousel>
                */}
                
                <Container>
                    <br />
                    <hr />
                    {getLayout()}
                    <br />
                </Container>
            </Container>
        </div>
    )
}

export default Landing