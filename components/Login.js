"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "../styles/Login.module.css";


export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    
    const handleOAuth = async (e) => {
        e.preventDefault();

        try {
            // Send the user to your backend to start the Google OAuth flow
            typeof window !== 'undefined' ? window.location.href = "https://todo-backend-1-4u6w.onrender.com/api/auth/google1" : null; // Redirect to backend route
        }
        catch (error) {
            setErr('Error: ' + error.message)
            console.log(error)
        }
    }


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
                    <span onClick={() => setIsSignUp(!isSignUp)} style={{fontSize:'1.2rem'}} className={styles.toggleLink}>
                        {isSignUp ? "Sign In" : "Create account"}
                    </span>
                </div>

                {/* SignIn with Google */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', justifyItems:'center', alignItems:'center', marginTop: '0.8rem', marginBottom:'2rem' }}>
                    <span style={{ textAlign: 'center', marginTop: '0.8rem' }}>or</span>
                    {/* <span style={{ textAlign: 'center', marginTop: '0.5rem' }}></span> */}
                    <button type='button' className={`${styles.google} ${styles.toggleLink}`} onClick={handleOAuth} style={{ fontWeight:'normal', width:'100%', paddingLeft:'0.3rem', paddingRight:'0.4rem', paddingTop:'0.65rem', paddingBottom:'0.65rem', borderRadius:'1.5rem', display:'flex', flexDirection:'row', justifyContent:'center', textAlign:'center', cursor: 'pointer', fontSize:'1.2rem', marginTop: '0.6rem', color:'white', backgroundColor:'black' }}>
                        <svg viewBox="0 0 128 128" style={{width:'2.1rem', backgroundColor:'white', borderRadius:'9%', padding:'0.3rem', marginRight:'0.6rem'}}>
                            <path fill="#fff" d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"></path><path fill="#e33629" d="M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z"></path><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z"></path><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"></path><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z"></path>
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
