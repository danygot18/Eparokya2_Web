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


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} exact="true"/>
        <Route path="/login" element={<Login />} exact="true" />
        <Route path="/register" element={<Register/>}  exact="true" />
        <Route path="/profile" element={<Profile/>}  exact="true" />
      </Routes>
    </Router>
  );
}

export default App;