export interface Link {
  name: string;
  url: string;
  icon?: string;
}

export interface LinkCategory {
  id: string;
  label: string;
  icon?: string;
  links: Link[];
}

export type Theme = 'dark' | 'light';

export interface SearchResult {
  link: Link;
  category: LinkCategory;
}

