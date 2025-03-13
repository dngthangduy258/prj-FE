import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../pages/Navbar'; 
import Footer from './Footer';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // users đã lọc theo role
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleFilter, setRoleFilter] = useState('all'); // filter role
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const apiUrl = process.env.REACT_APP_API_URL;
    const apiUrlAvatar = process.env.REACT_APP_API_UR_AVATAR;
    // useEffect(() => {
    //     fetchUsers();
    // }, []);

     useEffect(() => {applyRoleFilter(roleFilter);}, [roleFilter, users]);

    useEffect(() => {
        // Nếu không có token, về login luôn
        if (!token) {
            navigate('/login');
            return;
        }
    
        const checkUserRole = async () => {
            try {
                const response = await axios.get(`${apiUrl}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const currentUser = response.data;
    
                // Nếu là user thì về trang welcome
                if (currentUser.role === 'user') {
                    navigate('/welcome');
                }else{
                    fetchUsers();
                }
    
            } catch (error) {
                // console.error('Lỗi xác thực người dùng:', error);
                alert('Phiên đăng nhập hết hạn hoặc không có quyền!');
                navigate('/login');
            }
        };
    
        checkUserRole();
    
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${apiUrl}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            // console.error('Error fetching users:', error);
            alert('Bạn không có quyền hoặc token hết hạn!');
            navigate('/login');
        }
    };

    const applyRoleFilter = (role) => {
        if (role === 'all') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user => user.role === role);
            setFilteredUsers(filtered);
        }
    };

    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;
        try {
            await axios.delete(`${apiUrl}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Xóa user thành công');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Xóa thất bại');
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${apiUrl}/users/${selectedUser.id}`, selectedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Cập nhật user thành công');
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            // alert('Cập nhật thất bại');
            // console.log('error:', error); // Log chi tiết lỗi ở đây
            alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleChange = (e) => {
        setSelectedUser({
            ...selectedUser,
            [e.target.name]: e.target.value,
        });
    };

    return (

        
        <div className="d-flex flex-column min-vh-100">
            <Nav /> 
            <div className="container mt-5 flex-grow-1">
                <h2>Dashboard - Quản lý Users</h2>

                {/* Role Filter */}
                <div className="mb-4">
                    <label className="form-label fw-bold">Lọc theo role:</label>
                    <select
                        className="form-select w-25"
                        value={roleFilter}
                        onChange={handleRoleFilterChange}
                    >
                        <option value="all">Tất cả</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>

                {selectedUser ? (
                    <div>
                        <h3>Chỉnh sửa User</h3>
                        <div className="mb-3">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={selectedUser.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={selectedUser.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Role</label>
                            <select
                                className="form-control"
                                name="role"
                                value={selectedUser.role}
                                onChange={handleChange}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button className="btn btn-success" onClick={handleUpdate}>Lưu</button>
                        <button className="btn btn-secondary ms-2" onClick={() => setSelectedUser(null)}>Hủy</button>
                    </div>
                ) : (
                    <div>
                        <h3>Danh sách Users</h3>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(user)}>Sửa</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Không có user nào!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
}

export default Dashboard;
