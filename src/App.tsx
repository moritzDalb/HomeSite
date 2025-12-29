import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CodingPage from './pages/CodingPage';

function App() {
    // Basename for production (Tomcat) or empty for development
    const basename = import.meta.env.BASE_URL;

    return (
        <Router basename={basename}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/coding" element={<CodingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
