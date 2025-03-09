'use client'

import { useEffect, useRef, useState } from "react";
import styles from '@/styles/Home.module.css'
import Card from "./Card"
import { motion } from "framer-motion"
import useDataStore from "@/stores/useDataStore"

import * as React from 'react';
import { Skeleton, Stack, Box } from '@mui/material';


const StarterSection = ({ mainContentRef }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null)

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()  // Prevent auto-prompt
            setDeferredPrompt(e)  // Store the event for manual trigger
        })

        return () => {
            window.removeEventListener('beforeinstallprompt', () => { })
        }
    }, [])

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()  // Show install prompt

            const { outcome } = await deferredPrompt.userChoice
            if (outcome === 'accepted') {
                console.log('User accepted the install.')
            } else {
                console.log('User dismissed the install.')
            }
        } else {
            alert('PWA install prompt is not available.')
        }
    }

    const handleScrollToContent = () => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }


    return (
        <div className={styles.starterContainer}>
            <motion.h1
                className={styles.starterTitle}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Start your journey <br />
                <span className={styles.highlight}>into the world of words</span> <br />
                in 5 minutes
            </motion.h1>
            <motion.button
                className={styles.starterButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    handleInstallClick()
                    // setTimeout(()=>{
                    //     router.push('/login')
                    // }, 1800)
                }}
            >
                Get the App
            </motion.button>
            <motion.div
                className={styles.scrollIcon}
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                onClick={handleScrollToContent} // Scroll to main content on click
            >
                ⬇
            </motion.div>
        </div>
    )
}


const BlogCardSkeleton = () => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                padding: { xs: 2, sm: 4 }, // Responsive padding
                maxWidth: "600px", // Restrict width for larger screens
                margin: "0 auto", // Centering
            }}
        >
            {[1, 2, 3].map((_, index) => (
                <Stack
                    key={index}
                    spacing={1}
                    sx={{
                        width: "100%",
                        padding: 2,
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                    }}
                >
                    <Skeleton variant="text" sx={{ fontSize: "1.2rem", width: "60%" }} />
                    <Skeleton variant="circular" sx={{ width: 50, height: 50 }} />
                    <Skeleton variant="rectangular" sx={{ width: "100%", height: 80 }} />
                    <Skeleton variant="rounded" sx={{ width: "100%", height: 80 }} />
                </Stack>
            ))}
        </Box>
    )
}



export default function HomePage({ data1 = { blogs: [], page: 0, totalBlogs: 0, totalPages: 0, } }) {
    const mainContentRef = useRef(null)
    const { setData, data, FetchData } = useDataStore()
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setData(data1)
        // console.log('data: ' + data1)
    }, [])


    //Pagination.................................
    // 🔥 Fetch new blogs when user scrolls to the bottom
    const fetchMoreBlogs = async () => {
        if (loading)
            return

        setLoading(true)

        FetchData(data.page + 1)

        setTimeout(() => {
            setLoading(false)
        }, 1200)
    }


    return (
        <div className={styles.main}>

            <div className={styles.header}>
                <StarterSection mainContentRef={mainContentRef} />
            </div>

            <div ref={mainContentRef}></div>

            <div className={styles.Cards}>
                {
                    (loading) ? (<BlogCardSkeleton />) : (data && data.totalBlogs > 0) ? (
                        data.blogs.map((item, index) => {
                            return <Card key={index} data={item} />
                        })
                    ) : (<div className="mt-6 px-4 py-2 text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md">No Blogs found!</div>)
                }
                {/* <Card />
                    <Card />
                    <Card /> */}
            </div>

            {/* Load More Button */}
            {
                (data.page === data.totalPages) ? (<div className="mt-6 px-4 py-2 text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md">
                    🎉 You have read all blogs!
                </div>
                ) : (<button
                    onClick={fetchMoreBlogs}
                    disabled={loading}
                    className={`mb-1 px-3 py-2 text-white font-semibold bg-blue-600 
                            rounded-full shadow-lg transition-all duration-300 
                            hover:bg-blue-700 hover:scale-105 
                            active:scale-95 
                            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Loading..." : "Load More ->"}
                </button>)
            }

        </div>
    )
}