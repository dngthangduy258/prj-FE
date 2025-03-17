import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCheckbox
  } from 'mdb-react-ui-kit';
  
function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiUrlAvatar = process.env.REACT_APP_API_UR_AVATAR;


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`${apiUrl}/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data);
            } catch (error) {
                console.error('Không lấy được user:', error);
                // navigate('/login');
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Đã đăng xuất!');
        navigate('/login');
    };

    // ✅ Xử lý URL ảnh avatar
    const avatarUrl = user?.avatar
        ? `${user.avatar}`
        : '/default-avatar.png';
    console.log(avatarUrl);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Antoree</Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        {!localStorage.getItem('token') ? (
                            <>
                                <li className="nav-item">               
                                    <Link className="nav-link" to="/login"><MDBIcon fas icon="sign-in-alt" /> Login</Link>                           
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item d-flex align-items-center me-2">
                                    <img
                                        src={avatarUrl}
                                        alt="Avatar"
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '2px solid #ddd'
                                        }}
                                    />
                                </li>
                                <li className="nav-item d-flex align-items-center me-2">
                                    <span className="nav-link">
                                        Welcome, {user?.name || '...'}!
                                    </span>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={handleLogout}
                                    >
                                        Logout <MDBIcon fas icon="sign-out-alt" />
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
