import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navbar, Container, Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Header from '../../components/Header';

function UserDash() {
	return (
		<>
			<Header />
			<div style={{ display: 'flex' }}>
				<div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
					<Sidebar />
				</div>
				<div style={{ flex: '1', padding: '20px' }}>
					<h2>UserDash</h2>
					{/* Main content of your dashboard */}
					{/* You can place your dashboard components/routes here */}
				</div>
			</div>
		</>
	);
}

export default UserDash;
