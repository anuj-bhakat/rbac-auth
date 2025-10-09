import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
                
                Cookies.remove('session');
                Cookies.remove('user');

                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            } catch (error) {
                console.log("Logout failed:", error);
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-xl w-96">
                {/* Spinner */}
                <div className="border-4 border-t-4 border-green-500 border-dotted rounded-full w-16 h-16 mx-auto animate-spin mb-4"></div>
                
                {/* Logging out message */}
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Logging you out...</h2>
                <p className="text-gray-500">Please wait while we log you out of the system.</p>
            </div>
        </div>
    );
};

export default Logout;
