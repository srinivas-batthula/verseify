'use client'

import Navbar from "./Navbar"
import Footer from "./Footer"
import ClickAnimation from "./ClickAnimation"
import { usePathname } from "next/navigation"
import useThemeStore from '@/stores/useThemeStore'
import useSavedStore from "@/stores/useSavedStore"
import useUserStore from "@/stores/useUserStore"
import useTokenStore from "@/stores/useTokenStore"
import { useEffect, Suspense } from "react"
import styles from '@/styles/Follow.module.css'


const Layout = ({ children }) => {
    const { theme } = useThemeStore()
    const pathname = usePathname()
    const { FetchSaved } = useSavedStore()
    const { setUser } = useUserStore()
    const { setToken } = useTokenStore()



    //Method for public vapid key conversion...
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function askNotificationPermission() {
        // Check if the browser supports notifications
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications.');
            return;
        }

        // Check the current permission status
        if (Notification.permission === 'granted') {
            console.log('User has already granted permission.');
            return;
        }

        if (Notification.permission === 'denied') {
            console.log('User has denied notifications.');
            return;
        }

        // Request permission from the user
        Notification.requestPermission().then(async (permission) => {
            if (permission === 'granted') {
                console.log('User granted permission for notifications.');
                // You can also subscribe the user to push notifications here
                await subscribeToNotifications();
            } else {
                console.log('User denied permission for notifications.');
            }
        }).catch(error => {
            console.error('Error occurred while requesting permission:', error);
        });
    }

    async function subscribeToNotifications(uid, tokenU) {
        askNotificationPermission()
        console.log("Registering Push...")

        const publicVapidKey = urlBase64ToUint8Array('BL0h-BfUgsUuDiHdDrgSJWI6S3fbkMRPiNDXADF-fUvlmIFHTqvQ3BZovV9XrhmFLOyN0M8xmtgUdFb_6nbOF68')
        console.log("PublicKey converted to Uint8Array...")

        let subscription
        try {
            let registration = await navigator.serviceWorker.ready
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicVapidKey // Replace with your VAPID public key
            })
            console.log("Push Registered...")
        }
        catch (err) {
            console.log("Error while registering Push : " + err)
        }

        try {
            const formData = new FormData()
            formData.append('file', null)
            formData.append('data', JSON.stringify({subscription}))

            let r = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/db/users/${uid}?q=false`, {
                method: 'PATCH',
                // credentials:'include',
                headers: {
                    'Authorization': tokenU,
                },
                body: formData,
            })
            r = await r.json()

            if (r.success) {
                console.log('User is subscribed to notifications...')
            }
            else {
                console.log("An error occurred while Sending Notification")
            }
        }
        catch (err) {
            console.log("Error : " + err)
        }
    }


    useEffect(() => {
        const getUser = async () => {
            await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+'/')    // Test request to verseify_backend...
            await fetch(process.env.NEXT_PUBLIC_SAMBANOVA_URL+'/')    // Test request to sambanova-ai_fastapi...

            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/db/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                // credentials: 'include',      // 👈 This ensures cookies are sent with the request
            })
            res = await res.json()
            // console.log(res)

            setToken(`Bearer ${token}`)         //Set Token to current Global State...

            if (res && res.success) {
                typeof window !== 'undefined' ? localStorage.setItem('login', true) : null
                setUser(res.user)

                                            //Subscribe the User to Push Notifications...
                if(!res.user.subscription){
                    await subscribeToNotifications(res.user._id, `Bearer ${token}`)
                }
            }
            // else {
            //     typeof window !== 'undefined' ? localStorage.setItem('login', false) : null
            // }
        }
        getUser()

        const fetchData = async () => {
            await FetchSaved()
        }
        fetchData()
    }, [])


    // Register the service worker...
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(process.env.NEXT_PUBLIC_HOME + '/service-worker.js', { scope: '/' })
                .then((registration) => {
                    console.log('Service Worker registered with scope: ', registration.scope)
                })
                .catch((error) => {
                    console.error('Service Worker Registration failed: ', error)
                })
        }
    }, [])


    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">
            <div className={styles.loader}></div>
        </div>}>
            <div>
                <ClickAnimation />

                {
                    (pathname !== '/login/') ? <Navbar /> : <div style={{ display: 'none' }}></div>
                }

                <div style={{ marginTop: (pathname !== '/login/') ? '4rem' : '0rem', width: '100%', height: 'fit-content', color: theme, background: (theme === 'white') ? 'linear-gradient(180deg, #121212ef, #121212ef, #121212ef)' : 'linear-gradient(180deg, #a3a3a31f, #a3a3a31f, #a3a3a31f)' }}>
                    <main >{children}</main>
                </div>

                {
                    !['/login/', '/ai/'].includes(pathname) ? <Footer /> : <div style={{ display: 'none' }}></div>
                }
            </div>
        </Suspense>
    )
}

export default Layout
