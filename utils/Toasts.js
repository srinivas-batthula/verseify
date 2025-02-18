"use client";

import { toast } from "sonner";
import useThemeStore from "@/stores/useThemeStore";


// Function to show success message
export function showSuccess(msg) {
    const theme = useThemeStore.getState().theme; // Access store without hooks

    toast(msg, {
        duration: 2500, // Auto-hide after 2.5 seconds
        position: "top-center",
        style: {
            background: "rgba(200, 200, 200, 0.35)",
            color: 'rgb(0, 174, 0)',
            border: "1px solid rgba(200, 200, 200, 0.611)",
            borderLeft: "6px solid rgba(0, 119, 0, 0.516)",
            fontSize: "1rem",
            fontWeight: "bold",
            padding: "0.7rem",
            borderRadius: "6px",
        },
    });
}

// Function to show success message
export function showFailed(msg) {
    const theme = useThemeStore.getState().theme; // Access store without hooks

    toast(msg, {
        duration: 2500, // Auto-hide after 2.5 seconds
        position: "top-center",
        style: {
            background: "rgba(200, 200, 200, 0.35)",
            color: 'rgba(209, 0, 0, 0.815)',
            border: "1px solid rgba(200, 200, 200, 0.611)",
            borderLeft: "6px solid rgba(207, 0, 0, 0.471)",
            fontSize: "1rem",
            fontWeight: "bold",
            padding: "0.7rem",
            borderRadius: "6px",
        },
    });
}
