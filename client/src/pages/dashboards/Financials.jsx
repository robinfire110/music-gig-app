import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { saveSpreadsheetAll } from '../../Utils';
import ConfirmationModal from './ConfirmationModal';

function Financials({ financials, onDeleteFinancial }) {
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredFinancials, setFilteredFinancials] = useState([]);
	const [selectedRows, setSelectedRows] = useState([]);
	const [financialToDelete, setFinancialToDelete] = useState(null);
	const [deleteMessage, setDeleteMessage] = useState('');
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [financialsPerPage] = useState(10);
	const navigate = useNavigate();

	useEffect(() => {
		setFilteredFinancials(financials);
	}, [financials]);

	useEffect(() => {
		const filtered = financials.filter(financial =>
			financial.fin_name.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredFinancials(filtered);
	}, [searchQuery, financials]);

	const handleRowSelect = (index) => {
		if (selectedRows.includes(index)) {
			setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
		} else {
			setSelectedRows([...selectedRows, index]);
		}
	};

	const handleCreateNewCalc = () => {
		navigate('/calculator');
	};

	const handleExportAllToSpreadsheet = () => {
		const selectedData = filteredFinancials.filter((financial, index) => selectedRows.includes(index));
		if (selectedData.length > 0) {
			saveSpreadsheetAll(selectedData);
		} else {
			alert("No rows selected for export.");
		}
	};

	const handleExportToSpreadsheet = () => {
		selectedRows.forEach(index => {
			const selectedData = [filteredFinancials[index]];
			saveSpreadsheetAll(selectedData, selectedData[0].fin_name);
		});
	};

	const handleDeleteFinancial = (financial) => {
		setFinancialToDelete(financial);
		setDeleteMessage(`Are you sure you want to delete '${financial.fin_name}' record?`);
		setShowConfirmationModal(true);
	};

	const handleConfirmDeleteFinancial = () => {
		if (financialToDelete) {
			onDeleteFinancial(financialToDelete);
			setFinancialToDelete(null);
			setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== financialToDelete.index));
		}
		setShowConfirmationModal(false);
	};

	const handleRowClick = (financial) => {
		navigate(`/calculator/${financial.fin_id}`);
	};

	const indexOfLastFinancial = currentPage * financialsPerPage;
	const indexOfFirstFinancial = indexOfLastFinancial - financialsPerPage;
	const currentFinancials = filteredFinancials.slice(indexOfFirstFinancial, indexOfLastFinancial);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div>
			<div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2>Financials</h2>
				<h5>Select records to export</h5>
				<div>
					<div className="button-container">
						<Button className="btn btn-dark mr-2" variant="primary" onClick={handleCreateNewCalc}>Calculate New Wage</Button>
					</div>
					<div className="button-container">
						<Button variant="success mr-2" onClick={handleExportAllToSpreadsheet} disabled={selectedRows.length === 0}>Export All to Spreadsheet</Button>
					</div>
					<div className="button-container">
						<Button variant="success mr-2" onClick={handleExportToSpreadsheet} disabled={selectedRows.length === 0}>Export Individual Spreadsheet</Button>
					</div>
					<div style={{ marginTop: '20px', marginBottom: '20px', width: '100%'}}>
						<input
							type="text"
							placeholder="Search financials..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							style={{
								width: '100%',
								padding: '8px',
								paddingLeft: '30px',
								borderRadius: '20px',
								border: '1px solid #ced4da',
							}}
						/>
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
				{currentFinancials.map((financial, index) => (
					<tr key={index} style={{ cursor: 'pointer' }} onClick={() => handleRowClick(financial)}>
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
			{filteredFinancials.length > financialsPerPage && (
				<ul style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none', padding: 0 }}>
					{[...Array(Math.ceil(filteredFinancials.length / financialsPerPage)).keys()].map(number => (
						<li key={number} style={{ cursor: 'pointer', margin: '0 5px' }} onClick={() => paginate(number + 1)}>
							{number + 1}
						</li>
					))}
				</ul>
			)}
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

