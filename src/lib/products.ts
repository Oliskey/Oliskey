// Every Oliskey product in one place: navigation, the HQ journey, product pages, search data and the footer read this list.
import { CandlestickChart, FlaskConical, GraduationCap, Truck, type LucideIcon } from 'lucide-react';

export type ProductId = 'school' | 'fleet' | 'alpha' | 'labs';

export interface Product {
  id: ProductId;
  name: string;
  /** One line under the name. */
  tagline: string;
  /** For whom, in a few words. */
  audience: string;
  description: string;
  path: string;
  /** The live app, when there is one. */
  app?: { url: string; label: string };
  icon: LucideIcon;
  /** Brand tint for the product icon tile. */
  tint: string;
  /** Real app screenshots (demo data), white and dark look. */
  shots: { light: string; dark: string };
  /** What the product does, as short facts. */
  points: { title: string; text: string }[];
  /** What the visitor sees in the product's room at headquarters. */
  room: string;
  keywords: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'school',
    name: 'Oliskey School',
    tagline: 'School management for every role',
    audience: 'Primary and secondary schools',
    description: 'Student records, attendance, fees, exams, report cards, messaging and learning tools in one workspace for administrators, teachers, students and parents.',
    path: '/school',
    app: { url: 'https://app.oliskey.com/', label: 'Open Oliskey School' },
    icon: GraduationCap,
    tint: '#1F6BFF',
    shots: { light: '/products/school-light.webp', dark: '/products/school-dark.webp' },
    points: [
      { title: 'One login, the right dashboard', text: 'Administrators, teachers, students and parents each see their own workspace, and only their school’s data.' },
      { title: 'Attendance, results and report cards', text: 'Mark attendance, enter grades and publish report cards that parents can open and download.' },
      { title: 'Fees and messages', text: 'Track fees and arrears, and keep teachers and parents in one conversation.' },
      { title: 'Learning tools', text: 'Lesson notes, assignments and computer-based tests sit next to the records they belong to.' },
    ],
    room: 'A modern classroom: student desks with tablets, and a teaching display showing the school dashboard.',
    keywords: ['school', 'school management', 'school app', 'education', 'attendance', 'report cards', 'fees', 'cbt', 'nigeria'],
  },
  {
    id: 'fleet',
    name: 'Oliskey Fleet',
    tagline: 'Tricycle and fleet operations',
    audience: 'Transport operators',
    description: 'Vehicles, drivers, staff, daily collections, remittances, maintenance and finance records for tricycle and fleet operators.',
    path: '/fleet',
    app: { url: 'https://tricycles.oliskey.com/', label: 'Open Oliskey Fleet' },
    icon: Truck,
    tint: '#F2B705',
    shots: { light: '/products/fleet-light.webp', dark: '/products/fleet-dark.webp' },
    points: [
      { title: 'Every vehicle and driver', text: 'Keep vehicle, driver and staff records in one place instead of notebooks.' },
      { title: 'Collections and remittances', text: 'Record what each driver pays in and see what is outstanding.' },
      { title: 'Maintenance and costs', text: 'Log repairs and spending so you know what each vehicle really earns.' },
      { title: 'Built for the phone', text: 'Fleet runs well on a phone, where operators already work.' },
    ],
    room: 'A fleet operations bay: tricycles parked in marked lanes, a tracking display and the operations dashboard.',
    keywords: ['fleet', 'tricycle', 'keke', 'transport', 'drivers', 'remittance', 'vehicles', 'maintenance', 'logistics'],
  },
  {
    id: 'alpha',
    name: 'Oliskey Alpha',
    tagline: 'Trading practice and market learning',
    audience: 'People learning to trade',
    description: 'Practise Fixed Time, InZone and Forex trades with demo credits on live crypto prices, follow an AI that shows its full record, and study free lessons on trading and risk.',
    path: '/alpha',
    app: { url: 'https://alpha.oliskey.com/', label: 'Open Oliskey Alpha' },
    icon: CandlestickChart,
    tint: '#12B76A',
    shots: { light: '/products/alpha-light.webp', dark: '/products/alpha-dark.webp' },
    points: [
      { title: 'Demo credits, live prices', text: 'Practise on live crypto prices without risking your own money.' },
      { title: 'An AI that shows every result', text: 'Follow an AI trader whose wins and losses are all on the record.' },
      { title: 'Free lessons', text: 'Learn how trades work and how to manage risk before you decide anything.' },
      { title: 'Charts that stay readable', text: 'Clear charts and one main action per screen, in light and dark mode.' },
    ],
    room: 'A trading floor: rows of desks with three monitors each and a wall of live market charts.',
    keywords: ['alpha', 'oliskey alpha', 'trading', 'trading app', 'demo trading', 'practice trading', 'forex', 'crypto', 'ai trading'],
  },
  {
    id: 'labs',
    name: 'Oliskey Labs',
    tagline: 'Research and new technology',
    audience: 'Partners and builders',
    description: 'Oliskey Labs is where we research and test new ideas in AI and software before they become products.',
    path: '/labs',
    icon: FlaskConical,
    tint: '#7C5CFF',
    shots: { light: '/hq/stills/labs-day.webp', dark: '/hq/stills/labs-night.webp' },
    points: [
      { title: 'AI research', text: 'Exploring how AI can make school, transport and trading software simpler to use.' },
      { title: 'Prototypes', text: 'New ideas are built as small prototypes and tested before they become products.' },
      { title: 'Custom software', text: 'Talk to us about software built around how your organisation already works.' },
      { title: 'Open to partners', text: 'Schools, operators and companies can work with us on new tools.' },
    ],
    room: 'A technology laboratory: lab benches, a robot arm, server racks and a research wall.',
    keywords: ['labs', 'oliskey labs', 'ai research', 'innovation', 'custom software', 'prototypes'],
  },
];

export const productById = (id: ProductId) => PRODUCTS.find((p) => p.id === id)!;

export const CONTACT = {
  email: 'oliskeylee@gmail.com',
  whatsapp: 'https://wa.me/message/D3OS4AVFMEBIH1',
  company: 'Oliskeylee Ltd.',
  city: 'Lagos, Nigeria',
};
