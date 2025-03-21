'use client'

import React, { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion"
import styles from '../styles/Ai.module.css'



const Message = ({ text, sender }) => {
    return (
        <div className={`${styles.message} ${sender === "user" ? styles.user : styles.ai}`}>
            <ReactMarkdown>{text}</ReactMarkdown>
        </div>
    )
}


export default function Ai() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const chatBoxRef = useRef(null)


    useEffect(() => {
        chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim())
            return

        setLoading(true)
        const userMessage = { text: input, sender: "user" }
        setMessages([...messages, userMessage])

        setInput("")

        try {
            let response = await fetch("https://sambanova-ai-fastapi.onrender.com/verseify_ai", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ userInput: input }),
            })
            response = await response.json()
            const aiMessage = { text: response.response, sender: "ai" }

            // const aiMessage = { text: "Hello User, How can I help you today?", sender: "ai" }

            setTimeout(() => {
                setMessages((prev) => [...prev, aiMessage])
                setLoading(false)
            }, 1000)

        }
        catch (error) {
            console.error("Error:", error)
        }
        // finally {
        //     setLoading(false)
        // }
    }

    return (
        <div className={styles.chatContainer}>

            {
                // Messages...
                (messages && messages.length !== 0) ?
                    (
                        <div className={styles.chatBox}>
                            <h1 className={styles.heading1}>Write with AI</h1>

                            <div className={styles.box2} ref={chatBoxRef}>
                                {
                                    messages.map((msg, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                        >
                                            <Message text={msg.text} sender={msg.sender} />
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </div>
                    ) :
                    (
                        <div className={styles.chatUI}>
                            <h1 className={styles.heading}>Post with AI</h1>
                            <p className={styles.note}>
                                <span className={styles.alert}>Note:</span> Type <b>`#`</b> & Enter your topic to use <b>'Post with AI'</b> feature.
                            </p>
                            <p className={styles.hashtags}>#healthcare <span style={{ marginLeft: '6px' }}></span> #ai <span style={{ marginLeft: '6px' }}></span> #webdev</p>
                        </div>
                    )
            }

            {/* Input Container... */}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    className={styles.inputField}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()     // Prevents newline in input
                            return sendMessage()
                        }
                    }}
                    placeholder="Ask anything   { #ai  #trends }"
                />
                <motion.button
                    className={styles.sendButton}
                    onClick={sendMessage}
                    whileTap={{ scale: 0.9 }}
                >
                    {
                        (loading===true) ? (
                            <div className={styles.loadingDots}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>) : '➤'
                    }
                </motion.button>
            </div>
        </div>
    )
}
