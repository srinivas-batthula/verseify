"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "../styles/Login.module.css";


export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>{isSignUp ? "Register" : "Sign In"}</h2>

                <form className={styles.form}>
                    {isSignUp && (
                        <input type="text" placeholder="Full Name" className={styles.input} />
                    )}

                    <input type="email" placeholder="Email" className={styles.input} />

                    <div>
                        {/* Password Input with Show/Hide Feature */}
                        <div className={styles.passwordContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className={styles.input}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.eyeIcon}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className={styles.forgotPassword}>
                            <a href="#">Forgot password?</a>
                        </div>
                    </div>

                    <button type="submit" className={styles.button}>
                        {isSignUp ? "Create" : "Log In"}
                    </button>
                </form>

                <div className={styles.toggle}>
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span onClick={() => setIsSignUp(!isSignUp)} className={styles.toggleLink}>
                        {isSignUp ? "Sign In" : "Create account"}
                    </span>
                </div>
            </div>
        </div>
    );
}
