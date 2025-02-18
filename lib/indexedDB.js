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
        console.error('IndexedDB not available');
        return;
    }

    // Ensure 'saved' store exists before using
    if (!db.objectStoreNames.contains('saved')) {
        console.error("Object store 'saved' not found!");
        return;
    }

    const allItems = await db.getAll('saved');

    // Check if the ID already exists
    const exists = allItems.some((item) => item.id === id);
    if (exists) {
        console.warn(`Item with id ${id} already exists.`);
        return null;
    }

    // If 10 items exist, delete the oldest one
    if (allItems.length >= 10) {
        console.log(`Deleting oldest item: ${allItems[0].id}`);
        await db.delete('saved', allItems[0].id);
    }

    // Save the new response
    console.log(`Saving response: ${id}`);
    return await db.put('saved', { id, response });
};

// Get response
export const getResponse = async (id = '') => {
    const db = await dbPromise;
    if (!db) {
        console.error('IndexedDB not available');
        return null;
    }

    // Ensure 'saved' store exists
    if (!db.objectStoreNames.contains('saved')) {
        console.error("Object store 'saved' not found!");
        return null;
    }

    return (id!=='') ? db.get('saved', id) : db.getAll('saved');
};

// Delete response
export const deleteResponse = async (id) => {
    const db = await dbPromise;
    if (!db) {
        console.error('IndexedDB not available');
        return;
    }

    // Ensure 'saved' store exists
    if (!db.objectStoreNames.contains('saved')) {
        console.error("Object store 'saved' not found!");
        return;
    }

    console.log(`Deleting item: ${id}`);
    return db.delete('saved', id);
};
