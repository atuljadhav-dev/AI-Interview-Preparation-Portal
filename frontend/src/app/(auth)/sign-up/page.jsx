import SignUpPage from './SignUpPage';
export const metadata = {
	title: 'Create Your Account',
	description:
		'Create your PlacementReady account and start practicing AI-powered mock interviews, analyzing your resume, and improving your interview skills.',

	robots: {
		index: false,
		follow: false,
		googleBot: { index: false, follow: false },
	},

	alternates: { canonical: '/signup' },
};

const page = () => {
	return (
		<>
			<SignUpPage />
		</>
	);
};

export default page;
