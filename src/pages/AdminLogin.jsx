import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice'; // Assuming you have the slice for auth

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Hardcoded credentials (example: admin@admin.com / admin123)
        const validEmail = 'admin@admin.com';
        const validPassword = 'admin123';

        if (email === validEmail && password === validPassword) {
            // Dispatching the credentials to Redux
            dispatch(setCredentials({
                user: { email: validEmail },
                token: 'fake-jwt-token', // You can create a fake token if needed
                role: 'admin',
            }));

            // Redirecting to admin dashboard
            navigate('/admin/manage-data');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Admin Login</h2>
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
                    <button type="submit" className="auth-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
