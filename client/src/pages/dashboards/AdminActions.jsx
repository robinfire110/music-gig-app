import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";
import {Button, Tab, Tabs} from "react-bootstrap";


function AdminActions({ userData }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(20);
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredUsers(userData);
    }, [userData]);

    useEffect(() => {
        const filtered = userData.filter(user =>
            user.f_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, userData]);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleUserClick = (userId) => {
        navigate(`../profile/${userId}`);
    };

    const handleEditUser = (userId) => {
        console.log('Edit user:', userId);
    };

    const handlePromoteUser = (userId) => {
        console.log('Edit user:', userId);
    };

    const handleDeleteUser = (userId) => {
        console.log('Delete user:', userId);
    };

    const handleGoBackToDashboard = () => {
        window.location.reload();
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
                        <div>
                            <h2>Search Users</h2>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                style={{ width: '100%', padding: '8px', margin: '10px 0' }}
                            />
                        </div>
                        <div>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {currentUsers.map(user => (
                                    <li key={user.user_id} style={{ cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => handleUserClick(user.user_id)}>
                                        <span>{user.f_name} {user.l_name}</span>
                                        <div>
                                            <FontAwesomeIcon icon={faUser} style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handlePromoteUser(user.user_id); }} />
                                            <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleEditUser(user.user_id); }} />
                                            <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.user_id); }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Pagination */}
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
                    {/* Content for Posts Tab */}
                    {/* Add post related logic here */}
                </Tab>
            </Tabs>
        </>
    );
}

export default AdminActions;


