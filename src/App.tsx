import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CodingPage from './pages/CodingPage';

function PageWrapper({ children, page }: { children: React.ReactNode; page?: string }) {
    const pageClass = page ? `page-viewport--${page}` : '';
    return (
        <div className={`page-viewport ${pageClass}`}>
            <div className="page-container">
                <div className="page-main">
                    {children}
                </div>
            </div>
        </div>
    );
}

function App() {
    // Basename for production (Tomcat) or empty for development
    const basename = import.meta.env.BASE_URL;

    return (
        <Router basename={basename}>
            <Routes>
                <Route path="/" element={<PageWrapper page="home"><HomePage /></PageWrapper>} />
                <Route path="/coding" element={<PageWrapper page="coding"><CodingPage /></PageWrapper>} />
            </Routes>
        </Router>
    );
}

export default App;
