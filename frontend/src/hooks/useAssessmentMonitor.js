"use client";

import { useState, useEffect, useCallback } from "react";

export const useAssessmentMonitor = () => {
    // State to track if user is in fullscreen and if the tab is active
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isTabActive, setIsTabActive] = useState(true);
    const [warningCount, setWarningCount] = useState(0);

    const toggleFullScreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error("Error enabling fullscreen", e);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, []);

    useEffect(() => {
        // Listen for Fullscreen Changes
        const handleFullScreenChange = () => {
            const active = !!document.fullscreenElement;
            setIsFullScreen(active);
            if (!active) setWarningCount((prev) => prev + 1);
        };

        //Listen for Tab Switching
        const handleVisibilityChange = () => {
            const visible = document.visibilityState === "visible";
            setIsTabActive(visible);
            if (!visible) setWarningCount((prev) => prev + 1);
        };

        // Event Listeners
        document.addEventListener("fullscreenchange", handleFullScreenChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullScreenChange
            );
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    return {
        isFullScreen,
        isTabActive,
        warningCount,
        toggleFullScreen,
    };
};
