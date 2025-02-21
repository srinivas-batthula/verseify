"use client";

import { useRouter } from "next/navigation";
import styles from "../styles/Settings.module.css";
import { FaMoon, FaSun, FaUserEdit, FaLock, FaBell, FaEnvelope, FaTrash } from "react-icons/fa";
import useThemeStore from "@/stores/useThemeStore";
import { useState, useEffect } from "react";

export default function Settings() {
    const [isOn, setIsOn] = useState('true'); // Default value for isOn
    const router = useRouter();
    const { theme, setTheme } = useThemeStore();

    // Only read localStorage in the client (browser)
    useEffect(() => {
        const storedNotificationState = localStorage.getItem('notifications');
        if (storedNotificationState) {
            setIsOn(storedNotificationState);
        }
    }, []); // Empty dependency array ensures this runs once when the component mounts

    const toggle = () => {
        const newIsOn = isOn === 'true' ? 'false' : 'true';
        localStorage.setItem('notifications', newIsOn);
        setIsOn(newIsOn);
    };

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
                    <div className={styles.settingItem}>
                        <FaLock />
                        <span>Reset Password</span>
                    </div>

                    {/* Change Password */}
                    <div className={styles.settingItem}>
                        <FaEnvelope />
                        <span>Change E-mail</span>
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
                    <div className={styles.settingItem} style={{ color: 'red' }}>
                        <FaTrash />
                        <span>Delete Account</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
