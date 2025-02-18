'use client'

import { useRouter } from "next/navigation"


export default function Footer(){
    const router = useRouter()

    return(
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', justifyItems:'center', alignContent:'center', alignItems:'center', marginTop:'0rem', width:'100%', bottom:'0', marginBottom:'0', position:'static', background:'rgb(106, 106, 106)', color:'white', fontWeight:'bold'}}>
            <div style={{color:'rgb(191, 203, 255)', fontSize:'1.8rem', textAlign:'center', marginTop:'3rem'}}>Verseify -- <span style={{color:'white', fontSize:'1.1rem'}}>Every Blog, a New Verse!</span></div>
            <div style={{marginTop:'0.6rem', marginBottom:'0.6rem', marginLeft:'auto', marginRight:'auto', fontSize:'1rem', color:'white', display:'flex', flexWrap:'wrap', flexDirection:'row', justifyContent:'center', justifyItems:'center', alignContent:'center', alignItems:'center', textAlign:'center'}}>
                {
                    [
                        {
                            name: 'Home',
                            link: '/'
                        },
                        {
                            name: 'Search',
                            link: '/search'
                        },
                        {
                            name: 'About',
                            link: '/about'
                        },
                        {
                            name: 'Contact',
                            link: '/contact'
                        },
                        {
                            name: 'Privacy Policy',
                            link: '/privacyPolicy'
                        },
                        {
                            name: 'Terms Of Use',
                            link: '/terms'
                        },
                        {
                            name: 'SignIn',
                            link: '/login'
                        },
                        {
                            name: 'SignUp',
                            link: '/login'
                        },
                    ].map((item ,index)=>{
                        return (
                            <div style={{color:'rgb(0, 221, 255)', marginRight:'2.5rem', cursor:'pointer'}} key={index} onClick={()=>{router.push(item.link)}}>{item.name}</div>
                        )
                    })
                }
            </div>
            <div style={{color:'white', textAlign:'center', fontSize:'1rem'}}>Made with love and <span style={{color:'skyblue'}}>NodeJs</span>.</div>
            <div style={{marginBottom:'0.8rem'}}>Verseify © <span style={{color:'skyblue'}}>2025</span>.</div>
        </div>
    )
}
