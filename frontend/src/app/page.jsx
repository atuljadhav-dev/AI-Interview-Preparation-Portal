import Image from 'next/image';
import Link from 'next/link';
import logo from '/public/logo1.png';

export const metadata = {
	title: 'AI Interview Preparation Platform',
	description:
		'Practice realistic AI mock interviews, analyze your resume with ATS scoring, receive interview feedback, and improve your technical and HR interview skills with PlacementReady.',
	alternates: { canonical: '/' },
};
const Page = () => {
	return (
		<main className="bg-purple-100 dark:bg-gray-950">
			{/* Hero Section */}
			<section
				aria-labelledby="hero-heading"
				className="relative min-h-screen overflow-hidden">
				<div
					className="absolute inset-0 bg-cover bg-center"
					aria-hidden="true">
					<div className="absolute inset-0 bg-gradient-to-r from-purple-700/90 to-blue-700/80" />

					<video
						autoPlay
						loop
						muted
						playsInline
						preload="metadata"
						className="h-full w-full object-cover opacity-70"
						aria-hidden="true">
						<source
							src="/finalbg.webm"
							type="video/webm"
						/>
						<source
							src="/finalbg.mp4"
							type="video/mp4"
						/>
					</video>
				</div>

				<div className="relative z-10 flex min-h-screen flex-col">
					{/* Header */}
					<header className="px-4 pt-4 sm:px-6">
						<Link
							href="/"
							aria-label="PlacementReady home">
							<Image
								src={logo}
								width={150}
								height={50}
								priority
								alt="PlacementReady"
							/>
						</Link>
					</header>

					{/* Hero Content */}
					<div className="flex flex-1 items-center px-4 pb-20 pt-16 sm:px-6 md:px-20">
						<div className="max-w-3xl text-center sm:text-left">
							<p className="mb-4 text-sm font-semibold uppercase tracking-wider text-purple-200 sm:text-base">
								AI-Powered Interview Preparation
							</p>

							<h1
								id="hero-heading"
								className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
								Prepare for Your Next Job Interview with AI
							</h1>

							<p className="mb-8 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
								Practice realistic mock interviews, analyze your
								resume, receive personalized feedback, and build
								the confidence you need to succeed in your job
								search.
							</p>

							<div className="flex flex-col gap-4 sm:flex-row">
								<Link
									href="/sign-up"
									className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-purple-700 shadow-xl transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50">
									Start Preparing
								</Link>

								<Link
									href="#features"
									className="inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/50">
									Explore Features
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Introduction */}
			<section
				aria-labelledby="about-heading"
				className="py-16 md:py-20">
				<div className="container mx-auto px-6">
					<div className="mx-auto max-w-4xl">
						<h2
							id="about-heading"
							className="mb-6 text-center text-3xl font-bold md:text-4xl">
							Your AI Interview Preparation Platform
						</h2>

						<div className="rounded-2xl border-2 border-gray-950 bg-white p-8 dark:border-gray-100 dark:bg-black md:p-10">
							<p className="mb-6 text-lg leading-relaxed md:text-xl">
								<strong className="text-purple-500">
									PlacementReady
								</strong>{' '}
								is an AI-powered interview preparation portal
								designed to help students, fresh graduates, and
								job seekers prepare for technical and HR
								interviews.
							</p>

							<p className="text-lg leading-relaxed md:text-xl">
								Practice interviews based on your skills and job
								requirements, analyze your resume with ATS
								scoring, and review detailed performance
								feedback to identify areas for improvement.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section
				id="features"
				aria-labelledby="features-heading"
				className="py-16 md:py-20">
				<div className="container mx-auto px-6">
					<h2
						id="features-heading"
						className="mb-4 text-center text-3xl font-bold md:text-4xl">
						Everything You Need to Prepare for Interviews
					</h2>

					<p className="mx-auto mb-12 max-w-3xl text-center text-lg">
						Build your interview skills with practical tools
						designed to help you prepare, practice, and improve.
					</p>

					<div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
						<article className="rounded-xl border-2 border-gray-950 bg-white p-8 shadow-lg transition-transform hover:scale-105 dark:border-gray-100 dark:bg-black">
							<h3 className="mb-3 text-xl font-bold text-purple-500">
								AI Mock Interviews
							</h3>

							<p className="leading-relaxed">
								Practice realistic technical and HR interviews
								with AI-generated questions based on your skills
								and job requirements.
							</p>
						</article>

						<article className="rounded-xl border-2 border-gray-950 bg-white p-8 shadow-lg transition-transform hover:scale-105 dark:border-gray-100 dark:bg-black">
							<h3 className="mb-3 text-xl font-bold text-purple-500">
								Resume & ATS Analysis
							</h3>

							<p className="leading-relaxed">
								Analyze your resume against job descriptions,
								identify missing skills, and improve your ATS
								compatibility.
							</p>
						</article>

						<article className="rounded-xl border-2 border-gray-950 bg-white p-8 shadow-lg transition-transform hover:scale-105 dark:border-gray-100 dark:bg-black">
							<h3 className="mb-3 text-xl font-bold text-purple-500">
								Interview Performance Feedback
							</h3>

							<p className="leading-relaxed">
								Review your interview scores, strengths,
								weaknesses, skill ratings, and areas that need
								improvement.
							</p>
						</article>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section
				aria-labelledby="how-it-works-heading"
				className="bg-white py-16 dark:bg-black md:py-20">
				<div className="container mx-auto px-6">
					<h2
						id="how-it-works-heading"
						className="mb-12 text-center text-3xl font-bold md:text-4xl">
						How PlacementReady Works
					</h2>

					<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
								1
							</div>

							<h3 className="mb-2 text-xl font-bold">
								Create Your Profile
							</h3>

							<p>
								Add your skills, resume, and career information.
							</p>
						</div>

						<div className="text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
								2
							</div>

							<h3 className="mb-2 text-xl font-bold">
								Practice Interviews
							</h3>

							<p>
								Take AI-powered technical and HR mock
								interviews.
							</p>
						</div>

						<div className="text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
								3
							</div>

							<h3 className="mb-2 text-xl font-bold">
								Analyze & Improve
							</h3>

							<p>
								Review your feedback and improve your interview
								performance.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section
				aria-labelledby="cta-heading"
				className="py-16 text-center md:py-20">
				<div className="container mx-auto px-6">
					<h2
						id="cta-heading"
						className="mb-6 text-3xl font-bold md:text-4xl">
						Ready to Improve Your Interview Skills?
					</h2>

					<p className="mx-auto mb-8 max-w-2xl text-lg">
						Start practicing with PlacementReady and prepare for
						your next technical or HR interview with confidence.
					</p>

					<Link
						href="/sign-up"
						className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300">
						Start Preparing for Free
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-gray-300 py-8 dark:border-gray-700">
				<div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left">
					<div>
						<p className="font-bold">PlacementReady</p>
						<p className="text-sm">
							AI-powered interview preparation platform.
						</p>
					</div>

					<nav
						aria-label="Footer navigation"
						className="flex gap-6 text-sm">
						<Link
							href="/"
							className="hover:text-purple-500">
							Home
						</Link>

						<Link
							href="/sign-up"
							className="hover:text-purple-500">
							Get Started
						</Link>
					</nav>
				</div>
			</footer>
		</main>
	);
};

export default Page;
