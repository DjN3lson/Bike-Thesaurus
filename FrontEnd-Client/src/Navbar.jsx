import { Link } from 'react-router-dom';
import './css/Navbar.css';
import { useNavigate } from 'react-router-dom';



function Navbar() {
    const navigate = useNavigate();


    return (
        <>
            <div className="navbar">
                <nav>
                    <ul>
                        <li> <Link to="/" className="home-button">Home</Link> </li>
                        <li> <Link to="/manage" className="manage-button">Manage</Link> </li>
                        <li>  <Link to="/configuration" className="configuration button">Configuration</Link></li>
                    </ul>

                </nav>
            </div>
        </>
    )

}

export default Navbar;