import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../pages/Navbar';
import Footer from './Footer';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [avatar, setAvatar] = useState(null); // ✅ Thêm avatar
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiUrlAvatar = process.env.REACT_APP_API_UR_AVATAR;
    const handleRegister = async (e) => {
        e.preventDefault();

        const formData = new FormData(); // ✅ Dùng FormData thay vì object JSON
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', passwordConfirmation);
        if (avatar) {
            formData.append('avatar', avatar); // ✅ Thêm file ảnh vào form
        }

        try {
            const response = await axios.post(`${apiUrl}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Đăng ký thành công! Hãy đăng nhập.');
            navigate('/login');
        } catch (error) {
            console.log(error.response);
            alert('Đăng ký thất bại: ' + (error.response?.data?.message || 'Có lỗi xảy ra!'));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Nav />

            <div className="container mt-5 flex-grow-1">
                <h2>Register</h2>
                <form onSubmit={handleRegister} encType="multipart/form-data">
                    <div className="mb-3">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Avatar (ảnh đại diện)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button className="btn btn-success">Register</button>
                </form>
            </div>
            <Footer/>
        </div>
    );
}

export default Register;
