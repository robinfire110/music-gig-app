import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserDash from './dashboards/UserDash';
import Spinner from 'react-bootstrap/Spinner';

function Account() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setGigs(data.gigs);
            } catch (error) {
                console.error('Error fetching user gigs:', error);
            }
        };

        if (userData) {
            fetchUserGigs();
        }
    }, [userData]);

    if (loading) {
        return <Spinner />;
    }
    return <UserDash isAdmin={isAdmin} userData={userData} />;
}

export default Account;

