import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import { Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import TaskCard from '../components/TaskCard';
import type { Task } from '../components/TaskCard';

const groupTasksByDate = (tasks: Task[]) => {
    const grouped: { [key: string]: Task[] } = {};

    tasks.forEach(task => {
        const date = new Date(task.updatedAt);
        let dateKey = '';

        if (isToday(date)) {
            dateKey = 'Today';
        } else if (isYesterday(date)) {
            dateKey = 'Yesterday';
        } else {
            dateKey = format(date, 'MMMM d, yyyy');
        }

        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
    });

    return grouped;
};

const TaskHistory = () => {
    const queryClient = useQueryClient();

    const { data: tasks, isLoading } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await api.get('/tasks');
            return response.data;
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

    const completedTasks = tasks?.filter(t => t.completed).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) || [];
    const groupedTasks = groupTasksByDate(completedTasks);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Task History</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Review everything you've accomplished.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
                    </div>
                ) : completedTasks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mt-8 transition-colors duration-300"
                    >
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                            <Clock className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No completed tasks yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">Tasks you complete will show up here, grouped by the day you finished them.</p>
                        <Link to="/" className="inline-block mt-6 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                            Go to My Tasks
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(groupedTasks).map(([dateLabel, dateTasks], index) => (
                            <motion.div
                                key={dateLabel}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md py-2 mb-4 -mx-2 px-2 transition-colors duration-300">
                                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {dateLabel}
                                    </h2>
                                </div>
                                <div className="grid gap-3 relative before:absolute before:inset-y-0 before:-left-6 before:w-px before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent dark:before:from-gray-700 dark:before:via-gray-700 pl-2 sm:pl-0 sm:before:hidden">
                                    <AnimatePresence mode="popLayout">
                                        {dateTasks.map((task) => (
                                            <div key={task.id} className="relative">
                                                <div className="absolute top-6 -left-[33px] w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 border-2 border-white dark:border-gray-900 shadow-sm sm:hidden transition-colors duration-300" />
                                                <TaskCard
                                                    task={task}
                                                    onToggle={(t) => toggleTaskMutation.mutate(t)}
                                                    onDelete={(id) => deleteTaskMutation.mutate(id)}
                                                    onEdit={() => { }}
                                                />
                                            </div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskHistory;
