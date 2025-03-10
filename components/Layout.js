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


    useEffect(() => {
        const getUser = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/db/user', {
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


    // Register the service worker  
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('https://verseify.onrender.com/service-worker.js', { scope: '/' })
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
                    (pathname !== '/login/') ? <Footer /> : <div style={{ display: 'none' }}></div>
                }
            </div>
        </Suspense>
    )
}

export default Layout
