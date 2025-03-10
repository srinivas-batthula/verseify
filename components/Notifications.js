'use client'

import { useState, useEffect } from 'react';
import { getResponse } from '@/public/lib/indexedDB'
import styles from '@/styles/Notifications.module.css';
import { motion } from 'framer-motion';
import { Bell, Info } from 'lucide-react';



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


export default function Notifications() {
    const [notifications, setNotifications] = useState([])

    useEffect(()=>{
        const GET = async ()=>{
            const response = await getResponse({store: 'notify'})
            // console.log(response)
            setNotifications(response.success ? response.saved : [])
        }
        GET()
    }, [])


    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>
                <Bell size={30} /> Notifications
            </h2>
            {/* <button onClick={async(e)=>{await saveResponse({id:'1', response:{id: '1', title: 'Title', body: 'Body', date: new Date()}, store:'notify'})}}>Click</button> */}

            {(!notifications || notifications.length === 0) ? (
                <p className={styles.empty}>No new notifications 🎉</p>
            ) : (
                <motion.div
                    className={styles.notificationsList} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 0.5 }}
                >
                    {notifications.map((notification, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.notification}`}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.2 }}
                        >
                            <Info size={30} style={{color:'yellow'}} />

                            <div style={{display:'flex', flexDirection:'column', marginRight:'1rem'}}>
                                <p className={styles.title}>{notification.response.title}</p>
                                <p className={styles.body} style={{fontWeight:'normal'}}>{notification.response.body}</p>
                            </div>

                            <div style={{float:'right', right:'0', marginRight:'0', marginLeft:'auto', color:'black'}}>• {daysAgo(notification.response.date)}</div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}
