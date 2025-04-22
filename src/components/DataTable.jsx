"use client";

import { useState, useMemo } from "react";
import { FaEye, FaEdit, FaTrash, FaFileCsv, FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import "./DataTable.css";

const DataTable = ({
    data = [],
    columns = [],
    onAddNew,
    searchPlaceholder = "Search...",
    exportFileName = "data_export",
    rowsPerPageOptions = [10, 25, 50],
    defaultRowsPerPage = 10
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

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

    // CSV Export
    const exportToCSV = () => {
        const headers = columns.map(col => col.header);
        const keys = columns.map(col => col.key);

        const csvContent = [
            headers.join(","),
            ...filteredData.map(row =>
                keys.map(key => `"${row[key] || ''}"`).join(",")
            )
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${exportFileName}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
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
                        >
                            {action.icon}
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
        <div className="admin-table-container">
            {/* Table Controls */}
            <div className="table-controls">
                <div className="controls-group">
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
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="action-buttons-container">
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

            {/* Pagination - Same as before */}
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