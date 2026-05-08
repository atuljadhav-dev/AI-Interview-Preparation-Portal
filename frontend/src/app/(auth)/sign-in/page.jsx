import { Suspense } from 'react';
import SignInPage from './SignInPage';

export const metadata = {
	title: 'Sign In',
	description:
		'Sign in to PlacementReady to practice AI-powered mock interviews, analyze your resume, review interview feedback, and track your preparation progress.',

	robots: {
		index: false,
		follow: false,
		googleBot: { index: false, follow: false },
	},

	alternates: { canonical: '/sign-in' },
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
