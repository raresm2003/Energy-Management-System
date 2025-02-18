import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './auth-service';

const PrivateRoute = ({ children, requiredRole }) => {
    const { userRole } = useContext(AuthContext);

    if (!userRole) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/error" replace />;
    }

    return children;
};

export default PrivateRoute;
