// Public pages: title and description for <head>, the prerendered HTML (scripts/prerender.mjs) and sitemap.xml.
export const SITE = 'https://www.oliskey.com';

export interface PublicRoute { path: string; title: string; description: string }

export const ROUTES: PublicRoute[] = [
  { path: '/', title: 'Oliskey — Bring your business to the world and reach more customers', description: 'Bring your business to the world and reach more customers. Work smarter and grow your business with Oliskey apps for schools, transport operators and traders: Oliskey School, Fleet, Alpha and Labs.' },
  { path: '/products', title: 'Products — Oliskey', description: 'Oliskey School, Oliskey Fleet, Oliskey Alpha and Oliskey Lab: software for schools, transport operators, traders and builders.' },
  { path: '/school', title: 'Oliskey School — School management for every role', description: 'Student records, attendance, fees, exams, report cards, messaging and learning tools for administrators, teachers, students and parents.' },
  { path: '/fleet', title: 'Oliskey Fleet — Tricycle and fleet operations', description: 'Vehicles, drivers, collections, remittances, maintenance and finance records for tricycle and fleet operators.' },
  { path: '/alpha', title: 'Oliskey Alpha — Trading practice and market learning', description: 'Practise trading with demo credits on live crypto prices, follow an AI that shows its full record, and study free lessons.' },
  { path: '/labs', title: 'Oliskey Lab — Build, connect and grow your business online', description: 'Oliskey Lab builds or connects your website and app, plans the dashboards your business needs, automates routine work and manages your customers and social media. Try the demo.' },
  { path: '/solutions', title: 'Solutions — Oliskey', description: 'Find the Oliskey product for the job: running a school, running a fleet, learning to trade, or building something new.' },
  { path: '/industries', title: 'Industries — Oliskey', description: 'Oliskey builds for education, transport and logistics, finance education and technology.' },
  { path: '/resources', title: 'Resources — Oliskey', description: 'Open every Oliskey app, get help and contact the team.' },
  { path: '/about', title: 'About Oliskey', description: 'Our goal: bring your business to the world so it reaches more customers, works smarter and grows. Oliskeylee Ltd. builds Oliskey School, Fleet, Alpha and Labs in Lagos, Nigeria.' },
  { path: '/pricing', title: 'Pricing — Oliskey', description: 'Oliskey School is priced per child per term: Free, Basic ₦1,000 and Advanced ₦3,000. No upfront payment.' },
  { path: '/contact', title: 'Contact & support — Oliskey', description: 'Send Oliskey a message: support, a price quote, using a product or a partnership. We reply by email.' },
  { path: '/get-started', title: 'Create your Oliskey account', description: 'Create one Oliskey account to get started with Oliskey products.' },
  { path: '/sign-in', title: 'Sign in — Oliskey', description: 'Sign in to your Oliskey account.' },
];

export const routeFor = (path: string) => ROUTES.find((r) => r.path === path);
