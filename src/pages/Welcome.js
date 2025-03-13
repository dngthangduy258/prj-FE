import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar';
import Footer from './Footer';

function Welcome() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: '' // ➡ Thêm trường avatar vào đây
    });
    
    const [errors, setErrors] = useState({});
    const [avatarPreview, setAvatarPreview] = useState('/default-avatar.png');
    const [avatarFile, setAvatarFile] = useState(null);

    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiUrlAvatar = process.env.REACT_APP_API_UR_AVATAR;
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${apiUrl}/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userData = response.data;

            setUser(userData);
            setFormData({
                name: response.data.name,
                email: response.data.email,
                password: '',
                password_confirmation: '',
                avatar: response.data.avatar // ➡ Thêm avatar vào đây
            });
            
            setAvatarPreview(
                userData.avatar
                    ? `${apiUrlAvatar}/${userData.avatar}`
                    : '/default-avatar.png'
            );
        } catch (error) {
            console.error(error);
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            setErrors({ ...errors, avatar: '' });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);

            if (formData.password) {
                data.append('password', formData.password);
                data.append('password_confirmation', formData.password_confirmation);
            }

            if (avatarFile) {
                data.append('avatar', avatarFile);
            }
            console.log("avatarFile:",avatarFile);
            const response = await axios.post(
                `${apiUrl}/user?_method=PUT`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            alert('Cập nhật thông tin thành công!');
            setErrors({});
            fetchUser(); // Load lại user sau khi cập nhật
            window.location.reload();
        } catch (error) {
            console.error(error);

            if (error.response && error.response.status === 422) {
                const apiErrors = error.response.data.errors;
                setErrors(apiErrors);
            } else {
                alert('Cập nhật thất bại!');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Nav />
            <div className="container mt-5 flex-grow-1">
                <h2>Chào mừng, {user?.name}</h2>

                <div className="text-center mb-4">
                    <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                </div>

                <div className="card mt-4">
                    <div className="card-header">Cập nhật thông tin cá nhân</div>
                    <div className="card-body">
                        <form onSubmit={handleUpdate} encType="multipart/form-data">

                            {/* Tên */}
                            <div className="form-group mb-3">
                                <label htmlFor="name">Tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && (
                                    <small className="text-danger">{errors.name[0]}</small>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && (
                                    <small className="text-danger">{errors.email[0]}</small>
                                )}
                            </div>

                            {/* Mật khẩu mới */}
                            <div className="form-group mb-3">
                                <label htmlFor="password">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Để trống nếu không muốn đổi mật khẩu"
                                />
                                {errors.password && (
                                    <small className="text-danger">{errors.password[0]}</small>
                                )}
                            </div>

                            {/* Xác nhận mật khẩu */}
                            <div className="form-group mb-3">
                                <label htmlFor="password_confirmation">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Xác nhận lại mật khẩu mới"
                                />
                                {errors.password_confirmation && (
                                    <small className="text-danger">{errors.password_confirmation[0]}</small>
                                )}
                            </div>

                            {/* Avatar */}
                            <div className="form-group mb-3">
                                <label htmlFor="avatar">Ảnh đại diện</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="avatar"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                                {errors.avatar && (
                                    <small className="text-danger">{errors.avatar[0]}</small>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Lưu thay đổi
                            </button>
                        </form>
                    </div>
                </div>

                <button className="btn btn-danger mt-4" onClick={handleLogout}>
                    Đăng xuất
                </button>
            </div>
            
            <Footer/>
        </div>
    );
}

export default Welcome;
