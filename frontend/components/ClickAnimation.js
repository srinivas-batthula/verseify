"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/Home.module.css";


const ClickAnimation = () => {
    const [clicks, setClicks] = useState([])

    useEffect(() => {
        const handleClick = (event) => {
            const { clientX, clientY } = event;
            const newClick = { id: Date.now(), x: clientX, y: clientY }
            setClicks((prev) => [...prev, newClick])

            // Remove animation after a short delay
            setTimeout(() => {
                setClicks((prev) => prev.filter((click) => click.id !== newClick.id))
            }, 650)
        }

        window.addEventListener("click", handleClick)
        return () => window.removeEventListener("click", handleClick)
    }, [])

    return (
        <AnimatePresence>
            {clicks.map((click) => (
                <motion.div
                    key={click.id}
                    className={styles.ripple}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    style={{ left: click.x, top: click.y }}
                />
            ))}
        </AnimatePresence>
    )
}




export default ClickAnimation
