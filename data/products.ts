// Every live Oliskey product, in one place. The product hub, the apps menu in the top bar, site search, the footer and the
// search-engine data (seo/publicRoutes.ts) all read this list, so adding a product here shows it everywhere.
import { CandlestickChart, Gauge, GraduationCap, type LucideIcon } from 'lucide-react';

export interface OliskeyProduct {
  id: 'school' | 'fleet' | 'alpha';
  name: string;
  /** Who it is for, in a few words. */
  eyebrow: string;
  short: string;
  description: string;
  /** The page on this website that explains it (indexed by search engines). */
  detailsUrl: string;
  /** The live product. */
  appUrl: string;
  appLabel: string;
  icon: LucideIcon;
  /** Card header gradient (Tailwind). */
  tint: string;
  /** A real screenshot of the app, shown faintly in its card (demo data only). */
  image?: string;
  points: string[];
  /** Words people search for; site search matches these too. */
  keywords: string[];
}

export const PRODUCTS: OliskeyProduct[] = [
  {
    id: 'school',
    name: 'Oliskey School App',
    eyebrow: 'Oliskey Education · School operations',
    short: 'School management for every role',
    description: 'Help schools bring student records, attendance, fees, exams, report cards, communication and learning tools together in one workspace.',
    detailsUrl: '/school-management',
    appUrl: 'https://app.oliskey.com/',
    appLabel: 'Open School App',
    icon: GraduationCap,
    tint: 'from-blue-600 to-indigo-700',
    image: '/school-dashboard.png',
    points: ['Admin, teacher, student and parent experiences', 'School operations and learning tools', 'Built for schools in Nigeria'],
    keywords: ['school', 'school app', 'school management', 'education', 'students', 'teachers', 'parents', 'fees', 'results', 'cbt'],
  },
  {
    id: 'fleet',
    name: 'Oliskey Fleet',
    eyebrow: 'Fleet · Transport operations',
    short: 'Tricycle and fleet operations',
    description: 'Give tricycle operators a clearer way to manage vehicles, staff, drivers, collections, remittances, maintenance and finance records.',
    detailsUrl: '/fleet-operations',
    appUrl: 'https://tricycles.oliskey.com/',
    appLabel: 'Open Fleet',
    icon: Gauge,
    tint: 'from-violet-600 to-indigo-700',
    image: '/products/fleet-dashboard.webp',
    points: ['Vehicle, staff and driver records', 'Collections, remittances and finance', 'Mobile-first fleet workflows'],
    keywords: ['fleet', 'tricycle', 'keke', 'transport', 'drivers', 'remittance', 'vehicles', 'maintenance'],
  },
  {
    id: 'alpha',
    name: 'Oliskey Alpha',
    eyebrow: 'Trading practice · Learn and test',
    short: 'Practise trading with demo credits',
    description: 'Learn to trade without risking money: practise Fixed Time, InZone and Forex trades with demo credits on live crypto prices, follow an AI that shows its full record, and study free lessons.',
    detailsUrl: '/trading-app',
    appUrl: 'https://alpha.oliskey.com/',
    appLabel: 'Open Alpha',
    icon: CandlestickChart,
    tint: 'from-[#5B3DF5] to-[#1E6FD9]',
    image: '/products/alpha-terminal.webp',
    points: ['Demo credits on live crypto prices', 'An AI that shows every win and loss', 'Free lessons on trading and risk'],
    keywords: ['alpha', 'oliskey alpha', 'trading', 'trading app', 'demo trading', 'practice trading', 'forex', 'crypto', 'signals', 'ai trading'],
  },
];

export const productById = (id: OliskeyProduct['id']) => PRODUCTS.find((p) => p.id === id)!;
