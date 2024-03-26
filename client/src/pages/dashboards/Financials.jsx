import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Financials({ financials }) {
	const navigate = useNavigate();
	const [selectedRows, setSelectedRows] = useState([]);

	const handleGoBackToDashboard = () => {
		window.location.reload();
	};

	const handleCreateNewCalc = () => {
		navigate('/calculator');
	};

	const handleRowSelect = (index) => {
		if (selectedRows.includes(index)) {
			setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
		} else {
			setSelectedRows([...selectedRows, index]);
		}
	};

	if (!Array.isArray(financials) || financials.length === 0) {
		return <p>No financial data available.</p>;
	}

	return (
		<div>
			<div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
					<Button variant="link" onClick={handleGoBackToDashboard} style={{ textDecoration: 'underline' }}>Go back to Dashboard</Button>
					<h2>Financials</h2>
				</div>

				<div>
					<Button className="btn btn-dark" variant="primary" onClick={handleCreateNewCalc}>Calculate New Wage </Button>
					<Button variant="success"  disabled={selectedRows.length === 0}>Export to PDF</Button>
				</div>
			</div>
			<Table striped bordered hover>
				<thead>
				<tr>
					<th>Select</th>
					<th>Date</th>
					<th>Event Hours</th>
					<th>Calculation</th>
					<th>Total Wage</th>
				</tr>
				</thead>
				<tbody>
				{financials.map((financial, index) => (
					<tr key={index}>
						<td><input type="checkbox" checked={selectedRows.includes(index)} onChange={() => handleRowSelect(index)} /></td>
						<td>{financial.date}</td>
						<td>{financial.event_hours}</td>
						<td>{financial.fin_name}</td>
						<td>${financial.total_wage}</td>
					</tr>
				))}
				</tbody>
			</Table>
		</div>
	);
}

export default Financials;
