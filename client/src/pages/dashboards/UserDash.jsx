import React, { useState, useEffect } from 'react';
import { Container} from "react-bootstrap";
import Sidebar from './Sidebar';
import Header from '../../components/Header';
import EditProfile from '../dashboards/EditProfile';
import Gigs from '../dashboards/Gigs';
import Financials from '../dashboards/Financials';

function UserDash({ userData }) {
	const [selectedContent, setSelectedContent] = useState('');

	const handleLinkClick = (content) => {
		setSelectedContent(content);
	};
	return (
		<>
			<Header />
			<Container fluid>
				<div style={{ display: 'flex' }}>
					<div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
						<Sidebar handleLinkClick={handleLinkClick} />
					</div>
					<div style={{ flex: '1', padding: '20px' }}>
						{selectedContent === 'editProfile' && <EditProfile userData={userData} />}
						{selectedContent === 'gigs' && <Gigs userData={userData} />}
						{selectedContent === 'financials' && <Financials userData={userData} />}
					</div>
				</div>
			</Container>
		</>
	);
}

export default UserDash;
