'use client'

import React, { useState } from "react";
import Image from "next/image";
import useThemeStore from "@/stores/useThemeStore";
import styles from "@/styles/CommentCard.module.css";


const CommentCard = ({ comment }) => {
    const {theme} = useThemeStore()
    const [likes, setLikes] = useState(comment.likes);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState(comment.replies || []);

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            const newReply = {
                user: { name: "You", avatar: "/your-avatar.jpg", isSubscriber: false },
                date: "Just now",
                text: replyText,
                likes: 0,
                replies: [],
            };
            setReplies([...replies, newReply]);
            setReplyText("");
            setShowReplyInput(false);
        }
    };

    return (
        <div className={styles.commentCard}>
            {/* Profile Image */}
            <Image src={comment.user.avatar} alt="User Avatar" width={100} height={100} className={styles.avatar} />

            <div className={styles.commentContent}>
                {/* User Info */}
                <div className={styles.userInfo}>
                    <span className={styles.username}>{comment.user.name}</span>
                    {comment.user.isSubscriber && <span className={styles.subscriber}>Subscriber</span>}
                    <span className={styles.dot}>•</span>
                    <span className={styles.date}>{comment.date}</span>
                </div>

                {/* Comment Text */}
                <p className={styles.commentText}>{comment.text}</p>

                {/* Actions (Like & Reply) */}
                <div className={styles.actions}>
                    <button className={styles.likeBtn} onClick={() => setLikes(likes + 1)}>
                        👍 {likes}
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
                            style={{color: theme, background: (theme==='white')?'black':'white'}}
                        />
                        <button className={styles.submitReplyBtn} onClick={handleReplySubmit}>
                            Reply
                        </button>
                    </div>
                )}

                {/* Render Nested Replies */}
                <div className={styles.repliesContainer}>
                    {replies.map((reply, index) => (
                        <CommentCard key={index} comment={reply} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
