import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Wechsle zu ${theme === 'dark' ? 'hellem' : 'dunklem'} Modus`}
        >
            <div className={`toggle-track ${theme}`}>
                <Sun size={16} className="sun-icon" />
                <Moon size={16} className="moon-icon" />
                <div className="toggle-thumb" />
            </div>
        </button>
    );
};

export default ThemeToggle;
