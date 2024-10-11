import logo from './logo.svg';
import './App.css';
import { Home } from './Components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Layout/Header';

import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Login } from './Components/User/Login'
import Register from './Components/User/Register'
import Profile from './Components/User/Profile';

import ProtectedRoute from './Components/Route/protectedRoute';

//Dashboard
import Dashboard from './Components/Admin/Dashboard';
//User
import UsersList from './Components/Admin/User/UserList';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} exact="true" />
        <Route path="/login" element={<Login />} exact="true" />
        <Route path="/register" element={<Register />} exact="true" />
        <Route path="/profile" element={<Profile />} exact="true" />

        {/* Admin 
        need mo itago yung dashboard from the user*/}
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/admin/users" element={<UsersList />} />
      </Routes>
    </Router>
  );
}

export default App;