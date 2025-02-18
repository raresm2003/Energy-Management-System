import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth/login';
import AdminComponent from './dashboard/admin-component';
import UserComponent from './dashboard/user-component';
import ErrorPage from './commons/errorhandling/error-page';
import { AuthProvider, AuthContext } from './auth/auth-service';
import styles from './commons/styles/project-style.css';

const AppRoutes = () => {
    const { userRole, userId } = useContext(AuthContext);

    const isAuthenticated = userRole && userId;

    return (
        <div>
            <Routes>
                <Route path='/' element={<Navigate to="/login" replace />} />
                <Route path='/login' element={<Login />} />

                <Route
                    path="/admin/:id"
                    element={isAuthenticated && userRole === 'admin' ? <AdminComponent /> : <Navigate to="/login" />}
                />

                <Route
                    path="/user/:id"
                    element={isAuthenticated && userRole === 'user' ? <UserComponent /> : <Navigate to="/login" />}
                />

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
};

class App extends React.Component {
    render() {
        return (
            <div className={styles.back}>
                <AuthProvider>
                    <Router>
                        <AppRoutes />
                    </Router>
                </AuthProvider>
            </div>
        );
    }
}

export default App;
