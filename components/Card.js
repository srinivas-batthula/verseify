'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../styles/Card.module.css";
import useThemeStore from '@/stores/useThemeStore'
import { showSuccess, showFailed } from "@/utils/Toasts";
import React, { useState, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { saveResponse } from "@/public/lib/indexedDB";
import useSavedStore from "@/stores/useSavedStore";
import useUserStore from "@/stores/useUserStore";
import useDataStore from "@/stores/useDataStore";



const ShareButton = ({ data }) => {                     //data = { url, text }
    const [canUseWebShare, setCanUseWebShare] = useState(false)
    const shareUrl = (data.url) ? (process.env.NEXT_PUBLIC_HOME + '/blog/' + data.url) : (typeof window !== "undefined" ? window.location.href : "")
    const shareText = (data.text) ? data.text : ("Check out this awesome website!")

    useEffect(() => {
        if (navigator.share) {
            setCanUseWebShare(true)
        }
    }, []);

    const handleNativeShare = async () => {
        try {
            await navigator.share({
                title: "Verseify",
                text: shareText,
                url: shareUrl,
            });
            console.log("Shared successfully!")
        } catch (error) {
            console.error("Error sharing:", error)
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




function daysAgo(date) {
    const now = new Date();
    const inputDate = new Date(date);

    // Get only the date part (reset time to 00:00:00 for accurate comparison)
    now.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    // Calculate the difference in days
    const diffInDays = Math.floor((now - inputDate) / (1000 * 60 * 60 * 24));

    return `${diffInDays}d ago`;
}


const Card = ({ data = {} }) => {
    const { theme } = useThemeStore()
    const {setData} = useDataStore()
    const { saved, FetchSaved } = useSavedStore()
    const { user, setUser } = useUserStore()
    const [isLiked, setIsLiked] = useState((data.likes.includes(user._id)) ? true : false)
    const [isFollowing, setIsFollowing] = useState((user.following.includes(data.author)) ? true : false)
    const router = useRouter()

    const isSaved = (saved && saved.length > 0) ? saved.some((item) => item.id === data._id) : false
    let authorCheck = (data.author === user._id) ? true : false

    useEffect(()=>{             //Executes on client side to re-assign 'user' values after SSR...
        if(data){
            setIsFollowing((user.following.includes(data.author)) ? true : false)
            setIsLiked((data.likes.includes(user._id)) ? true : false)
            authorCheck = (data.author === user._id) ? true : false
        }
    }, [user, data])


    async function handleSave(e) {
        showSuccess(isSaved ? "Post Unsaved!" : "Post Saved!")

        const res = await saveResponse({id: data._id, response: data})

        await FetchSaved()

        if (!res || !res.success) {
            showFailed("Failed to Save!")
        }
    }

    const handleDelete = async (e) => {
        showSuccess("Post Deleted Successfully!")
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/db/blogs/${data._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            credentials: 'include',
        })
        res = await res.json()

        if (!(res && res.success)) {
            showFailed("Failed to Delete!")
        }
        else{
            setTimeout(()=>{
                showSuccess('Please Refresh to see Changes!')
            }, 650)
        }
    }

    const handleFollow = async (e) => {
        const login = typeof window !== 'undefined' ? localStorage.getItem('login') : null
        if(login==='false'){
            showFailed('Please do Login to Continue!')
            return
        }
            
        showSuccess(isFollowing ? "UnFollowed!" : "Followed!")

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        // console.log('user._id: '+user._id+'     data.author: '+data.author)

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/db/follow/${user._id}?q=${isFollowing ? 'unfollow' : 'follow'}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            credentials: 'include',
            body: JSON.stringify({id : data.author})
        })
        res = await res.json()
        // console.log(res)

        if (res && res.success) {
            setUser(res.user)
            setIsFollowing(!isFollowing)
        }
        else{
            showFailed(isFollowing ? "Failed to UnFollow!" : "Failed to Follow!")
        }
    }

    const handleLike = async (e) => {
        const login = typeof window !== 'undefined' ? localStorage.getItem('login') : null
        if(login==='false'){
            showFailed('Please do Login to Continue!')
            return
        }
        
        showSuccess("Liked Post!")
        setIsLiked(true)

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/db/blogs/${data._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            credentials: 'include',
            body: JSON.stringify({id : user._id})
        })
        res = await res.json()
        // console.log(res)

        if (!(res && res.success)) {
            showFailed("Failed to Like Post!")
            setIsLiked(false)
        }
    }


    return (
        <div className={styles.postCard} style={{ color: theme, background: (theme === 'white') ? 'black' : 'white' }}>
            {/* Header Section */}
            <div className={styles.postHeader} title="open profile">
                <div onClick={() => { router.push(`/profile/${data.author}`) }} className={styles.userDetails}>
                    <Image
                        src={(data.authorPic && data.authorPic.secure_url!=='') ? data.authorPic.secure_url : (theme === 'black' ? '/user_default_dark.png' : '/user_default_light.png')}
                        alt={`${data.authorName}'s profile`}
                        width={100}
                        height={100}
                        className={styles.avatar}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div className={styles.userDetails1}>
                        <div className={styles.authorName}>{authorCheck ? 'You' : data.authorName} <span style={{ color: (theme === 'black') ? 'rgb(66, 66, 66)' : 'rgb(209, 209, 209)' }} className={styles.times}> • {daysAgo(data.createdAt)}</span></div>
                        <div style={{ color: (theme === 'black') ? 'rgb(66, 66, 66)' : 'rgb(209, 209, 209)' }} className={styles.authorHead}>{data.authorBio}</div>
                    </div>
                </div>
                <button>
                    {
                        authorCheck ? (<span onClick={handleDelete} className={styles.deleteBtn} title="delete blog"><i className="fa-solid fa-trash-can"></i></span>) : (isFollowing) ? (<span onClick={handleFollow} className={styles.followBtn} title="UnFollow"><span style={{ fontWeight: 'bold' }}><i className="fa-solid fa-minus"></i></span> UnFollow</span>) : (<span onClick={handleFollow} className={styles.followBtn} title="Follow"><span style={{ fontWeight: 'bold' }}><i className="fa-solid fa-plus"></i></span> Follow</span>)
                    }
                </button>
            </div>

            {/* Post Image */}
            <div onClick={() => { router.push(`/blog/${data._id}`) }} className={styles.postContent}>
                {(data.media && data.media.secure_url!=='') && (
                    <Image
                        src={data.media.secure_url}
                        alt="Post Image"
                        width={600}
                        height={600}
                        className={styles.postImage}
                        style={{ objectFit: 'cover' }}
                    />
                )}
                <div className={styles.title}>{data.title}</div>
                <p className={styles.seeMore}>Read more <span style={{ fontWeight: 'bolder' }}>→</span></p>
                <ul className={styles.hashtags} style={{ marginTop: '1.3rem', marginBottom: '0.6rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    {
                        data.tags.map((item, index) => {
                            return <li className={styles.hashtag1} key={index} style={{ fontSize: '0.85rem' }}>#{item}</li>
                        })
                    }
                </ul>
            </div>

            {/* Engagement Buttons */}
            <div className={styles.postActions}>
                <button onClick={handleLike} className={styles.actionBtn}>
                    {
                        isLiked ? (<i className="fa-solid fa-heart" style={{ color: 'red' }} title="Like"></i>) : (<i className="fa-regular fa-heart" style={{ color: theme }} title="Like"></i>)
                    }
                    <span style={{ marginLeft: '0.2rem', fontSize: '0.9rem', color: (theme === 'black') ? '#464646' : 'rgb(219, 219, 219)' }}>{data.likes.length || 0}</span>
                </button>

                <button className={styles.actionBtn} onClick={() => { router.push(`/blog/${data._id}/#comments`) }}>
                    <i className="fa-regular fa-comment-dots" title="Comment"></i>
                </button>
                {/* <button className={styles.actionBtn}>
                    <i className="fa-solid fa-share-from-square" title="Share"></i>
                </button> */}

                <ShareButton data={{ url: data._id, text: `Check out my awesome Blog '${data.title}'` }} />
                
                <button onClick={handleSave} className={styles.actionBtn}>
                    {
                        isSaved ? <i className="fa-solid fa-bookmark" title="Bookmark"></i> : <i className="fa-regular fa-bookmark" title="Bookmark"></i>
                    }
                </button>
            </div>
        </div>
    );
};

export default Card;
