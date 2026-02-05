import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Course, Service, Project, BlogPost, EcosystemItem, FAQ } from '../types';
import { getIconByName } from '../utils/iconMap';
import {
  servicesData as fallbackServices,
  coursesData as fallbackCourses,
  portfolioData as fallbackPortfolio,
  blogPostsData as fallbackBlog,
  ecosystemData as fallbackEcosystem,
  faqs as staticFaqs
} from '../data';

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
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [courses, setCourses] = useState<Course[]>(fallbackCourses);
  const [portfolio, setPortfolio] = useState<Project[]>(fallbackPortfolio);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(fallbackBlog);
  const [ecosystem, setEcosystem] = useState<EcosystemItem[]>(fallbackEcosystem);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('courses').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('blog_posts').select('*'),
        supabase.from('ecosystem').select('*').order('sort_order', { ascending: true })
      ]);

      // 1. Process Services
      const servicesRes = results[0];
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data) {
        const dbServices = servicesRes.value.data.map((s: any) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: getIconByName(s.icon_name, 32),
          color: s.color_class
        }));

        setServices(prev => {
          const merged = [...prev];
          dbServices.forEach((dbItem: Service) => {
            const index = merged.findIndex(m => m.title === dbItem.title);
            if (index > -1) merged[index] = dbItem;
            else merged.push(dbItem);
          });
          return merged;
        });
      }

      // 2. Process Courses
      const coursesRes = results[1];
      if (coursesRes.status === 'fulfilled' && coursesRes.value.data) {
        const dbCourses = coursesRes.value.data.map((c: any) => ({
          id: c.id,
          title: c.title,
          level: c.level,
          description: c.description,
          price: c.price,
          image: c.image_url,
          tags: c.tags,
          duration: c.duration,
          instructor: c.instructor_id,
          curriculum: c.curriculum
        }));

        setCourses(prev => {
          const merged = [...prev];
          dbCourses.forEach((dbItem: Course) => {
            const index = merged.findIndex(m => m.id === dbItem.id);
            if (index > -1) merged[index] = dbItem;
            else merged.push(dbItem);
          });
          return merged;
        });
      }

      // 3. Process Projects (Portfolio)
      const projectsRes = results[2];
      if (projectsRes.status === 'fulfilled' && projectsRes.value.data) {
        const dbProjects = projectsRes.value.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          image: p.image_url,
          description: p.description
        }));

        setPortfolio(prev => {
          const merged = [...prev];
          dbProjects.forEach((dbItem: Project) => {
            const index = merged.findIndex(m => m.id === dbItem.id);
            if (index > -1) merged[index] = dbItem;
            else merged.push(dbItem);
          });
          return merged;
        });
      }

      // 4. Process Blog Posts
      const blogRes = results[3];
      if (blogRes.status === 'fulfilled' && blogRes.value.data) {
        const dbBlog = blogRes.value.data.map((b: any) => ({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          date: b.date_published,
          author: b.author,
          category: b.category,
          image: b.image_url,
          content: b.content
        }));

        setBlogPosts(prev => {
          const merged = [...prev];
          dbBlog.forEach((dbItem: BlogPost) => {
            const index = merged.findIndex(m => m.id === dbItem.id);
            if (index > -1) merged[index] = dbItem;
            else merged.push(dbItem);
          });
          return merged;
        });
      }

      // 5. Process Ecosystem (Products)
      const ecoRes = results[4];
      if (ecoRes.status === 'fulfilled' && ecoRes.value.data) {
        const dbEco = ecoRes.value.data.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          status: e.status,
          icon: getIconByName(e.icon_name, 24),
          color: e.color_class,
          link: e.link || undefined,
          actionText: e.action_text || undefined
        }));

        setEcosystem(prev => {
          const merged = [...prev];
          dbEco.forEach((dbItem: EcosystemItem) => {
            const index = merged.findIndex(m => m.id === dbItem.id);
            if (index > -1) merged[index] = dbItem;
            else merged.push(dbItem);
          });
          // Ensure sort order: Stable sort with Live items first
          return merged.sort((a, b) => {
            if (a.status === 'Live' && b.status !== 'Live') return -1;
            if (a.status !== 'Live' && b.status === 'Live') return 1;
            return 0;
          });
        });
      }

    } catch (err) {
      console.error("Fatal error during data fetching:", err);
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