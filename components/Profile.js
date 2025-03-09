"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "../styles/Profile.module.css";
import { FaChartLine, FaBookmark, FaEdit, FaShare, FaSignOutAlt, FaCog, FaPlus, FaBook, FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import useThemeStore from "@/stores/useThemeStore";
import useUserStore from "@/stores/useUserStore";
import styled from "styled-components";
import { showSuccess, showFailed } from "@/utils/Toasts";
import React, { useState, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';



const ShareButton = ({ data }) => {
    const { theme } = useThemeStore()
    const [canUseWebShare, setCanUseWebShare] = useState(false)
    const shareUrl = (data.url) ? (process.env.NEXT_PUBLIC_HOME + '/profile/' + data.url) : (typeof window !== "undefined" ? window.location.href : "")
    const shareText = (data.text) ? data.text : ("Check out my awesome Profile!")

    useEffect(() => {
        if (navigator.share) {
            setCanUseWebShare(true);
        }
    }, [])

    const Edit = styled.button`
        color: ${theme};
        `

    const handleNativeShare = async () => {
        try {
            await navigator.share({
                title: "Awesome PWA",
                text: shareText,
                url: shareUrl,
            });
            console.log("Shared successfully!");
        } catch (error) {
            console.error("Error sharing:", error);
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Edit onClick={canUseWebShare ? handleNativeShare : undefined} className={styles.editProfile} style={{ marginBottom: '0.8rem' }}>
                <FaShare title="Share Profile" size={25} />
            </Edit>

            {!canUseWebShare && (
                <div className="flex space-x-2">
                    <FacebookShareButton url={shareUrl}>
                        <span className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md">F</span>
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl}>
                        <span className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-md">X</span>
                    </TwitterShareButton>
                    <WhatsappShareButton url={shareUrl}>
                        <span className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all shadow-md">W</span>
                    </WhatsappShareButton>
                </div>
            )}
        </div>
    )
}


export default function Profile() {
    const params = useParams()
    const id = params.id
    const router = useRouter()
    const { theme } = useThemeStore()
    const { user, setUser } = useUserStore()
    const [users, setUsers] = useState({
        _id: '1',
        following: [],
        username: '',
        email: '',
        subscription: {},
        bio: '',
        profile_pic: {
            secure_url: '',
            public_id: '',
        },
        social_links: {
            linkedin: '',
            github: '',
            twitter: '',
        },
    })
    const [isFollowing, setIsFollowing] = useState((user.following.includes(users._id)) ? true : false)


    useEffect(() => {
        const getUser = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

            try {
                let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/users/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application',
                        'Authorization': token,
                    },
                    credentials: 'include',
                })
                res = await res.json()
                // console.log(res)

                if (!res || !res.success) {
                    return
                }
                else {
                    setUsers(res.user)
                }
            }
            catch (err) {
                return
            }
        }
        getUser()
    }, [id])


    let authorCheck = (users._id === user._id) ? true : false

    useEffect(() => {
        authorCheck = (users._id === user._id) ? true : false
        setIsFollowing((user.following.includes(users._id)) ? true : false)
    }, [user])


    const handleFollow = async (e) => {
        const login = typeof window !== 'undefined' ? localStorage.getItem('login') : null
        if (login === 'false') {
            showFailed('Please do Login to Continue!')
            return
        }

        showSuccess(isFollowing ? "UnFollowed!" : "Followed!")

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        // console.log('user._id: '+user._id+'     data.author: '+data.author)

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/follow/${user._id}?q=${isFollowing ? 'unfollow' : 'follow'}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            credentials: 'include',
            body: JSON.stringify({ id: users._id })
        })
        res = await res.json()
        // console.log(res)

        if (res && res.success) {
            setUser(res.user)
            setIsFollowing(!isFollowing)
        }
        else {
            showFailed(isFollowing ? "Failed to UnFollow!" : "Failed to Follow!")
        }
    }

    const handleLogout = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/auth/signOut`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            credentials: 'include',
        })
        res = await res.json()
        // console.log(res)

        if (res && res.success) {
            showSuccess("Logged Out Successfully!")
            setTimeout(() => {
                router.push("/login")
            }, 900)
        }
        else {
            showFailed("Failed to LogOut!")
        }
    }


    const Edit = styled.button`
        color: ${theme};
        `

    const Links = styled.a`
        color: (${theme}==='black')?'rgb(70, 70, 70)':'rgb(172, 172, 172)';

        &:hover{
            color:${(theme === 'white') ? 'gray' : 'black'};
            text-shadow:0 0 0.5rem ${(theme === 'black') ? 'gray' : 'black'};
        }`

    const NavBtns = styled.button`
        border: 1px solid ${theme};
        color: ${theme};
        background: ${(theme === 'white') ? 'black' : 'white'};
        
        &:hover{
            color: ${(theme === 'white') ? 'black' : 'white'};
            background: ${theme};
        }`


    return (
        <div style={{ width: '100%', height: 'fit-content', color: theme, background: (theme === 'white') ? 'linear-gradient(180deg, #121212ef, #121212ef, #121212ef)' : 'linear-gradient(180deg, #dfdfdf1f, #dfdfdf1f, #dfdfdf1f)' }}>
            <div className={styles.container}>
                <div className={styles.profileCard} style={{ color: theme, background: (theme === 'white') ? 'black' : 'white' }}>
                    {/* Profile Header */}
                    <div className={styles.header}>
                        <div className={styles.imageContainer} title="Update Profile Photo">
                            <img src={(users.profile_pic && users.profile_pic.secure_url !== '') ? users.profile_pic.secure_url : (theme === 'white' ? 'user_default_dark.png' : '/user_default_light.png')} alt="Profile" className={styles.profileImage} />
                        </div>
                        <div >
                            {/* <Edit className={styles.editProfile} style={{marginBottom:'0.8rem'}}>
                            <FaShare title="Share Profile" size={25} />
                        </Edit> */}
                            <ShareButton data={{ url: users._id }} />
                            {
                                (authorCheck) && (<Link href={{ pathname: '/editProfile' }}>
                                    <Edit className={styles.editProfile}>
                                        <FaEdit title="Edit Profile" size={25} />
                                    </Edit>
                                </Link>)
                            }
                        </div>
                    </div>

                    {/* User Info */}
                    <h2 className={styles.name}>@ {users.username}</h2>
                    <p className={styles.bio} style={{ color: (theme === 'black') ? 'rgb(70, 70, 70)' : 'rgb(213, 213, 213)' }}>{users.bio}</p>

                    {/* Stats */}
                    <div className={styles.stats} style={{ marginBottom: authorCheck ? '0' : '2.8rem' }}>
                        <motion.div
                            onClick={() => router.push(`/myblogs/${user._id}`)}
                            className={`${styles.statBox} ${(theme === 'white') ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3 className={styles.statTitle}>Blogs</h3>
                        </motion.div>

                        <motion.div
                            onClick={() => router.push(`/follow/${users._id}?q=followers`)}
                            className={`${styles.statBox} ${(theme === 'white') ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3 className={styles.statTitle}>Followers</h3>
                        </motion.div>

                        <motion.div
                            onClick={() => router.push(`/follow/${users._id}?q=following`)}
                            className={`${styles.statBox} ${(theme === 'white') ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3 className={styles.statTitle}>Following</h3>
                        </motion.div>
                    </div>

                    <div>
                        {
                            <button>
                                {
                                    authorCheck ? (<span ></span>) : (isFollowing) ? (<span onClick={handleFollow} className={styles.followBtn} title="UnFollow"><span style={{ fontWeight: 'bold' }}><i className="fa-solid fa-minus"></i></span> UnFollow</span>) : (<span onClick={handleFollow} className={styles.followBtn} title="Follow"><span style={{ fontWeight: 'bold' }}><i className="fa-solid fa-plus"></i></span> Follow</span>)
                                }
                            </button>
                        }
                    </div>

                    {/* Social Links */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', justifyItems: 'center', textAlign: 'center', color: (theme === 'white') ? 'white' : 'black', fontSize: '1.3rem', marginTop: authorCheck ? '0' : '2.8rem' }}>Follow me on</div>
                    <div className={styles.socialLinks}>
                        <a href={(users.social_links) ? users.social_links.linkedin : ''} target="_blank" rel="noopener noreferrer" style={{ color: (theme === 'black') ? 'rgb(70, 70, 70)' : 'rgb(172, 172, 172)' }} className={styles.socialIcon}>
                            <FaLinkedin className={styles.linkedin} />
                        </a>
                        <Link href={(users.social_links) ? users.social_links.github : ''} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            <FaGithub />
                        </Link>
                        <a href={(users.social_links) ? users.social_links.instagram : ''} target="_blank" rel="noopener noreferrer" style={{ color: (theme === 'black') ? 'rgb(70, 70, 70)' : 'rgb(172, 172, 172)' }} className={styles.socialIcon}>
                            <FaInstagram className={styles.instagram} />
                        </a>
                        <a href={(users.social_links) ? users.social_links.twitter : ''} target="_blank" rel="noopener noreferrer" style={{ color: (theme === 'black') ? 'rgb(70, 70, 70)' : 'rgb(172, 172, 172)' }} className={styles.socialIcon}>
                            <FaTwitter className={styles.x} />
                        </a>
                    </div>

                    {/* Navigation Buttons */}
                    {
                        (authorCheck) && (<div className={styles.buttons}>
                            <NavBtns className={styles.navButton} onClick={() => router.push("/dashboard")}>
                                <FaChartLine /> Dashboard
                            </NavBtns>
                            <NavBtns className={styles.navButton} onClick={() => router.push(`/myblogs/${user._id}`)}>
                                <FaBook /> My Blogs
                            </NavBtns>
                            <NavBtns className={styles.navButton} onClick={() => router.push("/post")}>
                                <FaPlus /> Create Post
                            </NavBtns>
                            <NavBtns className={styles.navButton} onClick={() => router.push("/savedBlogs")}>
                                <FaBookmark /> Saved Blogs
                            </NavBtns>
                            <NavBtns className={styles.navButton} onClick={() => router.push("/settings")}>
                                <FaCog /> Settings
                            </NavBtns>
                        </div>)
                    }

                    {/* Logout Button */}
                    {
                        (authorCheck) && (<button className={styles.logout} onClick={handleLogout}>
                            <FaSignOutAlt /> Log Out
                        </button>)
                    }

                    {/* Recent Blogs... */}
                    {
                        (!authorCheck) && (<div onClick={() => { router.push('/') }} style={{ margin: '1.8rem' }} className={`${styles.last1} ${styles.buttons}`}>
                            Back to Home...
                        </div>)
                    }
                </div>
            </div>
        </div>
    );
}
