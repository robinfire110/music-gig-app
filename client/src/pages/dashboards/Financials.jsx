import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { saveSpreadsheetAll } from '../../Utils';


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

	const handleExportAllToSpreadsheet = () => {
		const selectedData = financials.filter((financial, index) => selectedRows.includes(index));
		if(selectedData.length > 0) {
			saveSpreadsheetAll(selectedData);
		} else {
			alert("No rows selected for export.");
		}
	};

	const handleExportToSpreadsheet = () => {
		selectedRows.forEach(index => {
			const selectedData = [financials[index]];
			saveSpreadsheetAll(selectedData, selectedData[0].fin_name );
		});
	};

	const handleDeleteFinancial = (finId) =>
	{
		console.log("remove this financial")
	}


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
					<Button variant="success"  onClick={handleExportAllToSpreadsheet} disabled={selectedRows.length === 0}>Export All to Spread Sheet</Button>
					<Button variant="success"  onClick={handleExportToSpreadsheet} disabled={selectedRows.length === 0}>Export Individual Spread Sheet</Button>
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
					<th>Action</th>
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
						<td>
							<Button variant="danger" style={{ marginRight: '5px' }} onClick={(e) => { e.stopPropagation(); handleDeleteFinancial(financial.fin_id); }}>Delete</Button>
						</td>
					</tr>
				))}
				</tbody>
			</Table>
		</div>
	);
}

export default Financials;
