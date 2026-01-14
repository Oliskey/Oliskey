import React from 'react';
import { Globe, Smartphone, Code, BarChart, Layout, Brain, FlaskConical, Server, GraduationCap, Video, Rocket } from 'lucide-react';
import { Course, Service, Project, BlogPost, EcosystemItem, FAQ } from './types';

export const servicesData: Service[] = [
  {
    title: 'AI Solutions',
    description: 'We integrate intelligent AI models into your websites and apps to automate workflows and personalize user experiences.',
    icon: <Brain size={32} />,
    color: 'bg-purple-600'
  },
  {
    title: 'Web Development',
    description: 'High-performance, responsive websites built with React and Next.js.',
    icon: <Globe size={32} />,
    color: 'bg-blue-500'
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile apps for iOS and Android.',
    icon: <Smartphone size={32} />,
    color: 'bg-indigo-500'
  },
  {
    title: 'Custom Software',
    description: 'Tailored software solutions to automate your business processes.',
    icon: <Code size={32} />,
    color: 'bg-violet-500'
  },
  {
    title: 'SEO & Analytics',
    description: 'Data-driven strategies to improve your visibility and conversion rates.',
    icon: <BarChart size={32} />,
    color: 'bg-green-500'
  },
  {
    title: 'UI/UX Design',
    description: 'User-centric design that looks beautiful and functions perfectly.',
    icon: <Layout size={32} />,
    color: 'bg-pink-500'
  }
];

export const coursesData: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    level: 'Beginner',
    description: 'Learn HTML, CSS, JavaScript, and React from scratch. Build real projects.',
    price: '$49.99',
    image: 'https://picsum.photos/400/250?random=1',
    tags: ['Web Dev', 'React']
  },
  {
    id: '2',
    title: 'Python for Business Automation',
    level: 'Intermediate',
    description: 'Automate spreadsheets, emails, and data analysis tasks with Python.',
    price: '$39.99',
    image: 'https://picsum.photos/400/250?random=2',
    tags: ['Python', 'Automation']
  },
  {
    id: '3',
    title: 'Mobile App Development with Flutter',
    level: 'Advanced',
    description: 'Build native iOS and Android apps using a single codebase.',
    price: '$59.99',
    image: 'https://picsum.photos/400/250?random=3',
    tags: ['Mobile', 'Flutter']
  },
  {
    id: '4',
    title: 'UI/UX Design Masterclass',
    level: 'Beginner',
    description: 'Master Figma and design principles to create stunning interfaces.',
    price: '$44.99',
    image: 'https://picsum.photos/400/250?random=4',
    tags: ['Design', 'Figma']
  }
];

export const portfolioData: Project[] = [
  {
    id: 1,
    title: "FinTrack Pro",
    category: "Fintech App",
    image: "https://picsum.photos/600/400?random=10",
    description: "A comprehensive financial tracking application for personal finance management."
  },
  {
    id: 2,
    title: "EcoMarket",
    category: "E-commerce Platform",
    image: "https://picsum.photos/600/400?random=11",
    description: "Sustainable shopping marketplace connecting eco-friendly brands with consumers."
  },
  {
    id: 3,
    title: "HealthConnect",
    category: "Medical Dashboard",
    image: "https://picsum.photos/600/400?random=12",
    description: "Patient management and appointment scheduling dashboard for clinics."
  },
  {
    id: 4,
    title: "LearnLoop",
    category: "LMS System",
    image: "https://picsum.photos/600/400?random=13",
    description: "Learning Management System for schools and online educators."
  },
  {
    id: 5,
    title: "Urban Properties",
    category: "Real Estate Web",
    image: "https://picsum.photos/600/400?random=14",
    description: "Modern real estate listing website with virtual tour capabilities."
  },
  {
    id: 6,
    title: "FoodieExpress",
    category: "Delivery App",
    image: "https://picsum.photos/600/400?random=15",
    description: "Fast and reliable food delivery application with live tracking."
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 React Libraries for 2024',
    excerpt: 'Discover the essential tools that will speed up your frontend development workflow this year.',
    date: 'Oct 12, 2023',
    author: 'Sarah Johnson',
    category: 'Development',
    image: 'https://picsum.photos/800/400?random=20'
  },
  {
    id: '2',
    title: 'How to Scale Your Startup Tech Stack',
    excerpt: 'A guide for non-technical founders on choosing the right technology for growth.',
    date: 'Oct 08, 2023',
    author: 'Mike Chen',
    category: 'Business',
    image: 'https://picsum.photos/800/400?random=21'
  },
  {
    id: '3',
    title: 'Understanding TypeScript Generics',
    excerpt: 'Deep dive into one of the most powerful features of TypeScript with practical examples.',
    date: 'Sep 25, 2023',
    author: 'Alex Rivera',
    category: 'Tutorial',
    image: 'https://picsum.photos/800/400?random=22'
  }
];

export const ecosystemData: EcosystemItem[] = [
  {
    id: 'labs',
    title: 'Oliskey Labs',
    description: 'Product innovation and design.',
    status: 'Coming Soon',
    icon: <FlaskConical size={24} />,
    color: 'bg-pink-500'
  },
  {
    id: 'systems',
    title: 'Oliskey Systems',
    description: 'SaaS platforms and infrastructure.',
    status: 'Coming Soon',
    icon: <Server size={24} />,
    color: 'bg-blue-500'
  },
  {
    id: 'ai',
    title: 'Oliskey AI',
    description: 'Intelligent tools and integrations.',
    status: 'Coming Soon',
    icon: <Brain size={24} />,
    color: 'bg-purple-600'
  },
  {
    id: 'education',
    title: 'Oliskey Education',
    description: 'School platforms, courses, and learning tools.',
    status: 'Live',
    icon: <GraduationCap size={24} />,
    color: 'bg-green-500',
    link: '/app',
    actionText: 'Check the App'
  },
  {
    id: 'media',
    title: 'Oliskey Media',
    description: 'Tutorials, videos, and creator-first content.',
    status: 'Coming Soon',
    icon: <Video size={24} />,
    color: 'bg-red-500'
  },
  {
    id: 'ventures',
    title: 'Oliskey Ventures',
    description: 'Incubation and strategic investments.',
    status: 'Coming Soon',
    icon: <Rocket size={24} />,
    color: 'bg-orange-500'
  }
];

export const faqs: FAQ[] = [
  {
    question: "What is Oliskey?",
    answer: "Oliskey is an umbrella infrastructure brand building reliable systems, enduring culture, and continuous creativity across SaaS, AI, education and media."
  },
  {
    question: "Who is Oliskey for?",
    answer: "Schools, developers, enterprises, creators, and partners seeking scalable, elegant products."
  },
  {
    question: "How can I partner or invest?",
    answer: "Visit /investors or email invest@oliskey.com."
  }
];