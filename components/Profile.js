"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/Profile.module.css";
import { FaChartLine, FaBookmark, FaEdit, FaShare, FaSignOutAlt, FaCog, FaPlus, FaBook, FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import useThemeStore from "@/stores/useThemeStore";
import styled from "styled-components";


export default function Profile() {
    const router = useRouter();
    const {theme} = useThemeStore()

    const user = {
        name: "Srinivas",
        username: "@srinivas_dev",
        bio: "Aspiring Software Developer | MERN Stack | Building Tech for the Future",
        profileImage: "", // Change to actual image URL
        totalBlogs: 12,
        followers: 500,
        following: 120,
        socialLinks: {
            linkedin: "https://linkedin.com/in/srinivas",
            github: "https://github.com/srinivas",
            twitter: "https://twitter.com/srinivas",
        },
    }

    const handleLogout = () => {
        alert("Logged out successfully!"); // Replace with actual logout logic
        router.push("/login");
    };

    const Edit = styled.button`
        color: ${theme};
        `

    const Links = styled.a`
        color: (${theme}==='black')?'rgb(70, 70, 70)':'rgb(172, 172, 172)';

        &:hover{
            color:${(theme==='white')?'gray':'black'};
            text-shadow:0 0 0.5rem ${(theme==='black')?'gray':'black'};
        }`

    const NavBtns = styled.button`
        border: 1px solid ${theme};
        color: ${theme};
        background: ${(theme==='white')?'black':'white'};
        
        &:hover{
            color: ${(theme==='white')?'black':'white'};
            background: ${theme};
        }`

    return (
        <div style={{width:'100%', height:'fit-content', color: theme, background: (theme === 'white') ? 'linear-gradient(180deg, #121212ef, #121212ef, #121212ef)' : 'linear-gradient(180deg, #dfdfdf1f, #dfdfdf1f, #dfdfdf1f)'}}>
        <div className={styles.container}>
            <div className={styles.profileCard} style={{color: theme, background: (theme==='white') ? 'black' : 'white'}}>
                {/* Profile Header */}
                <div className={styles.header}>
                    <div className={styles.imageContainer} title="Update Profile Photo">
                        <img src={user.profileImage || (theme==='white' ? 'user_default_dark.png' : '/user_default_light.png')} alt="Profile" className={styles.profileImage} />
                    </div>
                    <div >
                        <Edit className={styles.editProfile} style={{marginBottom:'0.8rem'}}>
                            <FaShare title="Share Profile" size={25} />
                        </Edit>
                        <Link href={{pathname:'/editProfile', query:{user}}}>
                            <Edit className={styles.editProfile}>
                                <FaEdit title="Edit Profile" size={25} />
                            </Edit>
                        </Link>
                    </div>
                </div>

                {/* User Info */}
                <h2 className={styles.name}>@ {user.name}</h2>
                <p className={styles.bio} style={{color: (theme==='black')?'rgb(70, 70, 70)':'rgb(213, 213, 213)'}}>{user.bio}</p>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <div className={styles.s1}>
                            <strong>{user.totalBlogs}</strong>
                            <span>Blogs</span>
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.s2}>
                            <strong>{user.followers}</strong>
                            <span>Followers</span>
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.s3}>
                            <strong>{user.following}</strong>
                            <span>Following</span>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div style={{display:'flex', justifyContent:'center', alignContent:'center', alignItems:'center', justifyItems:'center', textAlign:'center', color: (theme==='white')?'white':'black', fontSize:'1.3rem', marginTop:'3rem'}}>Follow me on</div>
                <div className={styles.socialLinks}>
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{color: (theme==='black')?'rgb(70, 70, 70)':'rgb(172, 172, 172)'}} className={styles.socialIcon}>
                        <FaLinkedin className={styles.linkedin} />
                    </a>
                    <Links href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                        <FaGithub />
                    </Links>
                    <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{color: (theme==='black')?'rgb(70, 70, 70)':'rgb(172, 172, 172)'}} className={styles.socialIcon}>
                        <FaInstagram className={styles.instagram} />
                    </a>
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{color: (theme==='black')?'rgb(70, 70, 70)':'rgb(172, 172, 172)'}} className={styles.socialIcon}>
                        <FaTwitter className={styles.x} />
                    </a>
                </div>

                {/* Navigation Buttons */}
                <div className={styles.buttons}>
                    <NavBtns className={styles.navButton} onClick={() => router.push("/dashboard")}>
                        <FaChartLine /> Dashboard
                    </NavBtns>
                    <NavBtns className={styles.navButton} onClick={() => router.push("/myBlogs")}>
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
                </div>

                {/* Logout Button */}
                <button className={styles.logout} onClick={handleLogout}>
                    <FaSignOutAlt /> Log Out
                </button>
            </div>
        </div>
        </div>
    );
}
