import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import './index.css';
import App from './App';
import { SpecialDayEffectsProvider } from './context/SpecialDayEffectsContext';
import SpecialDayEffectsContainer from './components/SpecialDayEffects/SpecialDayEffectsContainer';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <FavoritesProvider>
                <SpecialDayEffectsProvider>
                    <App />
                    <SpecialDayEffectsContainer />
                </SpecialDayEffectsProvider>
            </FavoritesProvider>
        </ThemeProvider>
    </StrictMode>
);

