import { Building2, Bus, GraduationCap, LineChart, type LucideIcon } from 'lucide-react';

export const SOLUTIONS: { title: string; text: string; to: string; product: string }[] = [
  { title: 'Run a school', text: 'Records, attendance, fees, results and parent messages in one place.', to: '/school', product: 'Oliskey School' },
  { title: 'Run a tricycle or vehicle fleet', text: 'Drivers, daily collections, remittances and maintenance without notebooks.', to: '/fleet', product: 'Oliskey Fleet' },
  { title: 'Learn to trade safely', text: 'Practise with demo credits on live prices and learn how risk works.', to: '/alpha', product: 'Oliskey Alpha' },
  { title: 'Bring your business online', text: 'Build or connect your website and app, automate routine work and grow your customers.', to: '/labs', product: 'Oliskey Lab' },
];

export const INDUSTRIES: { title: string; text: string; icon: LucideIcon; to: string; detail: string }[] = [
  { title: 'Education', icon: GraduationCap, to: '/school', text: 'Primary and secondary schools, with a workspace for every role.',
    detail: 'Schools juggle registers, fee books, result sheets and parent calls. Oliskey School puts them in one system that administrators, teachers, students and parents each see from their own dashboard.' },
  { title: 'Transport and logistics', icon: Bus, to: '/fleet', text: 'Tricycle and vehicle operators who track drivers and daily money.',
    detail: 'Operators often rely on notebooks to follow drivers, daily payments and repairs. Oliskey Fleet keeps those records on the phone, so it is clear what each vehicle brings in and costs.' },
  { title: 'Finance education', icon: LineChart, to: '/alpha', text: 'People who want to understand trading before risking money.',
    detail: 'Oliskey Alpha lets people practise with demo credits on live prices, see an AI’s complete record and learn the basics of risk — before any real decision.' },
  { title: 'Any business going online', icon: Building2, to: '/labs', text: 'Businesses that want a website, app, automation and more customers.',
    detail: 'Oliskey Lab builds or connects a business’s website and app, plans its dashboards, automates routine work and brings customers and social media into one place.' },
];
