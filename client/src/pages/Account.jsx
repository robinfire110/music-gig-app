import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from './dashboards/Sidebar';
import Spinner from 'react-bootstrap/Spinner';
import {Card, Col, Container, Row} from "react-bootstrap";
import "../App.css";
import EditProfile from "./dashboards/EditProfile";
import Gigs from "./dashboards/Gigs";
import Financials from "./dashboards/Financials";
import AdminActions from "./dashboards/AdminActions";

function Account() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [gigs, setGigs] = useState([]);
    const [users, setUsers] = useState([]);
    const [financials, setFinancials] = useState([]);
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
                    setIsAdmin(data.user.isAdmin);
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
            } catch (error) {
                console.error('Error fetching user gigs:', error);
            }
        };

        if (userData) {
            fetchUserGigs();
        }
    }, [userData]);

    useEffect(() => {
        const fetchUserFinancials = async () => {
            try {
                if (!userData || !userData.user_id) {
                    console.error('User data or user_id is not available');
                    return;
                }
                const { data } = await axios.get(`http://localhost:5000/user-financials`, { withCredentials: true });
                setFinancials(data.userFinancials);
            } catch (error) {
                console.error('Error fetching user financials:', error);
            }
        };

        if (userData) {
            fetchUserFinancials();
        }
    }, [userData]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if(isAdmin){
                    const { data } = await axios.get('http://localhost:5000/all-users', { withCredentials: true });
                    setUsers(data.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleLinkClick = (content) => {
        setSelectedContent(content);
    };

    const renderContent = () => {
        switch(selectedContent) {
            case 'editProfile':
                return <EditProfile userData={userData} />;
            case 'gigs':
                return <Gigs userData={userData} gigs={gigs} />;
            case 'financials':
                return <Financials userData={userData} financials={financials} />;
            case 'adminActions':
                return <AdminActions userData={ users } />;
            default:
                return null;
        }
    };

    if (loading) {
        return <Spinner />;
    }

    const dashboardTitle = isAdmin ? 'Admin Dashboard' : 'User Dashboard';

    return (
        <Container fluid>
            <Row>
                <Col sm={2}>
                    <Sidebar handleLinkClick={handleLinkClick} isAdmin={isAdmin} />
                </Col>
                <Col sm={10} style={{ padding: '20px', flexGrow: 1 }}>
                    {selectedContent === '' && (
                        <div>
                            <h2 style={{ marginBottom: '20px', display: 'block' }}>{dashboardTitle}</h2>
                            <button
                                style={{ marginTop: '20px', marginBottom: '20px', display: 'block', background: 'none', border: 'none', cursor: 'pointer' }}

                            >
                                <h4>Gigs</h4>
                            </button>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                {gigs.slice(0, 3).map((gig) => (
                                    <Card key={gig.event_id} style={{ width: 'calc(33.33% - 20px)' }}>
                                        <Card.Body>
                                            <Card.Title>{gig.event_name}</Card.Title>
                                            <Card.Text>{gig.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedContent && renderContent()}
                </Col>
            </Row>
        </Container>
    );
}

export default Account;

