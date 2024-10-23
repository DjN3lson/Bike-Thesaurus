import React from "react";
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';

import SignIn from './Signin'
import Manage from "./Manage";
import App from "./App";
import './css/Navbar.css';





function Navbar() {

    return (
        <>
            <div className="navbar">
                <nav>
                    <ul>
                       
                            
                            <li> <Link to="/" className="home-button">Home</Link> </li>
                            <li> <Link to="/manage" className="manage-button">Manage</Link> </li>
                            <li> <Link to="/signin" className="signin-button">Sign In</Link> </li>
                            <li> <Link to="/logout" className="logout-button">Log out</Link></li>
                      
                    </ul>
                </nav>
            </div>
        </>
    )

}

export default Navbar;