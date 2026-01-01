import FeedBackCard from "@/components/FeedBackCard";
import axios from "axios";
import { cookies } from "next/headers";
export const metadata = {
    title: "Feedback - PlacementReady",
    description:
        "Detailed feedback on your interview performance. Review insights and suggestions to improve your skills and ace future interviews with PlacementReady.",
};
const page = async () => {
    const cookieStore = await cookies(); // Access cookies
    const token = cookieStore.get("authToken")?.value; // Get the authToken cookie value

    const { data } = await axios.get(`${process.env.BASE_URL}/feedback`, {
        headers: {
            Cookie: `authToken=${token}`, // Include the authToken cookie in the request
        },
        withCredentials: true,
    });
    return (
        <div>
            {data.data.map((feedback) => (
                <FeedBackCard key={feedback._id} feedback={feedback} />
            ))}
        </div>
    );
};

export default page;
