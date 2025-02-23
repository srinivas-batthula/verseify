'use client'

import React, {useEffect} from 'react'
import styles from '@/styles/Saved.module.css'
import Card from "./Card"
import useSavedStore from '@/stores/useSavedStore'


export default function Saved(){
    const {saved, FetchSaved} = useSavedStore()

    useEffect(()=>{
        const GET = async()=>{
            await FetchSaved()
        }
        GET()
    }, [])

    return(
        <div className={styles.main}>
            <div className={styles.head}>Saved Items ({saved.length || 0})</div>
            
                {
                    (saved.length===0)?(<div >No Saved Blogs!</div>):(
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
