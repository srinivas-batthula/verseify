"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useThemeStore from "@/stores/useThemeStore"
import useUserStore from "@/stores/useUserStore";
import styles from "@/styles/Dashboard.module.css"; // Import CSS module
import { useEffect, useState } from "react";




const Dashboard = () => {
    const { theme } = useThemeStore()
    const {user} = useUserStore()
    const [details, setDetails] = useState({totalBlogs: 0,totalComments: 0})


    useEffect(()=>{
        const get = async ()=>{
            try{
                let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/dashboard/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application',
                    },
                    credentials: 'include',
                })
                res = await res.json()
                // console.log(res)
        
                if (!res || !res.success) {
                    setDetails({totalBlogs: 0,totalComments: 0,})
                }
                else {
                    setDetails({totalBlogs: res.totalBlogs,totalComments: res.totalComments,})
                }
            }
            catch(err){
                setDetails({totalBlogs: 0,totalComments: 0,})
            }
        }
        get()
    }, [])

    const data = [
        { name: "Q1", blogs: 0, comments: 0, following: 0},
        { name: "Q2", blogs: details.totalBlogs, comments: details.totalComments, following: user.following.length },
        { name: "Q3", blogs: 1, comments: 1, following: 1},
    ]


    return (
        <div className={`${styles.dashboardContainer} ${(theme==='white') ? styles.darkMode : styles.lightMode}`}>

            {/* Dashboard Title */}
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.dashboardTitle}
            >
                Dashboard
            </motion.h1>

            {/* Stats Boxes */}
            <div className={styles.statsContainer}>
                {[
                    { title: "Blogs", value: details.totalBlogs, color: "#8884d8" },
                    { title: "Comments", value: details.totalComments, color: "#ff7300" },
                    { title: "Following", value: user.following.length, color: "#ff4081" }, // New Feature
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        className={`${styles.statBox} ${(theme==='white') ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className={styles.statTitle}>{stat.title}</h3>
                        <p className={styles.statValue} style={{ color: stat.color }}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Graph Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={`${styles.graphContainer} ${(theme==='white') ? styles.graphDark : styles.graphLight}`}
            >
                <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={(theme==='white') ? "#444" : "#ccc"} />
                        <XAxis dataKey="name" stroke={(theme==='white') ? "#fff" : "#000"} />
                        <YAxis stroke={(theme==='white') ? "#fff" : "#000"} />
                        <Tooltip contentStyle={{ backgroundColor: (theme==='white') ? "#333" : "#fff", color: (theme==='white') ? "#fff" : "#000" }} />
                        <Line type="monotone" dataKey="blogs" stroke="#8884d8" strokeWidth={3} />
                        <Line type="monotone" dataKey="Following" stroke="#ff4081" strokeWidth={3} />
                        <Line type="monotone" dataKey="comments" stroke="#ff7300" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default Dashboard;
