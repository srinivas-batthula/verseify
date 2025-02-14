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
            background: "rgba(64, 245, 64, 0.514)",
            color: theme,
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
            background: "rgba(255, 22, 22, 0.445)",
            color: theme,
            borderLeft: "6px solid rgba(207, 0, 0, 0.471)",
            fontSize: "1rem",
            fontWeight: "bold",
            padding: "0.7rem",
            borderRadius: "6px",
        },
    });
}
