import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch doctors list from API
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doctors');
                const data = await response.json();
                setDoctors(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <AdminLayout>
            <div className="page-content">
                <h1>Doctor List</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor.id}>
                                    <td>{doctor.name}</td>
                                    <td>{doctor.specialization}</td>
                                    <td>{doctor.contact}</td>
                                    <td>
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default DoctorList;