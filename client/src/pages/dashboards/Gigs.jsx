import React, {useEffect, useState} from 'react';
import {Button, Tab, Tabs} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

function Gigs({ userData, gigs, onGigsChange }) {
	const navigate = useNavigate();
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [confirmationMessage, setConfirmationMessage] = useState('');
	const [actionToConfirm, setActionToConfirm] = useState(null);


	useEffect(() => {

		if (onGigsChange) {
			onGigsChange(gigs);
		}
	}, [gigs, onGigsChange]);

	const handleWithdrawEvent = (event) => {
		navigate(`/event/${event.event_id}`);
	}

	const handleConfirmation = () => {
		if (actionToConfirm) {
			actionToConfirm();
			setActionToConfirm(null);
		}
		setShowConfirmationModal(false);
	};

	const handleSeeMoreClick = (gig) => {
		navigate(`/event/${gig.event_id}`);
	}

	function truncateText(text, maxLength = 50) {
		if (text.length <= maxLength) {
			return text;
		} else {
			return text.substring(0, maxLength) + '...';
		}
	}


	return (
		<>
			<div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			<h2>Your Gigs</h2>
			<div>
				<Button className="btn btn-dark" variant="primary" onClick={() => navigate(`/eventsearch`)}>Apply to more Gigs!</Button>
			</div>
		</div>
			<Tabs defaultActiveKey="gigs" id="listings-tabs">
				<Tab eventKey="gigs" title="Gigs">
					<h2 className="current-listings-header">Your Upcoming Gigs</h2>
					<div className="listings-card-container">
						{gigs
							.filter(gig => gig.is_listed && gig.status === 'accept')
							.map((gig) => (
							<div
								key={gig.event_id}
								className="listings-custom-card"
								onClick={() => navigate(`/event/${gig.event_id}`)}
							>
								<div className="card-body">
									<h5 className="card-title">{gig.event_name}</h5>
									<p className="card-text">Event Date: {gig.start_time}</p>
									{gig.addresses && gig.addresses.length > 0 && (
										<div>
											{gig.addresses.map((address, index) => (
												<div key={index}>
													<p className="card-text">Address: {address.street}, {address.city}, {address.state}, {address.zip}</p>
												</div>
											))}
										</div>
									)}
									<p className="card-text">
										<a href="#" onClick={() => handleSeeMoreClick(gig)}>Click for more details</a>
									</p>
									<p className="card-text">Status: {gig.status === 'accept' ? 'You have been hired for this gig!' : gig.status}</p>
								</div>
							</div>
						))}
					</div>
				</Tab>
				<Tab eventKey="pending" title="Pending">
					<h2 className="current-listings-header">Gigs you've Applied to</h2>
					<div className="listings-card-container">
						{gigs
							.filter(gig => gig.is_listed && gig.status === 'applied')
							.map((gig) => (
								<div
									key={gig.event_id}
									className="listings-custom-card"
									onClick={() => navigate(`/event/${gig.event_id}`)}
								>
									<div className="card-body">
										<h5 className="card-title">{gig.event_name}</h5>
										<p className="card-text">Event Date: {gig.start_time}</p>
										{gig.addresses && gig.addresses.length > 0 && (
											<div>
												{gig.addresses.map((address, index) => (
													<div key={index}>
														<p className="card-text">Address: {address.street}, {address.city}, {address.state}, {address.zip}</p>
													</div>
												))}
											</div>
										)}
										<p className="card-text">
										<a href="#" onClick={() => handleSeeMoreClick(gig)}>Click for more details</a>
									</p>
										<p>{gig.status === 'owner' ? 'Your Listing' : gig.status === 'applied' ? 'Pending Approval' : `Status: ${gig.status}`}</p>
										<div className="card-buttons">
											<Button
												variant="outline-danger"
												className="withdraw-button"
												onClick={(e) => {
													e.stopPropagation();
													handleWithdrawEvent(gig);
												}}
											>
												Withdraw
											</Button>
										</div>
									</div>
								</div>
							))}
					</div>
				</Tab>
				<Tab eventKey="closed" title="Closed">
					<h2 className="current-listings-header">Closed Listings</h2>
					<div className="listings-card-container">
						{gigs
							.filter(gig => gig.status === 'withdraw' || gig.status === 'rejected')
							.map((gig) => (
								<div
									key={gig.event_id}
									className="listings-custom-card"
									onClick={() => navigate(`/event/${gig.event_id}`)}
								>
									<div className="card-body">
										<h5 className="card-title">{gig.event_name}</h5>
										<p className="card-text">Event Date: {gig.start_time}</p>
										{gig.addresses && gig.addresses.length > 0 && (
											<div>
												{gig.addresses.map((address, index) => (
													<div key={index}>
														<p className="card-text">Address: {address.street}, {address.city}, {address.state}, {address.zip}</p>
													</div>
												))}
											</div>
										)}
										<p className="card-text">
											<a href="#" onClick={() => handleSeeMoreClick(gig)}>Click for more details</a>
										</p>
										<p>
											{gig.status === 'withdraw' ? 'You withdrew' :
													gig.status === 'reject' ? 'Not accepted' :
														`Status: ${gig.status}`}
										</p>

									</div>
								</div>
							))}
					</div>
				</Tab>
			</Tabs>
			<ConfirmationModal
				show={showConfirmationModal}
				handleClose={() => setShowConfirmationModal(false)}
				message={confirmationMessage}
				onConfirm={handleConfirmation}
			/>
		</>
	);
}

export default Gigs;


