import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/axios';
import { Plus, Loader2, CheckCircle2 } from 'lucide-react';

import TaskCard, { type Task } from '../components/TaskCard';

const Dashboard = () => {
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reminderTime, setReminderTime] = useState('');

    const { data: tasks, isLoading } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await api.get('/tasks');
            return response.data;
        }
    });

    const createTaskMutation = useMutation({
        mutationFn: async (newTask: { title: string; description: string; completed: boolean; reminderTime?: string | null }) => {
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

        const formattedReminder = reminderTime ? new Date(reminderTime).toISOString() : null;

        if (editingTask) {
            updateTaskMutation.mutate({ ...editingTask, title, description, reminderTime: formattedReminder });
        } else {
            createTaskMutation.mutate({ title, description, completed: false, reminderTime: formattedReminder });
        }
    };

    const openModal = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            setTitle(task.title);
            setDescription(task.description);

            // Format for datetime-local (YYYY-MM-DDThh:mm)
            if (task.reminderTime) {
                const date = new Date(task.reminderTime);
                const localStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                setReminderTime(localStr);
            } else {
                setReminderTime('');
            }
        } else {
            setEditingTask(null);
            setTitle('');
            setDescription('');
            setReminderTime('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setTitle('');
            setDescription('');
            setReminderTime('');
            setEditingTask(null);
        }, 200);
    };

    const pendingCount = tasks?.filter(t => !t.completed).length || 0;

    return (
        <div className="flex flex-col h-full w-full">
            {/* Main Content */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Your Tasks</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                            {isLoading ? 'Loading...' : `You have ${pendingCount} pending task${pendingCount !== 1 ? 's' : ''}.`}
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 dark:shadow-none"
                    >
                        <Plus className="w-5 h-5" />
                        New Task
                    </button>
                </div>

                {/* Task List */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
                    </div>
                ) : tasks?.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                            <CheckCircle2 className="w-8 h-8 text-blue-300 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">All caught up!</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">You don't have any tasks right now. Create a new task to get started.</p>
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
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-gray-900/40 dark:bg-gray-900/70 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-transparent dark:border-gray-700 transition-colors duration-300"
                        >
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-5 transition-colors duration-300">
                                {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Title</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. Prepare quarterly presentation"
                                        className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Description (Optional)</label>
                                    <textarea
                                        placeholder="Add details about this task..."
                                        rows={4}
                                        className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Remind Me (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={reminderTime}
                                        onChange={(e) => setReminderTime(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700/50 transition-colors duration-300">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
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
