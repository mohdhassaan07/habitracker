import { useState } from "react";
import { useDispatch } from 'react-redux';
import { signinFailure, signinstart, signinSuccess } from '@/redux/userSlice';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google'
import CircularProgress from "@mui/material/CircularProgress";
import { X } from "lucide-react";

const SigninForm = (props: any) => {
    const [toggleSignin, settoggleSignin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
            alert('Passwords do not match');
            return;
        }
        try {
            setLoading(true);
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
            setLoading(false);
            navigate('/journal');


        } catch (error) {
            console.error('Error during sign up:', error);
            dispatch(signinFailure())
            setLoading(false);
            toast.error('Sign up failed. Please try again.');
        }
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
    };

    const handleSignIn = async (e: any) => {
        e.preventDefault();
        let success = false;
        try {
            setLoading(true);
            dispatch(signinstart());
            const { name, confirmPassword, ...dataToSend } = formData;
            let response = await api.post('/user/signin', dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            const data = response.data
            dispatch(signinSuccess(data.user))
            success = true;
            

        } catch (error) {
            console.error('Error during sign in:', error)
            dispatch(signinFailure())
            toast.error('Sign in failed. Please check your credentials and try again.');
        }
        finally {
            setLoading(false);
            if (success) navigate('/journal');
        }
    }
    const googleAuth = async (code: string) => {
        try {
            return await api.get(`/user/googleLogin?code=${code}`, {
                withCredentials: true,
            })
        } catch (error) {
            console.error("Error during Google login:", error);
            toast.error('Google login failed. Please try again.');
        }
    }

    const responseGoogle = async (authResult: any) => {
        try {
            if (authResult['code']) {
                setLoading(true);
                const resp = await googleAuth(authResult['code']);
                if (resp && resp.data && resp.data.user) {
                    dispatch(signinSuccess(resp.data.user));
                    navigate('/journal');
                }
            }
        } catch (error) {
            console.error("error while requesting the code : ", error)
        } finally {
            setLoading(false);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    })

    if (!props.isModalOpen) return null;

    const handleClose = () => {
        if (!loading) {
            props.setIsModalOpen(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)] p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-md shadow-lg p-4 lg:p-6 w-full min-h-[22rem] max-w-sm lg:max-w-md relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black disabled:opacity-50"
                    onClick={handleClose}
                    disabled={loading}
                >
                    <X className="w-4 h-4 border border-gray-400" />
                </button>

                {!toggleSignin ? (
                    <>
                        <h1 className="text-3xl font-bold text-center mb-2 text-blue-600">Habitracker</h1>
                        <h2 className="text-xl font-semibold mb-6 text-center">Create an Account</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm text-gray-500 ">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 border border-gray-400 rounded-lg  focus:outline-none focus:ring-1 focus:ring-gray-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-gray-500 ">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 border border-gray-400 rounded-lg  focus:outline-none focus:ring-1 focus:ring-gray-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-gray-500">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 border border-gray-400 rounded-lg  focus:outline-none focus:ring-1 focus:ring-gray-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-gray-500">Re-enter Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 border border-gray-400 rounded-lg  focus:outline-none focus:ring-1 focus:ring-gray-200"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <CircularProgress color="inherit" size="1.25rem" /> : 'Sign Up'}
                            </button>
                            <button
                                type="button"
                                onClick={googleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-900 border disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <FaGoogle className="w-5 h-5" />
                                Sign Up with Google
                            </button>
                        </form>

                        <div className="text-center mt-6 text-sm">
                            Already have an account?
                            <button
                                onClick={() => settoggleSignin(!toggleSignin)}
                                disabled={loading}
                                className="ml-2 text-blue-600 font-medium hover:underline disabled:opacity-50"
                            >
                                Sign In
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-center mb-2 text-blue-600">HabitTracker</h1>
                        <h2 className="text-xl font-semibold mb-6 text-center">Welcome Back</h2>
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm text-gray-500 ">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 border border-gray-400 rounded-lg  focus:outline-none focus:ring-1 focus:ring-gray-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-gray-500">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 border border-gray-400 rounded-lg  focus:outline-none focus:ring-1 focus:ring-gray-200"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <CircularProgress color="inherit" size="1.25rem" /> : 'Sign In'}
                            </button>
                            <button
                                type="button"
                                onClick={googleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-900 border disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <FaGoogle className="w-5 h-5" />
                                Sign In with Google
                            </button>
                        </form>

                        <div className="text-center mt-6 text-sm">
                            No account?
                            <button
                                onClick={() => settoggleSignin(!toggleSignin)}
                                disabled={loading}
                                className="ml-2 text-blue-600 font-medium hover:underline disabled:opacity-50"
                            >
                                Sign Up
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SigninForm
