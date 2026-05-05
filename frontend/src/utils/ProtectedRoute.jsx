import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth(); // Grabbing the user state from our new context

    if (!user.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h2>⛔ Unauthorized Access</h2>
                <p>You do not have the correct permissions to view this page.</p>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;