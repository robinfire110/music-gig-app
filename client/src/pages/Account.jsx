import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserDash from './dashboards/UserDash';
import Spinner from 'react-bootstrap/Spinner';

function Account() {
    const navigate = useNavigate();
    const [cookies, , removeCookie] = useCookies([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const verifyUser = async () => {
            if (!cookies.jwt) {
                navigate('/login');
            } else {
                try {
                    const { data } = await axios.get('http://localhost:5000/account', { withCredentials: true });
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

    if (loading) {
        return <Spinner />;
    }
    return <UserDash isAdmin={isAdmin} />;
}

export default Account;

