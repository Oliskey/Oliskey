// Every Oliskey product in one place: navigation, the HQ journey, product pages, search data and the footer read this list.
import { CandlestickChart, FlaskConical, GraduationCap, Truck, type LucideIcon } from 'lucide-react';

export type ProductId = 'school' | 'fleet' | 'alpha' | 'labs';

/** One real app screen for one role, shown in the device that role uses. */
export interface Screen { role: string; title: string; text: string; kind: 'phone' | 'tablet' | 'desktop'; light: string; dark: string }

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
  /** Real screens, one per role. */
  screens?: Screen[];
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
    screens: [
      { role: 'Teacher, on the phone', title: 'The teacher dashboard', text: 'Classes, students, recent assignments and quick actions for attendance, gradebook and exams.', kind: 'phone', light: '/products/screens/school-teacher.webp', dark: '/products/screens/school-teacher.webp' },
      { role: 'Teacher, on the class screen', title: 'The AI assistant', text: 'Teachers ask about their own classes, marking and attendance, or for a quick starter activity. It only sees their own information.', kind: 'desktop', light: '/products/screens/school-ai.webp', dark: '/products/screens/school-ai.webp' },
      { role: 'Student, on the phone', title: 'What to do next', text: 'The next quiz or assignment with its due date, today’s timetable and AI study tools.', kind: 'phone', light: '/products/screens/school-student.webp', dark: '/products/screens/school-student.webp' },
      { role: 'Parent, on the phone', title: 'A child’s day, from anywhere', text: 'Attendance, assignments and results, plus the bus, calendar, notices and meetings.', kind: 'phone', light: '/products/screens/school-parent.webp', dark: '/products/screens/school-parent.webp' },
      { role: 'Administrator, on the computer', title: 'The school at a glance', text: 'Students, staff, parents, attendance and what needs action today, with one-tap approvals, timetable and emergencies.', kind: 'desktop', light: '/products/screens/school-admin.webp', dark: '/products/screens/school-admin.webp' },
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
    screens: [
      { role: 'Driver, on the phone', title: 'Make a payment', text: 'The amount is set by the company. The driver picks transfer or POS, adds the reference and a photo of the slip.', kind: 'phone', light: '/products/screens/fleet-pay-light.webp', dark: '/products/screens/fleet-pay-dark.webp' },
      { role: 'Driver, on the phone', title: 'Payment history', text: 'What is paid, what remains and every payment by week, month or year, with a way to report a missing one.', kind: 'phone', light: '/products/screens/fleet-history-light.webp', dark: '/products/screens/fleet-history-dark.webp' },
      { role: 'Area staff, on the tablet', title: 'Record a cash payment', text: 'Staff record cash, transfer or POS for any driver, with a receipt number generated when left empty.', kind: 'tablet', light: '/products/screens/fleet-staff-light.webp', dark: '/products/screens/fleet-staff-dark.webp' },
      { role: 'Company admin, on the computer', title: 'Collections to verify', text: 'Transfers wait for a check, and every recent payment is listed with its method and receipt.', kind: 'desktop', light: '/products/screens/fleet-admin-light.webp', dark: '/products/screens/fleet-admin-dark.webp' },
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
    screens: [
      { role: 'Trader, on the phone', title: 'The trading screen', text: 'Pick a market, a time and an amount, then Up or Down. The chart marks your entry and counts down to the end.', kind: 'phone', light: '/products/screens/alpha-terminal-light.webp', dark: '/products/screens/alpha-terminal-dark.webp' },
      { role: 'Trader, on the phone', title: 'Every market in one list', text: 'Currencies, crypto and more, with the payout for each and favourites one tap away.', kind: 'phone', light: '/products/screens/alpha-market-light.webp', dark: '/products/screens/alpha-market-dark.webp' },
      { role: 'Learner, on the phone', title: 'Free lessons first', text: 'Short lessons on how a forecast works, managing risk and reading signals, before any trade.', kind: 'phone', light: '/products/screens/alpha-lessons-light.webp', dark: '/products/screens/alpha-lessons-dark.webp' },
      { role: 'Trader, on the phone', title: 'Your real record', text: 'Best trade, profit, total trades and success rate, losses included. Nothing is hidden.', kind: 'phone', light: '/products/screens/alpha-record-light.webp', dark: '/products/screens/alpha-record-dark.webp' },
    ],
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
    shots: { light: '/products/labs-light.webp', dark: '/products/labs-dark.webp' },
    points: [
      { title: 'AI research', text: 'Exploring how AI can make school, transport and trading software simpler to use.' },
      { title: 'Prototypes', text: 'New ideas are built as small prototypes and tested before they become products.' },
      { title: 'Custom software', text: 'Talk to us about software built around how your organisation already works.' },
      { title: 'Open to partners', text: 'Schools, operators and companies can work with us on new tools.' },
    ],
    room: 'A technology lab where new ideas are researched and prototyped before they become Oliskey products.',
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
