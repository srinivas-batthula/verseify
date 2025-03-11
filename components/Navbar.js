"use client";

import { Image } from 'next/image';
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaSearch, FaBars, FaTimes, FaInstagram, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import styles from "@/styles/Navbar.module.css";
import useThemeStore from "@/stores/useThemeStore";
import useUserStore from "@/stores/useUserStore";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { getResponse } from '@/public/lib/indexedDB';
import useTokenStore from '@/stores/useTokenStore';
import { showSuccess, showFailed } from "@/utils/Toasts";



const Li = styled.li`
    &:hover {
        color: ${({ theme }) => (theme === 'white' ? 'black' : 'white')};
        background: ${({ theme }) => theme};
    }
`

export default function Navbar() {
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [notifications, setNotifications] = useState(0)
    const { theme } = useThemeStore()
    const { user } = useUserStore()
    const {setToken} = useTokenStore()
    const router = useRouter()

    const profileRef = useRef(null)
    const sidebarRef = useRef(null)

    const login = typeof window !== 'undefined' ? localStorage.getItem('login') || 'false' : 'false'


    useEffect(() => {
        const GET = async () => {
            const response = await getResponse({ store: 'notify' })
            // console.log(response)
            setNotifications(response.success ? response.saved.length : 0)
        }
        GET()
    }, [])

    // Close dropdown/sidebar when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsNavOpen(false)
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    //Handling Log Out...
    const handleLogout = async () => {
        typeof window !== 'undefined' ? localStorage.setItem('token', '') : null
        typeof window !== 'undefined' ? localStorage.setItem('login', false) : null
        setToken('')
        showSuccess("Logged Out Successfully!")

        setTimeout(()=>{
            window.location.href = '/'
        }, 600)
        
    
        // let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/auth/signOut`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     credentials: 'include',
        // })
        // res = await res.json()
        // // console.log(res)

        // if (res && res.success) {
        //     showSuccess("Logged Out Successfully!")
        //     typeof window !== 'undefined' ? localStorage.setItem('login', false) : null
        //     setTimeout(() => {
        //         router.push("/login")
        //     }, 900)
        // }
        // else {
        //     showFailed("Failed to LogOut!")
        // }
    }


    return (
        <nav className={`${styles.navbar} shadow-sm`} style={{ color: theme, background: (theme === 'white') ? 'black' : 'white' }}>
            {/* Left: Hamburger Icon */}
            <div className={styles.leftContainer}>
                <FaBars className={styles.icon} onClick={() => setIsNavOpen(true)} />
                <div onClick={() => { router.push('/') }} className={styles.logo}>
                    {/* https://srinivas-batthula.github.io/verseify */}
                    <img src="/verseify.png" alt="Logo" className={styles.logoImg} />
                </div>
            </div>

            {/* Center: Search Bar */}
            <div onClick={() => { router.push('/search') }} className={styles.searchContainer}>
                <input type="text" placeholder="Search. . ." className={styles.searchInput} />
                <FaSearch className={styles.searchIcon} />
            </div>

            {/* Right: Notification & Profile */}
            <div className={styles.rightSection}>
                <FaSearch onClick={() => { router.push('/search') }} className={`${styles.icon} ${styles.searchMobile}`} />

                {
                    (login === 'true') && (<div onClick={() => { router.push('/notifications') }} className={`${styles.notificationContainer}`} style={{ display: (login === 'false') ? 'none' : 'block' }}>
                        <FaBell className={`${styles.icon}`} />
                        {
                            (notifications) > 0 && (
                                <span className={styles.notificationBadge}>{notifications}</span>
                            )
                        }
                    </div>)
                }

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    {
                        (login === 'true') && ((user.profile_pic && user.profile_pic.secure_url !== '') ? (<img src={user.profile_pic.secure_url} onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ display: (login === 'false') ? 'none' : 'block' }} className={styles.profileIcon}></img>)
                            : (<BsPersonCircle
                                className={styles.profileIcon1}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                style={{ display: (login === 'false') ? 'none' : 'block' }}
                            />))
                    }
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={styles.dropdown}
                                style={{ color: theme, background: (theme === 'white') ? 'black' : 'white' }}
                            >
                                {/* Username & View Profile */}
                                <div onClick={() => { router.push(`/profile/${user._id}`) }} className={styles.profileHeader}>
                                    <p className={styles.username}><span style={{ marginRight: '0.1rem' }}>@</span>{user.username}</p>
                                    <p className={styles.viewProfile}>View Profile →</p>
                                </div>

                                {/* Options */}
                                <ul className={styles.dropdownMenu}>
                                    <Li theme={theme} onClick={() => { router.push('/dashboard') }} className={styles.dropdownItem}>Dashboard</Li>
                                    <Li theme={theme} onClick={() => { router.push('/post') }} className={styles.dropdownItem}>Create Post</Li>
                                    <Li theme={theme} onClick={() => { router.push('/settings') }} className={styles.dropdownItem}>Settings</Li>
                                    <li onClick={handleLogout} className={styles.dropdownItemLogout}>Logout</li>
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {
                    (login !== 'true') && (<div onClick={() => { router.push('/login') }} className={styles.log} style={{ display: (login === 'true') ? 'none' : 'block' }}>Log In</div>)
                }
            </div>

            {/* Sidebar Menu */}
            <AnimatePresence>
                {isNavOpen && (
                    <motion.div
                        initial={{ x: -250 }}
                        animate={{ x: 0 }}
                        exit={{ x: -250 }}
                        className={styles.sidebar}
                        style={{ background: (theme === 'white') ? 'black' : 'white', color: theme }}
                        ref={sidebarRef}
                    >
                        <FaTimes className={styles.closeIcon} onClick={() => setIsNavOpen(false)} />

                        <div style={{ fontWeight: '650', fontSize: '1.2rem', marginTop: '0.3rem', marginBottom: '0rem' }}>
                            Verseify
                            <div style={{ fontWeight: '400', fontSize: '0.9rem', color: 'rgb(120, 120, 120)' }}>Every Blog, a New Verse!</div>
                        </div>
                        <ul>
                            {
                                [
                                    {
                                        title: "Search",
                                        class: "fa-solid fa-magnifying-glass",
                                        link: '/search'
                                    },
                                    {
                                        title: "Home",
                                        class: "fa-solid fa-house",
                                        link: '/'
                                    },
                                    {
                                        title: "Create Post",
                                        class: "fa-solid fa-cloud-arrow-up",
                                        link: '/post'
                                    },
                                    {
                                        title: "About",
                                        class: "fa-solid fa-circle-info",
                                        link: '/about'
                                    },
                                    {
                                        title: "Contact",
                                        class: "fa-solid fa-file-signature",
                                        link: '/contact'
                                    },
                                ].map((item, index) => (
                                    <motion.li onClick={() => { router.push(item.link) }} key={index} className={styles.sidebarItem}>
                                        <i className={`${item.class} ${styles.sidebarIcons}`}></i>
                                        {item.title}
                                    </motion.li>
                                ))
                            }
                            <ul>
                                <li onClick={() => { router.push('/ai') }} className={styles.aiBtn} style={{
                                    background: 'linear-gradient(135deg, #6dd5ed, #00c851, #00796b)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    <i className={`fa-brands fa-rocketchat ${styles.sidebarIcons}`} style={{ color: 'black' }}></i>
                                    Write with AI
                                </li>
                                <li onClick={() => { router.push('/subscribe') }} className={`${styles.subscribeBtn}`} style={{
                                    background: 'linear-gradient(135deg, #12c2e9, #c471ed, #f64f59)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    <i className={`fas fa-crown ${styles.sidebarIcons}`}></i>
                                    Try Premium
                                </li>
                            </ul>
                        </ul>

                        <div style={{ fontWeight: '650', fontSize: '1.2rem' }}>Other</div>
                        <ul>
                            {
                                [
                                    {
                                        title: "Privacy Policy",
                                        class: "fa-solid fa-user-shield",
                                        link: '/privacyPolicy'
                                    },
                                    {
                                        title: "Terms Of Use",
                                        class: "fa-solid fa-check-to-slot",
                                        link: '/terms'
                                    }
                                ].map((item, index) => (
                                    <motion.li onClick={() => { router.push(item.link) }} key={index} className={styles.sidebarItem}>
                                        <i className={`${item.class} ${styles.sidebarIcons}`}></i>
                                        {item.title}
                                    </motion.li>
                                ))
                            }
                        </ul>

                        <div className={styles.linksMain}>
                            <a href="https://github.com/srinivas-batthula/" target="_blank" title="GitHub" className={styles.links}><FaGithub /></a>
                            <a href="https://www.linkedin.com/in/srinivas-batthula/" target="_blank" title="LinkedIn" className={styles.links}><FaLinkedin /></a>
                            <a href="https://www.instagram.com/srinivas_abhi8/" target="_blank" title="Instagram" className={styles.links}><FaInstagram /></a>
                            <a href="https://x.com/Abhi07082005/" target="_blank" title="Twitter" className={styles.links}><FaTwitter /></a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
