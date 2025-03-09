'use client'

import { create } from "zustand"


const useUserStore = create((set) => ({
    user: {
        _id: '',
        following: [],
    },
    FetchUser: async () => {
        const response = await fetch('', {})
        set({ user: response.success? response.user : {} })
    },
    setUser: (user)=>{
        set({ user })
    },
}))

export default useUserStore
