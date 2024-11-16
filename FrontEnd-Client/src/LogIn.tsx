import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
axios
interface LoginProps {
    onLogin: (name: string) => void;
}

function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [notification, setNotification] = useState("");

    const navigate = useNavigate();

    const logInUser = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Sending Data for Logging In: ",email, password);

        try {
            const response = await axios.post("http://localhost:5000/signin", {
                email, password
            }, {withCredentials: true});
            console.log("Data response (login): ", response.data);
            setNotification("Success")
            onLogin(response.data.firstName)
        }catch(error:any){
            if(error.response && error.response.status === 401){
                alert("Invalid login");
                setNotification("Failed")
            }else{
                console.log("Login was successful")
                setNotification("Success");
            }
        }
        navigate("/");
    }

    return (
        <>
            
            <h1>SIGN IN</h1>
            {notification && <div className="notification">{notification}</div>}
            <form onSubmit={logInUser}>
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
                <button type="submit">Sign In</button> <br />
                <button
                    type="button"
                    onClick={() => navigate("/register")}
                >
                    Don't have an account? Register
                </button>
            </form>
        </>
    );
}

export default Login;