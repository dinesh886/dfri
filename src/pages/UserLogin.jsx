import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';

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

            // Redirect to intended location or default dashboard
            const from = location.state?.from?.pathname || '/user/dashboard';
            navigate(from, { replace: true });
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>User Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;