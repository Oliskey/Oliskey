// Public pages: title and description for <head>, the prerendered HTML (scripts/prerender.mjs) and sitemap.xml.
export const SITE = 'https://www.oliskey.com';

export interface PublicRoute { path: string; title: string; description: string }

export const ROUTES: PublicRoute[] = [
  { path: '/', title: 'Oliskey — We turn manual work into digital business', description: 'Oliskey moves schools, transport operators and traders from paper and local reach to online systems. Enter the worlds of Oliskey School, Fleet, Alpha and Labs.' },
  { path: '/products', title: 'Products — Oliskey', description: 'Oliskey School, Oliskey Fleet, Oliskey Alpha and Oliskey Labs: software for schools, transport operators, traders and builders.' },
  { path: '/school', title: 'Oliskey School — School management for every role', description: 'Student records, attendance, fees, exams, report cards, messaging and learning tools for administrators, teachers, students and parents.' },
  { path: '/fleet', title: 'Oliskey Fleet — Tricycle and fleet operations', description: 'Vehicles, drivers, collections, remittances, maintenance and finance records for tricycle and fleet operators.' },
  { path: '/alpha', title: 'Oliskey Alpha — Trading practice and market learning', description: 'Practise trading with demo credits on live crypto prices, follow an AI that shows its full record, and study free lessons.' },
  { path: '/labs', title: 'Oliskey Labs — Research and new technology', description: 'Where Oliskey researches and tests new ideas in AI and software before they become products.' },
  { path: '/solutions', title: 'Solutions — Oliskey', description: 'Find the Oliskey product for the job: running a school, running a fleet, learning to trade, or building something new.' },
  { path: '/industries', title: 'Industries — Oliskey', description: 'Oliskey builds for education, transport and logistics, finance education and technology.' },
  { path: '/resources', title: 'Resources — Oliskey', description: 'Open every Oliskey app, get help and contact the team.' },
  { path: '/about', title: 'About Oliskey', description: 'Oliskeylee Ltd. is a software company in Lagos, Nigeria, building Oliskey School, Oliskey Fleet, Oliskey Alpha and Oliskey Labs.' },
  { path: '/pricing', title: 'Pricing — Oliskey', description: 'Pricing for Oliskey School and how to get started with Oliskey Fleet, Oliskey Alpha and Oliskey Labs.' },
  { path: '/get-started', title: 'Create your Oliskey account', description: 'Create one Oliskey account to get started with Oliskey products.' },
  { path: '/sign-in', title: 'Sign in — Oliskey', description: 'Sign in to your Oliskey account.' },
];

export const routeFor = (path: string) => ROUTES.find((r) => r.path === path);
