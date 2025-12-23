export interface Link {
  name: string;
  url: string;
}

export interface LinkCategory {
  id: string;
  label: string;
  links: Link[];
}
