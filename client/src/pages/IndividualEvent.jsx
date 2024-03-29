import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Col, Row, Button } from "react-bootstrap"; // Bootstrap imports
import { useCookies } from "react-cookie";
import { ClipLoader } from "react-spinners";
import "../styles/IndividualEvent.css";

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
    const [accepted, setAccepted] = useState([]);
    const [rejected, setRejected] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        //get user
        const fetchUserData = async () => {
            if (cookies.jwt) {
                try {
                    axios.get('http://localhost:5000/account', { withCredentials: true }).then(res => {
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
                const res = await fetch(`http://localhost:5000/event/id/${id}`)
                const data = await res.json();

                setEvent(data)
                setOwnerId(data.Users.length > 0 ? data.Users[0].user_id : null);

                const appliedUsers = data.Users.filter(user => user.UserStatus.status === 'applied');
                const acceptedUsers = data.Users.filter(user => user.UserStatus.status === 'accept');
                const rejectedUsers = data.Users.filter(user => user.UserStatus.status === 'reject');
                setApplications(appliedUsers);
                setAccepted(acceptedUsers);
                setRejected(rejectedUsers);

                setLoading(false);
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
            await axios.delete(`http://localhost:5000/event/${id}`);
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
        if (user) { //user getting moved back to pending
            const applicationData = { status: 'applied' }
            try {
                await axios.put(`http://localhost:5000/event/users/${id}/${user.user_id}`, applicationData)
                window.location.reload();
            } catch (err) {
                console.log(err)
            }
        } else { //grab the user's id from the page, add a user to the event with status "applied"
            const applicationData = { status: 'applied' }
            try {
                await axios.post(`http://localhost:5000/event/users/${id}/${userId.user_id}`, applicationData)
                window.location.reload();
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleWithdrawApplication = async e => {
        const applicationData = { status: 'withdraw' }
        try {
            await axios.put(`http://localhost:5000/event/users/${id}/${userId.user_id}`, applicationData)
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }

    const handleAcceptApplication = async (user) => {
        const applicationData = { status: 'accept' }
        try {
            await axios.put(`http://localhost:5000/event/users/${id}/${user.user_id}`, applicationData)
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }

    const handleRejectApplication = async (user) => {
        const applicationData = { status: 'reject' }
        try {
            await axios.put(`http://localhost:5000/event/users/${id}/${user.user_id}`, applicationData)
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }

    if(loading) {
        return <ClipLoader />;
    }

    return (
        <div>
            <hr />
            <Container className="name-date-summary" key={event.id}>
                <Row>
                    <Col style={{ display: 'flex', justifyContent: 'left' }}>
                        <div className="key-item" style={{ fontSize: "30px" }}> {event.event_name} - {formatDate(event.start_time)}</div>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'right', gap: '20px' }}>
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
            </Container>
            <Container className="event-holder">
                <Container className="individual-event-left" key={event.id} style={{ textAlign: "left" }}>
                    <Row className="mb-3" xs={1} lg={2}>
                        <Col lg="2">
                            <h5>Posted By: </h5>
                        </Col>
                        <Col lg="8">
                            {event.Users && event.Users.length > 0 && (
                                <div className="key-item"> {event.Users && <Link to={`/profile/${event.Users[0].user_id}`} style={{ color: "#000" }}>{event.Users[0].f_name} {event.Users[0].l_name}</Link>}</div>
                            )}
                        </Col>
                    </Row>
                    <Row className="mb-3" xs={1} lg={2}>
                        <Col lg="2">
                            <h5>Contact:</h5>
                        </Col>
                        <Col lg="8">
                            {event.Users && event.Users.length > 0 && (
                                <div className="key-item"> {event.Users[0].email} </div>
                            )}
                        </Col>
                    </Row>
                    <hr />
                    <h3>Event Information</h3>
                    <hr />
                    <Row className="mb-3" xs={1} lg={2}>
                        <Col lg="3">
                            <h5>Date: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {formatDate(event.start_time)}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Time: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {formatTime(event.start_time)} - {formatTime(event.end_time)}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Location: </h5>
                        </Col>
                        <Col lg="8">
                            {event.Address && (
                                <div className="key-item"> {event.Address.street} <br /> {event.Address.city} <br /> {event.Address.state} {event.Address.zip}</div>
                            )}
                        </Col>
                        <Col lg="3">
                            <h5>Pay: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> ${event.pay}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Rehearsal Hours: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {event.rehearse_hours}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Event Hours: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {event.event_hours}</div>
                        </Col>
                        <Col lg="3">
                            <h5>Total Hours: </h5>
                        </Col>
                        <Col lg="8">
                            <div className="key-item"> {event.event_hours + event.rehearse_hours}</div>
                        </Col>
                    </Row>
                </Container>
                <Container className="individual-event-right" key={event.id}>
                    <Row className="mb-3" xs={1} lg={1}>
                        <Col>
                            <div className="key-item"> {event.event_name}</div>
                        </Col>
                        <Col>
                            <div className="key-item"> {event.description}</div>
                        </Col>
                    </Row>
                    <h4>Musicians Needed:</h4>
                    <hr />
                    <Row className="mb-3" xs={1} lg={1}>
                        <Col>
                            {event.Instruments && event.Instruments.map((instrument, index) => (
                                <div key={index}><div className="key-item"> {instrument.name}</div></div>
                            ))}
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container className="application-container" style={{ marginTop: '2rem' }}>
                {/* Also add check for if the user is logged in in the first place, if not don't show either of these things */}
                {/* Need 4 checks, apply to event if not applied, withdraw from event if applied, show you've been accepted if accepted, show you've been rejected if rejected. */}
                {userId ? (
                    <>
                        {isEventOwner() ? (
                            <Container className="applications" style={{ textAlign: "left" }}>
                                <h3>Pending Applications</h3>
                                <hr />
                                {applications.map((user, index) => (
                                    <Row key={index} style={{ marginBottom: '1rem', alignItems: "center", textAlign: "left" }}>
                                        <Col sm="1">
                                            <Link to={`/profile/${user.user_id}`} style={{ color: "#000" }} className="user-profile-link">
                                                {user.f_name} {user.l_name}
                                            </Link>
                                        </Col>
                                        <Col sm="1"><Button variant="success" onClick={() => handleAcceptApplication(user)}>Accept</Button></Col>
                                        <Col sm="1"><Button variant="danger" onClick={() => handleRejectApplication(user)}>Reject</Button></Col>
                                    </Row>
                                ))}
                                <hr />
                                <h3>Accepted Applications</h3>
                                <hr />
                                {accepted.map((user, index) => (
                                    <Row key={index} style={{ marginBottom: '1rem', alignItems: "center", textAlign: "left" }}>
                                        <Col sm="1">
                                            <Link to={`/profile/${user.user_id}`} style={{ color: "#000" }} className="user-profile-link">
                                                {user.f_name} {user.l_name}
                                            </Link>
                                        </Col>
                                        <Col sm="2">
                                            <Button onClick={() => handleAddApplication(user)}>Move to Pending</Button>
                                        </Col>
                                        <Col sm="2">
                                            <Button variant="danger" onClick={() => handleRejectApplication(user)}>Reject</Button>
                                        </Col>
                                    </Row>
                                ))}
                                <hr />
                                <h3>Rejected Applications</h3>
                                <hr />
                                {rejected.map((user, index) => (
                                    <Row key={index} style={{ marginBottom: '1rem', alignItems: "center", textAlign: "left" }}>
                                        <Col sm="1">
                                            <Link to={`/profile/${user.user_id}`} style={{ color: "#000" }} className="user-profile-link">
                                                {user.f_name} {user.l_name}
                                            </Link>
                                        </Col>
                                        <Col sm="2">
                                            <Button onClick={() => handleAddApplication(user)}>Move to Pending</Button>
                                        </Col>
                                    </Row>
                                ))}
                            </Container>
                        ) : (
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
                                        <Button className="applyButton" onClick={handleAddApplication}>Apply to Event</Button>
                                    )
                                )
                            )
                        )}
                    </>
                ) : (
                    <Button variant='primary' href="/account">Please log in to apply for this event!</Button>
                )}
            </Container>
        </div>
    )
}

export default IndividualEvent