import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';

const HomePage = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Redirect authenticated users to the admin dashboard, else show login page
    if (isAuthenticated) {
        return <Navigate to="/admin/manage-data" />;
    }

    return <Navigate to="/admin-login" />;
};

export default HomePage;
