import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';
import { LogIn, Loader2, CheckSquare } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const loginFn = useAuthStore((state) => state.login);

    const loginMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post('/auth/login', { username, password });
            return response.data;
        },
        onSuccess: (data) => {
            loginFn(data.accessToken, data.username);
            navigate('/');
        },
        onError: () => {
            setError('Invalid username or password');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            loginMutation.mutate();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300 relative overflow-hidden">
            {/* Background elements for premium aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col items-center z-10 w-full">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 mb-8">
                    <CheckSquare className="w-8 h-8" />
                    <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">VitaTasks</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-2xl shadow-blue-900/5 dark:shadow-black/40"
                >
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/30 dark:shadow-blue-900/50">
                            <LogIn className="text-white w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Sign in to manage your workspace</p>
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
                                className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all flex justify-center items-center shadow-lg shadow-blue-600/20 dark:shadow-none hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
                        >
                            {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium transition-colors">Create one</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
