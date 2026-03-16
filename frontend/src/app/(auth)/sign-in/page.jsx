import { Suspense } from "react";
import SignInPage from "./SignInPage";

export const metadata = {
    title: "Login - PlacementReady",
    description: " Access Your PlacementReady Account",
};

const page = () => {
    return (
        <Suspense
            fallback={
                <div className="w-full h-screen flex items-center justify-center">
                    Loading...
                </div>
            }>
            <SignInPage />
        </Suspense>
    );
};

export default page;
