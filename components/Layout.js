'use client'

import Navbar from "./Navbar"
import Footer from "./Footer"
import useThemeStore from '@/stores/useThemeStore'


const Layout = ({ children }) => {

    const {theme} = useThemeStore()

    return (
        <div>
            <Navbar />

            <div style={{marginTop:'4rem', width:'100%', height:'fit-content', color: theme, background: (theme === 'white') ? 'linear-gradient(180deg, #121212ef, #121212ef, #121212ef)' : 'linear-gradient(180deg, #dfdfdf1f, #dfdfdf1f, #dfdfdf1f)'}}>
                <main >{children}</main>
            </div>
            
            <Footer />
        </div>
    )
}

export default Layout
