import Header from '../../components/Header';
import LinkCard from '../../components/LinkCard';
import type { LinkCategory } from '../../types';
import '../HomePage/HomePage.css';

const codingLinks: LinkCategory[] = [
	{
		id: 'github',
		label: 'GitHub',
		links: [{ name: 'Mein GitHub', url: 'https://github.com/moritzDalb' }],
	},
	{
		id: 'tools',
		label: 'Tools',
		links: [
			{ name: 'Platzhalter 1', url: '#' },
			{ name: 'Platzhalter 2', url: '#' },
		],
	},
	{
		id: 'docs',
		label: 'Docs',
		links: [
			{ name: 'Platzhalter 1', url: '#' },
			{ name: 'Platzhalter 2', url: '#' },
		],
	},
	{
		id: 'learning',
		label: 'Learning',
		links: [
			{ name: 'Platzhalter 1', url: '#' },
			{ name: 'Platzhalter 2', url: '#' },
		],
	},
];

const CodingPage = () => {
	return (
		<div className="home-page">
			<Header />
			<main className="main-content">
				<div className="link-cards-container">
					{codingLinks.map((category) => (
						<LinkCard key={category.id} category={category} />
					))}
				</div>
			</main>
		</div>
	);
};

export default CodingPage;
