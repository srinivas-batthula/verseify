'use client'

import React, { useEffect, useState } from 'react'
import styles from '@/styles/Saved.module.css'
import Card from "./Card"
import { useParams } from 'next/navigation'



export default function MyBlogs(){
    const params = useParams()

    const [blogs, setBlogs] = useState([])


    useEffect(()=>{
        const getBlogs = async (uid) => {
            try{
                let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/blogs/user/${uid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                res = await res.json()
                console.log(res)
        
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
            <div className={styles.head}>User's Blogs ({(blogs) ? blogs.length : 0})</div>
                {
                    (!blogs || blogs.length===0)?(<div >No Blogs Created Yet!</div>):(
                        <div className={styles.Cards}>
                            {
                                blogs.map((item, index)=>{
                                    return <Card data={{item}} key={index} />
                                })
                            }
                        </div>
                        )
                }
        </div>
    )
}
