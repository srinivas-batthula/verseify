"use client";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import styles from "@/styles/EditProfile.module.css";
import useThemeStore from "@/stores/useThemeStore";


const EditProfile = () => {
    const {theme} = useThemeStore()
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        bio: "",
        linkedin: "",
        github: "",
        instagram: "",
        twitter: "",
        avatar: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({ ...profile, avatar: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Profile:", profile);
    };

    return (
        <div className={styles.theme}>
            <div className={styles.container} style={{color: theme, background:(theme==='white')?'black':'white'}}>
                <h2 className={styles.heading}>Edit Profile</h2>
                <form className={styles.form} onSubmit={handleSubmit}>

                    {/* Profile Image Upload */}
                    <div className={styles.avatarSection}>
                        <label htmlFor="avatar">
                            <img
                                src={profile.avatar || (theme==='white')?"/user_default_dark.png":"/user_default_light.png"}
                                alt="Avatar"
                                className={styles.avatar}
                            />
                        </label>
                        <input
                            type="file"
                            id="avatar"
                            className={styles.fileInput}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="avatar" className={styles.editIcon}>
                            <FaEdit size={20} />
                        </label>
                    </div>

                    <div className={styles.head}>User Info</div>

                    {/* UserName */}
                    <div className={styles.inputGroup} style={{color: theme}}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            placeholder="Your username"
                            required
                            style={{color: 'black'}}
                        />
                    </div>

                    {/* Email */}
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            placeholder="Your email"
                            required
                            style={{color: 'black'}}
                        />
                    </div>

                    {/* Bio */}
                    <div style={{ marginBottom: '2rem' }} className={styles.inputGroup}>
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            placeholder="Write about yourself"
                            style={{color: 'black'}}
                        ></textarea>
                    </div>

                    <div className={styles.head}>Your Socials</div>

                    {/* LinkedIn */}
                    <div className={styles.inputGroup}>
                        <label>LinkedIn</label>
                        <input
                            type="url"
                            name="linkedin"
                            value={profile.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/your-profile"
                            style={{color: 'black'}}
                        />
                    </div>

                    {/* GitHub */}
                    <div className={styles.inputGroup}>
                        <label>GitHub</label>
                        <input
                            type="url"
                            name="github"
                            value={profile.github}
                            onChange={handleChange}
                            placeholder="https://github.com/your-profile"
                            style={{color: 'black'}}
                        />
                    </div>

                    {/* Instagram */}
                    <div className={styles.inputGroup}>
                        <label>Instagram</label>
                        <input
                            type="url"
                            name="instagram"
                            value={profile.instagram}
                            onChange={handleChange}
                            placeholder="https://instagram.com/your-profile"
                            style={{color: 'black'}}
                        />
                    </div>

                    {/* Twitter */}
                    <div className={styles.inputGroup}>
                        <label>Twitter</label>
                        <input
                            type="url"
                            name="twitter"
                            value={profile.twitter}
                            onChange={handleChange}
                            placeholder="https://twitter.com/your-profile"
                            style={{color: 'black'}}
                        />
                    </div>

                    {/* Save Changes Button */}
                    <button type="submit" className={styles.submitBtn}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
