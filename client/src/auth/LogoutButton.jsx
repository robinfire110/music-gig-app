import React from "react";
import { Button, Form } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();
    const logout = async () => {
        navigate("/")
    };

    return (
        <Button className="Logout-button" onClick={ () => logout()}>
            Log Out
        </Button>
    );
};

export default LogoutButton;