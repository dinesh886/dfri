import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectCurrentRole } from '../features/auth/authSlice';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectCurrentRole);
    const location = useLocation();
    const fromLocation = location.state?.from;
    const previousPath = fromLocation?.pathname || '/';

    // Determine the appropriate login route based on path
    const getLoginRoute = () => {
        if (location.pathname.startsWith('/admin')) return '/admin-login';
        if (location.pathname.startsWith('/user')) return '/user-login';
        return '/login'; // Fallback for other routes
    };

    // Determine the appropriate dashboard route based on role
    const getDashboardRoute = () => {
        if (role === 'admin') return '/admin/ManageData';
        if (role === 'user') return '/user/dashboard';
        return '/'; // Fallback for other roles
    };

    // Handle unauthenticated users
    if (!isAuthenticated) {
        return <Navigate to={getLoginRoute()} state={{ from: location }} replace />;
    }

    // Handle unauthorized roles
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    // Prevent role crossover (admins accessing user routes and vice versa)
    if ((role === 'admin' && location.pathname.startsWith('/user')) ||
        (role === 'user' && location.pathname.startsWith('/admin'))) {
        return <Navigate to={getDashboardRoute()} replace />;
    }

    // Handle direct access to protected parent routes
    if (location.pathname.endsWith('/') && location.pathname.length > 1) {
        return <Navigate to={previousPath || getDashboardRoute()} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;