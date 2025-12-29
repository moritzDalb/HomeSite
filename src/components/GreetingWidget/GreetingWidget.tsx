import { useState, useEffect } from 'react';
import { Sun, Moon, Coffee, Sunset } from 'lucide-react';
import './GreetingWidget.css';
import { t, setLocale, getLocale } from '../../i18n';
import { defaults } from '../../config/defaults';
import type { Locale as DefaultLocale } from '../../config/defaults';

const GreetingWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Setze initiale Locale basierend auf navigator (falls vorhanden) oder Default
    useEffect(() => {
        try {
            const nav = (navigator && (navigator.language || (navigator as any).userLanguage)) || '';
            const lang = nav.split('-')[0];
            if (lang === 'de' || lang === 'en') {
                setLocale(lang as DefaultLocale);
            } else {
                setLocale(defaults.defaultLocale);
            }
        } catch (e) {
            setLocale(defaults.defaultLocale);
        }
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour >= 5 && hour < 12) {
            return { text: t('greeting_morning'), icon: <Coffee className="greeting-icon coffee" /> };
        } else if (hour >= 12 && hour < 17) {
            return { text: t('greeting_day'), icon: <Sun className="greeting-icon sun" /> };
        } else if (hour >= 17 && hour < 21) {
            return { text: t('greeting_evening'), icon: <Sunset className="greeting-icon sunset" /> };
        } else {
            return { text: t('greeting_night'), icon: <Moon className="greeting-icon moon" /> };
        }
    };

    const formatDate = () => {
        const localeCode = defaults.localeMap[getLocale() as DefaultLocale] || defaults.localeMap[defaults.defaultLocale];
        return currentTime.toLocaleDateString(localeCode, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = () => {
        const localeCode = defaults.localeMap[getLocale() as DefaultLocale] || defaults.localeMap[defaults.defaultLocale];
        return currentTime.toLocaleTimeString(localeCode, defaults.timeOptions as Intl.DateTimeFormatOptions);
    };

    const greeting = getGreeting();

    return (
        <div className="greeting-widget">
            <div className="greeting-main">
                {greeting.icon}
                <h2 className="greeting-text">{greeting.text}{t('exclamation')}</h2>
            </div>
            <div className="time-display">
                <span className="time">{formatTime()}</span>
                <span className="date">{formatDate()}</span>
            </div>
        </div>
    );
};

export default GreetingWidget;
