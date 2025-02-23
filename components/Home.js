'use client'

import { useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'
import styles from '@/styles/Home.module.css'
import Card from "./Card"
import { motion } from "framer-motion";
import useSavedStore from "@/stores/useSavedStore";


const StarterSection = ({mainContentRef}) => {
    const router = useRouter()
    const [deferredPrompt, setDeferredPrompt] = useState(null)

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()  // Prevent auto-prompt
            setDeferredPrompt(e)  // Store the event for manual trigger
        })

        return () => {
            window.removeEventListener('beforeinstallprompt', () => {})
        }
    }, [])

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()  // Show install prompt

            const { outcome } = await deferredPrompt.userChoice
            if (outcome === 'accepted') {
                console.log('User accepted the install.');
            } else {
                console.log('User dismissed the install.');
            }
        } else {
            alert('PWA install prompt is not available.');
        }
    }

    const handleScrollToContent = () => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollIntoView({ behavior: "smooth" });
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
                    setTimeout(()=>{
                        router.push('/login')
                    }, 1800)
                }}
            >
                Download App Now
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



export default function HomePage() {
    const mainContentRef = useRef(null)
    const {FetchSaved, saved} = useSavedStore()

    useEffect(() => {
        const fetchData = async () => {
            await FetchSaved()
        }
        fetchData()
    }, [])
    

    return (
        <div className={styles.main}>

            <div className={styles.header}>
                <StarterSection mainContentRef={mainContentRef} />
            </div>

            <div ref={mainContentRef}></div>

            <div className={styles.Cards}>
                <Card />
                <Card />
                <Card />
            </div>

        </div>
    )
}