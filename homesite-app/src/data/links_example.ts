import type { LinkCategory } from '../types';

/**
 * Example links configuration file
 *
 * Copy this file to 'links.ts' and customize it with your personal links.
 * The links.ts file is gitignored to keep your personal data private.
 */

export const linkCategories: LinkCategory[] = [
    {
        id: 'media',
        label: 'Media',
        links: [
            { name: 'Twitch', url: 'https://www.twitch.tv' },
            { name: 'Youtube', url: 'https://www.youtube.com' },
            { name: 'Netflix', url: 'https://www.netflix.com' },
            { name: 'Spotify', url: 'https://www.spotify.com' },
        ],
    },
    {
        id: 'shopping',
        label: 'Shopping',
        links: [
            { name: 'Amazon', url: 'https://www.amazon.de' },
            { name: 'eBay', url: 'https://www.ebay.de' },
        ],
    },
    {
        id: 'maps',
        label: 'Karten',
        links: [
            { name: 'Google Maps', url: 'https://www.google.de/maps' },
            { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org' },
        ],
    },
    {
        id: 'biking',
        label: 'Biken',
        links: [
            { name: 'Komoot', url: 'https://www.komoot.com' },
            { name: 'Strava', url: 'https://www.strava.com' },
        ],
    },
    {
        id: 'games',
        label: 'Games',
        links: [
            { name: 'Steam', url: 'https://store.steampowered.com' },
            { name: 'Chess.com', url: 'https://www.chess.com' },
        ],
    },
    {
        id: 'cooking',
        label: 'Kochen',
        links: [
            { name: 'Chefkoch', url: 'https://www.chefkoch.de' },
            { name: 'Kitchen Stories', url: 'https://www.kitchenstories.com/de' },
        ],
    },
];
