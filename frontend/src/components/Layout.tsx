import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { LayoutDashboard, History, LogOut, CheckSquare, Sun, Moon, Bell } from 'lucide-react';
import type { Task } from './TaskCard';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { username, logout } = useAuthStore();
    const location = useLocation();

    const isDarkMode = useThemeStore((state) => state.isDarkMode);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Fetch tasks globally here to calculate reminders
    const { data: tasks } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await api.get('/tasks');
            return response.data;
        },
        refetchInterval: 30000 // Refetch every 30s to stay accurate
    });

    const [reminders, setReminders] = useState<{ task: Task; isDue: boolean }[]>([]);
    const [hasNewAlert, setHasNewAlert] = useState(false);

    // Check reminders periodically
    useEffect(() => {
        if (!tasks) return;

        const checkReminders = () => {
            const now = new Date();
            const allReminders = tasks
                .filter(task => !task.completed && task.reminderTime)
                .map(task => {
                    const reminderDate = new Date(task.reminderTime as string);
                    return {
                        task,
                        isDue: now >= reminderDate
                    };
                })
                .sort((a, b) => new Date(a.task.reminderTime as string).getTime() - new Date(b.task.reminderTime as string).getTime());

            setReminders(allReminders);

            // If there's at least one due reminder, trigger the dot
            setHasNewAlert(allReminders.some(r => r.isDue));
        };

        checkReminders();
        const interval = setInterval(checkReminders, 10000); // Check every 10 seconds locally
        return () => clearInterval(interval);
    }, [tasks]);

    const navigation = [
        { name: 'My Tasks', href: '/', icon: LayoutDashboard },
        { name: 'History', href: '/history', icon: History },
    ];

    const getPageTitle = () => {
        if (location.pathname === '/') return 'Dashboard';
        if (location.pathname === '/history') return 'Task History';
        return 'Overview';
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden sm:flex shrink-0 transition-colors duration-300">
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
                        <CheckSquare className="w-6 h-6" />
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">VitaTasks</span>
                    </div>
                </div>

                {/* Profile Area */}
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg border border-blue-200 dark:border-blue-800/50">
                            {username ? username[0].toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                Personal Workspace
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Action */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700/50">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors group"
                    >
                        <LogOut className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400" />
                        Log Out
                    </button>
                </div>
            </aside>

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Global Top Header (Desktop & Mobile) */}
                <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/50 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 transition-colors duration-300">
                    {/* Empty left side for desktop (since sidebar has logo), show logo on mobile */}
                    <div className="sm:hidden flex items-center gap-2 text-blue-600 dark:text-blue-500">
                        <CheckSquare className="w-6 h-6" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">VitaTasks</span>
                    </div>

                    {/* Page Title for Desktop */}
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{getPageTitle()}</h1>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 sm:px-3 sm:py-2 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? (
                                <>
                                    <Sun className="w-5 h-5" />
                                    <span className="hidden sm:inline-block text-sm font-medium">Light</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="w-5 h-5" />
                                    <span className="hidden sm:inline-block text-sm font-medium">Dark</span>
                                </>
                            )}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="hidden sm:flex p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors relative"
                            >
                                <Bell className="w-5 h-5" />
                                {hasNewAlert && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {isNotifOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsNotifOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700/70 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Scheduled Reminders</h3>
                                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                                                {reminders.length}
                                            </span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto w-full">
                                            {reminders.length === 0 ? (
                                                <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    You have no active reminders.
                                                </div>
                                            ) : (
                                                reminders.map(({ task, isDue }) => (
                                                    <div key={task.id} className="p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer relative group flex items-start">
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDue ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                                                        <div className="ml-2 flex-1 min-w-0 pr-2">
                                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 w-full break-words">
                                                                {task.title}
                                                            </p>
                                                            {isDue ? (
                                                                <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium flex items-center gap-1.5">
                                                                    <Bell className="w-3 h-3" /> Due Now!
                                                                </p>
                                                            ) : (
                                                                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 font-medium flex items-center gap-1.5">
                                                                    <Sun className="w-3 h-3" /> Upcoming
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile quick navigation to opposite page */}
                        <Link to={location.pathname === '/' ? '/history' : '/'} className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                            {location.pathname === '/' ? <History className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
                        </Link>
                        <button onClick={logout} className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
