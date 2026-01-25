"use client";
import { useState, useEffect, useRef } from "react";

export const useSpeechToText = (silenceTimeout = 3000) => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition && !recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            recognition.onresult = (event) => {
                //Reset timer immediately when user speaks
                if (timeoutRef.current) clearTimeout(timeoutRef.current);

                let finalTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }

                // Append only newly finalized text to the state
                if (finalTranscript) {
                    setTranscript(
                        (prev) =>
                            prev + (prev ? " " : "") + finalTranscript.trim()
                    );
                }

                // 2. Set auto-stop timer
                timeoutRef.current = setTimeout(() => {
                    if (transcript.length > 5) {
                        console.log("Silence detected. Stopping...");
                        stopListening();
                    }
                }, silenceTimeout);
            };

            recognition.onend = () => setIsListening(false);
            recognition.onerror = () => setIsListening(false);

            recognitionRef.current = recognition;
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [silenceTimeout]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                setTranscript(""); // Clear previous text
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Mic start error:", e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            setIsListening(false);
        }
    };

    return { transcript, isListening, startListening, stopListening };
};
