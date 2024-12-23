import React from "react";
import { Link } from "react-router-dom";

import './css/index.css';

function Index() {
    const logo = "./template/Index_Template.png";
    


    return (
        <>
            <div className='index-container'>
                <img src={logo} alt="Logo" />
                <Link to="/home">
                    <button>Go to App</button>
                </Link>
            </div>
        </>
    );
}

export default Index;