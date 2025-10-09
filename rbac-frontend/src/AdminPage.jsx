import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/logout");
    };

    const handleAPI = (endpoint) => {
        axios
            .get(endpoint)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-red-600 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200 transition"
                >
                    Logout
                </button>
            </nav>

            <main className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, Admin!</h2>

                {/* Permissions-based features */}
                {permissions.includes("create_record") && (
                    <button
                        onClick={() => handleAPI('/records/init')}
                        className="bg-green-600 text-white py-2 px-4 rounded-md mb-2"
                    >
                        Initialize Records
                    </button>
                )}

                {permissions.includes("read_record") && (
                    <button
                        onClick={() => handleAPI('/records')}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md mb-2"
                    >
                        View All Records
                    </button>
                )}

                {permissions.includes("update_record") && (
                    <button
                        onClick={() => handleAPI('/records/1')} // For example, updating record with ID 1
                        className="bg-yellow-600 text-white py-2 px-4 rounded-md mb-2"
                    >
                        Update Record
                    </button>
                )}

                {permissions.includes("delete_record") && (
                    <button
                        onClick={() => handleAPI('/records/1/delete')} // For example, deleting record with ID 1
                        className="bg-red-600 text-white py-2 px-4 rounded-md mb-2"
                    >
                        Delete Record
                    </button>
                )}
            </main>
        </div>
    );
};

export default AdminPage;
