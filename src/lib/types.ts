export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  media: string[]; // URLs of images or videos
  start_date?: string;
  end_date?: string;
  site_url?: string;
}
