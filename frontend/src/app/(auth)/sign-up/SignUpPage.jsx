'use client';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Link from 'next/link';
import api from '@/utils/api';
const SignUpPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const confirmPasswordRef = useRef(null);
	const [sending, setSending] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const [showConfirmPass, setShowConfirmPass] = useState(false);
	const router = useRouter();
	const handleFormChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const { refreshUser } = useUser();
	const handleKeydown = (e, name) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // Prevents the form from submitting early
			name.current.focus();
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}
		if (sending) return;
		try {
			setSending(true);
			const res = await api.post('/auth/signup', formData);
			toast.success('Registration Successfully');
			Cookies.set('authToken', res.data.token, { expires: 2 });
			refreshUser(); //to refetch the user data in the useUser hook
			router.push('/home');
		} catch (err) {
			toast.error(err.response.data.error);
		} finally {
			setSending(false);
		}
	};
	return (
		<main className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 transition">
			<section
				aria-labelledby="signup-heading"
				className="relative w-[90vw] max-w-[420px] rounded-3xl border border-white/30 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80 sm:p-10">
				{/* Page heading */}
				<header className="mb-6 text-center">
					<h1
						id="signup-heading"
						className="text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl">
						Create Your Account
					</h1>

					<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
						Start preparing for your next interview with
						PlacementReady.
					</p>
				</header>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-5"
					noValidate={false}>
					{/* Full Name */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="name"
							className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Full Name
						</label>

						<input
							id="name"
							type="text"
							name="name"
							autoFocus
							autoComplete="name"
							required
							minLength={2}
							value={formData.name}
							onChange={handleFormChange}
							onKeyDown={(event) =>
								handleKeyDown(event, emailRef)
							}
							placeholder="Enter your full name"
							className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:ring-2 focus:ring-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
					</div>

					{/* Email */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="email"
							className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Email Address
						</label>

						<input
							id="email"
							type="email"
							name="email"
							ref={emailRef}
							autoComplete="email"
							inputMode="email"
							required
							value={formData.email}
							onChange={handleFormChange}
							onKeyDown={(event) =>
								handleKeyDown(event, passwordRef)
							}
							placeholder="you@example.com"
							className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:ring-2 focus:ring-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
					</div>

					{/* Password */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="password"
							className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Password
						</label>

						<div className="relative">
							<input
								id="password"
								type={showPass ? 'text' : 'password'}
								name="password"
								ref={passwordRef}
								autoComplete="new-password"
								required
								minLength={8}
								value={formData.password}
								onChange={handleFormChange}
								onKeyDown={(event) =>
									handleKeyDown(event, confirmPasswordRef)
								}
								placeholder="Create a password"
								className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-16 text-gray-800 outline-none transition focus:ring-2 focus:ring-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>

							<button
								type="button"
								onClick={() =>
									setShowPass((previous) => !previous)
								}
								aria-label={
									showPass ? 'Hide password' : 'Show password'
								}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
								{showPass ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					{/* Confirm Password */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="confirmPassword"
							className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Confirm Password
						</label>

						<div className="relative">
							<input
								id="confirmPassword"
								type={showConfirmPass ? 'text' : 'password'}
								name="confirmPassword"
								ref={confirmPasswordRef}
								autoComplete="new-password"
								required
								minLength={8}
								value={formData.confirmPassword}
								onChange={handleFormChange}
								placeholder="Confirm your password"
								className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-16 text-gray-800 outline-none transition focus:ring-2 focus:ring-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>

							<button
								type="button"
								onClick={() =>
									setShowConfirmPass((previous) => !previous)
								}
								aria-label={
									showConfirmPass
										? 'Hide confirm password'
										: 'Show confirm password'
								}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
								{showConfirmPass ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={sending}
						aria-busy={sending}
						className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
						{sending ? 'Creating Account...' : 'Create Account'}
					</button>

					{/* Login link */}
					<p className="text-center text-sm text-gray-600 dark:text-gray-300">
						Already have an account?{' '}
						<Link
							href="/sign-in"
							className="font-medium text-purple-600 hover:underline dark:text-purple-400">
							Sign In
						</Link>
					</p>
				</form>
			</section>
		</main>
	);
};
export default SignUpPage;
