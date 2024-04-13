import React, {useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import Header from "../components/Header";
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import {getBackendURL} from "../Utils";
import Title from "../components/Title";

const Register = () => {
	const navigate = useNavigate();
	const [values, setValues] = useState({
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

	const handleChange = (event) => {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const {data} =  await axios.post(`${getBackendURL()}/register`, {
				...values,
			}, {
				withCredentials:true,
			});
			if(data){
				if(data.errors){
					const {email,password} = data.errors;
					if(email){
						generateError(email)
					}else if(password){
						generateError(password)
					}
				}else{
					navigate("/");
				}
			}
		}catch (err){
			console.log(err);
		}

		console.log('Form submitted with values:', values);
	};

	return (
		<div>
			<Title title="Register"/>
			<Header />
			<div className="container-login">
				<h2>Register Account</h2>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Label>Email address</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter email"
							name="email"
							value={values.email}
							onChange={handleChange}
							required
						/>
						<Form.Text className="text-muted">
							We'll never share your email with anyone else.
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Password"
							name="password"
							value={values.password}
							onChange={handleChange}
							required
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formBasicName">
						<Form.Label>Profile Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter your name"
							name="f_name"
							value={values.f_name}
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
							value={values.l_name}
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
							value={values.zip}
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
							value={values.instruments}
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
							value={values.bio}
							onChange={handleChange}
						/>
					</Form.Group>

					<Button className="btn btn-dark" variant="primary" type="submit">
						Submit
					</Button>
					<span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
				</Form>
				<ToastContainer />
			</div>
		</div>
	);
}

export default Register;
