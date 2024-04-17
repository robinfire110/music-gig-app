import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { saveSpreadsheetAll } from '../../Utils';
import ConfirmationModal from './ConfirmationModal';


function Financials({ financials, onDeleteFinancial }) {
	const [selectedRows, setSelectedRows] = useState([]);
	const [financialToDelete, setFinancialToDelete] = useState([]);
	const [deleteMessage, setDeleteMessage] = useState([]);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const navigate = useNavigate();

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
		console.log("is export all to spreadsheet working?")
		const selectedData = financials.filter((financial, index) => selectedRows.includes(index));
		if(selectedData.length > 0) {
			saveSpreadsheetAll(selectedData);
		} else {
			alert("No rows selected for export.");
		}
	};

	const handleExportToSpreadsheet = () => {
		console.log("is export to spreadsheet working?")
		selectedRows.forEach(index => {
			const selectedData = [financials[index]];
			saveSpreadsheetAll(selectedData, selectedData[0].fin_name );
		});
	};

	const handleDeleteFinancial = (financial) =>
	{
		setFinancialToDelete(financial);
		setDeleteMessage(`Are you sure you want to delete '${financial.fin_name}' record?`);
		setShowConfirmationModal(true);
	}

	const handleConfirmDeleteFinancial = () => {
		if (financialToDelete) {
			onDeleteFinancial(financialToDelete);
			setFinancialToDelete(null);
			setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== financialToDelete.index));
		}
		setShowConfirmationModal(false);
	};


	if (!Array.isArray(financials) || financials.length === 0) {
		return <p>No financial data available.</p>;
	}

	return (
		<div>
			<div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2>Financials</h2>
				<div>
					<div className="button-container">
						<Button className="btn btn-dark mr-2" variant="primary" onClick={handleCreateNewCalc}>Calculate New Wage </Button>
					</div>
					<div className="button-container">
						<Button variant="success mr-2"  onClick={handleExportAllToSpreadsheet} disabled={selectedRows.length === 0}>Export All to Spread Sheet</Button>
					</div>
					<div className="button-container">
						<Button variant="success mr-2"  onClick={handleExportToSpreadsheet} disabled={selectedRows.length === 0}>Export Individual Spread Sheet</Button>
					</div>


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
							<Button variant="danger" style={{ marginRight: '5px' }} onClick={(e) => { e.stopPropagation(); handleDeleteFinancial(financial); }}>Delete</Button>
						</td>
					</tr>
				))}
				</tbody>
			</Table>
			<ConfirmationModal
			show={showConfirmationModal}
			handleClose={() => setShowConfirmationModal(false)}
			message={deleteMessage}
			onConfirm={handleConfirmDeleteFinancial}
		/>
		</div>
	
	);
}

export default Financials;
