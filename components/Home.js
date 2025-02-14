'use client'

import styles from '@/styles/Home.module.css'
import Card from "./Card"


export default function HomePage(){

    return(
        <div className={styles.main}>
            <div className={styles.Cards}>
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    )
}