"use client";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useEffect, useState } from "react";

export default function SpeechInput() {
    const { transcript, listening, startListening, stopListening } =
        useSpeechToText();
    const [text, setText] = useState("");
    useEffect(() => {
        setText(transcript);
    }, [transcript]);
    return (
        <div className="bg-gray-950 min-h-screen">
            <h2 className="text-xl font-bold mb-4 text-white">
                🎤 Speech to Text
            </h2>
            <textarea
                className="w-full h-32 border rounded p-2"
                value={text}
                readOnly
            />
            <div className="mt-4 flex gap-2">
                {!listening ? (
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={startListening}>
                        Start Speaking
                    </button>
                ) : (
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={stopListening}>
                        Stop
                    </button>
                )}
            </div>
        </div>
    );
}
