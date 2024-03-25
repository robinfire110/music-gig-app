import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import EventCard from "../components/EventCard";
import {ClipLoader} from 'react-spinners'
import EventHorizontalScroll from "../components/EventHorizontalScroll";

const Profile = () => {
    //URL Params
    const navigate = useNavigate();
    const [paramId, setParamId] = useState(useParams().id);

    //States
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [colSize, setColSize] = useState({xs: 5, sm: 4, md: 5, lg: 4, xl: 3})
    const [userLocation, setUserLocation] = useState();

    //Functions
    function capatalize(string)
    {
        return string[0].toUpperCase() + string.slice(1);
    }

    function listInstruments()
    {
        let string = ""
        userData?.Instruments.map(instrument => {
            string += `${instrument.name}, `; 
        })
        
        //Remove last comma
        return string.slice(0, string.length-2);
    }

    function listEvents()
    {
        let events;
        if (userData?.Events.length > 0)
        {
            console.log(userData.Events);
            return (<EventHorizontalScroll data={userData.Events} />)
            /*
            const events = userData?.Events.map(event => {
                if (event.UserStatus.status == "owner")
                {
                    return <Col xxl={4} xl={6} lg={6} md={12} sm={12} xs={12}><EventCard eventId={event.event_id}/></Col>
                }
            });
            return events;
            */
        }
        else
        {
            return "No events listed."
        }
        
    }

    //Run on first start
    useEffect(() => {
        //Get user data
        axios.get(`http://localhost:5000/user/id/${paramId}`).then(res => {
            if (res.data)
            {
                setUserData(res.data);

                //Get location
                axios.get(`http://localhost:5000/api/geocoding/zip/${res.data.zip}`).then((res) => {
                    setUserLocation(res.data);
                    setIsLoading(false);
                    console.log("Location", res.data);
                }).catch(error => {
                    setIsLoading(false);
                    console.log(error);
                });
                
            }
            else
            {
                //No user found
                navigate("/");
            }
            
        }).catch(error => {
            console.log(error);
        })
    }, [])
    
    //Render
    if (isLoading)
    {
        return (
            <div>
                <ClipLoader />
            </div>
        )
    }
    else
    {
        return (
            <>
            <br />
                <Container> 
                    <div style={{textAlign: "left"}}>
                        <h1>User Profile</h1>
                        <br />
                        <br />
                        <Row>
                            <Col className="mb-3" lg={7} md={7}>
                                <Card id="infoCard" style={{height: "100%"}} >
                                    <Card.Header>
                                        <h3>Information</h3>
                                    </Card.Header>
                                    <Card.Body>
                                        <Col>
                                            <Row>
                                                <Col xs={colSize.xs} sm={colSize.sm} md={colSize.md} lg={colSize.lg} xl={colSize.xl}><h5>Name</h5></Col>
                                                <Col><p>{capatalize(userData?.f_name)} {capatalize(userData?.l_name)} </p></Col>
                                                <hr />
                                            </Row>
                                            <Row>
                                                <Col xs={colSize.xs} sm={colSize.sm} md={colSize.md} lg={colSize.lg} xl={colSize.xl}><h5>Email</h5></Col>
                                                <Col><p>{userData?.email}</p></Col>
                                                <hr />
                                            </Row>
                                            <Row>
                                                <Col xs={colSize.xs} sm={colSize.sm} md={colSize.md} lg={colSize.lg} xl={colSize.xl}><h5>Location</h5></Col>
                                                <Col><p>{userLocation ? userLocation.results[0].formatted_address : userData?.zip}</p></Col>
                                                <hr />
                                            </Row>
                                            <Row>
                                                <Col xs={colSize.xs} sm={colSize.sm} md={colSize.md} lg={colSize.lg} xl={colSize.xl}><h5>Instruments</h5></Col>
                                                <Col><p>{userData?.Instruments.length > 0 ? userData?.Instruments.map(instrument => instrument.name).join(', ') : "None"}</p></Col>
                                                <hr />
                                            </Row>
                                        </Col>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="mb-3">
                                <Card id="bioCard" style={{height: "100%"}}>
                                    <Card.Header>
                                        <h3>Bio</h3>
                                    </Card.Header>
                                    <Card.Body>
                                        {userData.bio ? <Card.Text>{userData.bio}</Card.Text> : <Card.Text className="text-muted">No bio provided</Card.Text>}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <h3>Listed Events</h3>
                            {listEvents()}
                        </Row>
                    </div> 
                </Container>
            <br />
            </>
        )
    }
    
}

export default Profile