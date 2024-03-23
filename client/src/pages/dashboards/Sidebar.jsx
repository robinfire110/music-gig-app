import React from 'react';
import { Nav } from 'react-bootstrap';

function Sidebar() {
    return (
        <Nav className="flex-column">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/analytics">Analytics</Nav.Link>
            <Nav.Link href="/settings">Settings</Nav.Link>
        </Nav>
    );
}

export default Sidebar;
