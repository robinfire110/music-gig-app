import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Tab, Tabs, Table, Row, Col, Form} from "react-bootstrap";
import ConfirmationModal from './ConfirmationModal';
import PasswordResetModal from "./PasswordResetModal";
import { PaginationControl } from 'react-bootstrap-pagination-control';

function AdminActions({  userData, postData, onPasswordReset, onPromoteUser, onDemoteUser, onDeleteUser, onDeletePost }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryPosts, setSearchQueryPosts] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [resetPassMessage, setResetPassMessage] = useState('');
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
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


    useEffect(() => {
        const filteredPosts = postData.filter(post =>
            post.event_name.toLowerCase().includes(searchQueryPosts.toLowerCase())
        );
        setFilteredPosts(filteredPosts);
    }, [searchQueryPosts, postData]);



    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchPostsInputChange = (event) => {
        setSearchQueryPosts(event.target.value);
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

    const handleDeletePost = (post) => {
        setPostToDelete(post);
        setActionToConfirm(() => () => onDeletePost(post));
        setConfirmationMessage(`Are you sure you want to delete ${post.event_name} by ${post.f_name}?`);
        setShowConfirmationModal(true);
    }

    const handlePostClick = (eventId) => {
        navigate(`../event/${eventId}`);
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

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    //const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    //const paginatePosts = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Tabs defaultActiveKey="users" id="admin-actions-tabs" onSelect={() => {setCurrentPage(1)}}>
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
                    </div>
                    <Row className="justify-content-center">
                        <Col lg={{offset: 1}} sm={{offset: 1}} xs={{offset: 1}}>
                            <PaginationControl page={currentPage} total={filteredUsers.length} limit={itemsPerPage} changePage={(page) => {setCurrentPage(page)}} ellipsis={1}/>
                        </Col>
                        <Col lg={1} sm={1} xs={1}>
                            <Form.Select className="float-right" value={itemsPerPage} style={{width: "5rem", float: "right"}} onChange={(e) => {setItemsPerPage(e.target.value);}}>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={9999}>All</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="posts" title="Posts">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ marginTop: '20px', marginBottom: '20px', width: '50%'}}>
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQueryPosts}
                                onChange={handleSearchPostsInputChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    paddingLeft: '30px',
                                    borderRadius: '20px',
                                    border: '1px solid #ced4da',
                                }}
                            />
                        </div>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date Created</th>
                                <th>Name</th>
                                <th>Created By</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentPosts.map(post => (
                                <tr key={post.event_id} style={{ cursor: 'pointer' }} onClick={() => handlePostClick(post.event_id)}>
                                    <td>{post.event_id}</td>
                                    <td>{new Date(post.date_posted).toLocaleDateString()}</td>
                                    <td>{post.event_name}</td>
                                    <td>{post.f_name} {post.l_name}</td>
                                    <td>
                                        <Button variant="danger" style={{ marginRight: '5px' }} onClick={(e) => { e.stopPropagation(); handleDeletePost(post); }}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                    <Row className="justify-content-center">
                        <Col lg={{offset: 1}} sm={{offset: 1}} xs={{offset: 1}}>
                            <PaginationControl page={currentPage} total={filteredPosts.length} limit={itemsPerPage} changePage={(page) => {setCurrentPage(page)}} ellipsis={1}/>
                        </Col>
                        <Col lg={1} sm={1} xs={1}>
                            <Form.Select className="float-right" value={itemsPerPage} style={{width: "5rem", float: "right"}} onChange={(e) => {setItemsPerPage(e.target.value);}}>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={9999}>All</option>
                            </Form.Select>
                        </Col>
                    </Row>
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


