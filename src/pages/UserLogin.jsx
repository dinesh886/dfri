import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import './UserLogin.css'; // You'll need to create this CSS file

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading } = useSelector(state => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Hardcoded credentials for user login
        const validEmail = 'user@user.com';
        const validPassword = 'user123';

        if (email === validEmail && password === validPassword) {
            dispatch(setCredentials({
                user: { email: validEmail },
                token: 'fake-jwt-token',
                role: 'user',
            }));

            const from = location.state?.from?.pathname || '/user/dashboard';
            navigate(from, { replace: true });
        } else {
            setError('Invalid email or password');
        }
    };

    const handleGoogleSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);

        dispatch(setCredentials({
            user: {
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture
            },
            token: credentialResponse.credential,
            role: 'user',
        }));

        const from = location.state?.from?.pathname || '/user/dashboard';
        navigate(from, { replace: true });
    };

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Login to access your account</p>
                </div>

                <div className="google-login-container">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="filled_blue"
                        size="large"
                        width="300"
                        shape="rectangular"
                        text="continue_with"
                    />
                </div>

                <div className="divider">
                    <span>or</span>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="input-group">
                        <FiMail className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                <span>Continue</span>
                                <FiArrowRight className="button-icon" />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <a href="/register">Sign up</a></p>
                    <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;