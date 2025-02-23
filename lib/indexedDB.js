'use client';

import { openDB } from 'idb';

// Ensure IndexedDB runs only in the browser
const isBrowser = typeof window !== 'undefined';

// Open IndexedDB
export const dbPromise = isBrowser
    ? openDB('verseify-db', 1, {
        upgrade(db) {
            console.log('Upgrading DB...');
            if (!db.objectStoreNames.contains('saved')) {
                console.log('Creating object store: saved');
                db.createObjectStore('saved', { keyPath: 'id' });
            }
        },
    })
    : Promise.resolve(null);

// Save response (only store up to 10 items, prevent duplicates)
export const saveResponse = async (id, response) => {
    const db = await dbPromise;
    if (!db) {
        // console.error('IndexedDB not available')
        return { success: false, msg: `IndexedDB not available!` }
    }

    // Ensure 'saved' store exists before using
    if (!db.objectStoreNames.contains('saved')) {
        // console.error("Object store 'saved' not found!")
        return { success: false, msg: `IndexedDB doesn't existed in the device!` }
    }

    const allItems = await db.getAll('saved');

    // Check if the ID already exists
    const exists = allItems.some((item) => item.id === id)
    if (exists) {
        // console.warn(`Item with id ${id} already exists.`)
        await db.delete('saved', id)
        return { success: true, msg: `Post Unsaved!` }
    }

    // If 10 items exist, delete the oldest one
    if (allItems.length >= 10) {
        // console.log(`Deleting oldest item: ${allItems[0].id}`)
        await db.delete('saved', allItems[0].id)
    }

    // Save the new response
    // console.log(`Saving response: ${id}`);
    await db.put('saved', { id, response })
    return { success: true, msg: `Item with id ${id} Saved.` }
}

// Get response
export const getResponse = async (id = '') => {
    const db = await dbPromise;
    if (!db) {
        // console.error('IndexedDB not available')
        return { success: false, msg: `IndexedDB not available!` }
    }

    // Ensure 'saved' store exists
    if (!db.objectStoreNames.contains('saved')) {
        // console.error("Object store 'saved' not found!")
        return { success: false, msg: `Object store not Found!` }
    }

    const saved = (id !== '') ? await db.get('saved', id) : await db.getAll('saved')
    return { success: true, saved }
}

// Delete response
export const deleteResponse = async (id) => {
    const db = await dbPromise;
    if (!db) {
        // console.error('IndexedDB not available')
        return { success: false, msg: `IndexedDB not available!` }
    }

    // Ensure 'saved' store exists
    if (!db.objectStoreNames.contains('saved')) {
        // console.error("Object store 'saved' not found!")
        return { success: false, msg: `Object store not Found!` }
    }

    // console.log(`Deleting item: ${id}`)
    await db.delete('saved', id)
    return { success: true, msg: `Post Unsaved!` }
}
