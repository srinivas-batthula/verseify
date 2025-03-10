"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { showSuccess, showFailed } from "@/utils/Toasts";
import Image from "next/image";
import useUserStore from "@/stores/useUserStore";
import useTokenStore from "@/stores/useTokenStore";
import styles from '@/styles/Follow.module.css'



const Follow = () => {
    const params = useParams()
    const id = params.id
    const router = useRouter()
    const q = useSearchParams().get('q')
    const {user} = useUserStore()
    const {token} = useTokenStore()
    const [followingUsers, setFollowingUsers] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        // console.log('userId: '+user._id+'  q: '+q)
        const fetchFollowing = async () => {
            try {
                setLoading(true)
                let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/db/follow/${id}?q=${q}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': token,
                    },
                    // credentials: "include",
                })
                res = await res.json()
                // console.log(res)

                if (res && res.success) {
                    // showSuccess('Fetch Successful!')
                    setFollowingUsers(res.follows)
                }
                else{
                    showFailed("Error Fetching following Users!")
                }
            }
            catch(error) {
                showFailed("Something went Wrong!")
                // console.error("Error fetching following Users:", error)
            }
            finally {
                setLoading(false)
            }
        }

        setTimeout(()=>{
            fetchFollowing()
        }, 500)
    }, [user])


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className={styles.loader}></div>
            </div>
        )
    }


    return (
        <div className={`min-h-screen w-full py-10 ${styles.main1}`}>
            <motion.h1
                className="text-3xl font-bold text-center text-gray-800 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {q==='following' ? 'Following' : 'Followers'} ({(followingUsers && followingUsers.length!==0) ? followingUsers.length : 0})
            </motion.h1>

            {(!followingUsers || followingUsers.length === 0) ? (
                <p className="text-center text-gray-500">{q==='following' ? "User is not following anyone Yet." : "User has no Followers Yet."}</p>
            ) : (
                <div className={`${styles.main2}`}>
                <motion.div
                    className="w-full mx-auto py-4 rounded-lg sm:w-full"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                    }}
                >
                    {followingUsers.map((user) => (
                        <motion.div
                            onClick={()=>{router.push(`/profile/${user._id}`)}}
                            key={user._id}
                            className="flex items-center space-x-4 p-3 border-b shadow-md border-gray-300 bg-white 
                                    hover:bg-gray-100 transition-all duration-300 
                                    w-full sm:w-full md:w-[400px] lg:w-[450px] xl:w-[500px] mx-auto rounded-lg"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Image
                                src={(user.profile_pic && user.profile_pic.secure_url!=='') ? user.profile_pic.secure_url : "/user_default_light.png"}
                                alt={user.username}
                                width={50}
                                height={50}
                                className="rounded-full object-cover w-12 h-12"
                            />
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-800">{user.username}</h2>
                                <p className="text-sm text-gray-600">{user.bio || "No bio available"}</p>
                            </div>
                            <button className="px-4 py-1 text-sm font-medium text-blue-600 border border-blue-500 rounded-full 
                                            hover:bg-blue-500 hover:text-white transition">
                                {q==='following' ? 'Following' : 'Follow'}
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
                </div>
            )}
        </div>
    );
};

export default Follow;