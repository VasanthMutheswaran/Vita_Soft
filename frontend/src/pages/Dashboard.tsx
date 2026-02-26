import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';
import { LogOut, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import TaskCard from '../components/TaskCard';

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

const Dashboard = () => {
    const { username, logout } = useAuthStore();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const { data: tasks, isLoading } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await api.get('/tasks');
            return response.data;
        }
    });

    const createTaskMutation = useMutation({
        mutationFn: async (newTask: { title: string; description: string; completed: boolean }) => {
            await api.post('/tasks', newTask);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            closeModal();
        }
    });

    const updateTaskMutation = useMutation({
        mutationFn: async (updatedTask: Task) => {
            await api.put(`/tasks/${updatedTask.id}`, updatedTask);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            closeModal();
        }
    });

    const toggleTaskMutation = useMutation({
        mutationFn: async (task: Task) => {
            await api.put(`/tasks/${task.id}`, { ...task, completed: !task.completed });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        if (editingTask) {
            updateTaskMutation.mutate({ ...editingTask, title, description });
        } else {
            createTaskMutation.mutate({ title, description, completed: false });
        }
    };

    const openModal = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            setTitle(task.title);
            setDescription(task.description);
        } else {
            setEditingTask(null);
            setTitle('');
            setDescription('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setTitle('');
            setDescription('');
            setEditingTask(null);
        }, 200);
    };

    const pendingCount = tasks?.filter(t => !t.completed).length || 0;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">V</span>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                            VitaTasks
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600 hidden sm:inline-block">
                            Hi, <span className="text-gray-900">{username}</span>
                        </span>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline-block">Log Out</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
                        <p className="text-gray-500 mt-1">
                            {isLoading ? 'Loading...' : `You have ${pendingCount} pending task${pendingCount !== 1 ? 's' : ''}.`}
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                    >
                        <Plus className="w-5 h-5" />
                        New Task
                    </button>
                </div>

                {/* Task List */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : tasks?.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-blue-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700">All caught up!</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">You don't have any tasks right now. Create a new task to get started.</p>
                    </div>
                ) : (
                    <motion.div layout className="grid gap-3">
                        <AnimatePresence mode="popLayout">
                            {tasks?.map((task) => (
                                <div key={task.id} className="group">
                                    <TaskCard
                                        task={task}
                                        onToggle={(t) => toggleTaskMutation.mutate(t)}
                                        onDelete={(id) => deleteTaskMutation.mutate(id)}
                                        onEdit={(t) => openModal(t)}
                                    />
                                </div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-5">
                                {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. Prepare quarterly presentation"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea
                                        placeholder="Add details about this task..."
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
                                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex justify-center items-center"
                                    >
                                        {(createTaskMutation.isPending || updateTaskMutation.isPending) ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : 'Save Task'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
