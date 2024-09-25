import React from "react";
import {BrowserRouter, Link} from "react-router-dom";
import './css/home.css';

function Navbar(){
    return(
        <>
        <BrowserRouter>
        <div className="navbar">
            <Link to='/' className="home-button">Home</Link>
            <Link to='/insert' className="insertpdf-button">Insert</Link>
            <Link to='/sign-in' className="signin-button">Sign In</Link>
        </div>
        </BrowserRouter>
        </>
    )
}

export default Navbar;