// src/UsersTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, FormControl, Table } from 'react-bootstrap';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/auth/users`)
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    }, []);

    const handleEditClick = (user) => {
        setEditUser(user);
        setShowEditModal(true);
    };

    const handleDeleteClick = (id) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/api/auth/delete/${id}`)
            .then(() => {
                setUsers(users.filter((user) => user.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    };

    const handleChangePasswordClick = (user) => {
        setEditUser(user);
        setShowPasswordModal(true);
    };

    const handleUpdatePassword = () => {
        if (editUser && newPassword) {
            axios
                .put(`${process.env.REACT_APP_API_URL}/api/auth/update-password/${editUser.id}`, { newPassword })
                .then(() => {
                    alert('Password updated successfully!');
                    setShowPasswordModal(false);
                    setNewPassword('');
                })
                .catch((error) => {
                    console.error('Error updating password:', error);
                });
        } else {
            alert('No user selected or password not provided.');
        }
    };

    const handleSaveEdit = () => {
        if (editUser) {
            axios
                .put(`${process.env.REACT_APP_API_URL}/api/auth/edit/${editUser.id}`, {
                    name: editUser.name,
                    email: editUser.email,
                    role: editUser.role,
                })
                .then(() => {
                    setShowEditModal(false);
                    setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
                })
                .catch((error) => {
                    console.error('Error updating user:', error);
                });
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">User Data</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <Button variant="primary" size="sm" className="me-2" onClick={() => handleEditClick(user)}>
                                        Edit
                                    </Button>
                                    <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteClick(user.id)}>
                                        Delete
                                    </Button>
                                    <Button variant="warning" size="sm" onClick={() => handleChangePasswordClick(user)}>
                                        Change Password
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Edit User Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editUser && (
                        <div>
                            <label>Name</label>
                            <FormControl
                                type="text"
                                placeholder="Name"
                                value={editUser.name}
                                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                className="mb-3"
                            />
                            <label>Email</label>
                            <FormControl
                                type="email"
                                placeholder="Email"
                                value={editUser.email}
                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                className="mb-3"
                            />
                            <label>Role</label>
                            <FormControl
                                as="select"
                                value={editUser.role}
                                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                className="mb-3"
                            >
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                                <option value="Cutting">Cutting</option>
                                <option value="Sewing">Sewing</option>
                                <option value="Quality control">Quality Control</option>
                                <option value="Packing">Packing</option>
                            </FormControl>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Change Password Modal */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mb-3"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdatePassword}>
                        Change Password
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UsersTable;
