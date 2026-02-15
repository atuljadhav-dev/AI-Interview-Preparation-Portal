import FeedBacksPage from "./FeedBacksPage";
export const metadata = {
    title: "Feedback - PlacementReady",
    description:
        "Detailed feedback on your interview performance. Review insights and suggestions to improve your skills and ace future interviews with PlacementReady.",
};
const page = async () => {
    return <FeedBacksPage />;
};

export default page;
