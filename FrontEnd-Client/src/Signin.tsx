import React, {useState } from "react";
import axios from "axios";


function SignIn() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const Account = () => {
        return {
            firstName,
            lastName,
            email,
            password,
            isAdmin
        };
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSignUpClick = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const generateRandomId = () => {
        if (isAdmin) {
            return String(Math.floor(Math.random() * 10)).padStart(3, '0'); //admin ID: 000-009
        } else {
            return String(Math.floor(Math.random() * 990) + 10).padStart(3, '0'); //USer IDs: 010-999
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const accountData = Account();
        const randomId = generateRandomId;

        try {
            await axios.post("http://localhost:8080/api/users", {
                ...accountData,
                id: randomId
            });
            handleCloseModal();
        } catch (error) {
            console.error("Error creating account: ", error)
        }
    }

    return (
        <>
            <h1>
                SIGN IN
            </h1>
            <form>
                <div className="signin">
                    <label htmlFor="ID">ID:</label>
                    <input type="text" id="id" name="id" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Sign In</button>
                <br />
                <label htmlFor="signup">Create Account</label>
                <button type="button" onClick={handleSignUpClick}> Create Account</button>
            </form>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Create Acccount</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="firstName">First Name: </label>
                                <input type="text" id="firstName" name="firstName" required onChange={(e) => setFirstName(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" required onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="isAdmin">Admin: </label>
                                <input type="checkbox" id="isAdmin" name="isAdmin" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
                            </div>
                            <div>
                                <label htmlFor="signupPassword">Password:</label>
                                <input type="password" id="signupPassword" name="signupPassword" required onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}



export default SignIn;