import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function AdminActions({ userData }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

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
        console.log('User clicked:', userId);
    };

    const handleEditUser = (userId) => {
        console.log('Edit user:', userId);
    };

    const handleDeleteUser = (userId) => {
        console.log('Delete user:', userId);
    };

    return (
        <>
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
                        {filteredUsers.map(user => (
                            <li key={user.user_id} style={{ cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center' }} onClick={() => handleUserClick(user.user_id)}>
                                <span>{user.f_name} {user.l_name}</span>
                                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleEditUser(user.user_id); }} />
                                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.user_id); }} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default AdminActions;


