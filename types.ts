import { ReactNode } from 'react';

export interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  price: string;
  image: string;
  tags: string[];
}

export interface Service {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}

export interface Project {
  id: number | string;
  title: string;
  category: string;
  image: string;
  description?: string; // Added for searchability
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export interface EcosystemItem {
  id: string;
  title: string;
  description: string;
  status: 'Live' | 'Coming Soon';
  icon: ReactNode;
  color: string;
  link?: string;
  actionText?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}