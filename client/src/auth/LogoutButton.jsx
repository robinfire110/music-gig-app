import React from "react";
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import {toast, ToastContainer} from 'react-toastify';

const LogoutButton = () => {
    const navigate = useNavigate();
    const [,, removeCookie] = useCookies([]);

    const logOut = () => {
        removeCookie("jwt");
        navigate("/");
        toast.success('You have been successfully logged out!', {
            position: "top",
            autoClose: 2000
        });
    };

    return (
        <Nav.Item>
            <Nav.Link onClick={logOut}>Logout</Nav.Link>
        </Nav.Item>
    );
};

export default LogoutButton;
