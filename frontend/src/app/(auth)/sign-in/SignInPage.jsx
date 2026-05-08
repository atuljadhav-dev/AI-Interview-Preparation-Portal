'use client';
import { useUser } from '@/hooks/useUser';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import api from '@/utils/api';
import Link from 'next/link';
const SignInPage = () => {
	const [formData, setFormData] = useState({ password: '', email: '' });
	const [showPass, setShowPass] = useState(false);
	const params = useSearchParams();
	useEffect(() => {
		if (params.get('notify')) {
			toast.info('Please sign in to access this page.');
		}
	}, [params]);
	const passwordRef = useRef(null);
	const router = useRouter();
	const { refreshUser } = useUser();
	const [sending, setSending] = useState(false);
	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData((previous) => ({ ...previous, [name]: value }));
	};
	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // Prevents the form from submitting early
			passwordRef.current.focus();
		}
	};
	const handleSend = async (e) => {
		e.preventDefault();
		if (sending) return;
		try {
			setSending(true);
			const res = await api.post('/auth/signin', formData);
			if (res.data.success) {
				Cookies.set('authToken', res.data.token, { expires: 2 }); //cookies set by the server are not accessible in client side,nextjs app. Hence setting cookie in client side also.It helps to middleware to identify authenticated user.Server side cookies are set http only so that cookies will not be accessible in the middleware.
				toast.success('Sign In Successfully');
				refreshUser(); //to refetch the user data in the useUser hook
				if (params.get('redirect')) {
					router.push(params.get('redirect'));
				} else {
					router.push('/home');
				}
			}
		} catch (err) {
			console.log(err);
			toast.error(err.response.data.error);
		} finally {
			setSending(false);
		}
	};
	return (
		<main
			className="
                min-h-screen
                flex
                items-center
                justify-center
                px-4
                py-6
                sm:px-6
                sm:py-10
                bg-gradient-to-br
                from-purple-100
                via-blue-100
                to-pink-100
                dark:from-gray-600
                dark:via-gray-700
                dark:to-gray-600
                transition
            ">
			<section
				aria-labelledby="signin-heading"
				className="
                    relative
                    w-full
                    max-w-md
                    rounded-3xl
                    border
                    border-white/30
                    bg-white/80
                    p-6
                    shadow-2xl
                    backdrop-blur-xl
                    dark:border-gray-700
                    dark:bg-gray-800/80
                    sm:p-8
                ">
				{/* Header */}
				<header className="mb-6 text-center">
					<h1
						id="signin-heading"
						className="
                            text-3xl
                            font-bold
                            text-gray-800
                            dark:text-white
                            sm:text-4xl
                        ">
						Welcome Back
					</h1>

					<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
						Sign in to continue your interview preparation.
					</p>
				</header>

				{/* Login Form */}
				<form
					onSubmit={handleSend}
					className="flex flex-col gap-5">
					{/* Email */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="email"
							className="
                                text-sm
                                font-medium
                                text-gray-700
                                dark:text-gray-300
                            ">
							Email Address
						</label>

						<input
							id="email"
							type="email"
							name="email"
							autoFocus
							autoComplete="email"
							inputMode="email"
							required
							value={formData.email}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							placeholder="you@example.com"
							className="
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-4
                                py-3
                                text-gray-800
                                outline-none
                                transition
                                focus:ring-2
                                focus:ring-purple-400
                                dark:border-gray-600
                                dark:bg-gray-700
                                dark:text-white
                            "
						/>
					</div>

					{/* Password */}
					<div className="flex flex-col gap-1">
						<label
							htmlFor="password"
							className="
                                text-sm
                                font-medium
                                text-gray-700
                                dark:text-gray-300
                            ">
							Password
						</label>

						<div className="relative">
							<input
								id="password"
								type={showPass ? 'text' : 'password'}
								name="password"
								ref={passwordRef}
								autoComplete="current-password"
								required
								value={formData.password}
								onChange={handleChange}
								placeholder="Enter your password"
								className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-4
                                    py-3
                                    pr-16
                                    text-gray-800
                                    outline-none
                                    transition
                                    focus:ring-2
                                    focus:ring-purple-400
                                    dark:border-gray-600
                                    dark:bg-gray-700
                                    dark:text-white
                                "
							/>

							<button
								type="button"
								onClick={() =>
									setShowPass((previous) => !previous)
								}
								aria-label={
									showPass ? 'Hide password' : 'Show password'
								}
								className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-sm
                                    font-medium
                                    text-purple-600
                                    hover:underline
                                    dark:text-purple-400
                                ">
								{showPass ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={sending}
						aria-busy={sending}
						className="
                            rounded-lg
                            bg-gradient-to-r
                            from-purple-600
                            to-blue-600
                            py-3
                            font-semibold
                            text-white
                            shadow-md
                            transition
                            duration-300
                            hover:scale-[1.02]
                            hover:shadow-lg
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        ">
						{sending ? 'Signing In...' : 'Sign In'}
					</button>

					{/* Registration Link */}
					<p className="text-center text-sm text-gray-600 dark:text-gray-300">
						Don't have an account?{' '}
						<Link
							href="/sign-up"
							className="
                                font-medium
                                text-purple-600
                                hover:underline
                                dark:text-purple-400
                            ">
							Create an account
						</Link>
					</p>
				</form>
			</section>
		</main>
	);
};
export default SignInPage;
