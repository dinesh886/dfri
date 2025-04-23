import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import DataTable from "../../components/DataTable";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import "./ManageData.css";
import doctor from '../../assets/images/doctor.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorList = () => {
    const [data, setData] = useState([
        {
            id: 1,
            name: "Dr. John Doe",
            email: "john.doe@example.com",
            phone: "123-456-7890",
            image: doctor,
            status: "Enabled",
        },
        {
            id: 2,
            name: "Dr. Jane Smith",
            email: "jane.smith@example.com",
            phone: "987-654-3210",
            image: doctor,
            status: "Enabled",
        },
        {
            id: 3,
            name: "Dr. Emily Davis",
            email: "emily.davis@example.com",
            phone: "555-123-4567",
            image: doctor,
            status: "Disabled",
        },
    ]);

    const handleView = (row) => {
        console.log("View doctor:", row);
        toast.info(`Viewing ${row.name}'s details`);
    };

    const handleEdit = (row) => {
        console.log("Edit doctor:", row);
        toast.success(`Editing ${row.name}'s information`);
    };

    const handleDelete = (row) => {
        if (confirm(`Are you sure you want to delete ${row.name}?`)) {
            setData(prev => prev.filter(item => item.id !== row.id));
            toast.error(`${row.name} has been deleted`);
        }
    };

    const handleAddNew = () => {
        console.log("Add new doctor clicked");
        toast.success("Add new doctor form opened");
    };

    const toggleStatus = (row) => {
        setData(prev => prev.map(item =>
            item.id === row.id
                ? { ...item, status: item.status === "Enabled" ? "Disabled" : "Enabled" }
                : item
        ));
        toast.info(`${row.name} status changed to ${row.status === "Enabled" ? "Disabled" : "Enabled"}`);
    };

    const columns = [
        {
            key: 'id',
            header: 'ID',
            sortable: true
        },
        {
            key: 'name',
            header: 'Name',
            sortable: true
        },
        {
            key: 'email',
            header: 'Email',
            sortable: true
        },
        {
            key: 'phone',
            header: 'Phone',
            sortable: true
        },
        {
            key: 'image',
            header: 'Image',
            render: (value) => (
                <div className="doctor-image-container">
                    <img src={value} alt="Doctor" className="doctor-image" />
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (value, row) => (
                <div
                    className={`status-toggle ${value.toLowerCase()}`}
                    onClick={() => toggleStatus(row)}
                >
                    <div className="status-toggle-track">
                        <div className="status-toggle-thumb">
                            {value === "Enabled" ? (
                                <IoMdCheckmark className="status-icon" />
                            ) : (
                                <IoMdClose className="status-icon" />
                            )}
                        </div>
                    </div>
                    <span className="status-label">{value}</span>
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            actions: [
               
                {
                    name: 'delete',
                    icon: <FaTrash />,
                    title: 'Delete',
                    handler: handleDelete,
                    className: 'action-btn delete-action'
                }
            ]
        }
    ];

    return (
        <AdminLayout>
            <div className="manage-doctors-page">
                <div className="page-header">
                    <h1>Doctors Management</h1>
                    <p>Manage and monitor all registered doctors in the system</p>
                </div>

                <DataTable
                    data={data}
                    columns={columns}
                    onAddNew={handleAddNew}
                    searchPlaceholder="Search doctors..."
                    exportFileName="doctors_list"
                    rowsPerPageOptions={[10, 25, 50]}
                    defaultRowsPerPage={10}
                />

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </div>
        </AdminLayout>
    );
};

export default DoctorList;