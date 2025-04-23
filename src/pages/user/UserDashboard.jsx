import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import DataTable from '../../components/DataTable';
import './UserDashboard.css';

const UserDashboard = () => {
    // Sample data for doctor's dashboard
    const doctorData = [
        {
            sNo: 1,
            patientId: "PT-101",
            patientName: "John Doe",
            appointmentDate: "2023-05-15",
            diagnosis: "Hypertension",
            status: "Completed",
            lastVisit: "2023-04-10"
        },
        {
            sNo: 2,
            patientId: "PT-102",
            patientName: "Jane Smith",
            appointmentDate: "2023-05-16",
            diagnosis: "Diabetes",
            status: "Pending",
            lastVisit: "2023-03-15"
        },
        {
            sNo: 3,
            patientId: "PT-103",
            patientName: "Robert Brown",
            appointmentDate: "2023-05-17",
            diagnosis: "Asthma",
            status: "Scheduled",
            lastVisit: "2023-02-20"
        },
        {
            sNo: 4,
            patientId: "PT-104",
            patientName: "Sarah Johnson",
            appointmentDate: "2023-05-18",
            diagnosis: "Migraine",
            status: "Completed",
            lastVisit: "2023-01-05"
        },
        {
            sNo: 5,
            patientId: "PT-105",
            patientName: "Michael Davis",
            appointmentDate: "2023-05-19",
            diagnosis: "Arthritis",
            status: "Pending",
            lastVisit: "2022-12-12"
        },
        {
            sNo: 6,
            patientId: "PT-106",
            patientName: "Emily Wilson",
            appointmentDate: "2023-05-20",
            diagnosis: "Depression",
            status: "Completed",
            lastVisit: "2022-11-18"
        }
    ];

    // Define columns for the DataTable
    const columns = [
        {
            key: 'sNo',
            header: 'S.NO',
            sortable: true
        },
        {
            key: 'patientId',
            header: 'Patient ID',
            sortable: true
        },
        {
            key: 'patientName',
            header: 'Patient Name',
            sortable: true
        },
        {
            key: 'appointmentDate',
            header: 'Appointment Date',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            key: 'diagnosis',
            header: 'Diagnosis',
            sortable: true
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (value) => (
                <span className={`status-badge ${value.toLowerCase()}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'lastVisit',
            header: 'Last Visit',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        }
    ];

    const handleView = (row) => {
        console.log("View patient:", row);
        // Implement your view logic here
    };

    const handleAddNew = () => {
        console.log("Add new patient clicked");
        // Implement your add new logic here
    };

    return (
        <UserLayout>
            <div className="doctor-dashboard">
                {/* <div className="dashboard-header">
                    <h1>Doctor Dashboard</h1>
                    <p>Manage your patients and appointments</p>
                </div> */}

              

                <DataTable
                    data={doctorData}
                    columns={columns}
                    onAddNew={handleAddNew}
                    onView={handleView}
                    searchPlaceholder="Search patients..."
                    exportFileName="doctor_patients"
                    rowsPerPageOptions={[5, 10, 25]}
                    defaultRowsPerPage={5}
                    title="Patient Records"
                />
            </div>
        </UserLayout>
    );
};

export default UserDashboard;
