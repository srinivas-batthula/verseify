"use client";

import Image from "next/image";
import styles from "@/styles/Blog.module.css"; // Import CSS file
import React, { useState, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import CommentCard from "./CommentCard";
import useThemeStore from "@/stores/useThemeStore";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading"; 
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight"; 


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



const Blog = ({ post }) => {
    const [content, setContent] = useState(()=>localStorage.getItem("blogContent") || "<p>No content available</p>");
    const {theme} = useThemeStore()

    post = {
        author: 'Srinivas',
        headline: 'Software Developer',
        avatar: '/author.jpg',
        title: 'Java Src',
        hashtags: '#dev',
        image: '/portfolio_project.png',
        content: "Hello all, I'm Srinivas Batthula..."
    }
    const comments = [
        {
            user: { name: "Ansell Maximilian", avatar: "/author.jpg", isSubscriber: true },
            date: "Feb 13",
            text: "Good luck! 👍",
            likes: 3,
        },
        {
            user: { name: "Srinivas", avatar: "/user2.jpg", isSubscriber: false },
            date: "Feb 14",
            text: "Great article! Thanks for sharing.",
            likes: 5,
        },
    ];

    const [newComment, setNewComment] = useState("");

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
        content: content,
        editable: false, // Make it read-only
        editorProps: {
            attributes: { class: "" },
        },
    })

    return (
        <div className={styles.container} style={{color: theme, background: (theme==='white')?'black':'white'}}>
            <div className={styles.box} style={{ marginBottom: '4rem' }}>
                {/* Share Button */}
                <div className={styles.shareSection}>
                    <h1 className={styles.title}>{post.title}</h1>
                    <div className={styles.shareButtons}>
                        <ShareButton />
                    </div>
                </div>

                {/* Post Image */}
                <Image src={post.image} alt="Post Image" width={800} height={800} className={styles.postImage} />

                {/* Author Section */}
                <div className={styles.authorSection}>
                    <Image src={post.avatar} alt="Author's Profile pic" width={100} height={100} className={styles.avatar} style={{ borderRadius: "50%", objectFit: "cover" }} />
                    <div className={styles.authorDetails}>
                        <h3 className={styles.authorName}>{post.author}</h3>
                        <p className={styles.authorBio}>{post.headline}</p>
                    </div>
                    <button className={styles.followBtn}>
                        <span style={{ fontWeight: 'bold' }}><i className="fa-solid fa-plus"></i></span> Follow
                    </button>
                </div>

                {/* Like & Comment Section */}
                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={() => setLikes(likes + 1)}>
                        <i className="fa-solid fa-heart" style={{ color: 'red' }} title="Likes"></i> <span style={{ marginLeft: '0.2rem', fontSize: '0.9rem', color: (theme === 'black') ? '#464646' : 'rgb(219, 219, 219)' }}>54</span>
                    </button>
                    <button className={styles.actionBtn}><i class="fa-regular fa-comment-dots" title="Comments"></i> <span style={{ marginLeft: '0.2rem', fontSize: '0.9rem', color: (theme === 'black') ? '#464646' : 'rgb(219, 219, 219)' }}>54</span></button>
                </div>

                {/* Post Content */}
                <p className={styles.content}>
                    <EditorContent editor={editor} />
                </p>

                {/* Comment Section */}
                <div className={styles.commentSection}>
                    <h3 className={styles.commentTitle}>Leave a Comment:</h3>
                    <textarea
                        className={styles.commentBox}
                        placeholder="Write your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{color: theme, background: (theme==='white')?'black':'white'}}
                    />
                    <button className={styles.commentSubmit} onClick={() => setComments(comments + 1)}>
                        Comment
                    </button>

                    {/* Comments */}
                    <div style={{marginTop:'2rem', padding:'1rem'}}>
                        {comments.map((comment, index) => (
                            <CommentCard key={index} comment={comment} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Blog;
