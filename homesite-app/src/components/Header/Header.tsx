import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">
        <Link to="/">Startseite</Link>
        <Link to="/coding">Coding</Link>
      </h1>
    </header>
  );
};

export default Header;

