import { Link } from 'react-router-dom';
import './css/Navbar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface NavbarProps {
    isLoggedIn: boolean;
    onLogout: () => void;
    firstName: string | null;
}

function Navbar({ isLoggedIn, onLogout, firstName }: NavbarProps) {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/logout");
            onLogout();
            navigate("/signin")
        } catch (error) {
            console.error("Error logging out", error);
        }
    };
    return (
        <>
            <div className="navbar">
                <nav>
                    <ul>
                        <li> <Link to="/" className="home-button">Home</Link> </li>
                        <li> <Link to="/manage" className="manage-button">Manage</Link> </li>
                        {isLoggedIn ? (
                            <>
                                <li onClick={handleLogout} className='logout-button'>Logout</li>
                                <div className="bottom">
                                    <li> {firstName}</li>
                                </div>
                            </>
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