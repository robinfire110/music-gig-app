import React from 'react';
import { Nav } from 'react-bootstrap';
import '../../App.css'

function Sidebar({ handleLinkClick }) {
    return (
        <Nav className="custom-sidebar flex-column">
            <Nav.Link onClick={() => handleLinkClick('editProfile')} href="#">Profile</Nav.Link>
            <Nav.Link onClick={() => handleLinkClick('gigs')} href="#">Gigs</Nav.Link>
            <Nav.Link onClick={() => handleLinkClick('financials')} href="#">Financials</Nav.Link>
        </Nav>
    );
}

export default Sidebar;

