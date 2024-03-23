import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navbar, Container, Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Header from '../../components/Header';

function AdminDash() {
    const navigate = useNavigate();
    const [cookies, , removeCookie] = useCookies([]);

    useEffect(() => {
        const verifyUser = async () => {
            if (!cookies.jwt) {
                navigate('/login');
            } else {
                try {
                    const { data } = await axios.get('http://localhost:5000/account', { withCredentials: true });
                    toast(`hi ${data.user}`, { theme: 'dark' });
                } catch (error) {
                    removeCookie('jwt');
                    navigate('/login');
                }
            }
        };
        verifyUser();
    }, [cookies, navigate, removeCookie]);

    return (
        <>
            <Header />
            <div style={{ display: 'flex' }}>
                <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
                    <Sidebar />
                </div>
                <div style={{ flex: '1', padding: '20px' }}>
                    {/* Main content of your dashboard */}
                    {/* You can place your dashboard components/routes here */}
                </div>
            </div>
        </>
    );
}

export default AdminDash;

