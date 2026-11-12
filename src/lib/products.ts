// Every Oliskey product in one place: navigation, the HQ journey, product pages, search data and the footer read this list.
import { CandlestickChart, FlaskConical, GraduationCap, Truck, type LucideIcon } from 'lucide-react';

export type ProductId = 'school' | 'fleet' | 'alpha' | 'labs';

/** One role of a product and three of its real screens, shown on a phone. */
export interface RoleScreens { role: string; eyebrow: string; summary: string; screens: { title: string; text: string; light: string; dark: string }[] }

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
  /** Extra stops of the room's camera tour (one text block each), after the three standard ones. */
  tour?: { eyebrow: string; title: string; text: string }[];
  /** Every role, with three of its real screens. */
  roles?: RoleScreens[];
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
    room: 'Two classrooms where every student works on their own dashboard and asks questions there, while teachers teach, mark attendance and answer from theirs.',
    tour: [
      { eyebrow: 'The school office', title: 'The admin dashboard runs the school', text: 'Students, staff, timetable, exams, results and fees in one place, with today’s attendance and anything that needs action.' },
      { eyebrow: 'Parents, away from school', title: 'Parents see their child’s day from anywhere', text: 'Attendance, results, report cards, fees and messages from teachers on the parent dashboard, even from work.' },
    ],
    roles: [
      { role: 'Administrator', eyebrow: 'Runs the school', summary: 'The school at a glance, with fees and results in reach.', screens: [
        { title: 'Today at a glance', text: 'Students, staff, parents and quick actions.', light: '/products/roles/school-admin-1.webp', dark: '/products/roles/school-admin-1.webp' },
        { title: 'Fees and arrears', text: 'What is expected, collected and outstanding.', light: '/products/roles/school-admin-2.webp', dark: '/products/roles/school-admin-2.webp' },
        { title: 'Results by subject', text: 'How every subject is performing.', light: '/products/roles/school-admin-3.webp', dark: '/products/roles/school-admin-3.webp' },
      ] },
      { role: 'Teacher', eyebrow: 'Teaches the class', summary: 'Classes, attendance and an AI assistant that knows their own classes.', screens: [
        { title: 'Classes and assignments', text: 'Assigned classes, students and recent work.', light: '/products/roles/school-teacher-1.webp', dark: '/products/roles/school-teacher-1.webp' },
        { title: 'Mark attendance', text: 'Present, absent or late for each student.', light: '/products/roles/school-teacher-2.webp', dark: '/products/roles/school-teacher-2.webp' },
        { title: 'AI assistant', text: 'Marking, attendance or a quick lesson starter.', light: '/products/roles/school-teacher-3.webp', dark: '/products/roles/school-teacher-3.webp' },
      ] },
      { role: 'Student', eyebrow: 'Learns', summary: 'What is due next, help when stuck and learning games.', screens: [
        { title: 'What is due next', text: 'The next quiz and today’s timetable.', light: '/products/roles/school-student-1.webp', dark: '/products/roles/school-student-1.webp' },
        { title: 'AI study help', text: 'Ask about schoolwork and the timetable.', light: '/products/roles/school-student-2.webp', dark: '/products/roles/school-student-2.webp' },
        { title: 'Learning games', text: 'Maths, geography and more, at their level.', light: '/products/roles/school-student-3.webp', dark: '/products/roles/school-student-3.webp' },
      ] },
      { role: 'Parent', eyebrow: 'Follows from anywhere', summary: 'A child’s day, fees and report cards from the phone.', screens: [
        { title: 'A child’s day', text: 'Attendance, assignments and school utilities.', light: '/products/roles/school-parent-1.webp', dark: '/products/roles/school-parent-1.webp' },
        { title: 'Fees and payments', text: 'Expected, settled and still due.', light: '/products/roles/school-parent-2.webp', dark: '/products/roles/school-parent-2.webp' },
        { title: 'Report cards', text: 'Pick the session and term to view.', light: '/products/roles/school-parent-3.webp', dark: '/products/roles/school-parent-3.webp' },
      ] },
    ],
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
    room: 'A keke bay where drivers pay from their phones, the area staff records cash on a tablet, and the operations desk sees every payment come in.',
    tour: [
      { eyebrow: 'Drivers on the Fleet app', title: 'Pay from the phone, see what is left', text: 'Drivers see their next payment and what remains, and pay by transfer or POS with the reference.' },
      { eyebrow: 'Even from the keke', title: 'Payments without leaving the seat', text: 'A driver can pay and check his payment history between trips; the staff and the office see it at once.' },
      { eyebrow: 'Arriving at the bay', title: 'Every keke and driver on record', text: 'Vehicles, drivers, collections, remittances and maintenance live in one place, so the operator knows what each keke really earns.' },
    ],
    roles: [
      { role: 'Company admin', eyebrow: 'Runs the company', summary: 'Money owed, collected and paid to the bank, and every tricycle.', screens: [
        { title: 'Admin dashboard', text: 'Bank obligation, collections and what drivers owe.', light: '/products/roles/fleet-admin-1-light.webp', dark: '/products/roles/fleet-admin-1-dark.webp' },
        { title: 'Finance', text: 'Bank loans, payments and driver receivables.', light: '/products/roles/fleet-admin-2-light.webp', dark: '/products/roles/fleet-admin-2-dark.webp' },
        { title: 'Tricycles', text: 'Every tricycle with its plate, driver and status.', light: '/products/roles/fleet-admin-3-light.webp', dark: '/products/roles/fleet-admin-3-dark.webp' },
      ] },
      { role: 'Area staff', eyebrow: 'Collects in the area', summary: 'Who is due today, who is behind, and the cash to remit.', screens: [
        { title: 'Staff dashboard', text: 'Drivers, tricycles and what was collected.', light: '/products/roles/fleet-staff-1-light.webp', dark: '/products/roles/fleet-staff-1-dark.webp' },
        { title: 'Collections', text: 'Due today, with one tap to collect.', light: '/products/roles/fleet-staff-2-light.webp', dark: '/products/roles/fleet-staff-2-dark.webp' },
        { title: 'My drivers', text: 'Who is on track and who is overdue.', light: '/products/roles/fleet-staff-3-light.webp', dark: '/products/roles/fleet-staff-3-dark.webp' },
      ] },
      { role: 'Driver', eyebrow: 'Drives the keke', summary: 'What is left to pay, the next payment and its history.', screens: [
        { title: 'Driver dashboard', text: 'Left to pay, progress and the next payment.', light: '/products/roles/fleet-driver-1-light.webp', dark: '/products/roles/fleet-driver-1-dark.webp' },
        { title: 'Make a payment', text: 'Transfer or POS, with the reference and slip.', light: '/products/roles/fleet-driver-2-light.webp', dark: '/products/roles/fleet-driver-2-dark.webp' },
        { title: 'Payment history', text: 'Every payment, by week, month or year.', light: '/products/roles/fleet-driver-3-light.webp', dark: '/products/roles/fleet-driver-3-dark.webp' },
      ] },
    ],
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
    room: 'A trading floor with live market charts, where people practise and learn before they risk real money.',
    roles: [
      { role: 'Trader', eyebrow: 'Practises trading', summary: 'Demo credits, every market and a clear trading screen.', screens: [
        { title: 'Home', text: 'Demo balance, lessons, rewards and the AI trader.', light: '/products/roles/alpha-trader-1-light.webp', dark: '/products/roles/alpha-trader-1-dark.webp' },
        { title: 'The trading screen', text: 'Market, time, amount, then Up or Down.', light: '/products/roles/alpha-trader-2-light.webp', dark: '/products/roles/alpha-trader-2-dark.webp' },
        { title: 'Every market', text: 'Currencies and more, with each payout.', light: '/products/roles/alpha-trader-3-light.webp', dark: '/products/roles/alpha-trader-3-dark.webp' },
      ] },
      { role: 'Learner', eyebrow: 'Learns first', summary: 'Free lessons before any trade, and an honest record after.', screens: [
        { title: 'Skill Hub', text: 'Short lessons, from first steps to signals.', light: '/products/roles/alpha-learner-1-light.webp', dark: '/products/roles/alpha-learner-1-dark.webp' },
        { title: 'A lesson', text: 'One idea per page, in plain words.', light: '/products/roles/alpha-learner-2-light.webp', dark: '/products/roles/alpha-learner-2-dark.webp' },
        { title: 'Your record', text: 'Best trade, profit and success rate, losses included.', light: '/products/roles/alpha-learner-3-light.webp', dark: '/products/roles/alpha-learner-3-dark.webp' },
      ] },
    ],
    keywords: ['alpha', 'oliskey alpha', 'trading', 'trading app', 'demo trading', 'practice trading', 'forex', 'crypto', 'ai trading'],
  },
  {
    id: 'labs',
    name: 'Oliskey Lab',
    tagline: 'Build, connect and grow your business online',
    audience: 'Small and growing businesses',
    description: 'Oliskey Lab builds or connects your website and app, plans the dashboards your business needs, automates routine work, and brings your social media and customers into one place — from one account.',
    path: '/labs',
    icon: FlaskConical,
    tint: '#7C5CFF',
    shots: { light: '/products/lab-light.webp', dark: '/products/lab-dark.webp' },
    app: { url: '/lab/', label: 'Try the demo' },
    points: [
      { title: 'Your website, built or connected', text: 'Lab builds a website from a short conversation about your business, or connects the one you have — without rebuilding what works.' },
      { title: 'The right app, nothing more', text: 'Lab works out how many dashboards your app needs — customers, staff, riders, managers — and only recommends a store app when it pays.' },
      { title: 'Routine work on autopilot', text: 'Instant replies, reminders, orders and follow-ups, each with the steps to set it up and switched on only with your approval.' },
      { title: 'Customers and social in one place', text: 'Every enquiry from your website, WhatsApp and social media, with a status so nobody is forgotten.' },
    ],
    roles: [
      { role: 'Business owner', eyebrow: 'Runs the business', summary: 'How the business is doing, what to do this week, and every tool in one place.', screens: [
        { title: 'Home', text: 'Business health, the numbers that matter and this week’s focus.', light: '/products/roles/lab-home-light.webp', dark: '/products/roles/lab-home-dark.webp' },
        { title: 'Grow your customers', text: 'Social accounts, performance and the growth plan.', light: '/products/roles/lab-grow-light.webp', dark: '/products/roles/lab-grow-dark.webp' },
        { title: 'All features', text: 'Everything you need to run and grow, one tap away.', light: '/products/roles/lab-more-light.webp', dark: '/products/roles/lab-more-dark.webp' },
      ] },
      { role: 'Team member', eyebrow: 'Keeps it running', summary: 'Look after the website, answer customers and set up automations.', screens: [
        { title: 'Build and manage', text: 'The live website, quick edits, checks and new pages.', light: '/products/roles/lab-build-light.webp', dark: '/products/roles/lab-build-dark.webp' },
        { title: 'Customers', text: 'Every enquiry with its status, by source.', light: '/products/roles/lab-customers-light.webp', dark: '/products/roles/lab-customers-dark.webp' },
        { title: 'Automation', text: 'What can run by itself and how to set it up.', light: '/products/roles/lab-automation-light.webp', dark: '/products/roles/lab-automation-dark.webp' },
      ] },
    ],
    room: 'The lab where a business is understood, built and connected — and keeps improving every month.',
    keywords: ['oliskey lab', 'website builder nigeria', 'business website', 'social media management', 'business automation', 'digital transformation', 'small business app'],
  },
];

export const productById = (id: ProductId) => PRODUCTS.find((p) => p.id === id)!;

export const CONTACT = {
  email: 'oliskeylee@gmail.com',
  whatsapp: 'https://wa.me/message/D3OS4AVFMEBIH1',
  company: 'Oliskeylee Ltd.',
  city: 'Lagos, Nigeria',
};
