import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import { selectCurrentUser } from '../../features/auth/authSlice';

const Profile = () => {
    const user = useSelector(selectCurrentUser);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update profile API call
            const response = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Profile update failed');
            }

            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    return (
        <AdminLayout>
            <div className="page-content">
                <h1>Profile Settings</h1>
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="save-btn">Save Changes</button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default Profile;