import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignInProps {
    onLogin: (name: string) => void;
}

function SignIn({ onLogin }: SignInProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
   
    const [isSignUp, setIsSignUp] = useState(false);

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (isSignUp) {
                console.log('Sending sign up data: ', { firstName, lastName, email, password, isAdmin });
                const response = await axios.post("http://localhost:8000/register", {
                    firstName,
                    lastName,
                    email,
                    password,
                    isAdmin
                });
                setNotification({ message: "Account created successfully", type: 'success' });
                console.log('Sign up response: ', response.data)
                setIsSignUp(false);
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                setIsAdmin(false);

            } else {
                // signin logic here
                console.log('Sending signin data: ', { email, password });
                const response = await axios.post("http://localhost:8000/signin", {
                    email,
                    password,
                });

                if (response.status === 200) {
                    console.log('Signin response:', response.data);
                    setNotification({ message: "Signed in sucessfully", type: 'success' });

                    onLogin(response.data.firstName);
                    navigate("/")

                }
                // console.log('Signin response', response.data.email);
                // setNotification({message: "Signed in sucessfully", type: 'success'});
                // onLogin(response.data.firstName);
                // navigate("/")
            }
        } catch (error: any) {
            console.error("Detailed error: ", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setNotification({
                message: error.response?.data?.message || "An error occured. Try again",
                type: 'error'
            })
        }
    }

    return (
        <>
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <h1>
                {isSignUp ? 'SIGN UP' : 'SIGN IN'}
            </h1>
            <form onSubmit={handleSubmit}>

                {isSignUp && (
                    <>
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
                    </>
                )}
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
                {isSignUp && (
                    <div>
                        <label htmlFor="isAdmin">Admin Role:</label>
                        <input
                            type="checkbox"
                            id="isAdmin"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                    </div>
                )}
                <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                <br />
                <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                >
                    {isSignUp ? 'Back to Sign In' : 'Create Account'}
                </button>
            </form>
        </>
    );
}



export default SignIn;