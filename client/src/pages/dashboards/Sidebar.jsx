import React from 'react';
import Container from 'react-bootstrap/Container';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import '../../App.css';

function Sidebar({ handleLinkClick, isAdmin }) {
    return (
        <Navbar expand="lg" className="">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto sidebar-vertical">
                        <Nav.Link
                            onClick={() => handleLinkClick('listings')}
                            href="#"
                        >Listings</Nav.Link>
                        <Nav.Link
                            onClick={() => handleLinkClick('gigs')}
                            href="#"
                        >Applications</Nav.Link>
                        <Nav.Link
                            onClick={() => handleLinkClick('financials')}
                            href="#">Financials</Nav.Link>
                        <Nav.Link
                            onClick={() => handleLinkClick('editProfile')}
                            href="#">Profile</Nav.Link>
                        {isAdmin && (
                            <Nav.Link
                                onClick={() => handleLinkClick('adminActions')}
                                href="#"
                                className="custom-link"
                            >
                                Admin
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Sidebar;


