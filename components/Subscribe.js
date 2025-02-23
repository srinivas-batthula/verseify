'use client'

import styles from '@/styles/Subscribe.module.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { showFailed, showSuccess } from '@/utils/Toasts'


export default function Subscribe() {
    const router = useRouter()
    
        useEffect(()=>{
            if((typeof window !== 'undefined' ? localStorage.getItem('login') || 'false' : 'false')==='false'){
                showFailed("Please do Login to Continue!")
                router.push('/')
                return
            }
        }, [])

    return (
        <div style={{ width: '100%', height: '100vh', padding: '0.3rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <div className={styles.card}>
                <h2 className={styles.title}>Premium Plan</h2>
                <p className={styles.price}>$9.99/month</p>
                <ul className={styles.features}>
                    <li>✔️ Unlimited Access</li>
                    <li>✔️ AI-Powered Blog Writing</li>
                    <li>✔️ Priority Support</li>
                </ul>
                <button  className={styles.subscribeBtn}>
                    <i className="fas fa-crown"></i> Subscribe Now
                </button>
            </div>
        </div>
    )
}