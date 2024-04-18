import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../App.css'
import { getBackendURL } from "../Utils"
import Select from "react-select";


const Register = () => {
	const navigate = useNavigate();
	const [instruments, setInstruments] = useState([])
	const [selectedInstruments, setSelectedInstruments] = useState([])
	const [values, setValues] = useState({
		email: '',
		password: '',
		f_name: '',
		l_name: '',
		zip: '',
		instruments: '',
		bio: ''
	});

	useEffect(() => {
		axios.get(`${getBackendURL()}/instrument/`).then(async (res) => {
			//Create instruments
			setInstruments(res.data);
			console.log(res.data)
		}).catch(error => {
			console.log(error);
		});
	}, []);

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
	const displaySelectedInstruments = () => {
		console.log("Selected Instruments:", selectedInstruments);
	};

	const configureInstrumentList = (data) => {
		const instrumentOptionList = []
		data.forEach(instrument => {
			instrumentOptionList.push({value: instrument.instrument_id, label: instrument.name});
		});
		return instrumentOptionList
	}

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
	};

	return (
		<div>
			<div className="register-container">
				<h2>Register Account</h2>
				<Form  className="register-form" onSubmit={handleSubmit}>
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
						<Form.Label>Last Name</Form.Label>
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
						<Form.Label>Instruments (select multiple)</Form.Label>
						<Select
							options={configureInstrumentList(instruments)}
							name="instruments"
							isMulti
							onChange={(selectedOptions) => setSelectedInstruments(selectedOptions)}
							value={selectedInstruments}
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
