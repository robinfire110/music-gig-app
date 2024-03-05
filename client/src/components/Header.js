import React from 'react';
import { Navbar } from 'react-bootstrap';

function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <p>This is the header</p>
            {/* header content here */}
        </Navbar>
    )
}

export default Header;