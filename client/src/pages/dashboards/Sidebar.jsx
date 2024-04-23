import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Col, Nav, Navbar, NavDropdown, Row } from 'react-bootstrap';
import '../../App.css';
import { Link } from 'react-router-dom';

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
        <Container>
            {deviceType === "browser" && 
                <Navbar className="">
                    <Nav className={`${sidebarOrientation}`}>
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
                </Navbar>
            }
            {deviceType === "mobile" &&
            <>
            <Row>
                <Col className="mx-2 my-1">
                    <Link style={{color: "black", textDecoration: "none"}}
                        onClick={() => handleLinkClick('listings')}
                        href="#"
                    >Listings</Link>
                </Col>
                <Col className="mx-2 my-1">
                    <Link style={{color: "black", textDecoration: "none"}}
                        onClick={() => handleLinkClick('gigs')}
                        href="#"
                    >Applications</Link>
                </Col>
                <Col className="mx-2 my-1">
                    <Link style={{color: "black", textDecoration: "none"}}
                        onClick={() => handleLinkClick('financials')}
                        href="#">Financials
                    </Link>
                </Col>
                <Col className="mx-2 my-1">
                    <Link style={{color: "black", textDecoration: "none"}}
                        onClick={() => handleLinkClick('editProfile')}
                        href="#">Profile
                    </Link>
                </Col>
                {isAdmin && (
                    <Col className="mx-2 my-1">
                    <Link style={{color: "black", textDecoration: "none"}}
                        onClick={() => handleLinkClick('adminActions')}
                        href="#"
                        className="custom-link"
                    >
                        Admin
                    </Link>
                    </Col>
                )}
            </Row>
            <hr />
            </>
            }
        </Container>
        </>
    );
}

export default Sidebar;


