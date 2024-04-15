import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from './dashboards/Sidebar';
import Spinner from 'react-bootstrap/Spinner';
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import "../App.css";
import EditProfile from "./dashboards/EditProfile";
import Gigs from "./dashboards/Gigs";
import Financials from "./dashboards/Financials";
import AdminActions from "./dashboards/AdminActions";
import { getBackendURL } from "../Utils"
import Title from '../components/Title';
import ConfirmationModal from "./dashboards/ConfirmationModal";


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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [showUnlistModal, setShowUnlistModal] = useState(false);
    const [eventToUnlist, setEventToUnlist] = useState(null);



    useEffect(() => {
        const verifyUser = async () => {
            if (!cookies.jwt) {
                navigate('/login');
            } else {
                try {
                    const { data } = await axios.get(`${getBackendURL()}/account`, { withCredentials: true });
                    setUserData(data.user);
                    setIsAdmin(data.user.isAdmin);
                    console.log(data.user)
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
                console.log(data.userGigs)
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

    const handleDeleteFinancial = async (financial) => {
        // try {
            console.log('delete financial record')
            console.log(financial)
        // }
        //     const response = await axios.post(`${getBackendURL()}`,
        //         financial , {
        //             withCredentials: true
        //         });
        //     if (response.data.success) {
        //         toast.success(`Successfully deleted financial record`, { theme: 'dark' });
        //
        //     } else {
        //         console.error('Failed to delete financial record:', response.data.message);
        //     }
        // } catch (error) {
        //     console.error('Error deleting financial record:', error);
        // }
    };

    const handleDeleteEvent = async (event) => {
        try {
            const response = await axios.post(`${getBackendURL()}/delete-event`,
                event , {
                    withCredentials: true
                });
            if (response.data.success) {
                toast.success(`Successfully deleted listing ${event.event_name}`, { theme: 'dark' }, { theme: 'dark' });
                window.location.reload();
            } else {
                console.error('Failed to delete listing:', response.data.message);
            }

        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete event', { theme: 'dark' });
        } finally {
            handleCloseDeleteModal();
        }
    };

    const handleUnlistEvent = async (event) => {
        try {
            const response = await axios.post(`${getBackendURL()}/unlist-event`,
                event , {
                    withCredentials: true
                });
            if (response.data.success) {
                toast.success(`Successfully unlisted event ${event.event_name}`, { theme: 'dark' });
                // Perform any additional actions after unlisting the event if needed
            } else {
                console.error('Failed to unlist event:', response.data.message);
            }

        } catch (error) {
            console.error('Error unlisting event:', error);
            toast.error('Failed to unlist event', { theme: 'dark' });
        } finally {
            handleCloseUnlistModal();
        }
    };


    const handleShowUnlistModal = (event) => {
        setEventToUnlist(event);
        setShowUnlistModal(true);
    }

    const handleCloseUnlistModal = () => {
        setShowUnlistModal(false);
        setEventToUnlist(null);
    };


    const handleShowDeleteModal = (event) => {
        setEventToDelete(event);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setEventToDelete(null);
    };

    function truncateText(text, maxLength = 50) {
        if (text.length <= maxLength) {
            return text;
        } else {
            return text.substring(0, maxLength) + '...';
        }
    }

    const renderContent = () => {
        switch(selectedContent) {
            case 'dashboard':
                window.location.reload();
                return null;
            case 'editProfile':
                return <EditProfile userData={userData}
                                    onDeleteEvent={handleDeleteEvent}/>;
            case 'gigs':
                return <Gigs userData={userData} gigs={gigs} />;
            case 'financials':
                return <Financials userData={userData}
                                   financials={financials}
                                   onDeleteFinancial={handleDeleteFinancial}/>;
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
        <div className="wrapper">
            <Container>
                <div className="sidebar-vertical">
                    <Sidebar handleLinkClick={handleLinkClick} isAdmin={isAdmin} />
                </div>
            </Container>
            <Container>
                <Title title={"Account"} />
                <div className="content">
                    {selectedContent === '' && (
                        <div>
                            <h2 style={{ marginBottom: '20px', display: 'block' }}>{dashboardTitle}</h2>
                            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4>Your Recent Listings</h4>
                            </div>
                            <div className="card-container">
                                {gigs.filter(gig => gig.status === 'owner' && gig.is_listed === 1).slice(0, 4).map((gig) => (
                                    <div
                                        key={gig.event_id}
                                        className="custom-card"
                                        onClick={() => navigate(`/event/${gig.event_id}`)}
                                    >
                                        <div className="card-body">
                                            <h5 className="card-title">{gig.event_name}</h5>
                                            <p className="card-text">{truncateText(gig.description)}</p>
                                            <div className="card-buttons">

                                                <Button
                                                    variant="outline-secondary"
                                                    className="edit-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/form/${gig.event_id}`);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    className="unlist-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShowUnlistModal(gig);
                                                    }}
                                                >
                                                    Unlist
                                                </Button>


                                                <Button
                                                    variant="danger"
                                                    className="delete-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShowDeleteModal(gig);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}
                    {selectedContent && renderContent()}
                </div>
            </Container>
            <ConfirmationModal
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                message="Are you sure you want to delete this event?"
                onConfirm={() => handleDeleteEvent(eventToDelete)}
            />
            <ConfirmationModal
                show={showUnlistModal}
                handleClose={handleCloseUnlistModal}
                message="Are you sure you want to unlist this event?"
                onConfirm={() => handleUnlistEvent(eventToUnlist)}
            />
        </div>
    );
}

export default Account;

