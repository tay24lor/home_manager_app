import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignIn: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in!");
        } catch (error) {
            console.error("Sign-in error:", error);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleSignIn}>Sign In</button>
        </div>
    );
};

export default SignIn;