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
import { getBackendURL } from "../Utils"


function Account() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [gigs, setGigs] = useState([]);
    const [users, setUsers] = useState([]);
    const [financials, setFinancials] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContent, setSelectedContent] = useState('');


    useEffect(() => {
        const verifyUser = async () => {
            if (!cookies.jwt) {
                navigate('/login');
            } else {
                try {
                    const { data } = await axios.get(`${getBackendURL()}/account`, { withCredentials: true });
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
                const { data } = await axios.get(`${getBackendURL()}/user-gigs`, { withCredentials: true });
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
                const { data } = await axios.get(`${getBackendURL()}/user-financials`, { withCredentials: true });
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
                    const { data } = await axios.get(`${getBackendURL()}/all-users`, { withCredentials: true });
                    // console.log(data.users)
                    setUsers(data.users);
                }

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [isAdmin]);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if(isAdmin){
                    const { data } = await axios.get(`${getBackendURL()}/all-events`, { withCredentials: true });
                    setPosts(data.events);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchPosts();
    }, [isAdmin]);


    const handleLinkClick = (content) => {
        setSelectedContent(content);
    };

    const handlePasswordReset = async (user, newPassword) => {
        try {
            const response = await axios.post(`${getBackendURL()}/reset-user-password`,
                { user, newPassword }, {
                    withCredentials: true
                });
            if (response.data.success) {
                toast.success("Password reset successfully", { theme: 'dark' });
            } else {
                console.error('Failed to reset password:', response.data.message);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    const handlePromoteUser = async (user) => {
        try {
            const response = await axios.post(`${getBackendURL()}/promote-user`,
                user , {
                    withCredentials: true
                });
            if (response.data.success) {
                toast.success(`Successfully promoted ${user.email} to Admin`, { theme: 'dark' });
            } else {
                console.error('Failed to promote user:', response.data.message);
            }
        } catch (error) {
            console.error('Error promoting user:', error);
        }
    };


    const handleDemoteUser = async (user) => {
        try {
            const response = await axios.post(`${getBackendURL()}/demote-user`,
                user , {
                    withCredentials: true
                });
            if (response.data.success) {
                toast.success(`Successfully demoted ${user.email} to user`, { theme: 'dark' });

            } else {
                console.error('Failed to demote user:', response.data.message);
            }
        } catch (error) {
            console.error('Error demote user:', error);
        }
    };

    const handleDeleteUser = async (user) => {
        try {
            const response = await axios.post(`${getBackendURL()}/remove-user`,
                user , {
                    withCredentials: true
                });
            if (response.data.success) {
                toast.success(`Successfully deleted user ${user.email}`, { theme: 'dark' });

            } else {
                console.error('Failed to delete user:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeletePost = async (post) => {
        try {
            const response = await axios.post(`${getBackendURL()}/remove-user-post`,
                post , {
                    withCredentials: true
                });
            if (response.data.success) {
                toast.success(`Successfully deleted post ${post.event_name} by ${post.f_name}`, { theme: 'dark' });

            } else {
                console.error('Failed to delete post:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
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
                return <
                    AdminActions userData={ users }
                                 postData={ posts }
                                 onPasswordReset={handlePasswordReset}
                                 onPromoteUser={handlePromoteUser}
                                 onDemoteUser={handleDemoteUser}
                                 onDeleteUser={handleDeleteUser}
                                 onDeletePost={handleDeletePost}/>;
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

