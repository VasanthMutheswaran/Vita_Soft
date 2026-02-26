import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../lib/axios';
import { UserPlus, Loader2 } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md p-8 glass-card rounded-2xl"
            >
                <div className="text-center mb-8">
                    <div className="bg-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                        <UserPlus className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join us to organize your workspace</p>
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center shadow-md shadow-indigo-600/20 disabled:opacity-70"
                    >
                        {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:underline font-medium">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
