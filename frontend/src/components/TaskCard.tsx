import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Trash2, Edit3 } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
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
            whileHover={{ y: -2 }}
            className={`p-5 rounded-xl border transition-all ${task.completed
                    ? 'bg-gray-50/80 border-gray-200'
                    : 'bg-white border-blue-100 shadow-sm shadow-blue-900/5'
                }`}
        >
            <div className="flex items-start gap-4">
                <button
                    onClick={() => onToggle(task)}
                    className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-blue-500 transition-colors"
                >
                    {task.completed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`mt-1 text-sm line-clamp-2 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                        </p>
                    )}
                    <div className="mt-3 text-xs text-gray-400 font-medium">
                        {format(new Date(task.createdAt), 'MMM d, yyyy • h:mm a')}
                    </div>
                </div>

                <div className="flex gap-2 flex-shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
