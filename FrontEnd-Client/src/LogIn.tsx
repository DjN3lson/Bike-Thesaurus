import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "./httpClient";

interface LoginProps {
    onLogin: (name: string) => void;
}

function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const logInUser = async () => {
        console.log("Sending Data for Logging In: ",email, password);

        try {
            const response = await httpClient().post("http://localhost:5000/signin", {
                email, password
            });
            console.log("Data response (login): ", response.data);
            
        }catch(error:any){
            if(error.response.status===401){
                alert("Invalid login");
            }else{
                console.log("Login was successful")
            }
        }
    }

    return (
        <>
            
            <h1>SIGN IN</h1>
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