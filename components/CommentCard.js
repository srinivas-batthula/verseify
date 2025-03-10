'use client'

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useThemeStore from "@/stores/useThemeStore";
import useUserStore from "@/stores/useUserStore";
import { showSuccess, showFailed } from "@/utils/Toasts";
import styles from "@/styles/CommentCard.module.css";



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


const CommentCard = ({ comment }) => {
    const router = useRouter()
    const { theme } = useThemeStore()
    const { user } = useUserStore()
    const [likes, setLikes] = useState(comment.likesCount || 0)
    const [showReplyInput, setShowReplyInput] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [replies, setReplies] = useState(comment.replies || [])


    const handleReplySubmit = async () => {
        if (replyText === '') {
            showFailed("Enter Something to Reply!")
            return
        }

        const login = typeof window !== 'undefined' ? localStorage.getItem('login') : null
        if (login === 'false') {
            showFailed('Please do Login to Continue!')
            return
        }

        showSuccess("Added New Reply!")

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/comments/${comment.blogId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ userId: user._id, text: replyText, parentId: comment._id })
        })
        res = await res.json()
        // console.log(res)

        if (!res || !res.success) {
            showFailed("Failed to Reply!")
        }
        else {
            setReplyText("")
            setShowReplyInput(false)
            setReplies([res.comment, ...replies])
        }
    }

    const handleLike = async () => {
        const login = typeof window !== 'undefined' ? localStorage.getItem('login') : null
        if (login === 'false') {
            showFailed('Please do Login to Continue!')
            return
        }

        showSuccess("Liked Comment!")
        setLikes(prevLikes => prevLikes + 1)

        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/comments/${comment._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        res = await res.json()
        // console.log(res)

        if (!res || !res.success) {
            showFailed("Failed to Like Comment!")
        }
    }

    const authorCheck = (comment.userId === user._id) ? true : false


    return (
        <div className={styles.commentCard}>
            {/* Profile Image */}
            <Image onClick={() => { router.push(`/profile/${comment.userId}`) }} src={(comment.authorPic && comment.authorPic.secure_url !== '') ? comment.authorPic.secure_url : (theme === 'black' ? '/user_default_dark.png' : '/user_default_light.png')} alt="User Avatar" width={100} height={100} className={styles.avatar} />

            <div className={styles.commentContent}>
                {/* User Info */}
                <div className={styles.userInfo}>
                    <span onClick={() => { router.push(`/profile/${comment.userId}`) }} className={styles.username}>{authorCheck ? 'You' : comment.authorName}</span>
                    {/* {comment.user.isSubscriber && <span className={styles.subscriber}>Subscriber</span>} */}
                    <span className={styles.dot}>•</span>
                    <span className={styles.date}>{daysAgo(comment.createdAt)}</span>
                </div>

                {/* Comment Text */}
                <p className={styles.commentText}>{comment.text}</p>

                {/* Actions (Like & Reply) */}
                <div className={styles.actions}>
                    <button className={styles.likeBtn} onClick={handleLike}>
                        👍 {likes || 0}
                    </button>

                    <button className={styles.replyBtn} onClick={() => setShowReplyInput(!showReplyInput)}>
                        Reply
                    </button>
                </div>

                {/* Reply Input Box */}
                {showReplyInput && (
                    <div className={styles.replyInputContainer}>
                        <textarea
                            className={styles.replyInput}
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            style={{ color: theme, background: (theme === 'white') ? 'black' : 'white' }}
                        />
                        <button className={styles.submitReplyBtn} onClick={handleReplySubmit}>
                            Reply
                        </button>
                    </div>
                )}

                {/* Render Nested Replies */}
                <div className={styles.repliesContainer}>
                    {
                        (replies.length > 0) && replies.map((reply, index) => (
                            <CommentCard key={index} comment={reply} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
