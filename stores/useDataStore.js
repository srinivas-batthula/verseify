'use client'

import { create } from "zustand"


const useDataStore = create((set) => ({
    data: {
        blogs: [],
        page: 0,
        totalBlogs: 0,
        totalPages: 0,
    },

    FetchData: async (page=1) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/blogs?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                // credentials: 'include',
            })
            res = await res.json()
            // console.log(res)

            if (res && res.success) {
                set((state) => ({
                    data: {
                        blogs: page === 1 ? res.blogs : [...state.data.blogs, ...res.blogs], // Append new blogs
                        page: res.page,
                        totalBlogs: res.totalBlogs,
                        totalPages: res.totalPages,
                    }
                }))
            }
        }
        catch (error) {
            console.error("Error fetching more blogs:", error)
        }
    },

    setData: (data)=>{
        set({ data })
    },
}))

export default useDataStore
