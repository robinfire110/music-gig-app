import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Col, Row, Button, Card } from "react-bootstrap"; // Bootstrap imports
import { useCookies } from "react-cookie";
import { ClipLoader } from "react-spinners";
import "../styles/IndividualEvent.css";
import {formatCurrency } from "../Utils";
import {getBackendURL} from "../Utils";

const IndividualEvent = () => {
    const [event, setEvent] = useState({
        event_name: "",
        date_posted: "",
        start_time: "",
        end_time: "",
        description: "",
        pay: null,
        event_hours: "",
        Users: []
    })

    const [cookies, removeCookie] = useCookies([]);
    const [userId, setUserId] = useState(null) //Current user's id set here
    const [ownerId, setOwnerId] = useState(null) //get the owner's id here
    const [applications, setApplications] = useState([]);
    const [withdrawn, setWithdrawn] = useState([])
    const [accepted, setAccepted] = useState([]);
    const [rejected, setRejected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [colSize, setColSize] = useState({xs: 5, sm: 5, md: 5, lg: 5, xl: 4})
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        //get user
        const fetchUserData = async () => {
            if (cookies.jwt) {
                try {
                    axios.get(`${getBackendURL()}/account`, { withCredentials: true }).then(res => {
                        if (res.data?.user) {
                            const userData = res.data.user;
                            setUserId(userData);
                        }
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }

        const fetchEvent = async () => {
            try {
                await axios.get(`${getBackendURL()}/event/id/${id}`).then((res) => {
                    const data = res.data;
                    setEvent(data)
                    setOwnerId(data.Users.length > 0 ? data.Users[0].user_id : null);
    
                    const appliedUsers = data.Users.filter(user => user.UserStatus.status === 'applied');
                    const withdrawnUsers = data.Users.filter(user => user.UserStatus.status === 'withdraw');
                    const acceptedUsers = data.Users.filter(user => user.UserStatus.status === 'accept');
                    const rejectedUsers = data.Users.filter(user => user.UserStatus.status === 'reject');
                    setApplications(appliedUsers);
                    setWithdrawn(withdrawnUsers);
                    setAccepted(acceptedUsers);
                    setRejected(rejectedUsers);
    
                    setLoading(false);
                });
               
            } catch (err) {
                console.log(err)
            }
        }

        fetchUserData();
        fetchEvent();
    }, [id])

    const isEventOwner = () => {
        return ownerId && userId && ownerId === userId.user_id
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${getBackendURL()}/event/${id}`);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        const timeZoneSet = {
            hour: 'numeric',
            minute: '2-digit',
        }
        return time.toLocaleTimeString([], timeZoneSet);
    }

    const handleAddApplication = async (user) => {
        const applicationData = { status: 'applied' }
        //If the user isn't in the list, post
        if (user && event && !event.Users.some(listUser => listUser.user_id === user.user_id))
        {
            const applicationData = { status: 'applied' }
            try {
                await axios.post(`${getBackendURL()}/event/users/${id}/${userId.user_id}`, applicationData)
                window.location.reload();
            } catch (err) {
                console.log(err)
            }
        }
        else //If the user is in the list, put.
        {
            
            try {
                await axios.put(`${getBackendURL()}/event/users/${id}/${user.user_id}`, applicationData)
                window.location.reload();
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleWithdrawApplication = async e => {
        const applicationData = { status: 'withdraw' }
        try {
            await axios.put(`${getBackendURL()}/event/users/${id}/${userId.user_id}`, applicationData)
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }

    const handleAcceptApplication = async (user) => {
        const applicationData = { status: 'accept' }
        try {
            await axios.put(`${getBackendURL()}/event/users/${id}/${user.user_id}`, applicationData)
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }

    const handleRejectApplication = async (user) => {
        const applicationData = { status: 'reject' }
        try {
            await axios.put(`${getBackendURL()}/event/users/${id}/${user.user_id}`, applicationData)
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }

    const addLineBreak = (str) =>
    str.split('\n').map((subStr) => {
        return (
        <>
            {subStr}
            <br />
        </>
        );
    });

    if (loading) {
        return <ClipLoader />;
    }

    return (
        <div>
            <hr />
            <Container> 
                <div style={{textAlign: "left"}}>
                    <Row >
                        <Col>
                            <h1>{event.event_name}</h1>
                        </Col>
                        <Col lg="auto" style={{ display: 'flex', justifyContent: 'right'}}>
                        {isEventOwner() ? (
                            <Link to={`/form/${id}`} style={{ color: "#fff" }}>
                                <Button className="editEvent">Edit Event</Button>
                            </Link>
                        ) : (
                            <Link to={`/calculator/${event.event_id}?event=true`} style={{ color: "#fff" }}>
                                <Button className="sendToCalc">Send to Calculator</Button>
                            </Link>
                        )}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="mb-3" lg={8} md={8}>
                            <Card className="shadow" id="infoCard" style={{height: "100%"}} >
                                <Card.Header>
                                    <h3>Event Information</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Col>
                                        
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col xs="auto" lg={colSize.lg} xl={colSize.xl}><h5>Date</h5></Col>
                                                    <Col><p>{formatDate(event.start_time)}</p></Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="auto" lg={colSize.lg} xl={colSize.xl}><h5>Location</h5></Col>
                                                    <Col lg="auto"><p>
                                                    {event.Address && (
                                                        <Link target="blank" to={`https://www.google.com/maps/search/?api=1&query=${event.Address.street}+${event.Address.city}+${event.Address.state}+${event.Address.zip}`}>
                                                            {event.Address.street} <br /> {event.Address.city}, {event.Address.state} {event.Address.zip}
                                                        </Link>
                                                    )}
                                                    </p></Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="auto" lg={colSize.lg} xl={colSize.xl}><h5>Pay</h5></Col>
                                            
                                                    <Col><p>{formatCurrency(event.pay)}</p></Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col lg="auto"><h5>Time</h5></Col>
                                                    <Col className="text-start"><p>{formatTime(event.start_time)} - {formatTime(event.end_time)}</p></Col>
                                                </Row>
                                                <Row>
                                                    <Col size="auto"><h5>Event Hours</h5></Col>
                                                    <Col><p>{event.event_hours}</p></Col>
                                                </Row>
                                                <Row>
                                                    <Col size="auto"><h5>Rehearsal Hours</h5></Col>
                                                    <Col><p>{event.rehearse_hours}</p></Col>
                                                </Row>
                                                <Row><hr style={{width: "75%"}}/></Row>
                                                <Row>
                                                    
                                                    <Col size="auto"><h5>Total Hours</h5></Col>
                                                    <Col><p>{event.rehearse_hours + event.event_hours}</p></Col>
                                                </Row>
                                            </Col>
                                            <hr />
                                        </Row>
    
                                        <Row>
                                            <Container>
                                            <Col xs={colSize.xs} sm={colSize.sm} md={colSize.md} lg={colSize.lg} xl={colSize.xl}><h5>Description</h5></Col>
                                            <Col><p>{event.description != "" ? addLineBreak(event.description) : <Card.Text className="text-muted">No description provided</Card.Text>}</p></Col>
                                            </Container>
                                        </Row>
                                    </Col>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-3">
                            <Card className="shadow text-center">
                                <Card.Header>
                                    <h3>Owner Information</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col><h5>Posted by - {event.Users && event.Users.length > 0 && (event.Users && <Link to={`/profile/${event.Users[0].user_id}`} style={{ color: "#000" }}>{event.Users[0].f_name} {event.Users[0].l_name}</Link>)}</h5></Col>
                                    </Row>
                                    <Row>
                                        <Col><h5>Contact - {event.Users[0].email} </h5></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        
                            <Card className="shadow text-center mt-3">
                                <Card.Header>
                                    <h3>Instruments Needed</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Container>
                                    {event.Instruments && event.Instruments.length > 0 ? event.Instruments.map((instrument, index) => (
                                        <Row key={index}><h5>{instrument.name}</h5></Row>
                                    )) : <Card.Text className="text-muted">No instruments provided</Card.Text>}
                                    </Container>
                                </Card.Body>
                            </Card>

                            {!isEventOwner() &&
                            <Card className="shadow text-center mt-3">
                                <Card.Header>
                                    <h3>Application</h3>
                                </Card.Header>
                                <Card.Body>
                                    {userId ? 
                                        applications.some(user => user.user_id === userId.user_id && user.UserStatus.status === 'applied') ? (
                                        <Button className="withdrawButton" onClick={handleWithdrawApplication}>Withdraw from Event</Button>
                                    ) : (
                                        accepted.some(user => user.user_id === userId.user_id && user.UserStatus.status === 'accept') ? (
                                            <h4>You've been accepted for this event, get in touch with <Link to={`/profile/${event.Users[0].user_id}`} style={{ color: "#000" }}>{event.Users[0].f_name} {event.Users[0].l_name}</Link> for more details!
                                            </h4>
                                        ) : (
                                            rejected.some(user => user.user_id === userId.user_id && user.UserStatus.status === 'reject') ? (
                                                <h4>You've not been chosen to participate in this event.</h4>
                                            ) : (
                                                <Button className="applyButton" onClick={() => handleAddApplication(userId)}>Apply to Event</Button>
                                            )
                                        )
                                    ) : <Button variant='primary' href="/account">Please log in to apply for this event!</Button>}
                                </Card.Body>
                            </Card>
                            }
                        </Col>
                    </Row>
                </div> 
            </Container>

            {/* Applications */}
            <Container> 
            {userId && isEventOwner() &&
                <div style={{textAlign: "left"}}>
                    <Row>
                        <Col className="my-3">
                            <Card className="shadow" id="infoCard" style={{height: "100%"}} >
                                <Card.Header>
                                    <h3>Musician Applications</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Col>
                                        <Row><h5>Pending Applications</h5></Row>
                                        {applications.length > 0 ? applications.map((user, index) => (
                                            <Row key={index} style={{ marginBottom: '1rem', alignItems: "center", textAlign: "left" }}>
                                                <Col sm="2">
                                                    <Link to={`/profile/${user.user_id}`} style={{ color: "#000" }} className="user-profile-link">
                                                        {user.f_name} {user.l_name}
                                                    </Link>
                                                </Col>
                                                <Col sm="auto"><Button variant="success" size="sm" onClick={() => handleAcceptApplication(user)}>Accept</Button></Col>
                                                <Col sm="auto"><Button variant="danger" size="sm" onClick={() => handleRejectApplication(user)}>Reject</Button></Col>
                                            </Row>
                                        )) : <Card.Text className="text-muted">No pending applications</Card.Text>}
                                        <hr />
                                        <Row><h5>Accepted Applications</h5></Row>
                                        {accepted.length > 0 ? accepted.map((user, index) => (
                                            <Row key={index} style={{ marginBottom: '1rem', alignItems: "center", textAlign: "left" }}>
                                                <Col lg="3" sm="3" xs="3">
                                                    <Link to={`/profile/${user.user_id}`} style={{ color: "#000" }} className="user-profile-link">
                                                        {user.f_name} {user.l_name}
                                                    </Link>
                                                </Col>
                                                <Col lg="auto"><Button size="sm" onClick={() => handleAddApplication(user)}>Move to Pending</Button></Col>
                                                <Col lg="auto"><Button variant="danger" size="sm" onClick={() => handleRejectApplication(user)}>Reject</Button></Col>
                                            </Row>
                                        )) : <Card.Text className="text-muted">No accepted applications</Card.Text>}
                                        <hr />
                                        <Row><h5>Rejected Applications</h5></Row>
                                        {rejected.length > 0 ? rejected.map((user, index) => (
                                            <Row key={index} style={{ marginBottom: '1rem', alignItems: "center", textAlign: "left" }}>
                                                <Col sm="2">
                                                    <Link to={`/profile/${user.user_id}`} style={{ color: "#000" }} className="user-profile-link">
                                                        {user.f_name} {user.l_name}
                                                    </Link>
                                                </Col>
                                                <Col sm="auto"><Button size="sm" onClick={() => handleAddApplication(user)}>Move to Pending</Button></Col>
                                            </Row>
                                        )): <Card.Text className="text-muted">No rejected applications</Card.Text>}
                                        <hr />
                                    </Col>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div> 
                }
            </Container>
        </div>
    )
}

export default IndividualEvent