'use client'

import Navbar from "./Navbar"
import Footer from "./Footer"
import { usePathname } from "next/navigation"
import useThemeStore from '@/stores/useThemeStore'
import { useEffect } from "react"


const Layout = ({ children }) => {
    const {theme} = useThemeStore()
    const pathname = usePathname()

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            // Register the service worker                  
            navigator.serviceWorker
                .register('https://srinivas-batthula.github.io/verseify/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope)
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error)
                });
        }
    }, [])

    return (
        <div>
            {
                (pathname !== '/login') ? <Navbar /> : <div style={{display: 'none'}}></div>
            }

            <div style={{marginTop:(pathname !== '/login')?'4rem':'0rem', width:'100%', height:'fit-content', color: theme, background: (theme === 'white') ? 'linear-gradient(180deg, #121212ef, #121212ef, #121212ef)' : 'linear-gradient(180deg, #bbbbbb1f, #bbbbbb1f, #bbbbbb1f)'}}>
                <main >{children}</main>
            </div>
            
            {
                (pathname !== '/login') ? <Footer /> : <div style={{display: 'none'}}></div>
            }
        </div>
    )
}

export default Layout
