import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Tab, Tabs, Table} from "react-bootstrap";
import ConfirmationModal from './ConfirmationModal';
import PasswordResetModal from "./PasswordResetModal";

function AdminActions({  userData, onPasswordReset, onPromoteUser, onDemoteUser, onDeleteUser }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(20);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [resetPassMessage, setResetPassMessage] = useState('');
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userToResetPass, setUserToResetPass] = useState(null);
    const [userToDemote, setUserToDemote] = useState(null);
    const [userToPromote, setUserToPromote] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredUsers(userData);
    }, [userData]);

    useEffect(() => {
        const filtered = userData.filter(user =>
            user.f_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.l_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, userData]);


    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleUserClick = (userId) => {
        navigate(`../profile/${userId}`);
    };

    const handlePasswordReset = (user) => {
        setUserToResetPass(user);
        setResetPassMessage(`Are you sure you want to reset the password for ${user.email}?`)
        setShowPasswordResetModal(true);
    };

    const handlePromoteUser = (user) => {
        setUserToPromote(user);
        setActionToConfirm(() => () => {
            onPromoteUser(user);
        });
        setConfirmationMessage(`Are you sure you want to promote ${user.email} to Admin?`);
        setShowConfirmationModal(true);
    };


    const handleDemoteUser = (user) => {
        setUserToDemote(user);
        setActionToConfirm(() => () => onDemoteUser(user));
        setConfirmationMessage(`Are you sure you want to demote ${user.email} from Admin?`);
        setShowConfirmationModal(true);
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setActionToConfirm(() => () => onDeleteUser(user));
        setConfirmationMessage(`Are you sure you want to delete ${user.email}?`);
        setShowConfirmationModal(true);
    };

    const handleGoBackToDashboard = () => {
        window.location.reload();
    };

    const handleConfirmation = () => {
        if (actionToConfirm) {
            actionToConfirm();
            setActionToConfirm(null);
        }
        setShowConfirmationModal(false);
    };

    const handlePasswordResetConfirm = (newPassword) => {
        onPasswordReset(userToResetPass, newPassword);
        setShowPasswordResetModal(false);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (
        <>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                    <Button variant="link" onClick={handleGoBackToDashboard} style={{ textDecoration: 'underline' }}>Go back to Dashboard</Button>
                </div>
            </div>
            <Tabs defaultActiveKey="users" id="admin-actions-tabs">
                <Tab eventKey="users" title="Users">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ marginTop: '20px', marginBottom: '20px', width: '50%'}}>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    paddingLeft: '30px',
                                    backgroundImage: `url('/icons8-search-20.svg')`,
                                    backgroundPosition: '5px center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '20px 20px',
                                    borderRadius: '20px',
                                    border: '1px solid #ced4da',

                            }}
                            />
                        </div>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Last Online</th>
                                <th>User Type</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.user_id} style={{ cursor: 'pointer' }} onClick={() => handleUserClick(user.user_id)}>
                                    <td>{user.user_id}</td>
                                    <td>{user.f_name} {user.l_name}</td>
                                    <td>{user.email}</td>
                                    <td></td>
                                    <td><td>{user.isAdmin ? 'Admin' : 'User'}</td></td>
                                    <td>
                                        {user.isAdmin ? (
                                            <Button variant="warning" style={{ marginRight: '5px' }} onClick={(e) => { e.stopPropagation(); handleDemoteUser(user); }}>Demote</Button>
                                        ) : (
                                            <Button variant="primary" style={{ marginRight: '5px' }} onClick={(e) => { e.stopPropagation(); handlePromoteUser(user); }}>Promote</Button>
                                        )}
                                        <Button variant="secondary" style={{ marginRight: '5px' }} onClick={(e) => { e.stopPropagation(); handlePasswordReset(user); }}>Reset Password</Button>
                                        <Button variant="danger" style={{ marginRight: '5px' }} onClick={(e) => { e.stopPropagation(); handleDeleteUser(user); }}>Delete</Button>

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <ul style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none', padding: 0 }}>
                            {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map(number => (
                                <li key={number} style={{ cursor: 'pointer', margin: '0 5px' }} onClick={() => paginate(number + 1)}>
                                    {number + 1}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Tab>
                <Tab eventKey="posts" title="Posts">

                </Tab>
            </Tabs>
            <ConfirmationModal
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                message={confirmationMessage}
                onConfirm={handleConfirmation}
            />
            <PasswordResetModal
                show={showPasswordResetModal}
                handleClose={() => setShowPasswordResetModal(false)}
                message={resetPassMessage}
                onConfirm={handlePasswordResetConfirm}
            />
        </>
    );
}

export default AdminActions;


