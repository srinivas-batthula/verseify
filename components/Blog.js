"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import styles from "@/styles/Blog.module.css"; // Import CSS file
import React, { useState, useEffect, use } from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import CommentCard from "./CommentCard";
import { showSuccess, showFailed } from "@/utils/Toasts";
import useThemeStore from "@/stores/useThemeStore";
import useUserStore from "@/stores/useUserStore";
import { saveResponse } from "@/public/lib/indexedDB";
import useSavedStore from "@/stores/useSavedStore";
import useTokenStore from "@/stores/useTokenStore";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";



const ShareButton = ({ data }) => {                     //data = { url, text }
    const [canUseWebShare, setCanUseWebShare] = useState(false)
    const shareUrl = (data.url) ? (process.env.NEXT_PUBLIC_HOME + '/blog/' + data.url) : (typeof window !== "undefined" ? window.location.href : "")
    const shareText = (data.text) ? data.text : ("Check out this awesome website!")

    useEffect(() => {
        if (navigator.share) {
            setCanUseWebShare(true)
        }
    }, [])

    const handleNativeShare = async () => {
        try {
            await navigator.share({
                title: "Verseify",
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



const Blog = () => {
    const params = useParams()
    const id = params.id
    const router = useRouter()
    const { theme } = useThemeStore()
    const { user, setUser } = useUserStore()
    const { saved, FetchSaved } = useSavedStore()
    const {token} = useTokenStore()
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState([])
    const [post, setPost] = useState({
        author: '',
        _id: '',
        authorName: '',
        authorBio: '',
        authorPic: {
            secure_url: '',
            public_id: ''
        },
        title: '',
        tags: [],
        media: {
            secure_url: '',
            public_id: ''
        },
        likes: [],
        createdAt: new Date(),
        content: "",
        authorSocials: {},
    })
    const [isLiked, setIsLiked] = useState((post.likes.includes(user._id)) ? true : false)
    const [isFollowing, setIsFollowing] = useState((user.following.includes(post.author)) ? true : false)


    useEffect(() => {
        const getBlog = async () => {
            try {
                let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/blogs/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application',
                        'Authorization': token,
                    },
                    // credentials: 'include',
                })
                res = await res.json()
                // console.log(res)

                if (!res || !res.success) {
                    return
                }
                else {
                    setPost(res.blog)
                }
            }
            catch (err) {
                return
            }
        }

        const getComments = async () => {
            try {
                let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/comments/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application',
                        'Authorization': token,
                    },
                    // credentials: 'include',
                })
                res = await res.json()
                // console.log(res)

                if (!res || !res.success) {
                    return
                }
                else {
                    setComments(res.comments)
                }
            }
            catch (err) {
                return
            }
        }

        getBlog()
        getComments()
    }, [id])

    let authorCheck = (post.author === user._id) ? true : false

    useEffect(() => {
        if(post){
            setIsFollowing((user.following.includes(post.author)) ? true : false)
            setIsLiked((post.likes.includes(user._id)) ? true : false)
            authorCheck = (post.author === user._id) ? true : false
        }
        // console.log(post.content)
    }, [user, post])


    const isSaved = (saved && saved.length > 0) ? saved.some((item) => item.id === post._id) : false

    async function handleSave(e) {
        showSuccess(isSaved ? "Post Unsaved!" : "Post Saved!")

        const res = await saveResponse({id: post._id, response: post})

        await FetchSaved()

        if (!res || !res.success) {
            showFailed("Failed to Save!")
        }
    }

    const handleDelete = async (e) => {
        showSuccess("Post Deleted Successfully!")

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/blogs/${post._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            // credentials: 'include',
        })
        res = await res.json()

        if (!(res && res.success)) {
            showFailed("Failed to Delete!")
        }
    }

    const handleFollow = async (e) => {
        const login = typeof window !== 'undefined' ? localStorage.getItem('login') : null
        if (login === 'false') {
            showFailed('Please do Login to Continue!')
            return
        }

        showSuccess(isFollowing ? "UnFollowed!" : "Followed!")

        // console.log('user._id: '+user._id+'     data.author: '+data.author)

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/follow/${user._id}?q=${isFollowing ? 'unfollow' : 'follow'}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            // credentials: 'include',
            body: JSON.stringify({ id: post.author })
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

    const handleLike = async (e) => {
        const login = typeof window !== 'undefined' ? localStorage.getItem('login') : null
        if (login === 'false') {
            showFailed('Please do Login to Continue!')
            return
        }

        showSuccess("Liked Post!")

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/blogs/${post._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            // credentials: 'include',
            body: JSON.stringify({ id: user._id })
        })
        res = await res.json()
        // console.log(res)

        if (!(res && res.success)) {
            showFailed("Failed to Like Post!")
        }
        else {
            setIsLiked(true)
            setPost((prev) => ({
                ...prev,
                likes: [...prev.likes, user._id],
            }))
        }
    }

    const handleComment = async (e) => {
        if (newComment === '') {
            showFailed("Enter Something to Comment!")
            return
        }

        const login = typeof window !== 'undefined' ? localStorage.getItem('login') : null
        if (login === 'false') {
            showFailed('Please do Login to Continue!')
            return
        }

        showSuccess("Added New Comment!")

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/comments/${post._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            // credentials: 'include',
            body: JSON.stringify({ userId: user._id, text: newComment })
        })
        res = await res.json()
        // console.log(res)

        if (!res || !res.success) {
            showFailed("Failed to Comment!")
        }
        else {
            setNewComment("")
            setComments([res.comment, ...comments])          //Updating 'comments'-state with new comment...
        }
    }



    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Heading.configure({ levels: [1, 2, 3] }),
            BulletList.configure({ HTMLAttributes: { class: "list-disc ml-3" } }),
            OrderedList.configure({ HTMLAttributes: { class: "list-decimal ml-3" } }),
            Underline,
            Highlight,
        ],
        content: post.content || "<p>Loading...</p>",
        editable: false, // Make it read-only
        editorProps: {
            attributes: { class: "" },
        },
    })


    return (
        <div className={styles.container} style={{ color: theme, background: (theme === 'white') ? 'black' : 'white' }}>
            <div className={styles.box} style={{ marginBottom: '4rem' }}>
                {/* Share Button */}
                <div className={styles.shareSection}>
                    <h1 className={styles.title}>{post.title}</h1>
                    <div className={styles.shareButtons}>
                        <ShareButton data={{ url: post._id, text: `Check out my awesome Blog '${post.title}'` }} />
                    </div>
                </div>

                {/* Post Image */}
                {
                    (post.media && post.media.secure_url !== '') && (
                        <Image src={post.media.secure_url} alt="Post Image" width={800} height={800} className={styles.postImage} />
                    )
                }
                <div style={{ marginBottom: (!post.media || post.media.secure_url === '') ? '2.5rem' : '0' }}></div>

                {/* Author Section */}
                <div className={styles.authorSection}>
                    <div onClick={() => { router.push(`/profile/${post.author}`) }} className={styles.author}>
                        <Image src={(post.authorPic && post.authorPic.secure_url !== '') ? post.authorPic.secure_url : '/user_default_dark.png'} alt="Author's Profile pic" width={100} height={100} className={styles.avatar} style={{ borderRadius: "50%", objectFit: "cover" }} />
                        <div className={styles.authorDetails}>
                            <h3 className={styles.authorName}>{authorCheck ? 'You' : post.authorName}</h3>
                            <p className={styles.authorBio}>{post.authorBio}</p>
                        </div>
                    </div>

                    <button className={styles.followBtn}>
                        {
                            authorCheck ? (<span onClick={handleDelete} title="delete blog"><i className="fa-solid fa-trash-can"></i></span>) : (isFollowing) ? (<span onClick={handleFollow} title="UnFollow"><span style={{ fontWeight: 'bold' }}><i className="fa-solid fa-minus"></i></span> UnFollow</span>) : (<span onClick={handleFollow} title="Follow"><span style={{ fontWeight: 'bold' }}><i className="fa-solid fa-plus"></i></span> Follow</span>)
                        }
                    </button>
                </div>

                {/* Like & Comment & Save Section */}
                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={handleLike}>
                        {
                            isLiked ? (<i className="fa-solid fa-heart" style={{ color: 'red' }} title="Like"></i>) : (<i className="fa-regular fa-heart" style={{ color: theme }} title="Like"></i>)
                        }
                        <span style={{ marginLeft: '0.2rem', fontSize: '0.9rem', color: (theme === 'black') ? '#464646' : 'rgb(219, 219, 219)' }}>{post.likes.length || 0}</span>
                    </button>

                    <a href="#comments" className={styles.actionBtn}><i className="fa-regular fa-comment-dots" title="Comments"></i></a>

                    <button onClick={handleSave} className={styles.actionBtn}>
                        {
                            isSaved ? <i className="fa-solid fa-bookmark" title="Bookmark"></i> : <i className="fa-regular fa-bookmark" title="Bookmark"></i>
                        }
                    </button>
                </div>

                {/* Post Content */}
                <div className={styles.content}>
                    {/* {editor && <EditorContent editor={editor} />} */}
                    {editor && <div dangerouslySetInnerHTML={{ __html: post.content }} />}
                </div>

                {/* Comment Section */}
                <div id="comments" className={styles.commentSection}>
                    <h3 className={styles.commentTitle}>Leave a Comment:</h3>
                    <textarea
                        className={styles.commentBox}
                        placeholder="Write your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ color: theme, background: (theme === 'white') ? 'black' : 'white' }}
                    />
                    <button className={styles.commentSubmit} onClick={handleComment}>
                        Comment
                    </button>

                    {/* Comments */}
                    <div style={{ marginTop: '2rem', padding: '1rem' }}>
                        {
                            (!comments && comments.length === 0) ? <div >No Comments Yet.</div> : comments.map((comment, index) => (
                                <CommentCard key={index} comment={comment} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Blog;
