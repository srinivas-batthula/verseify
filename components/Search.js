"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showFailed } from "@/utils/Toasts";
import styles from "@/styles/Search.module.css";



const Blog = ({ data }) => {
    const router = useRouter()


    return (
        <motion.div
            onClick={() => { router.push(`/blog/${data._id}`) }}
            key={data._id}
            className={styles.card}
            whileHover={{ scale: 1.02 }}
        >
            <Image
                src={(data.media && data.media.secure_url !== '') ? data.media.secure_url : '/default_blog.svg'}
                alt={data.title}
                width={80}
                height={80}
                className={styles.thumbnail}
                style={{padding: (data.media && data.media.secure_url !== '') ? '0' : '0.8rem'}}
            />
            <div className={styles.cardContent}>
                <h2 className={styles.blogTitle}>{data.title}</h2>
                <span className={styles.readMore}>Read more →</span>
            </div>
        </motion.div>
    )
}


const User = ({ data }) => {
    const router = useRouter()


    return (
        <motion.div
            onClick={() => { router.push(`/profile/${data._id}`) }}
            key={data._id}
            className={styles.card2}
            whileHover={{ scale: 1.02 }}
        >
            <Image
                src={(data.profile_pic && data.profile_pic.secure_url !== '') ? data.profile_pic.secure_url : "/user_default_light.png"}
                alt={data.username}
                width={50}
                height={50}
                className={styles.thumbnail2}
            />
            <div className={styles.cardContent2}>
                <h2 className={styles.blogTitle2}>{data.username}</h2>
                <span className={styles.readMore2}>View profile →</span>
            </div>
        </motion.div>
    )
}


const Search = () => {
    const [query, setQuery] = useState("")
    const [query2, setQuery2] = useState("")
    const [check, setCheck] = useState('blog')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)


    const fetchSearchResults = async () => {
        if (!query.trim()){
            showFailed('Enter Something to Search!')
            return
        }

        try {
            setLoading(true)
            const checkT = (query.trim().charAt(0)==='@') ? 'user' : 'blog'    //'user'-> Searching for a 'User',,  Or Else for a 'Blog'...
            setCheck(checkT)
            const cleanedQuery = (query.trim().charAt(0) === '@') ? query.trim().slice(1).trim() : query.trim()

            let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?q=${cleanedQuery}&check=${checkT}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            res = await res.json()
            // console.log(res)

            if (res && res.success) {
                setQuery2(query)
                setResults(res.results)
            }
            else{
                showFailed(res.details || 'Error fetching Search results')
            }
        }
        catch(error) {
            showFailed('Something went Wrong')
            // console.error("Error fetching Search results:", error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()       // Prevents page reload
        setQuery2('')
        fetchSearchResults()
    }


    return (
        <div className={styles.container}>
            {/* Search Input Box */}
            <form onSubmit={handleSearch} className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Type '@' to search for users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}><i className="fa-solid fa-magnifying-glass"></i></button>
            </form>

            <motion.h1
                className={styles.title}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Search Results for  ' {query2} '
            </motion.h1>

            {loading ? (
                <div className={styles.loader}></div>
            ) : (!results || results.length === 0) ? (
                <p className={styles.noResults}>No results found.</p>
            ) : (
                <motion.div
                    className={styles.resultsContainer}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                    }}
                >
                    {
                        results.map((item, index) => (
                            (check==='user') ? <User key={index} data={item} /> : <Blog key={index} data={item} />
                        ))
                    }
                </motion.div>
            )}
        </div>
    );
};

export default Search;
