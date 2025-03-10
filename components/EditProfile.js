"use client";

import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import styles from "@/styles/EditProfile.module.css";
import { showSuccess, showFailed } from "@/utils/Toasts";
import useThemeStore from "@/stores/useThemeStore";
import useUserStore from "@/stores/useUserStore";
import { useRouter } from "next/navigation";



const EditProfile = () => {
    const router = useRouter()
    const { theme } = useThemeStore()
    const { user } = useUserStore()
    const [profile, setProfile] = useState({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        social_links: {
            linkedin: (user.social_links) ? user.social_links.linkedin: '',
            github: (user.social_links) ? user.social_links.github : '',
            instagram: (user.social_links) ? user.social_links.instagram : '',
            twitter: (user.social_links) ? user.social_links.twitter : '',
        },
    })
    const [file, setFile] = useState(null)
    const [isFile, setIsFile] = useState(false)



    useEffect(() => {
        setProfile({
            username: user.username || "",
            email: user.email || "",
            bio: user.bio || "",
            social_links: {
                linkedin: (user.social_links) ? user.social_links.linkedin: '',
                github: (user.social_links) ? user.social_links.github : '',
                instagram: (user.social_links) ? user.social_links.instagram : '',
                twitter: (user.social_links) ? user.social_links.twitter : '',
            },
        })
        setFile((user.profile_pic) ? user.profile_pic.secure_url || null : null)
    }, [user])


    const handleChange = (e) => {
        const { name, value } = e.target
        
        if (name.startsWith("social_links.")) {
            const key = name.split(".")[1]; // Extract 'linkedin', 'github', etc.
            setProfile((prevProfile) => ({
                ...prevProfile,
                social_links: {
                    ...prevProfile.social_links,
                    [key]: value
                }
            }))
        } else {
            setProfile((prevProfile) => ({
                ...prevProfile,
                [name]: value
            }))
        }
    }    

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (profile.username === '' || profile.email === '') {
            showFailed("Username and Email are required!")
            return
        }

        const formData = new FormData()
        if (isFile) {
            formData.append('file', file)
        }
        formData.append('data', JSON.stringify(profile))

        // console.log('formData: '+formData.get('data'))           // +'file: '+file+'userId: '+user._id

        try {
            let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/users/${user._id}?q=${isFile}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            })
            res = await res.json()
            // console.log(res)

            if (!res || !res.success) {
                showFailed("Failed to Edit Profile!")
            }
            else {
                showSuccess("Profile Changes Saved Successfully!")
                setTimeout(() => {
                    router.push('/')
                }, 1000)
            }
        }
        catch (error) {
            // console.log(error)
            showFailed("Something went Wrong!")
        }
    }


    return (
        <div className={styles.theme}>
            <div className={styles.container} style={{ color: theme, background: (theme === 'white') ? 'black' : 'white' }}>
                <h2 className={styles.heading}>Edit Profile</h2>
                <form className={styles.form}>

                    {/* Profile Image Upload */}
                    <div className={styles.avatarSection}>
                        <label htmlFor="avatar">
                            <img
                                src={typeof file === 'string' ? file : file ? URL.createObjectURL(file) : (theme === 'white') ? "/user_default_dark.png" : "/user_default_light.png"}
                                alt="Avatar"
                                className={styles.avatar}
                            />
                        </label>
                        <input
                            type="file"
                            id="avatar"
                            className={styles.fileInput}
                            accept="image/*"
                            onChange={(e) => {setFile(e.target.files[0]); setIsFile(true);}}
                        />
                        <label htmlFor="avatar" className={styles.editIcon}>
                            <FaEdit size={20} />
                        </label>
                    </div>

                    <div className={styles.head}>User Info</div>

                    {/* UserName */}
                    <div className={styles.inputGroup} style={{ color: theme }}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            placeholder="Your username"
                            required
                            style={{ color: 'black' }}
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
                            style={{ color: 'black' }}
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
                            style={{ color: 'black' }}
                        ></textarea>
                    </div>

                    <div className={styles.head}>Your Socials</div>

                    {/* LinkedIn */}
                    <div className={styles.inputGroup}>
                        <label>LinkedIn</label>
                        <input
                            type="url"
                            name="social_links.linkedin"
                            value={profile.social_links.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/your-profile"
                            style={{ color: 'black' }}
                        />
                    </div>

                    {/* GitHub */}
                    <div className={styles.inputGroup}>
                        <label>GitHub</label>
                        <input
                            type="url"
                            name="social_links.github"
                            value={profile.social_links.github}
                            onChange={handleChange}
                            placeholder="https://github.com/your-profile"
                            style={{ color: 'black' }}
                        />
                    </div>

                    {/* Instagram */}
                    <div className={styles.inputGroup}>
                        <label>Instagram</label>
                        <input
                            type="url"
                            name="social_links.instagram"
                            value={profile.social_links.instagram}
                            onChange={handleChange}
                            placeholder="https://instagram.com/your-profile"
                            style={{ color: 'black' }}
                        />
                    </div>

                    {/* Twitter */}
                    <div className={styles.inputGroup}>
                        <label>Twitter</label>
                        <input
                            type="url"
                            name="social_links.twitter"
                            value={profile.social_links.twitter}
                            onChange={handleChange}
                            placeholder="https://twitter.com/your-profile"
                            style={{ color: 'black' }}
                        />
                    </div>

                    {/* Save Changes Button */}
                    <button onClick={handleSubmit} type="submit" className={styles.submitBtn}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
