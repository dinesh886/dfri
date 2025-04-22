import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLogin from '../pages/AdminLogin';
import UserLogin from '../pages/UserLogin';
import ManageData from '../pages/admin/ManageData';
import FootExam from '../pages/admin/FootExam';
import DoctorList from '../pages/admin/DoctorList';
import Profile from '../pages/admin/Profile';
import ChangePassword from '../pages/admin/ChangePassword';
import HomePage from '../pages/HomePage';
import UserDashboard from '../pages/user/UserDashboard';
import Unauthorized from '../pages/Unauthorized';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin protected routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/manage-data" element={<ManageData />} />
                <Route path="/admin/foot-exam" element={<FootExam />} />
                <Route path="/admin/doctor-list" element={<DoctorList />} />
                <Route path="/admin/profile" element={<Profile />} />
                <Route path="/admin/change-password" element={<ChangePassword />} />
            </Route>

            {/* User (Doctor) protected routes */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                <Route path="/user/dashboard" element={<UserDashboard />} />
                {/* Add more doctor-specific routes here when ready */}
                {/* <Route path="/user/patient-records" element={<PatientRecords />} /> */}
            </Route>

            {/* Shared protected routes (for both admin and user) */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
                <Route path="/settings" element={<ChangePassword />} />
                {/* Add more shared routes here */}
            </Route>

            {/* Fallback routes */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;