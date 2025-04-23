"use client";

import { useState } from "react";
import { FaDownload, FaTimes, FaCalendarAlt } from "react-icons/fa";
import { DatePicker } from "antd";
import { BsDownload } from "react-icons/bs";
import './ExportModal.css';

const ExportModal = ({
    isOpen,
    onClose,
    onExport,
    isLoading,
    exportFileName = "data_export",
    columns = [],
    data = []
}) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [gender, setGender] = useState("all");
    const [ageRange, setAgeRange] = useState({ min: "", max: "" });

    const handleExportClick = () => {
        const exportFilters = {
            dateRange,
            gender,
            ageRange
        };
        onExport(exportFilters);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="export-modal">
                <div className="modal-header">
                    <h3>Export Data</h3>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Close export modal"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="filter-section">
                        <div className="filter-group">
                            <label className="filter-label">Date Range</label>
                            <div className="date-picker-wrapper">
                                <DatePicker.RangePicker
                                    value={dateRange}
                                    onChange={setDateRange}
                                    format="DD-MM-YYYY"
                                    className="date-range-picker"
                                    suffixIcon={<FaCalendarAlt className="calendar-icon" />}
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Gender</label>
                            <div className="gender-tabs">
                                <button
                                    className={`gender-tab ${gender === 'all' ? 'active' : ''}`}
                                    onClick={() => setGender('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`gender-tab ${gender === 'male' ? 'active' : ''}`}
                                    onClick={() => setGender('male')}
                                >
                                    Male
                                </button>
                                <button
                                    className={`gender-tab ${gender === 'female' ? 'active' : ''}`}
                                    onClick={() => setGender('female')}
                                >
                                    Female
                                </button>
                            </div>
                        </div>


                        <div className="filter-group">
                            <label className="filter-label">Age Range</label>
                            <div className="age-range-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={ageRange.min}
                                    onChange={(e) => setAgeRange({ ...ageRange, min: e.target.value })}
                                    className="age-input"
                                />
                                <span className="range-separator">to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={ageRange.max}
                                    onChange={(e) => setAgeRange({ ...ageRange, max: e.target.value })}
                                    className="age-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className="action-btn download-excel"
                        onClick={handleExportClick}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="spinner"></div>
                        ) : (
                            <>
                                    <BsDownload className="btn-icon" /> Export Data
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;