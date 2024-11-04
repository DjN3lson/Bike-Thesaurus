import { Link } from 'react-router-dom';
import './css/Navbar.css';

interface NavbarProps {
    isAuthenticated: boolean;
}


function Navbar({isAuthenticated}: NavbarProps) {

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} />
            <div className="navbar">
                <nav>
                    <ul>
                       
                            
                            <li> <Link to="/" className="home-button">Home</Link> </li>
                            <li> <Link to="/manage" className="manage-button">Manage</Link> </li>
                            {isAuthenticated ? ( // Conditional rendering based on authentication
                            <li> <Link to="/logout" className="logout-button">Log Out</Link></li>
                        ) : (
                            <li> <Link to="/signin" className="signin-button">Sign In</Link> </li>
                        )}
                      
                    </ul>
                </nav>
            </div>
        </>
    )

}

export default Navbar;