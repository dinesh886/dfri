"use client";

import { useState, useMemo } from "react";
import { FaEye, FaEdit, FaTrash, FaFileCsv, FaSearch, FaPlus, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import "./DataTable.css";

const DataTable = ({
    data = [],
    columns = [],
    onAddNew,
    onView,
    onEdit,
    onDelete,
    searchPlaceholder = "Search...",
    exportFileName = "data_export",
    rowsPerPageOptions = [10, 25, 50],
    defaultRowsPerPage = 10
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    const filteredData = useMemo(() => {
        let result = [...data];

        // Filtering
        if (searchTerm) {
            result = result.filter((row) => {
                return columns.some((col) => {
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

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [data, columns, searchTerm, sortConfig]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const exportToCSV = () => {
        const headers = columns.map(col => col.header);
        const keys = columns.map(col => col.key);

        const csvContent =
            headers.join(",") +
            "\n" +
            filteredData.map((row) =>
                keys.map(key => {
                    const value = row[key];
                    // Format dates if needed
                    if (key.toLowerCase().includes('date') && value instanceof Date) {
                        return `"${new Date(value).toLocaleDateString()}"`;
                    }
                    return `"${value || ''}"`;
                }).join(",")
            ).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${exportFileName}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    const handleClear = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    const renderCellContent = (row, column) => {
        const value = row[column.key];

        if (column.render) {
            return column.render(value, row);
        }

        if (column.key.toLowerCase().includes('date') && value) {
            return new Date(value).toLocaleDateString();
        }

        if (column.key.toLowerCase() === 'status' && value) {
            return (
                <span className={`status-badge ${String(value).toLowerCase()}`}>
                    {value}
                </span>
            );
        }

        return value;
    };

    return (
        <div className="admin-table-container">
            {/* Table Controls */}
            <div className="table-controls">
                {/* Left side - Search and Filter */}
                <div className="controls-group">
                    {/* Search with floating label effect */}
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
                                <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Rows per page selector */}
                    <div className="rows-per-page-selector">
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="rows-per-page-select"
                        >
                            {rowsPerPageOptions.map(option => (
                                <option key={option} value={option}>
                                    Show {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reset filters button */}
                    {searchTerm && (
                        <button className="reset-filters-btn" onClick={handleClear}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M6 7v12a2 2 0 002 2h8a2 2 0 002-2V7m-4-4v3m-6-3v3" />
                            </svg>
                            Reset
                        </button>
                    )}
                </div>

                {/* Right side - Action buttons */}
                <div className="action-buttons-container">
                    {onAddNew && (
                        <button className="add-new-btn" onClick={onAddNew}>
                            <FaPlus className="btn-icon" />
                            <span className="btn-text">Add New</span>
                        </button>
                    )}
                    <button className="export-btn" onClick={exportToCSV}>
                        <FaFileCsv className="btn-icon" />
                        <span className="btn-text">Export as CSV</span>
                    </button>
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
                                >
                                    <div className="th-content">
                                        {column.header}
                                        {sortConfig.key === column.key && (
                                            sortConfig.direction === 'asc' ? <CiFilter /> : <IoFilterOutline />
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onView || onEdit || onDelete) && (
                                <th>Actions</th>
                            )}
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
                                    {(onView || onEdit || onDelete) && (
                                        <td className="actions-cell">
                                            {onView && (
                                                <button
                                                    className="action-btn view-btn"
                                                    onClick={() => onView(row)}
                                                    title="View"
                                                >
                                                    <FaEye />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    className="action-btn edit-btn"
                                                    onClick={() => onEdit(row)}
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    className="action-btn delete-btn"
                                                    onClick={() => onDelete(row)}
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr className="no-data-row">
                                <td colSpan={columns.length + ((onView || onEdit || onDelete) ? 1 : 0)}>
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
                                // Show first pages, current page with neighbors, and last pages
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
        </div>
    );
};

export default DataTable;