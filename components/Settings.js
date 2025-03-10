"use client";

import { useRouter } from "next/navigation";
import styles from "../styles/Settings.module.css";
import { FaMoon, FaSun, FaUserEdit, FaLock, FaBell, FaKey, FaTrash } from "react-icons/fa";
import useThemeStore from "@/stores/useThemeStore";
import useUserStore from "@/stores/useUserStore";
import useTokenStore from "@/stores/useTokenStore";
import { showFailed } from "@/utils/Toasts";
import { useState, useEffect } from "react";



export default function Settings() {
    const [isOn, setIsOn] = useState('true'); // Default value for isOn
    const router = useRouter()
    const { theme, setTheme } = useThemeStore()
    const {user} = useUserStore()
    const {token} = useTokenStore()


    // Only read localStorage in the client (browser)
    useEffect(() => {
        const storedNotificationState = typeof window !== 'undefined' ? localStorage.getItem('notifications') : true;
        if (storedNotificationState) {
            setIsOn(storedNotificationState)
        }
    }, [])

    const toggle = () => {
        const newIsOn = isOn === 'true' ? 'false' : 'true';
        typeof window !== 'undefined' ? localStorage.setItem('notifications', newIsOn) : true;
        setIsOn(newIsOn);
    }


    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <div className={`${styles.container} ${(theme === 'white') ? styles.dark : ""}`}>
                <h2 className={styles.title}>Settings</h2>

                <div className={styles.box}>
                    {/* Theme Toggle */}
                    <div className={styles.settingItem} onClick={setTheme}>
                        {(theme === 'white') ? <FaSun /> : <FaMoon />}
                        <span>{(theme === 'white') ? "Light Mode" : "Dark Mode"}</span>
                    </div>

                    {/* Edit Profile */}
                    <div onClick={() => { router.push('/editProfile') }} className={styles.settingItem}>
                        <FaUserEdit />
                        <span>Edit Profile</span>
                    </div>

                    {/* Change Password */}
                    <a target="_blank" href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password/${user._id}?tid=${token}`} className={styles.settingItem}>
                        <FaLock />
                        <span>Reset Password</span>
                    </a>

                    {/* Change Password */}
                    <div onClick={()=>{router.push('/login?q=forgotPassword')}} className={styles.settingItem}>
                        <FaKey />
                        <span>Forgot Password</span>
                    </div>

                    {/* Manage Notifications */}
                    <div className={styles.settingItem} onClick={toggle}>
                        <FaBell />
                        <span>Manage Notifications</span>
                        <button
                            style={{ fontWeight: 'bold', float: 'right', marginLeft: '5%' }}
                            className={`flex justify-end align-middle float-right relative right-1 px-4 py-2 text-white rounded-lg transition-all ${(isOn === 'true') ? "bg-green-500" : "bg-gray-500"
                                }`}
                        >
                            {(isOn === 'true') ? "ON" : "OFF"}
                        </button>
                    </div>

                    {/* Social Accounts */}
                    <div onClick={()=>{showFailed('Something went Wrong!')}} className={styles.settingItem} style={{ color: 'red' }} >
                        <FaTrash />
                        <span>Delete Account</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
