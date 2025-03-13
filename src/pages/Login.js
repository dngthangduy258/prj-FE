import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../pages/Navbar';
import Footer from '../pages/Footer';
import { Link } from 'react-router-dom';

// MDB UI Kit
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
} from 'mdb-react-ui-kit';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleToken = params.get('token');

    if (googleToken) {
      localStorage.setItem('token', googleToken);

      axios
        .get(`${apiUrl}/profile`, {
          headers: { Authorization: `Bearer ${googleToken}` }
        })
        .then((res) => {
          const user = res.data;
          localStorage.setItem('user', JSON.stringify(user));

          if (user.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/welcome');
          }
        })
        .catch(() => {
          alert('Xác thực Google thất bại');
        });
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const user = JSON.parse(userData);
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/welcome');
      }
    }
  }, [location.search, navigate, apiUrl]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/welcome');
      }
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/auth/google/redirect`;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav />

      <main className="flex-grow-1">
        <MDBContainer fluid className="p-3 my-5 h-custom">
          <MDBRow>
            <MDBCol col="10" md="6">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample"
              />
            </MDBCol>

            <MDBCol col="4" md="6">
              <form onSubmit={handleLogin}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email address"
                  id="email"
                  type="email"
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  id="password"
                  type="password"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="d-flex justify-content-between mb-4">
                  <MDBCheckbox
                    name="rememberMe"
                    id="rememberMe"
                    label="Remember me"
                  />
                  <a href="#!">Forgot password?</a>
                </div>

                <div className="text-center text-md-start mt-4 pt-2">
                  <button type="submit" className="btn btn-primary mb-0 px-5" size="lg">
                    Login
                  </button>
                  
                  
                  

                </div>
              </form>
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">Or</p>
              </div>

              <div className="d-flex flex-row align-items-left justify-content-left">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="me-2 d-flex align-items-center"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#4285F4',
                    border: '1px solid #dadce0',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}
                >
                  <MDBIcon fab icon="google" style={{ color: '#4285F4', marginRight: '8px' }} />
                  Sign in with Google
                </button>
              </div>

              <p className="small fw-bold mt-2 pt-1 mb-2">
                Don't have an account?{' '}
                <Link className="nav-link d-inline text-danger" to="/register">
                  Register
                </Link>
              </p>
            </MDBCol>
          </MDBRow>


        </MDBContainer>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
