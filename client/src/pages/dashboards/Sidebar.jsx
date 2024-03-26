import React from 'react';
import { Nav } from 'react-bootstrap';
import '../../App.css';

function Sidebar({ handleLinkClick }) {
    return (
        <div className="custom-sidebar-container">
            <Nav className="custom-sidebar flex-column">
                <Nav.Link
                    onClick={() => handleLinkClick('gigs')}
                    href="#"
                    className="custom-link"
                >
                    Listings
                </Nav.Link>
                <Nav.Link
                    onClick={() => handleLinkClick('financials')}
                    href="#"
                    className="custom-link"
                >
                    Financials
                </Nav.Link>
                <Nav.Link
                    onClick={() => handleLinkClick('editProfile')}
                    href="#"
                    className="custom-link"
                >
                    Profile
                </Nav.Link>
            </Nav>
        </div>
    );
}

export default Sidebar;


