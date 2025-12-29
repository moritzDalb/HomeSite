import { useState, useEffect } from 'react';
import { Sun, Moon, Coffee, Sunset } from 'lucide-react';
import './GreetingWidget.css';

const GreetingWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour >= 5 && hour < 12) {
            return { text: 'Good morning', icon: <Coffee className="greeting-icon coffee" /> };
        } else if (hour >= 12 && hour < 17) {
            return { text: 'Good afternoon', icon: <Sun className="greeting-icon sun" /> };
        } else if (hour >= 17 && hour < 21) {
            return { text: 'Good evening', icon: <Sunset className="greeting-icon sunset" /> };
        } else {
            return { text: 'Good night', icon: <Moon className="greeting-icon moon" /> };
        }
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = () => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const greeting = getGreeting();

    return (
        <div className="greeting-widget">
            <div className="greeting-main">
                {greeting.icon}
                <h2 className="greeting-text">{greeting.text}!</h2>
            </div>
            <div className="time-display">
                <span className="time">{formatTime()}</span>
                <span className="date">{formatDate()}</span>
            </div>
        </div>
    );
};

export default GreetingWidget;
