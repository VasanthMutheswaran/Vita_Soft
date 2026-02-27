import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Trash2, Edit3, AlarmClock } from 'lucide-react';

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    reminderTime?: string | null;
}

interface TaskCardProps {
    task: Task;
    onToggle: (task: Task) => void;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className={`group p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${task.completed
                ? 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/50'
                : 'bg-white dark:bg-gray-800 border-blue-100/50 dark:border-blue-900/30 shadow-md shadow-blue-900/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-blue-900/10 dark:hover:shadow-black/40 hover:border-blue-200 dark:hover:border-blue-700/50'
                }`}
        >
            {/* Small accent line on the left for active tasks */}
            {!task.completed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}

            <div className="flex items-start gap-4">
                <button
                    onClick={() => onToggle(task)}
                    className="mt-1 flex-shrink-0 text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-110 transition-all duration-200 active:scale-95"
                >
                    {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400 transition-colors" />
                    ) : (
                        <Circle className="w-6 h-6 transition-colors" />
                    )}
                </button>

                <div className="flex-1 min-w-0 pr-4">
                    <h3 className={`font-bold text-lg leading-tight transition-colors duration-200 ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through font-medium' : 'text-gray-800 dark:text-gray-100'}`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`mt-1.5 text-sm line-clamp-2 leading-relaxed ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        <div className={`mt-4 inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium tracking-wide ${task.completed ? 'bg-gray-50/80 dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500' : 'bg-gray-50/80 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700/50 text-gray-500 dark:text-gray-400'}`}>
                            {format(new Date(task.completed ? task.updatedAt : task.createdAt), 'MMM d, yyyy • h:mm a')}
                        </div>

                        {task.reminderTime && !task.completed && (
                            <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800/50 text-xs font-medium text-blue-600 dark:text-blue-400">
                                <AlarmClock className="w-3.5 h-3.5" />
                                {format(new Date(task.reminderTime), 'MMM d, h:mm a')}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0 opacity-100 sm:opacity-0 sm:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 focus-within:opacity-100 focus-within:translate-x-0 transition-all duration-200">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all hover:scale-105 active:scale-95"
                        title="Edit"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-105 active:scale-95"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
