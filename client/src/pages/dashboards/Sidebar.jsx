import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import '../../App.css';

function Sidebar({ handleLinkClick, isAdmin }) {
    //States
    const [deviceType, setDeviceType] = useState("browser");
    const [sidebarOrientation, setSidebarOrientation] = useState("sidebar-vertical");

    //Use effect
    useEffect(() => {
        updateStyle();

        //Set update style
        window.addEventListener("resize", updateStyle); 
    }, [])

    //Update overflow
    function updateStyle()
    {
        if (window.innerWidth >= 992)
        {
            setDeviceType("browser"); 
            setSidebarOrientation("sidebar-vertical");
        } 
        else
        {
            setDeviceType("mobile");
            setSidebarOrientation("sidebar");
        } 
    }

    return (
        <>
        <Navbar className="">
            <Container>
                    <Nav className={`me-auto ${sidebarOrientation}`}>
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
            </Container>
        </Navbar>
        {deviceType === "mobile" && <hr />}
        </>
    );
}

export default Sidebar;


