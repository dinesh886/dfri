"use client"

import { useState, useRef, useEffect } from "react"
import { FaUserCircle, FaUserCog, FaLock, FaSignOutAlt, FaChevronDown } from "react-icons/fa"
import "./Header.css"

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    // Close dropdown when clicking outside 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <header className="admin-header">
            <div className="header-content">
                <div className="header-title">
                    {/* <h1>Hospital Management System</h1> */}
                </div>

                <div className="header-actions">
                    <div className="profile-dropdown" ref={dropdownRef}>
                        <button
                            className={`profile-button ${isDropdownOpen ? 'active' : ''}`}
                            onClick={toggleDropdown}
                            aria-expanded={isDropdownOpen}
                            aria-label="User profile menu"
                        >
                            <div className="profile-info">
                                <FaUserCircle className="profile-icon" />
                                <span className="profile-name">Dr. John Doe</span>
                                <FaChevronDown className={`dropdown-arrow ${isDropdownOpen ? 'rotate' : ''}`} />
                            </div>
                        </button>

                        <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                            <a href="/admin/profile" className="dropdown-item">
                                <FaUserCog className="dropdown-icon" />
                                <span>My Profile</span>
                            </a>
                            <a href="/admin/change-password" className="dropdown-item">
                                <FaLock className="dropdown-icon" />
                                <span>Change Password</span>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="/logout" className="dropdown-item logout">
                                <FaSignOutAlt className="dropdown-icon" />
                                <span>Logout</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header