import React from 'react';
import widgetsConfig from '../../config/widgetsConfig';
import WeatherWidget from '../WeatherWidget';
import GreetingWidget from '../GreetingWidget';

interface WidgetsAreaProps {
    page: string; // 'home' | 'coding' etc.
}

const WidgetsArea: React.FC<WidgetsAreaProps> = ({ page }) => {
    const config = widgetsConfig[page] || widgetsConfig.home;

    const renderWidget = (name: string | null) => {
        switch (name) {
            case 'weather':
                return <WeatherWidget />;
            case 'greeting':
                return <GreetingWidget />;
            default:
                return null;
        }
    };

    return (
        <div className="widgets-row">
            <div className="left-slot">{renderWidget(config.left)}</div>
            <div className="center-slot">{renderWidget(config.center)}</div>
            <div className="right-slot">{renderWidget(config.right)}</div>
        </div>
    );
};

export default WidgetsArea;

