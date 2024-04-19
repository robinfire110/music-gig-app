import React, { useState, useEffect } from 'react';
import {Form, Button, Container} from 'react-bootstrap';
import {toast, ToastContainer} from 'react-toastify';
import axios from 'axios';
import {getBackendURL} from "../../Utils";
import UserPasswordResetModal from "../dashboards/UserPasswordResetModal";
import Select from "react-select";

function EditProfile({ userData,  onUserChange }) {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		f_name: '',
		l_name: '',
		zip: '',
		instruments: '',
		bio: ''

	});

	const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
	const [instruments, setInstruments] = useState([])
	const [selectedInstruments, setSelectedInstruments] = useState([])

	const generateError = (err) => toast.error(err, {
		position: "bottom-right",
	})

	useEffect(() => {
		axios.get(`${getBackendURL()}/instrument/`).then(async (res) => {
			//Create instruments
			setInstruments(res.data);
		}).catch(error => {
			console.error(error);
		});
	}, []);

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

	const configureInstrumentList = (data) => {
		const instrumentOptionList = []
		data.forEach(instrument => {
			instrumentOptionList.push({value: instrument.instrument_id, label: instrument.name});
		});
		return instrumentOptionList
	}


	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${getBackendURL()}/account/update_user`, formData, {
				withCredentials: true
			});
			if (response.data.success) {
				onUserChange(formData);
				toast.success('Profile updated successfully' , { theme: 'dark' });
			} else {
				toast.error('Failed to update profile', { theme: 'dark' });
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			toast.error('Failed to update profile');
		}
	};

	const togglePasswordResetModal = () => {
		setShowPasswordResetModal(!showPasswordResetModal);
	};

	return (
		<Container style={{ maxWidth: '600px', position: 'relative' }}>
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
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<div className="d-flex align-items-center">
						<Form.Control
							type="password"
							placeholder="Password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							disabled
						/>
						<Button style={{ marginLeft: '15px' }} className="btn btn-dark" variant="secondary" onClick={togglePasswordResetModal}>
							Reset Password
						</Button>
					</div>
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
					<Form.Label>Instruments (select multiple)</Form.Label>
					<Select
						options={configureInstrumentList(instruments)}
						name="instruments"
						isMulti
						onChange={(selectedOptions) => setSelectedInstruments(selectedOptions)}
						value={selectedInstruments}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Your Instruments</Form.Label>
					<Form.Control
						as="textarea"
						rows={3}
						value={formData.instruments}
						readOnly
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
			<UserPasswordResetModal
				show={showPasswordResetModal}
				handleClose={togglePasswordResetModal}
				isAdmin={false}
			/>
		</Container>
	);
}

export default EditProfile;


