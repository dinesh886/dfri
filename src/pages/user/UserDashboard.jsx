import React from 'react';
import Header from '../../components/Header';
import DataTable from '../../components/DataTable';

import { FaEdit } from 'react-icons/fa'; 

const sampleData = [
    {
        sNo:1,
        participantId: 'P-1001',
        participantName: 'John Doe',
        date: '2025-04-01',
        status: 'completed'
    },
    {
        sNo:2,
        participantId: 'P-1002',
        participantName: 'Jane Smith',
        date: '2025-04-02',
        status: 'Pending'
    },
    {
        sNo:3,
        participantId: 'P-1003',
        participantName: 'Alice Johnson',
        date: '2025-04-03',
        status: 'completed'
    },
    {
        sNo:4,
        participantId: 'P-1004',
        participantName: 'Bob Lee',
        date: '2025-04-04',
        status: 'Pending'
    },
    {
        sNo:5,
        participantId: 'P-1005',
        participantName: 'Charlie Kim',
        date: '2025-04-05',
        status: 'completed'
    },
    {
        sNo:6,
        participantId: 'P-1006',
        participantName: 'Diana Prince',
        date: '2025-04-06',
        status: 'Pending'
    },
    {
        sNo:7,
        participantId: 'P-1007',
        participantName: 'Ethan Hunt',
        date: '2025-04-07',
        status: 'completed'
    },
    {
        sNo:8,
        participantId: 'P-1008',
        participantName: 'Fiona Gallagher',
        date: '2025-04-08',
        status: 'Pending'
    },
    {
        sNo:9,
        participantId: 'P-1009',
        participantName: 'George Michaels',
        date: '2025-04-09',
        status: 'completed'
    },
    {
        sNo:10,
        participantId: 'P-1010',
        participantName: 'Hannah Brown',
        date: '2025-04-10',
        status: 'Pending'
    }
];

const columns = [
    {
        key: 'sNo',
        header: 'S.NO',
        sortable: true,
        selector: row => row.sNo,
    },
    {
        key: 'participantId',
        header: 'Participant ID',
        sortable: true,
    },
    {
        key: 'participantName',
        header: 'Participant Name',
        sortable: true,
    },
    {
        key: 'date',
        header: 'Date',
        sortable: true,
    },
    {
        key: 'status',
        header: 'Status',
        sortable: true,
        cell: row => (
            <span style={{ color: row.status.toLowerCase() === 'completed' ? 'green' : 'red' }}>
                {row.status}
            </span>
        ),
    },
    {
        key: 'actions',
        header: 'Actions',
        cell: row => (
            row.status === 'Pending' && (
                <button 
                    onClick={() => handleEdit(row)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <FaEdit />
                </button>
            )
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    },
];


const UserDashboard = () => {
    return (
        <div className="user-dashboard">
            <Header />
           <div className="container">
           <DataTable
                data={sampleData}
                columns={columns}
                searchPlaceholder="Search participants..."
                exportFileName="participants"
                rowsPerPageOptions={[10, 25, 50]}
                    defaultRowsPerPage={10}
                />

           </div>
           
        </div>
    );
};

export default UserDashboard;
