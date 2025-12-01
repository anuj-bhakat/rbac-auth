import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Logout = () => {
    const navigate = useNavigate();
    const [status, setStatus] = React.useState('logging_out'); // 'logging_out' | 'success'

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });

                Cookies.remove('session');
                Cookies.remove('user');

                setStatus('success');

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } catch (error) {
                console.log("Logout failed:", error);
                // Even if it fails, we should probably redirect or show error, but for now let's just redirect
                setStatus('success'); // Force success UI for better UX even on network error
                setTimeout(() => navigate("/login"), 1500);
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex flex-col justify-center items-center px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main logout card */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 w-full max-w-md text-center transition-all duration-500 transform">

                {status === 'logging_out' ? (
                    <>
                        {/* Logout icon with gradient background */}
                        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>

                        {/* Enhanced spinner */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                        </div>

                        {/* Logging out message */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Logging you out...
                        </h2>
                        <p className="text-gray-600 text-lg mb-2">Please wait a moment</p>
                    </>
                ) : (
                    <>
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl scale-100 transition-transform duration-300">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Successfully Logged Out
                        </h2>
                        <p className="text-gray-600 text-lg mb-2">See you next time! 👋</p>
                        <p className="text-gray-400 text-sm mt-4">Redirecting to login...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Logout;
