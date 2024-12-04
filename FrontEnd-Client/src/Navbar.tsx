import { Link } from 'react-router-dom';
import './css/Navbar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface NavbarProps {
   
}

function Navbar({  }: NavbarProps) {
    const navigate = useNavigate();


    return (
        <>
            <div className="navbar">
                <nav>
                    <ul>
                        <li> <Link to="/" className="home-button">Home</Link> </li>
                        <li> <Link to="/manage" className="manage-button">Manage</Link> </li>
                    </ul>

                </nav>
            </div>
        </>
    )

}

export default Navbar;