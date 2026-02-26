import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';
import { LogIn, Loader2 } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 glass-card rounded-2xl"
            >
                <div className="text-center mb-8">
                    <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <LogIn className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to manage your tasks</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/50"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center shadow-md shadow-blue-600/20 disabled:opacity-70"
                    >
                        {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
