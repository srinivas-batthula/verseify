'use client'

import axios from "axios"
import styles from '@/styles/Subscribe.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { showFailed, showSuccess } from '@/utils/Toasts'
import useUserStore from "@/stores/useUserStore"



export default function Subscribe() {
    const router = useRouter()
    const {user} = useUserStore()
    const [loading, setLoading] = useState(false)
    const [razorpayLoaded, setRazorpayLoaded] = useState(false)


    // Load Razorpay script once
    useEffect(() => {
        if ((typeof window !== 'undefined' ? localStorage.getItem('login') || 'false' : 'false') === 'false') {
            showFailed("Please do Login to Continue!")
            router.push('/')
            return
        }

        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true;
        script.onload = () => setRazorpayLoaded(true)
        document.body.appendChild(script)
        console.log('Razorpay Loaded!')
    }, [])

    const handlePayment = async () => {
        if (!razorpayLoaded) {
            alert("Razorpay SDK failed to load. Please refresh.")
            return
        }

        setLoading(true)
        try {
            // 📌 Step 1: Create Order
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/razorpay/order`, {
                amount: 599, // Amount in INR
            })

            // console.log(`Request sent to /order,,,  response---> ${data}`)

            // 📌 Step 2: Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_Razorpay_Key, // Replace with Razorpay Test Key
                amount: data.amount,
                currency: "INR",
                name: "Verseify Inc.",
                description: "Test Transaction for Subscription on Verseify",
                order_id: data.id,

                method: "upi",
                upi: {
                    vpa: "success@razorpay", // Use dummy UPI ID for success
                },
                method: "netbanking",
                netbanking: {
                    bank: "ICIC", // Use any test bank code (ICICI, HDFC, SBI, AXIS)
                },
                method: "wallet",
                wallet: "PHONEPE" || "PAYTM",
                method: "paylater",
                paylater: "SIMPL" || "LAZYPAY" || "ZESTMONEY",

                handler: async function (response) {
                    const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/razorpay/verify`, response)
                    if (verifyRes.data.success){
                        typeof window !== 'undefined' ? localStorage.setItem('subscribed', 'true') : null
                        showSuccess("Payment Successful!")
                        setTimeout(()=>{
                            router.push('/')
                            showSuccess(`Congrat's ${user.username}, You are a Premium User now!`)
                        }, 1800)
                    }
                    else{
                        showFailed("Payment Verification Failed!")
                        setTimeout(()=>{
                            showFailed("Please try again!")
                        }, 600)
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email,
                    contact: "9876543210",
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.open();
        }
        catch(error){
            // console.error("Payment error:", error)
            showFailed("Something went wrong, Please try again!")
        }
        finally {
            setLoading(false)
        }
    }

    const subscribed = typeof window !== 'undefined' ? localStorage.getItem('subscribed') || 'false' : 'false'


    return (
        <div style={{ width: '100%', height: '100vh', padding: '0.3rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <div className={styles.card}>
                <h2 className={styles.title}>Premium Plan</h2>
                <p className={styles.price}>₹599/month</p>
                <ul className={styles.features}>
                    <li>✔️ Unlimited Access</li>
                    <li>✔️ AI-Powered Blog Writing</li>
                    <li>✔️ Priority Support</li>
                </ul>
                <button onClick={handlePayment} className={styles.subscribeBtn} style={{cursor: loading ? "not-allowed" : "pointer"}} disabled={loading}>
                    {loading ? <span>Processing...</span> : (subscribed==='true') ? <span><i className="fas fa-crown"></i> Extend Plan</span> : <span><i className="fas fa-crown"></i> Subscribe Now</span>}
                </button>
            </div>
        </div>
    )
}
