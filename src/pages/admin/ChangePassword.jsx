import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import './ChangePassword.css'; // CSS file

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Password strength calculator
    useEffect(() => {
        if (formData.newPassword) {
            let strength = 0;
            if (formData.newPassword.length >= 8) strength += 20;
            if (/[A-Z]/.test(formData.newPassword)) strength += 20;
            if (/[a-z]/.test(formData.newPassword)) strength += 20;
            if (/[0-9]/.test(formData.newPassword)) strength += 20;
            if (/[^A-Za-z0-9]/.test(formData.newPassword)) strength += 20;
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(0);
        }
    }, [formData.newPassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!formData.newPassword) newErrors.newPassword = 'New password is required';
        else if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';

        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your new password';
        else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSuccess('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Password changed successfully!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setErrors({ server: 'Failed to change password. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 40) return 'weak';
        if (passwordStrength <= 80) return 'medium';
        return 'strong';
    };

    return (
        <AdminLayout>
            <div className="change-password-container">
                <h1 className="change-password-title">Change Password</h1>

                {errors.server && (
                    <div className="alert error">
                        <span className="alert-icon">!</span>
                        {errors.server}
                    </div>
                )}

                {success && (
                    <div className="alert success">
                        <span className="alert-icon">✓</span>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="password-form">
                    <div className="form-group">
                        <label>Current Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword.current ? "text" : "password"}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className={errors.currentPassword ? 'error-input' : ''}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => togglePasswordVisibility('current')}
                            >
                                {showPassword.current ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword.new ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={errors.newPassword ? 'error-input' : ''}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => togglePasswordVisibility('new')}
                            >
                                {showPassword.new ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {formData.newPassword && (
                            <div className="password-strength-meter">
                                <div
                                    className={`strength-bar ${getStrengthColor()}`}
                                    style={{ width: `${passwordStrength}%` }}
                                ></div>
                                <div className="strength-labels">
                                    <span className={passwordStrength >= 20 ? 'active' : ''}>Weak</span>
                                    <span className={passwordStrength >= 60 ? 'active' : ''}>Medium</span>
                                    <span className={passwordStrength >= 100 ? 'active' : ''}>Strong</span>
                                </div>
                            </div>
                        )}

                        {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error-input' : ''}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => togglePasswordVisibility('confirm')}
                            >
                                {showPassword.confirm ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ChangePassword;