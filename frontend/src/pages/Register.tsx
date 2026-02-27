import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../lib/axios';
import { UserPlus, Loader2, CheckSquare } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post('/auth/register', { username, password });
            return response.data;
        },
        onSuccess: () => {
            navigate('/login');
        },
        onError: (err: any) => {
            setError(err.response?.data?.error || 'Failed to create account. Username might be taken.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            registerMutation.mutate();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300 relative overflow-hidden">
            {/* Background elements for premium aesthetic */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col items-center z-10 w-full">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-500 mb-8">
                    <CheckSquare className="w-8 h-8" />
                    <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">VitaTasks</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-2xl shadow-indigo-900/5 dark:shadow-black/40"
                >
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/50">
                            <UserPlus className="text-white w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Account</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Join us to organize your workspace</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 p-3 rounded-xl mb-6 text-sm text-center">
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all flex justify-center items-center shadow-lg shadow-indigo-600/20 dark:shadow-none hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
                        >
                            {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
                        Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline font-medium transition-colors">Log in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
