'use client'

import React, { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { showFailed } from '@/utils/Toasts'
import styles from '../styles/Ai.module.css'




const Message = ({ data }) => {
    const router = useRouter()

    const handlePost = async () => {
        if (data.q && data.q === true) {
            const responseContent = data.text

            // Extract title
            const titleMatch = responseContent.match(/\*\*SEO-friendly 5-word title:\*\* "(.*?)"/)
            const title = titleMatch ? titleMatch[1] : null

            // Extract hashtags
            const hashtagsList = responseContent.match(/#\w+/g) || []                        // Match hashtags
            const hashtagsWithoutHash = hashtagsList.map(tag => encodeURIComponent(tag))     // Remove '#' by slicing
            const hashtags = hashtagsWithoutHash.join(" ")                                   // Join them into a space-separated string

            // Extract content snippet
            const contentMatch = responseContent.match(/\*\*10-word engaging blog content snippet:\*\* "(.*?)"/)
            const content = contentMatch ? contentMatch[1] : null

            // console.log(hashtags)
            return router.push(`/post?q=true&title=${title}&content=${content}&hashtags=${hashtags}`)
        }
    }


    return (
        <div className={`${styles.message} ${data.sender === "user" ? styles.user : styles.ai}`}>
            <ReactMarkdown>{data.text}</ReactMarkdown>

            <button onClick={handlePost} type="button" className={styles.msgBtn} style={{ display: (data.sender === "ai" && data.q) ? 'flex' : 'none', color:'rgb(55, 212, 176)', justifyContent:'center', alignContent:'center', textAlign:'center', marginTop:'2rem' }}>Quick Post ➤</button>
        </div>
    )
}


export default function Ai() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const chatBoxRef = useRef(null)


    // useEffect(()=>{
    //     fetch('https://sambanova-ai-fastapi-ytj2.onrender.com/', {
    //         method:'GET',
    //         headers: { "Content-Type": "application/json" },
    //     })
    // }, [])

    useEffect(() => {
        chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim()){
            showFailed("Enter a Valid input(s)!")
            return
        }

        setLoading(true)
        const userMessage = { text: input, sender: "user" }
        setMessages([...messages, userMessage])
        setInput("")

        if (input.trim().includes('#')) {
            userMessage.q = true
        }
        else {
            userMessage.q = false
        }

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_SAMBANOVA_URL+`/verseify_ai?q=${userMessage.q}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput: input }),
            })
            response = await response.json()
            let aiMessage = { text: response.response, sender: "ai", q: userMessage.q }

            setMessages((prev) => [...prev, aiMessage])
        }
        catch(error) {
            showFailed("Something went wrong!")
            console.error("Error:", error)
        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
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
                                            <Message data={msg} />
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
                        (loading === true) ? (
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
