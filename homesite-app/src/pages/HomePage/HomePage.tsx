import Header from '../../components/Header';
import LinkCard from '../../components/LinkCard';
import { linkCategories } from '../../data/links';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <main className="main-content">
        <div className="link-cards-container">
          {linkCategories.map((category) => (
            <LinkCard key={category.id} category={category} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
