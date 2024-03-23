import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import LogoutButton from '../auth/LogoutButton';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function Header() {
    const [cookies] = useCookies(['jwt']);
    const location = useLocation();

    const showLogoutButton = cookies.jwt && location.pathname !== '/login';

    return (
        <div>
            <ToastContainer />
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">Harmonize</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="justify-content-end">
                            <Nav.Item><Nav.Link href="/form">List Event</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href="/eventsearch">Events</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href="/calculator">Calculator</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href="/account">Account</Nav.Link></Nav.Item>
                            {showLogoutButton && <LogoutButton />}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default Header;
