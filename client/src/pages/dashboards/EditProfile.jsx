import React, { useState, useEffect } from 'react';
import {Form, Button, Container} from 'react-bootstrap';
import {toast, ToastContainer} from 'react-toastify';
import axios from 'axios';
const { REACT_APP_BACKEND_URL } = process.env;

function EditProfile({ userData }) {
	console.log(userData);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		f_name: '',
		l_name: '',
		zip: '',
		instruments: '',
		bio: ''

	});

	const generateError = (err) => toast.error(err, {
		position: "bottom-right",
	})

	useEffect(() => {
		if (userData) {
			setFormData(prevFormData => ({
				...prevFormData,
				email: userData.email || '',
				password: userData.password || '',
				f_name: userData.f_name || '',
				l_name: userData.l_name || '',
				zip: userData.zip || '',
				instruments: userData.instruments || '',
				bio: userData.bio || ''
			}));
		}
	}, [userData]);


	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`http://${REACT_APP_BACKEND_URL}/update_user`, formData, {
				withCredentials: true
			});
			if (response.data.success) {
				toast.success('Profile updated successfully');
				window.location.reload()
			} else {
				toast.error('Failed to update profile');
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			toast.error('Failed to update profile');
		}
	};
	const handleGoBackToDashboard = () => {
		window.location.reload();
	};


	return (

		<Container style={{ maxWidth: '600px', position: 'relative' }}>
			<div style={{ position: 'absolute', left: '0', top: '0' }}>
				<Button variant="link" onClick={handleGoBackToDashboard} style={{ textDecoration: 'underline' }}>Go back to Dashboard</Button>
			</div>
			<h2>{formData.f_name}'s Profile</h2>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						disabled
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						disabled
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicName">
					<Form.Label>Profile Name</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter your name"
						name="f_name"
						value={formData.f_name}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicLastName">
					<Form.Label>Profile Name</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter your last name"
						name="l_name"
						value={formData.l_name}
						onChange={handleChange}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicLocation">
					<Form.Label>Location</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter your Zipcode"
						name="zip"
						value={formData.zip}
						onChange={handleChange}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicInstruments">
					<Form.Label>Instruments</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter instruments you play"
						name="instruments"
						value={formData.instruments}
						onChange={handleChange}
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicBio">
					<Form.Label>Bio</Form.Label>
					<Form.Control
						as="textarea"
						rows={3}
						placeholder="Enter a short bio"
						name="bio"
						value={formData.bio}
						onChange={handleChange}
					/>
				</Form.Group>

				<Button className="btn btn-dark" variant="primary" type="submit">
					Update Profile
				</Button>
			</Form>
		</Container>
	);
}

export default EditProfile;


