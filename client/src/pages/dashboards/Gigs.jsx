import React, {useEffect} from 'react';
import {Card, Container, Row, Col, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

function Gigs({ userData, gigs }) {
	const navigate = useNavigate();

	const handleCardClick = (eventId) => {
		navigate(`../event/${eventId}`);
	};
	const handleCreateNewListing = () => {
		navigate('/form');
	};

	const isInPast = (dateString) => {
		const eventDate = new Date(dateString);
		const currentDate = new Date();
		return eventDate < currentDate;
	};

	const pastEvents = gigs.filter((gig) => isInPast(gig.end_time) || !gig.is_listed);
	const currentUserEvents = gigs.filter(gig => gig.is_listed);

	const renderGigsAsCards = (gigs) => {
		return (
			<Container>
				<Row xs={1} md={2} lg={3}>
					{gigs.map((gig) => (
						<Col key={gig.event_id}>
							<Card onClick={() => handleCardClick(gig.event_id)} style={{ cursor: 'pointer' }}>
								<Card.Body>
									<Card.Title>{gig.event_name}</Card.Title>
									<Card.Text>{gig.description}</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
		);
	};

	return (
		<div>
			<div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2>Listings</h2>
				<div>
					<Button className="btn btn-dark" variant="primary" onClick={handleCreateNewListing}>Create New Listing</Button>
				</div>
			</div>
			<div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
				<h3>Your Current Listings</h3>
				{renderGigsAsCards(gigs.filter((gig) => gig.is_listed))}
			</div>
			<div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
				<h3>Past Listings</h3>
				{renderGigsAsCards(
					gigs.filter((gig) => new Date(gig.end_time) < new Date() || !gig.is_listed)
				)}
			</div>

			<div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
				<h3>Listings you've applied to</h3>
			</div>
		</div>
	);
}

export default Gigs;


