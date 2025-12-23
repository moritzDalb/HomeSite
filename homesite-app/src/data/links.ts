import type { LinkCategory } from '../types';

export const linkCategories: LinkCategory[] = [
  {
    id: 'media',
    label: 'Media',
    links: [
      { name: 'Twitch', url: 'https://www.twitch.tv/directory/following' },
      { name: 'Youtube', url: 'https://www.youtube.com' },
      { name: 'Netflix', url: 'https://www.netflix.com/browse' },
      { name: 'NFL GamePass', url: 'https://www.nflgamepass.com/de' },
    ],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    links: [
      { name: 'Amazon', url: 'https://www.amazon.de/' },
      { name: 'Zalando', url: 'https://www.zalando.de' },
    ],
  },
  {
    id: 'maps',
    label: 'Karten',
    links: [
      { name: 'Google Maps', url: 'https://www.google.de/maps' },
      { name: 'Falk', url: 'https://www.falk.de/routenplaner?data=eyJncCI6IjUxLjE2NTY5MSwxMC40NTE1MjYiLCJneiI6IjYuMDAifQ==' },
    ],
  },
  {
    id: 'biking',
    label: 'Biken',
    links: [
      { name: 'Outdooractive', url: 'https://www.outdooractive.com/de' },
      { name: 'Komoot', url: 'https://www.komoot.de' },
    ],
  },
  {
    id: 'games',
    label: 'Games',
    links: [
      { name: 'Geoguessr', url: 'https://www.geoguessr.com' },
      { name: 'Chess.com', url: 'https://www.chess.com/home' },
    ],
  },
  {
    id: 'cooking',
    label: 'Kochen',
    links: [
      { name: 'Kitchen Stories', url: 'https://www.kitchenstories.com/de' },
    ],
  },
];

