'use client'

import React, { useEffect, useState } from 'react'
import styles from '@/styles/Saved.module.css'
import Card from "./Card"
import useUserStore from '@/stores/useUserStore'
import { useParams } from 'next/navigation'



export default function MyBlogs(){
    const params = useParams()

    const [blogs, setBlogs] = useState([])
    const {user} = useUserStore()
    const t = {
        author: user._id,
        authorName: user.username,
        authorBio: user.bio,
        authorPic: user.profile_pic,
    }

    useEffect(()=>{
        const getBlogs = async (uid) => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        
            try{
                let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/blogs/user/${uid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    credentials: 'include',
                })
                res = await res.json()
                // console.log(res)
        
                if (!res || !res.success) {
                    setBlogs([])
                }
                else {
                    setBlogs(res.blogs)
                }
            }
            catch(err){
                setBlogs([])
            }
        }
        getBlogs(params.id)
    }, [])


    return(
        <div className={styles.main}>
            <div className={styles.head}>My Blogs ({(blogs) ? blogs.length : 0})</div>
                {
                    (!blogs || blogs.length===0)?(<div >No Blogs Created Yet!</div>):(
                        <div className={styles.Cards}>
                            {
                                blogs.map((item, index)=>{
                                    return <Card data={{...item, ...t}} key={index} />
                                })
                            }
                        </div>
                        )
                }
        </div>
    )
}
