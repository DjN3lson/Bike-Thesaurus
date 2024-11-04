import { Link } from 'react-router-dom';
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
                      
                    </ul>
                </nav>
            </div>
        </>
    )

}

export default Navbar;