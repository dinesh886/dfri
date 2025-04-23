import { useState, useEffect } from 'react';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaCog } from 'react-icons/fa';
// import Image from 'next/image';
// import logo from '@/public/logo.svg';
import './UserHeader.css';

const UserHeader = () => {
    const [user, setUser] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem('googleUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('googleUser');
        setProfileOpen(false);
    };

    return (
        <header className="user-dashboard-header">
            <div className="user-header-content">
                <div className="user-logo-container">
                    {/* Replace with your logo if necessary */}
                    <div className="logo">Logo</div>
                </div>

                <div className="user-profile-section">
                    {loading ? (
                        <div className="user-profile-skeleton"></div>
                    ) : user ? (
                        <div className="user-profile-container">
                            <button
                                className="user-profile-button"
                                onClick={() => setProfileOpen(!profileOpen)}
                                aria-expanded={profileOpen}
                                aria-label="User profile"
                            >
                                {user.picture ? (
                                    <img
                                        src={user.picture}
                                        alt="User profile"
                                        width={36}
                                        height={36}
                                        className="user-profile-image"
                                    />
                                ) : (
                                    <FaUserCircle className="user-profile-icon" />
                                )}
                                <span className="user-profile-name">{user.name || user.email}</span>
                                <FaChevronDown className={`dropdown-icon ${profileOpen ? 'open' : ''}`} />
                            </button>

                            {profileOpen && (
                                <div className="user-profile-dropdown">
                                    <div className="user-dropdown-header">
                                        {user.picture ? (
                                            <img
                                                src={user.picture}
                                                alt="User profile"
                                                width={48}
                                                height={48}
                                                className="user-dropdown-profile-image"
                                            />
                                        ) : (
                                            <FaUserCircle className="user-dropdown-profile-icon" />
                                        )}
                                        <div className="user-info">
                                            <h4>{user.name}</h4>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="user-dropdown-divider"></div>
                                    <button className="user-dropdown-item">
                                        <FaCog className="user-dropdown-item-icon" />
                                        Account Settings
                                    </button>
                                    <button
                                        className="user-dropdown-item logout"
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt className="user-dropdown-item-icon" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>Please log in to continue.</div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
