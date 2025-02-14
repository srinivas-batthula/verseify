'use client'

import { create } from "zustand"


const useThemeStore = create((set)=>({
    theme: 'black',
    setTheme: ()=> set((state)=>({
        theme: (state.theme === 'white') ? 'black' : 'white'
    }))
}))

export default useThemeStore
