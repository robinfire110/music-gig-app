import React, { useState, useEffect } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import Sidebar from './Sidebar'; 
function AdminDash() {
     useEffect(() => {
        // Your authentication logic
    }, []);

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">Harmonize</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Your navbar links */}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
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
