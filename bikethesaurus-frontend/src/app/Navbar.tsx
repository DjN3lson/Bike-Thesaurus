import React from "react";
import {BrowserRouter, Link} from "react-router-dom";
import './css/home.css';

function Navbar(){
    return(
        <>
        <BrowserRouter>
        <div className="navbar">
            <Link to='/' className="home-button">Home</Link>
            <Link to='/manage' className="manage-button">Manage</Link>
            <Link to='/sign-in' className="signin-button">Sign In</Link>
        </div>
        </BrowserRouter>
        </>
    )
}

export default Navbar;