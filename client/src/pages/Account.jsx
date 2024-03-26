import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserDash from './dashboards/UserDash';
import Sidebar from './dashboards/Sidebar';
import Spinner from 'react-bootstrap/Spinner';
import {Card, Col, Container, Row} from "react-bootstrap";
import "../App.css";
import EditProfile from "./dashboards/EditProfile";
import Gigs from "./dashboards/Gigs";
import Financials from "./dashboards/Financials";

function Account() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContent, setSelectedContent] = useState('');

    useEffect(() => {
        const verifyUser = async () => {
            if (!cookies.jwt) {
                navigate('/login');
            } else {
                try {
                    const { data } = await axios.get('http://localhost:5000/account', { withCredentials: true });
                    setUserData(data.user);
                    setIsAdmin(data.isAdmin);
                    console.log(data)
                    toast(`hi ${data.user.f_name}`, { theme: 'dark' });
                } catch (error) {
                    removeCookie('jwt');
                    navigate('/login');
                } finally {
                    setLoading(false);
                }
            }
        };

        verifyUser();
    }, [cookies, navigate, removeCookie]);

    useEffect(() => {
        const fetchUserGigs = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/user-gigs', { withCredentials: true });
                setGigs(data.userGigs);
                console.log(data.userGigs);
            } catch (error) {
                console.error('Error fetching user gigs:', error);
            }
        };

        if (userData) {
            fetchUserGigs();
        }
    }, [userData]);

    const handleLinkClick = (content) => {
        setSelectedContent(content);
    };

    const renderContent = () => {
        switch(selectedContent) {
            case 'editProfile':
                return <EditProfile userData={userData} />;
            case 'gigs':
                return <Gigs userData={userData} />;
            case 'financials':
                return <Financials userData={userData} />;
            default:
                return null;
        }
    };

    if (loading) {
        return <Spinner />;
    }
    return (
        <Container fluid>
            <Row>
                <Col sm={2}>
                    <Sidebar handleLinkClick={handleLinkClick} />
                </Col>
                <Col sm={10} style={{ padding: '20px', flexGrow: 1 }}>
                    {/* Conditionally render cards only if no item is clicked */}
                    {selectedContent === '' && (
                        <Row xs={1} md={2} className="g-4">
                            {gigs.map((gig) => (
                                <Col key={gig.event_id}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{gig.event_name}</Card.Title>
                                            <Card.Text>{gig.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {selectedContent && renderContent()}
                </Col>
            </Row>
        </Container>
    );
}

export default Account;

