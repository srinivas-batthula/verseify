'use client'

import Image from "next/image";
import styles from "../styles/Card.module.css";
import useThemeStore from '@/stores/useThemeStore'
import { showSuccess, showFailed } from "@/utils/Toasts";


const Card = ({ 
    author = 'Srinivas', 
    headline = 'Software Developer', 
    avatar = '/author.jpg', 
    title = 'Java Src', 
    hashtags, 
    postImage = '/portfolio_project.png' 
}) => {
    const {theme} = useThemeStore()

    return (
        <div className={styles.postCard} style={{color: theme, background:(theme === 'white') ? 'black' : 'white'}}>
            {/* Header Section */}
            <div className={styles.postHeader} title="open profile">
                <div className={styles.userDetails}>
                    <Image
                        src={avatar}
                        alt={`${author}'s profile`}
                        width={100} 
                        height={100} 
                        className={styles.avatar}
                        style={{ borderRadius: "50%", objectFit: "cover" }} 
                    />
                    <div className={styles.userDetails1}>
                        <div className={styles.authorName}>{author} <span style={{color: (theme === 'black') ? 'rgb(66, 66, 66)' : 'rgb(209, 209, 209)'}} className={styles.times}> • 2h ago</span></div>
                        <div style={{color: (theme === 'black') ? 'rgb(66, 66, 66)' : 'rgb(209, 209, 209)'}} className={styles.authorHead}>{headline}</div>
                    </div>
                </div>
                <button onClick={()=>showSuccess("Following!")} className={styles.followBtn} title="Follow">
                    <span style={{ fontWeight: 'bold' }}><i className="fa-solid fa-plus"></i></span> Follow
                </button>
            </div>

            {/* Post Image */}
            <div className={styles.postContent}>
                {postImage && (
                    <Image 
                        src={postImage} 
                        alt="Post Image"
                        width={500} 
                        height={500} 
                        className={styles.postImage} 
                        style={{ objectFit: 'cover' }} 
                    />
                )}
                <div className={styles.title}>{title}</div>
                <p className={styles.seeMore}>Read more <span style={{ fontWeight: 'bolder' }}>→</span></p>
                <p className={styles.hashtags} style={{ fontSize: '0.85rem' }}>{hashtags}</p>
            </div>

            {/* Engagement Buttons */}
            <div className={styles.postActions}>
                <button onClick={()=>showSuccess("Liked Post!")} className={styles.actionBtn}>
                    <i className="fa-solid fa-heart" style={{ color: 'red' }} title="Like"></i> <span style={{marginLeft:'0.2rem', fontSize: '0.9rem', color: (theme==='black')?'#464646':'rgb(219, 219, 219)' }}>54</span>
                </button>
                <button className={styles.actionBtn}>
                    <i className="fa-regular fa-comment-dots" title="Comment"></i> <span style={{marginLeft:'0.2rem', fontSize: '0.9rem', color: (theme==='black')?'#464646':'rgb(219, 219, 219)' }}>6</span>
                </button>
                <button className={styles.actionBtn}>
                    <i className="fa-solid fa-share-from-square" title="Share"></i>
                </button>
                <button onClick={()=>showSuccess("Post Saved!")} className={styles.actionBtn}>
                    <i className="fa-regular fa-bookmark" title="Bookmark"></i>
                </button>
            </div>
        </div>
    );
};

export default Card;
