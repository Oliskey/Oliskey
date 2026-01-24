import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Course, Service, Project, BlogPost, EcosystemItem, FAQ } from '../types';
import { getIconByName } from '../utils/iconMap';
import { faqs as staticFaqs } from '../data'; // Keep FAQs static for now or move to DB later

interface DataContextType {
  services: Service[];
  courses: Course[];
  portfolio: Project[];
  blogPosts: BlogPost[];
  ecosystem: EcosystemItem[];
  faqs: FAQ[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [portfolio, setPortfolio] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [ecosystem, setEcosystem] = useState<EcosystemItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Services
      const { data: servicesData } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (servicesData) {
        setServices(servicesData.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: getIconByName(s.icon_name, 32),
          color: s.color_class
        })));
      }

      // 2. Fetch Courses
      const { data: coursesData } = await supabase.from('courses').select('*');
      if (coursesData) {
        setCourses(coursesData.map(c => ({
          id: c.id,
          title: c.title,
          level: c.level,
          description: c.description,
          price: c.price,
          image: c.image_url,
          tags: c.tags
        })));
      }

      // 3. Fetch Portfolio
      const { data: projectData } = await supabase.from('projects').select('*');
      if (projectData) {
        setPortfolio(projectData.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          image: p.image_url,
          description: p.description
        })));
      }

      // 4. Fetch Blog
      const { data: blogData } = await supabase.from('blog_posts').select('*');
      if (blogData) {
        setBlogPosts(blogData.map(b => ({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          date: b.date_published,
          author: b.author,
          category: b.category,
          image: b.image_url
        })));
      }

      // 5. Fetch Ecosystem
      const { data: ecoData } = await supabase.from('ecosystem').select('*').order('sort_order', { ascending: true });
      if (ecoData) {
        setEcosystem(ecoData.map(e => {
            // Manual Override for the School App to be LIVE based on user request
            if (e.id === 'schools_app') {
                return {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    status: 'Live',
                    icon: getIconByName(e.icon_name, 24),
                    color: e.color_class,
                    link: '/school-app',
                    actionText: 'Launch App'
                };
            }
            return {
              id: e.id,
              title: e.title,
              description: e.description,
              status: e.status,
              icon: getIconByName(e.icon_name, 24),
              color: e.color_class,
              link: e.link || undefined,
              actionText: e.action_text || undefined
            };
        }));
      }

    } catch (err) {
      console.error("Error fetching data from Supabase:", err);
      // Fallback strategies could go here, but user requested backend data.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    services,
    courses,
    portfolio,
    blogPosts,
    ecosystem,
    faqs: staticFaqs, // Static for now
    loading,
    refreshData: fetchData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};