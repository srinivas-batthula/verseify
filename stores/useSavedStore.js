'use client'

import { create } from "zustand"
import { getResponse } from '@/lib/indexedDB'


const useSavedStore = create((set) => ({
    saved: [],
    FetchSaved: async () => {
        const response = await getResponse()
        // console.log(response.saved[0].response)
        set({ saved: response.success ? response.saved : [] })
    },
}))

export default useSavedStore
