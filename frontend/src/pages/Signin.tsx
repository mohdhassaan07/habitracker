import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { signinFailure, signinstart, signinSuccess } from '@/redux/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/utils/api';
import { FaGoogle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google'
import CircularProgress from "@mui/material/CircularProgress";

const Signin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state: any) => state.user.loading);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: any) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignIn = async (e: any) => {
        e.preventDefault();
        dispatch(signinstart());
        try {
            let response = await api.post('/user/signin', formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            const data = response.data
            dispatch(signinSuccess(data.user))
            navigate('/journal');
        } catch (error) {
            console.error('Error during sign in:', error)
            dispatch(signinFailure())
            toast.error('Sign in failed. Please check your credentials and try again.');
        }
    }

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <Toaster position="top-right" />
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 lg:p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">HabitTron</h1>
                    <h2 className="text-xl font-semibold mt-2 text-gray-700 dark:text-gray-300">Welcome Back</h2>
                </div>

                <form onSubmit={handleSignIn} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <CircularProgress color="inherit" size="1.25rem" /> : 'Sign In'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={googleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <FaGoogle className="w-5 h-5 text-red-500" />
                        Sign In with Google
                    </button>
                </form>

                <div className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </div>

                <div className="text-center mt-4">
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signin
