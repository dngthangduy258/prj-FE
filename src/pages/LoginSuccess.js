import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function LoginSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    const apiUrl = process.env.REACT_APP_API_URL;
    const apiUrlAvatar = process.env.REACT_APP_API_UR_AVATAR;
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
            axios.get(`${apiUrl}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then((res) => {
                const user = res.data;
                localStorage.setItem('user', JSON.stringify(user));

                if (user.role === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/welcome');
                }
            }).catch(() => {
                navigate('/login');
            });
        } else {
            navigate('/login');
        }
    }, [location.search]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="loader"></div>
        </div>
    );
    
}

export default LoginSuccess;
