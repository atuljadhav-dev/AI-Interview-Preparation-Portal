"use client";
import { useState, useEffect } from "react";

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = (text) => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Logic to find a high-quality female voice
            const femaleVoice = voices.find(
                (voice) =>
                    voice.name.includes("Female") ||
                    voice.name.includes("Google UK English Female") ||
                    voice.name.includes("Samantha") || // High quality MacOS voice
                    voice.name.includes("Zira") || // High quality Windows voice
                    voice.name.includes("Microsoft Maria")
            );

            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }

            utterance.rate = 1.3;
            utterance.pitch = 1.1; 

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return { speak, stop, isSpeaking };
};
