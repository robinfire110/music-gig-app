import React from "react";
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

const LogoutButton = () => {
    const navigate = useNavigate();
    const [,, removeCookie] = useCookies([]);

    const logOut = () => {
        removeCookie("jwt");
        navigate("/register");
    };

    return (
        <Nav.Item>
            <Nav.Link onClick={logOut}>Logout</Nav.Link>
        </Nav.Item>
    );
};

export default LogoutButton;
