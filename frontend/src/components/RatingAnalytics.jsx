"use client";
import { useTheme } from "next-themes";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
const RatingAnalytics = ({ ratings }) => {
    const { theme } = useTheme();
    const data = ratings.map((rating, index) => ({
        attempt: index + 1,
        rating: rating,
    }));
    if (Array.isArray(ratings)) {
        if (ratings.length == 0) {
            return (
                <div className="w-full h-full flex justify-center items-center">
                    <span className="text-center">
                        Analytics available after the interview completion
                    </span>
                </div>
            );
        }
    }
    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <XAxis dataKey="attempt" />

                    <YAxis domain={[0, 5]} />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="rating"
                        strokeWidth={1}
                        dot={{
                            r: 0,
                            strokeWidth: 2,
                            fill: theme === "dark" ? "#fff" : "#000",
                        }}
                        activeDot={{
                            r: 1,
                            strokeWidth: 2,
                            fill: theme === "dark" ? "#fff" : "#000",
                        }}
                        isAnimationActive={true}
                        animationDuration={2000}
                        animationEasing="ease-out"
                        stroke={
                            theme === "dark"
                                ? "rgba(255, 255, 255, 0.8)"
                                : "rgba(0, 0, 0, 0.8)"
                        }
                        
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RatingAnalytics;
