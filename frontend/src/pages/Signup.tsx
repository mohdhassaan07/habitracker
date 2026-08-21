import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { signinFailure, signinstart, signinSuccess } from '@/redux/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/utils/api';
import { FaGoogle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google'
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
};

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state: any) => state.user.loading);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: any) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            dispatch(signinstart());
            const { confirmPassword, ...dataToSend } = formData;
            let response = await api.post('/user/signup', dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            const data = response.data;
            dispatch(signinSuccess(data.user));
            navigate('/journal');

        } catch (error) {
            console.error('Error during sign up:', error);
            dispatch(signinFailure())
            toast.error('Sign up failed. Please try again.');
        }
    };

    const googleAuth = (code: string) =>
        api.get(`/user/googleLogin?code=${code}`, {
            withCredentials: true,
        });

    const responseGoogle = async (authResult: any) => {
        try {
            if (authResult?.code) {
                dispatch(signinstart());
                const resp = await googleAuth(authResult.code);
                if (resp?.data?.user) {
                    dispatch(signinSuccess(resp.data.user));
                    navigate('/journal');
                } else {
                    dispatch(signinFailure());
                    toast.error('Google login failed. Please try again.');
                }
            }
        } catch (error) {
            console.error("error while requesting the code : ", error)
            dispatch(signinFailure());
            toast.error('Google login failed. Please try again.');
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    })

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 overflow-hidden font-body">
            <Toaster position="top-right" />

            {/* ░░ grain overlay ░░ */}
            <div
                className="pointer-events-none fixed inset-0 z-50 opacity-[0.018] dark:opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* ░░ ambient glow ░░ */}
            <div className="absolute left-1/2 top-1/4 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/[0.07] dark:bg-blue-500/[0.15] blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 h-[350px] w-[350px] rounded-full bg-indigo-300/[0.08] dark:bg-indigo-600/[0.08] blur-[100px]" />
            <div className="absolute -top-10 -right-10 h-[250px] w-[250px] rounded-full bg-blue-200/[0.06] dark:bg-blue-700/[0.06] blur-[80px]" />

            {/* ░░ decorative grid lines ░░ */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-stone-300/30 dark:via-stone-700/20 to-transparent" />
                <div className="absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-stone-300/30 dark:via-stone-700/20 to-transparent" />
                <div className="absolute left-0 top-1/4 h-px w-full bg-gradient-to-r from-transparent via-stone-300/30 dark:via-stone-700/20 to-transparent" />
                <div className="absolute left-0 bottom-1/4 h-px w-full bg-gradient-to-r from-transparent via-stone-300/30 dark:via-stone-700/20 to-transparent" />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative z-10 w-full max-w-md px-4 py-8"
            >
                {/* Back to Home */}
                <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
                    <Link
                        to="/"
                        className="group mb-8 inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 transition-colors hover:text-stone-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </Link>
                </motion.div>

                {/* Card */}
                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-2xl border border-stone-200/60 dark:border-stone-800/60 bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl shadow-xl shadow-stone-200/30 dark:shadow-black/20 p-8 lg:p-10"
                >
                    {/* Header */}
                    <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-8">
                        <Link to="/" className="inline-block font-display text-2xl font-bold tracking-tight text-stone-900 dark:text-white mb-1">
                            Habitron
                        </Link>
                        <div className="mx-auto mt-3 mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                            <Sparkles className="h-3 w-3" />
                            Start your journey
                        </div>
                        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Create your account</h1>
                        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Begin building habits that stick</p>
                    </motion.div>

                    {/* Google Button */}
                    <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
                        <button
                            type="button"
                            onClick={googleLogin}
                            disabled={loading}
                            className="group w-full flex items-center justify-center gap-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-200 transition-all duration-300 hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-md hover:shadow-stone-200/40 dark:hover:shadow-black/20 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FaGoogle className="w-4 h-4 text-red-500" />
                            Continue with Google
                        </button>
                    </motion.div>

                    {/* Divider */}
                    <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200 dark:border-stone-700/60"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white/70 dark:bg-stone-900/60 text-stone-400 dark:text-stone-500 uppercase tracking-wider">or</span>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form variants={fadeUp} transition={{ duration: 0.5 }} onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1.5 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200 text-sm"
                                    placeholder="Your full name"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1.5 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200 text-sm"
                                    placeholder="name@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1.5 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200 text-sm"
                                    placeholder="Create a password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1.5 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200 text-sm"
                                    placeholder="Confirm your password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                        >
                            {loading ? (
                                <CircularProgress color="inherit" size="1.25rem" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </>
                            )}
                        </button>
                    </motion.form>

                    {/* Footer link */}
                    <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mt-8 text-sm text-stone-500 dark:text-stone-400">
                        Already have an account?{' '}
                        <Link
                            to="/signin"
                            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            Sign in
                        </Link>
                    </motion.p>
                </motion.div>

                {/* Bottom subtle text */}
                <motion.p
                    variants={fadeUp}
                    transition={{ duration: 0.5 }}
                    className="mt-8 text-center text-xs text-stone-400 dark:text-stone-600"
                >
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                </motion.p>
            </motion.div>
        </div>
    )
}

export default Signup
