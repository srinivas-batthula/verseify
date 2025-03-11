'use client'

import { openDB } from 'idb'


// Ensure IndexedDB runs only in the browser
const isBrowser = typeof window !== 'undefined'

// Open IndexedDB
export const dbPromise = isBrowser
    ? openDB('verseify-db', 1, {
        upgrade(db) {
            console.log('Upgrading DB...')
            // Create 'saved' store if not exists
            if (!db.objectStoreNames.contains('saved')) {
                db.createObjectStore('saved', { keyPath: 'id' })
            }
            // Create 'notify' store if not exists
            if (!db.objectStoreNames.contains('notify')) {
                db.createObjectStore('notify', { keyPath: 'id' })
            }
        },
    })
    : Promise.resolve(null)

// Save response (only store up to 10 items, prevent duplicates)
export const saveResponse = async ({ id, response, store = 'saved' }) => {
    const db = await dbPromise
    if (!db) {
        return { success: false, msg: `IndexedDB not available!` }
    }

    // Ensure 'saved' store exists before using
    if (!db.objectStoreNames.contains(store)) {
        return { success: false, msg: `IndexedDB doesn't existed in the device!` }
    }

    const allItems = await db.getAll(store)

    // Check if the ID already exists
    const exists = allItems.some((item) => item.id === id)
    if (exists) {
        await db.delete(store, id)
        return { success: true, msg: `Post Unsaved!` }
    }

    // If 10 items exist, delete the oldest one (As we SAVE only upto 10-items)...
    if (allItems.length >= 10) {
        await db.delete(store, allItems[0].id)
    }

    // Save the new response
    await db.put(store, { id, response })
    return { success: true, msg: `Item with id ${id} Saved.` }
}


if ((isBrowser) && ('serviceWorker' in navigator)) {
    // Listen for messages from the Service Worker
    navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data.type === 'SAVE_NOTIFICATION') {
            // console.log('Saving notification:', event.data.data)
            await saveResponse({ id: event.data.data.id, response: event.data.data, store: 'notify' })
        }
    })
}


// Get response
export const getResponse = async ({ id = '', store = 'saved' }) => {
    const db = await dbPromise
    if (!db) {
        return { success: false, msg: `IndexedDB not available!` }
    }

    // Ensure 'saved' store exists
    if (!db.objectStoreNames.contains(store)) {
        return { success: false, msg: `Object store not Found!` }
    }

    const saved = (id !== '') ? await db.get(store, id) : await db.getAll(store)
    return { success: true, saved }
}

// Delete response
export const deleteResponse = async (id, store = 'saved') => {
    const db = await dbPromise;
    if (!db) {
        return { success: false, msg: `IndexedDB not available!` }
    }

    // Ensure 'saved' store exists
    if (!db.objectStoreNames.contains(store)) {
        return { success: false, msg: `Object store not Found!` }
    }

    await db.delete(store, id)
    return { success: true, msg: `Post Unsaved!` }
}
