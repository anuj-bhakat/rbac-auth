import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Signup from './Signup';
import Login from './Login';
import Logout from './Logout';
import ManagerPage from './ManagerPage';
import AdminPage from './AdminPage';
import EmployeePage from './EmployeePage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RequireUnauth = ({ isAuthenticated, userRole, children }) => {
    if (isAuthenticated && userRole) {
        return <Navigate to={`/${userRole}`} replace />;
    }
    return children;
};

const App = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/auth/check-session`, {
                    withCredentials: true,
                });

                if (response.data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setUserRole(response.data.user.role);
                } else {
                    setIsAuthenticated(false);
                    setUserRole(null);
                }
            } catch (err) {
                console.log('User is not authenticated', err);
                setIsAuthenticated(false);
                setUserRole(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <RequireUnauth isAuthenticated={isAuthenticated} userRole={userRole}>
                            <Login />
                        </RequireUnauth>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RequireUnauth isAuthenticated={isAuthenticated} userRole={userRole}>
                            <Signup />
                        </RequireUnauth>
                    }
                />
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? `/${userRole}` : "/login"} replace />}
                />
                <Route path="/manager" element={<ManagerPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/employee" element={<EmployeePage />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </Router>
    );
};

export default App;
