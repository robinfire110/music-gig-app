import React, {useEffect, useState} from 'react';
import {Card, Container, Row, Col, Button, Tab, Tabs, Table} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

function Gigs({ userData, gigs, onDeleteEvent, onUnlistEvent }) {
	const navigate = useNavigate();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [eventToDelete, setEventToDelete] = useState(null);
	const [eventToUnlist, setEventToUnlist] = useState(null);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [confirmationMessage, setConfirmationMessage] = useState('');
	const [actionToConfirm, setActionToConfirm] = useState(null);

	const handleCreateNewListing = () => {
		navigate('/form');
	};

	const handleDeleteEvent = (event) => {
		setEventToDelete(event);
		setActionToConfirm(() => () => onDeleteEvent(event));
		setConfirmationMessage(`Are you sure you want to delete ${event.event_name}?`);
		setShowConfirmationModal(true);
	}

	const handleUnlistEvent = (event) => {
		setEventToUnlist(event);
		setActionToConfirm(() => () => onUnlistEvent(event));
		setConfirmationMessage(`Are you sure you want to unlist ${event.event_name}?`);
		setShowConfirmationModal(true);
	}

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
			<h2>Listings</h2>
			<div>
				<Button className="btn btn-dark" variant="primary" onClick={handleCreateNewListing}>Create New Listing</Button>
			</div>
		</div>
			<Tabs defaultActiveKey="allListings" id="listings-tabs">
				<Tab eventKey="allListings" title="Listings">
					<div className="listings-card-container">
						{gigs.map((gig) => (
							<div
								key={gig.event_id}
								className="listings-custom-card"
								onClick={() => navigate(`/event/${gig.event_id}`)}
							>
								<div className="card-body">
									<h5 className="card-title">{gig.event_name}</h5>
									<p className="card-text">{truncateText(gig.description)}</p>
									<p>{gig.status === 'owner' ? 'Your Listing' : `Status: ${gig.status}`}</p>
									<div className="card-buttons">
										{gig.status === 'owner' && gig.is_listed === 0 ? (
											<Button
												variant="danger"
												className="delete-button"
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteEvent(gig);
												}}
											>
												Delete
											</Button>
										) : gig.status === 'owner' ? (
											<>
												<Button
													variant="outline-secondary"
													className="edit-button"
													onClick={(e) => {
														e.stopPropagation();
														navigate(`/form/${gig.event_id}`);
													}}
												>
													Edit
												</Button>
												<Button
													variant="outline-danger"
													className="unlist-button"
													onClick={(e) => {
														e.stopPropagation();
														handleUnlistEvent(gig);
													}}
												>
													Unlist
												</Button>
												<Button
													variant="danger"
													className="delete-button"
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteEvent(gig);
													}}
												>
													Delete
												</Button>
											</>
										) : gig.status === 'applied' ? (
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
										) : null}
									</div>
								</div>
							</div>
						))}
					</div>
				</Tab>

				<Tab eventKey="applied" title="Active">
					<h2 className="current-listings-header">All your current Listings</h2>
					<div className="listings-card-container">
						{gigs
							.filter(gig => gig.is_listed && gig.status === 'owner')
							.map((gig) => (
								<div
									key={gig.event_id}
									className="listings-custom-card"
									onClick={() => navigate(`/event/${gig.event_id}`)}
								>
									<div className="card-body">
										<h5 className="card-title">{gig.event_name}</h5>
										<p className="card-text">{truncateText(gig.description)}</p>
										<p>{gig.status === 'owner' ? 'Your Listing' : `Status: ${gig.status}`}</p>
										<div className="card-buttons">
											<Button
												variant="outline-secondary"
												className="edit-button"
												onClick={(e) => {
													e.stopPropagation();
													navigate(`/form/${gig.event_id}`);
												}}
											>
												Edit
											</Button>
											{gig.status === 'owner' && (
												<>
													<Button
														variant="outline-danger"
														className="unlist-button"
														onClick={(e) => {
															e.stopPropagation();
															handleUnlistEvent(gig);
														}}
													>
														Unlist
													</Button>
													<Button
														variant="danger"
														className="delete-button"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteEvent(gig);
														}}
													>
														Delete
													</Button>
												</>
											)}
										</div>
									</div>
								</div>
							))}
					</div>

					<h2 className="current-listings-header">Your upcoming Events</h2>
					<div className="listings-card-container">
						{gigs
							.filter(gig => gig.status === 'accept')
							.map((gig) => (
								<div
									key={gig.event_id}
									className="listings-custom-card"
									onClick={() => navigate(`/event/${gig.event_id}`)}
								>
									<div className="card-body">
										<h5 className="card-title">{gig.event_name}</h5>
										<p className="card-text">{truncateText(gig.description)}</p>
										<p>{gig.status === 'owner' ? 'Your Listing' : `Status: ${gig.status}`}</p>
										<div className="card-buttons">
										</div>
									</div>
								</div>
							))}
					</div>
				</Tab>
				<Tab eventKey="pending" title="Pending">
					<div className="listings-card-container">
						{gigs
							.filter(gig => gig.status === 'applied' && gig.is_listed)
							.map((gig) => (
								<div
									key={gig.event_id}
									className="listings-custom-card"
									onClick={() => navigate(`/event/${gig.event_id}`)}
								>
									<div className="card-body">
										<h5 className="card-title">{gig.event_name}</h5>
										<p className="card-text">{truncateText(gig.description)}</p>
										<p>{gig.status === 'owner' ? 'Your Listing' : `Status: ${gig.status}`}</p>
										<div className="card-buttons">
											{gig.status === 'owner' ? (
												<>
													<Button
														variant="outline-secondary"
														className="edit-button"
														onClick={(e) => {
															e.stopPropagation();
															navigate(`/form/${gig.event_id}`);
														}}
													>
														Edit
													</Button>
													<Button
														variant="outline-danger"
														className="unlist-button"
														onClick={(e) => {
															e.stopPropagation();
															handleUnlistEvent(gig);
														}}
													>
														Unlist
													</Button>
													<Button
														variant="danger"
														className="delete-button"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteEvent(gig);
														}}
													>
														Delete
													</Button>
												</>
											) : gig.status === 'applied' ? (
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
											) : null}
										</div>
									</div>
								</div>
							))}
					</div>
				</Tab>
				<Tab eventKey="closed" title="Closed">
					<div className="listings-card-container">
						{gigs
							.filter(gig => gig.status === 'withdraw' || gig.status === 'rejected' || !gig.is_listed)
							.map((gig) => (
								<div
									key={gig.event_id}
									className="listings-custom-card"
									onClick={() => navigate(`/event/${gig.event_id}`)}
								>
									<div className="card-body">
										<h5 className="card-title">{gig.event_name}</h5>
										<p className="card-text">{truncateText(gig.description)}</p>
										<p>{gig.status === 'owner' ? 'Your Listing' : `Status: ${gig.status}`}</p>
										<div className="card-buttons">
											{gig.status === 'owner' && (
												<Button
													variant="danger"
													className="delete-button"
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteEvent(gig);
													}}
												>
													Delete
												</Button>
											)}
											{gig.status === 'applied' && (
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
											)}
										</div>
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


