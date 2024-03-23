import React, { useState, useEffect } from 'react';
import { useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {Navbar, Container, Button} from 'react-bootstrap';
import Sidebar from './Sidebar';
import Header from "../../components/Header";
function AdminDash() {
    const navigate = useNavigate();
    const [cookies,setCookie,removeCookie] = useCookies([]);
     useEffect(() => {
     const verifyUser = async  () => {
         if(!cookies.jwt){
             navigate("/login");
         }else{
             const {data} =  await axios.post(
                 "http://localhost:5000", {}, {withCredentials:true}
             );
             if(!data.status) {
                 removeCookie("jwt")
                 navigate("/login");
             }else{
                 toast(`hi ${data.user}`, {theme:"dark"});
             }
         }
     };
     verifyUser();
    }, [cookies,navigate, removeCookie]);
     const logOut = () => {
         removeCookie("jwt")
         navigate("/register")
     }

    return (
        <>
            <Header/>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
                    <Sidebar />
                </div>
                <Button onClick={logOut}>Logout</Button>
                <div style={{ flex: '1', padding: '20px' }}>
                    {/* Main content of your dashboard */}
                    {/* You can place your dashboard components/routes here */}
                </div>
            </div>
        </>
    );
}

export default AdminDash;
