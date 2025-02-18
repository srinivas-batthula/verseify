'use client'

import React, {useEffect, useState} from 'react'
import styles from '@/styles/Saved.module.css'
import Card from "./Card"
import { getResponse } from '@/lib/indexedDB'


export default function Saved(){
    const [saved, setSaved] = useState([])

    useEffect(()=>{
        const GET = async()=>{
            const res = await getResponse()

            if(res){
                setSaved(res)
            }
        }
        GET()
    }, [])

    return(
        <div className={styles.main}>
            <div className={styles.head}>Saved Items ({(saved)?saved.length:0})</div>
            
                {
                    (saved && saved.length===0)?(<div >No Saved Blogs!</div>):(
                        <div className={styles.Cards}>
                            {
                                saved.map((item, index)=>{
                                    return <Card key={index} />
                                })
                            }
                        </div>
                            )
                }
        </div>
    )
}
