'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../styles/Card.module.css";
import useThemeStore from '@/stores/useThemeStore'
import { showSuccess, showFailed } from "@/utils/Toasts";
import React, { useState, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { saveResponse, getResponse } from "@/lib/indexedDB";



const ShareButton = () => {
    const [canUseWebShare, setCanUseWebShare] = useState(false);
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = "Check out this awesome website!";

    useEffect(() => {
        if (navigator.share) {
            setCanUseWebShare(true);
        }
    }, []);

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
            <button
                className={styles.actionBtn}
                onClick={canUseWebShare ? handleNativeShare : undefined}
            >
                <i className="fa-solid fa-share-from-square" title="Share"></i>
            </button>

            {!canUseWebShare && (
                <div className="flex space-x-2">
                    <FacebookShareButton url={shareUrl}>
                        <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md">F</button>
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl}>
                        <button className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-md">X</button>
                    </TwitterShareButton>
                    <WhatsappShareButton url={shareUrl}>
                        <button className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all shadow-md">W</button>
                    </WhatsappShareButton>
                </div>
            )}
        </div>
    )
}


const Card = ({ 
    author = 'Srinivas', 
    headline = 'Software Developer', 
    avatar = '/author.jpg', 
    title = 'Java Src', 
    hashtags,
    postImage = '/portfolio_project.png' 
}) => {
    const {theme} = useThemeStore()
    const router = useRouter()

    async function handleSave(e) {
        showSuccess("Post Saved!")

        const r = await saveResponse('1', { 
            author : 'Srinivas', 
            headline : 'Software Developer', 
            avatar : '/author.jpg', 
            title : 'Java Src', 
            postImage : '/portfolio_project.png' 
        })

        if(!r){
            showFailed("Failed to Save!")
        }
        
        const res = await getResponse()
        console.log(res)
    }

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
            <div onClick={()=>{router.push('/blog')}} className={styles.postContent}>
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
                {/* <button className={styles.actionBtn}>
                    <i className="fa-solid fa-share-from-square" title="Share"></i>
                </button> */}
                <ShareButton />
                <button onClick={handleSave} className={styles.actionBtn}>
                    <i className="fa-regular fa-bookmark" title="Bookmark"></i>
                </button>
            </div>
        </div>
    );
};

export default Card;
