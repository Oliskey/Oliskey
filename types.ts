import { ReactNode } from 'react';

export interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  description: string;
  price: string;
  image: string; // mapped from image_url
  tags: string[];
  duration?: string;
  instructor?: string; // mapped from instructor_id
  curriculum?: any; // jsonb
}

export interface Service {
  id?: string;
  title: string;
  description: string;
  icon: ReactNode; // Transformed from icon_name
  color: string; // mapped from color_class
}

export interface Project {
  id: number | string;
  title: string;
  category: string;
  image: string; // mapped from image_url
  description?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string; // mapped from date_published
  author: string;
  category: string;
  image: string; // mapped from image_url
  content?: string;
}

export interface EcosystemItem {
  id: string;
  title: string;
  description: string;
  status: 'Live' | 'Coming Soon' | string;
  icon: ReactNode; // Transformed from icon_name
  color: string; // mapped from color_class
  link?: string;
  actionText?: string; // mapped from action_text
}

export interface FAQ {
  question: string;
  answer: string;
}
