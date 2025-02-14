"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useThemeStore from "@/stores/useThemeStore";
import styles from "@/styles/Dashboard.module.css"; // Import CSS module


const data = [
    { name: "Jan", blogs: 5, likes: 20, comments: 8 },
    { name: "Feb", blogs: 7, likes: 35, comments: 15 },
    { name: "Mar", blogs: 10, likes: 50, comments: 20 },
    { name: "Apr", blogs: 15, likes: 70, comments: 30 },
    { name: "May", blogs: 20, likes: 100, comments: 40 },
];


const Dashboard = () => {
    const { theme } = useThemeStore();

    return (
        <div className={`${styles.dashboardContainer} ${(theme==='white') ? styles.darkMode : styles.lightMode}`}>

            {/* Dashboard Title */}
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.dashboardTitle}
            >
                Blog Dashboard
            </motion.h1>

            {/* Stats Boxes */}
            <div className={styles.statsContainer}>
                {[
                    { title: "Blogs", value: 50, color: "#8884d8" },
                    { title: "Likes", value: 250, color: "#82ca9d" },
                    { title: "Comments", value: 100, color: "#ff7300" },
                    { title: "Followers", value: 1200, color: "#ff4081" }, // New Feature
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
                <h2 className="text-2xl font-semibold mb-4">Monthly Statistics</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={(theme==='white') ? "#444" : "#ccc"} />
                        <XAxis dataKey="name" stroke={(theme==='white') ? "#fff" : "#000"} />
                        <YAxis stroke={(theme==='white') ? "#fff" : "#000"} />
                        <Tooltip contentStyle={{ backgroundColor: (theme==='white') ? "#333" : "#fff", color: (theme==='white') ? "#fff" : "#000" }} />
                        <Line type="monotone" dataKey="blogs" stroke="#8884d8" strokeWidth={3} />
                        <Line type="monotone" dataKey="likes" stroke="#82ca9d" strokeWidth={3} />
                        <Line type="monotone" dataKey="comments" stroke="#ff7300" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default Dashboard;
