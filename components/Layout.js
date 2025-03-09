'use client'

import Navbar from "./Navbar"
import Footer from "./Footer"
import ClickAnimation from "./ClickAnimation"
import { usePathname } from "next/navigation"
import useThemeStore from '@/stores/useThemeStore'
import useSavedStore from "@/stores/useSavedStore"
import useUserStore from "@/stores/useUserStore"
import { useEffect, Suspense } from "react"


const Layout = ({ children }) => {
    const { theme } = useThemeStore()
    const pathname = usePathname()
    const { FetchSaved } = useSavedStore()
    const { setUser } = useUserStore()


    useEffect(() => {
        const getUser = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

            let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+'/api/db/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                credentials: 'include' // 👈 This ensures cookies are sent with the request
            })
            res = await res.json()
            // console.log(res)

            if (res && res.success) {
                typeof window !== 'undefined' ? localStorage.setItem('login', true) : null
                setUser(res.user)
            }
            else {
                typeof window !== 'undefined' ? localStorage.setItem('login', false) : null
            }
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
            navigator.serviceWorker.register(process.env.NEXT_PUBLIC_HOME+'/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope: ', registration.scope)
                })
                .catch((error) => {
                    console.error('Service Worker Registration failed: ', error)
                });
        }
    }, [])

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <div>
                <ClickAnimation />
        
                {
                    (pathname !== '/login') ? <Navbar /> : <div style={{ display: 'none' }}></div>
                }
    
                <div style={{ marginTop: (pathname !== '/login') ? '4rem' : '0rem', width: '100%', height: 'fit-content', color: theme, background: (theme === 'white') ? 'linear-gradient(180deg, #121212ef, #121212ef, #121212ef)' : 'linear-gradient(180deg, #a3a3a31f, #a3a3a31f, #a3a3a31f)' }}>
                    <main >{children}</main>
                </div>
            
                {
                    (pathname !== '/login') ? <Footer /> : <div style={{ display: 'none' }}></div>
                }
            </div>
        </Suspense>
    )
}

export default Layout
