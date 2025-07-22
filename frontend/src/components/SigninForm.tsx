import Modal from "./Modal";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { signinFailure, signinstart, signinSuccess } from '@/redux/userSlice';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
const SigninForm = (props:any) => {
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
            const data = response.data;
            dispatch(signinSuccess(data.user));
            setLoading(false);
            navigate('/journal');

        } catch (error) {
            console.error('Error during sign in:', error);
            dispatch(signinFailure())
            setLoading(false);
            toast.error('Sign in failed. Please check your credentials and try again.');
        }
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
    }
    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    }

    return (
        <div>
            {!toggleSignin && <Modal isOpen={props.isModalOpen} onClose={() => props.setIsModalOpen(false)} >
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
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Sign Up
                    </button>
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-900 border"
                    >
                        <FaGoogle className="w-5 h-5" />
                        Sign Up with Google
                    </button>
                </form>

                <div className="text-center mt-6 text-sm">
                    Already have an account?
                    <button
                        onClick={() => settoggleSignin(!toggleSignin)}
                        className="ml-2 text-blue-600 font-medium hover:underline"
                    >
                        Sign In
                    </button>
                </div>
            </Modal>}

            {toggleSignin &&
                <Modal isOpen={props.isModalOpen} onClose={() => props.setIsModalOpen(false)} >
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
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Sign In
                        </button>
                        <button
                            type="button"

                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-900 border"
                        >
                            <FaGoogle className="w-5 h-5" />
                            Sign In with Google
                        </button>
                    </form>

                    <div className="text-center mt-6 text-sm">
                        No account?
                        <button
                            onClick={() => settoggleSignin(!toggleSignin)}
                            className="ml-2 text-blue-600 font-medium hover:underline"
                        >
                            Sign Up
                        </button>
                    </div>
                </Modal>}
        </div>
    )
}

export default SigninForm
