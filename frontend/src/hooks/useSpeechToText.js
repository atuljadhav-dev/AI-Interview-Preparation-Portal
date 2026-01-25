"use client";
import { useState, useEffect, useRef } from "react";

export const useSpeechToText = (silenceTimeout = 4000) => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event) => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current); // Clear previous timeout on new result

                let currentTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript; // Append all results
                }
                setTranscript(currentTranscript); // Update transcript state

                timeoutRef.current = setTimeout(() => {
                    if (
                        recognitionRef.current &&
                        currentTranscript.trim() !== ""
                    ) {
                        // Only stop if there's some transcript
                        stopListening();
                    }
                }, silenceTimeout); // Set new timeout
            };

            recognitionRef.current.onend = () => setIsListening(false); // Handle end event
            recognitionRef.current.onerror = () => setIsListening(false); // Handle error event
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current); // Cleanup timeout on unmount
        };
    }, [silenceTimeout]);

    const startListening = () => {
        // Double-check to prevent starting multiple instances
        if (recognitionRef.current && !isListening) {
            try {
                setTranscript("");
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Recognition start failed:", e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            // Prevent multiple stops
            recognitionRef.current.stop();
            setIsListening(false);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    return { transcript, isListening, startListening, stopListening };
};
