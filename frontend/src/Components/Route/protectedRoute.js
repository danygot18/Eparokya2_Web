import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import Loader from '../Layout/Loader';
import { getUser } from '../../Utils/helpers';

const ProtectedRoute = ({ children, isAdmin = false }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
        setLoading(false);
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to='/login' />;
    }

    if (isAdmin && !user.isAdmin) {
        return <Navigate to='/' />;
    }

    return children;
};

export default ProtectedRoute;
