import React, { useState } from "react";
import axios from "axios";


function SignIn() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const Account = () => {
        return {
            firstName,
            lastName,
            email,
            password,
            isAdmin
        };
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const accountData = Account();

        try {
            if (isSignUp) {
                console.log('Sending sign up data: ', accountData);
                const response = await axios.post("http://localhost:8080/api/users", {
                    ...accountData,
                });
                console.log('Sign up response: ', response.data)
                setNotification({message: "Account has been created successfully", type: 'success'});
            } else {
                // Add signin logic here when ready
                console.log('Sending signin data: ', {email, password});
                const response = await axios.post("http://localhost:8080/api/users/signin", {
                    email,
                    password,
                });
                console.log('Signin response', response.data.email);
                setNotification({message: "Signed in sucessfully", type: 'success'})
            }
        } catch (error: any) {
            console.error("Detailed error: ", {
                message: error.message,
                response: error.response?.data,
                status:error.response?.status
            });
            setNotification({
                message: error.response?.data?.message ||  "An error occured. Try again",
                type: 'error'
            })
        }
    }

    return (
        <>
            <h1>
                {isSignUp ? 'SIGN UP' : 'SIGN IN'}
            </h1>
            <form onSubmit={handleSubmit}>
                {notification && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}
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