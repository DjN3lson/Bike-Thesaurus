import axios from "axios";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
axios


function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const [notification, setNotification] = useState("");

    const navigate = useNavigate();

    const handleRegistration = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Sending data for Registration: ", { firstName, lastName, email, password, isAdmin })
        try {
            const response = await axios.post("http://localhost:5000/register", {
                firstName,
                lastName,
                email,
                password,
                isAdmin
            }, { withCredentials: true });
            console.log("Response of data: ", response.data)
            setNotification("Sucess");
            
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                alert("Invalid registration");
                setNotification("Failed");
            } else {
                console.log("Registration was successful");
                setNotification("Success");
            }
        }
        navigate("/login");
    }


    return (
        <>
            <h1>SIGN UP</h1>
            {notification && <div className="notification">{notification}</div>}
            <form onSubmit={handleRegistration}>
                <div className="signin">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="signin">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div className="signin">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="isAdmin">Admin Role:</label>
                    <input
                        type="checkbox"
                        id="isAdmin"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                </div>
                <button type="submit">Sign Up</button>
                <br />
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Already have an account? Sign In
                </button>
            </form>
        </>
    );

}
export default Register;