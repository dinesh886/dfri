"use client";

import { useState, useMemo } from "react";
import {
    FaEye, FaEdit, FaTrash, FaFileCsv,
    FaSearch, FaDownload, FaPlus, FaFileUpload,
    FaFileDownload, FaFilter, FaTimes, FaFileExcel
} from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { BsDownload } from "react-icons/bs";
import { IoFilterOutline } from "react-icons/io5";
import { DatePicker } from "antd";
import * as XLSX from "xlsx";
import ExportModal from "./ExportModal";
import "./DataTable.css";

const DataTable = ({
    data = [],
    columns = [],
    // Button visibility controls
    showSearch = true,
    showAddNew = true,
    showDownloadSample = true,
    showUploadExcel = true,
    showExport = true,
    // Action handlers
    onAddNew,
    onDownloadSample,
    onUploadExcel,
    // Other props
    searchPlaceholder = "Search...",
    exportFileName = "data_export",
    rowsPerPageOptions = [10, 25, 50],
    defaultRowsPerPage = 10
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [loadingStates, setLoadingStates] = useState({
        addNew: false,
        downloadSample: false,
        uploadExcel: false,
        export: false
    });
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState("csv");
    const [dateRange, setDateRange] = useState([null, null]);
    const [gender, setGender] = useState("all");
    const [ageRange, setAgeRange] = useState({ min: "", max: "" });

    // Memoized filtered and sorted data
    const filteredData = useMemo(() => {
        let result = [...data];

        // Filtering
        if (searchTerm) {
            result = result.filter((row) => {
                return columns.some((col) => {
                    if (col.searchable === false) return false;
                    const value = row[col.key];
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        }


        // Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, columns, searchTerm, sortConfig]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Sorting handler
    const requestSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc'
            ? 'desc'
            : 'asc';
        setSortConfig({ key, direction });
    };

    // Action handlers with loading states
    const handleAction = async (actionName, actionFn) => {
        setLoadingStates(prev => ({ ...prev, [actionName]: true }));
        try {
            await actionFn?.();
        } finally {
            setLoadingStates(prev => ({ ...prev, [actionName]: false }));
        }
    };

    const handleExport = (filters) => {
        handleAction('export', () => {
            // Apply filters
            let filteredExportData = [...data];

            // Date range filter
            if (filters.dateRange[0] && filters.dateRange[1]) {
                filteredExportData = filteredExportData.filter(row => {
                    const rowDate = new Date(row.date);
                    return rowDate >= filters.dateRange[0] && rowDate <= filters.dateRange[1];
                });
            }

            // Gender filter
            if (filters.gender !== "all" && filters.gender) {
                filteredExportData = filteredExportData.filter(row => row.gender === filters.gender);
            }

            // Age filter
            if (filters.ageRange.min || filters.ageRange.max) {
                filteredExportData = filteredExportData.filter(row => {
                    const age = row.age;
                    return (
                        (!filters.ageRange.min || age >= parseInt(filters.ageRange.min)) &&
                        (!filters.ageRange.max || age <= parseInt(filters.ageRange.max))
                    );
                });
            }

            // Prepare headers and keys
            const headers = columns.map(col => col.header);
            const keys = columns.map(col => col.key);

            if (filters.format === "csv") {
                // CSV Export
                const csvContent = [
                    headers.join(","),
                    ...filteredExportData.map(row =>
                        keys.map(key => `"${row[key] || ''}"`).join(","))
                ].join("\n");

                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${exportFileName}_${new Date().toISOString().slice(0, 10)}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Excel Export
                const worksheetData = [
                    headers,
                    ...filteredExportData.map(row => keys.map(key => row[key] || ''))
                ];

                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(worksheetData);
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                XLSX.writeFile(wb, `${exportFileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
            }

            // Close modal after export
            setShowExportModal(false);
        });
    };

  

    // Cell content renderer
    const renderCellContent = (row, column) => {
        if (column.actions) {
            return (
                <div className="action-buttons">
                    {column.actions.map((action, index) => (
                        <button
                            key={index}
                            className={`action-btn ${action.name}-btn`}
                            onClick={() => action.handler(row)}
                            title={action.title}
                            disabled={loadingStates[action.name]}
                        >
                            {loadingStates[action.name] ? (
                                <div className="spinner-small" />
                            ) : (
                                action.icon
                            )}
                        </button>
                    ))}
                </div>
            );
        }

        if (column.render) {
            return column.render(row[column.key], row);
        }

        return row[column.key];
    };

    return (
        <div className="data-table-container">
            {/* Table Controls */}
            <div className="table-controls">
                <div className="controls-group">
                    {showSearch && (
                        <div className="search-container">
                            <div className="search-input-container">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder=" "
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                    id="search-input"
                                />
                                <label htmlFor="search-input" className="floating-label">
                                    {searchPlaceholder}
                                </label>
                                {searchTerm && (
                                    <button
                                        className="clear-search-btn"
                                        onClick={() => setSearchTerm("")}
                                        aria-label="Clear search"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="action-buttons-container">
                    {showAddNew && (
                        <button
                            className="Add-new action-btn"
                            onClick={() => handleAction('addNew', onAddNew)}
                            disabled={loadingStates.addNew}
                        >
                            {loadingStates.addNew ? (
                                <div className="spinner" />
                            ) : (
                                <>
                                    <FaPlus className="btn-icon" />
                                    <span className="btn-text">Add Data</span>
                                </>
                            )}
                        </button>
                    )}

                    {showDownloadSample && (
                        <button
                            className="sample-excel-download action-btn"
                            onClick={() => handleAction('downloadSample', onDownloadSample)}
                            disabled={loadingStates.downloadSample}
                        >
                            {loadingStates.downloadSample ? (
                                <div className="spinner" />
                            ) : (
                                <>
                                    <FaFileDownload className="btn-icon" />
                                    <span className="btn-text">Sample Download</span>
                                </>
                            )}
                        </button>
                    )}

                    {showUploadExcel && (
                        <button
                            className="excel-upload action-btn"
                            onClick={() => handleAction('uploadExcel', onUploadExcel)}
                            disabled={loadingStates.uploadExcel}
                        >
                            {loadingStates.uploadExcel ? (
                                <div className="spinner" />
                            ) : (
                                <>
                                    <FaFileUpload className="btn-icon" />
                                    <span className="btn-text">Excel Upload</span>
                                </>
                            )}
                        </button>
                    )}

                    {showExport && (
                        <button
                            className="download-excel action-btn"
                            onClick={() => {
                                console.log('Opening modal');
                                setShowExportModal(true);
                            }}

                        >
                            <BsDownload className="btn-icon" />
                            <span className="btn-text">Export Data</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => column.sortable !== false && requestSort(column.key)}
                                    className={column.sortable !== false ? 'sortable' : ''}
                                    aria-sort={
                                        sortConfig.key === column.key
                                            ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                                            : 'none'
                                    }
                                >
                                    <div className="th-content">
                                        {column.header}
                                        {sortConfig.key === column.key && (
                                            sortConfig.direction === 'asc' ?
                                                <FaFilter className="sort-icon asc" /> :
                                                <FaFilter className="sort-icon desc" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((row, rowIndex) => (
                                <tr key={row.id || rowIndex}>
                                    {columns.map((column) => (
                                        <td key={`${row.id || rowIndex}-${column.key}`}>
                                            {renderCellContent(row, column)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr className="no-data-row">
                                <td colSpan={columns.length}>
                                    <div className="no-data-message">
                                        No matching records found
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredData.length > rowsPerPage && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        Showing {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
                    </div>

                    <div className="pagination-controls">
                        <button
                            className="pagination-nav"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="page-numbers">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let page;
                                if (totalPages <= 5) {
                                    page = i + 1;
                                } else if (currentPage <= 3) {
                                    page = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    page = totalPages - 4 + i;
                                } else {
                                    page = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`page-number ${currentPage === page ? 'active' : ''}`}
                                        aria-label={`Page ${page}`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <span className="page-ellipsis">...</span>
                            )}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="page-number"
                                    aria-label={`Page ${totalPages}`}
                                >
                                    {totalPages}
                                </button>
                            )}
                        </div>

                        <button
                            className="pagination-nav"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Export Modal */}
        
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExport}
                isLoading={loadingStates.export}
                exportFileName={exportFileName}
                columns={columns}
                data={data}
            />
        </div>
    );
};

export default DataTable;