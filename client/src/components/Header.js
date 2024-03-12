import React from 'react';
import { Navbar, NavDropdown, Nav, Container} from 'react-bootstrap';

function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Harmonize</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="justify-content-end">
                    {/* In the future, content will change based on logged in status */}
                    <Nav.Item><Nav.Link href="/form">List Event</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/eventsearch">Events</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/calculator">Calculator</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/account">Account</Nav.Link></Nav.Item>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;