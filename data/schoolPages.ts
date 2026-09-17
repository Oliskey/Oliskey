// Content for the Oliskey School App public pages. Every claim here describes
// something the app actually does today (see the school-app repository).
// No customer counts, ratings, awards or "best/fastest" claims.

export interface Section { heading: string; body: string; bullets?: string[] }
export interface Faq { q: string; a: string }
export interface SchoolPage {
    path: string;
    eyebrow: string;
    h1: string;
    intro: string;
    sections: Section[];
    faqs?: Faq[];
    /** Paths of related pages for internal linking. */
    related: string[];
}

export const PLANS = [
    { name: 'Free', price: '₦0', unit: '', note: 'Core records for small schools. Start here, upgrade any time.' },
    { name: 'Basic', price: '₦1,000', unit: 'per student per term', note: 'Attendance, fees, exams and results, CBT, e-learning, messaging, multi-branch.' },
    { name: 'Advanced', price: '₦3,000', unit: 'per student per term', note: 'Everything in Basic plus the AI tools for teachers, students, parents and admins.' },
];
export const TRIAL_NOTE = 'Every new school starts on a 30-day free trial. Billing is per term, based on enrolled students.';

export const ROLES = ['School Admin', 'Proprietor', 'Teacher', 'Student', 'Parent', 'Exam Officer', 'Compliance Officer', 'Inspector', 'Counselor'];

export const SCHOOL_PAGES: SchoolPage[] = [
    {
        path: '/features',
        eyebrow: 'Oliskey School App',
        h1: 'Every part of running a school, in one system',
        intro: 'Oliskey replaces the spreadsheets, notebooks and group chats a school runs on with one connected system that every role signs in to.',
        sections: [
            { heading: 'Administration', body: 'Set up the school, its branches, sessions and terms, classes and subjects. Enrol students, onboard staff, and assign teachers to classes. Every record is scoped to your school and branch.' },
            { heading: 'Attendance and timetable', body: 'Teachers mark class attendance from a phone; the timetable is built once and shared with staff, students and parents.', bullets: ['Attendance by class and date', 'Term and per-student attendance summaries', 'Timetable by class and teacher'] },
            { heading: 'Fees and payments', body: 'Fee structures per class and term, invoices, instalments, online payment through Paystack and Flutterwave, receipts and outstanding-balance tracking.' },
            { heading: 'Exams, results and report cards', body: 'Exam setup, score entry by subject, grade computation, positions and published report cards.' },
            { heading: 'CBT and e-learning', body: 'Computer-based tests with automatic marking, plus lesson plans, lesson notes, schemes of work, assignments and shared learning resources.' },
            { heading: 'Communication', body: 'Announcements, notices, direct messages and notifications between the school, staff and parents.' },
            { heading: 'AI assistance', body: 'On the Advanced plan, AI drafts lesson notes, schemes of work and quiz questions for teachers, explains topics to students, and summarises for administrators. Provider keys never leave the server.' },
            { heading: 'Works on any device', body: 'Oliskey is a web app that installs like a native app on Android, iOS and desktop, with offline-friendly access to recent data.' },
        ],
        related: ['/school-management', '/teachers', '/students', '/parents', '/attendance', '/fees', '/exams-results', '/cbt', '/e-learning', '/ai', '/demo'],
    },
    {
        path: '/school-management',
        eyebrow: 'School management system',
        h1: 'A school management system built for multi-branch schools',
        intro: 'Oliskey gives proprietors and administrators one place to run enrolment, staff, classes, attendance, fees, exams, results, communication and compliance — across every branch.',
        sections: [
            { heading: 'One school, many branches', body: 'A main-branch admin sees every branch; a branch admin sees only theirs. Teachers and parents see the branches their classes and children belong to. Isolation between schools is enforced in the database, not just in the app.' },
            { heading: 'Standard IDs for everyone', body: 'Every user gets a school-issued ID in the form SCHOOL_BRANCH_ROLE_NUMBER (for example EXCEL_MAIN_STU_0001), generated automatically at creation and used everywhere in the app.' },
            { heading: 'Roles that match how schools work', body: 'Each role signs in to a dashboard built for its job.', bullets: ROLES },
            { heading: 'Compliance and oversight', body: 'Compliance checks and reports, inspection templates and audit logs give proprietors and inspectors a record of what happened and when.' },
            { heading: 'Try before you commit', body: 'The demo school is fully interactive — create students, mark attendance, enter results — and every change is visible immediately when you switch to another role.' },
        ],
        faqs: [
            { q: 'Can one school run several branches?', a: 'Yes. Branches are set up under one school, each with its own code, records and admins. The main-branch admin can see all of them.' },
            { q: 'Can another school see our data?', a: 'No. Every table is scoped by school and branch, and row-level security in the database enforces it for every query.' },
            { q: 'What does it cost?', a: 'Free for core records; Basic is ₦1,000 per student per term; Advanced with AI is ₦3,000 per student per term. New schools get a 30-day free trial.' },
        ],
        related: ['/features', '/attendance', '/fees', '/exams-results', '/parents', '/demo'],
    },
    {
        path: '/teachers',
        eyebrow: 'For teachers',
        h1: 'Teacher tools for the whole school day',
        intro: 'Attendance, lesson planning, assignments, marks and communication with parents — from a phone in the classroom or a laptop in the staff room.',
        sections: [
            { heading: 'Attendance in a minute', body: 'Open the class, tap present or absent, save. Records go straight to the admin and to parents.' },
            { heading: 'Lesson plans, notes and schemes of work', body: 'Write and file lesson plans and notes per subject and week; on the Advanced plan AI drafts them from your topic and class level for you to edit.' },
            { heading: 'Assignments and CBT', body: 'Set assignments with attachments, collect submissions online, and run computer-based tests that mark themselves.' },
            { heading: 'Results entry', body: 'Enter continuous-assessment and exam scores by subject; grades, totals and positions are computed for the report card.' },
            { heading: 'Your own profile and documents', body: 'Teachers keep their profile, documents and class assignments in one place; multi-branch teachers see every branch they teach in.' },
        ],
        related: ['/e-learning', '/cbt', '/exams-results', '/attendance', '/ai', '/features'],
    },
    {
        path: '/students',
        eyebrow: 'For students',
        h1: 'One student record from admission to graduation',
        intro: 'Profile, class, attendance, fees, results and report cards live on one record, and students get a portal for assignments, tests and study help.',
        sections: [
            { heading: 'Admission and enrolment', body: 'Enrol a student with their documents and guardian details; the system issues their ID and places them in a class and branch.' },
            { heading: 'The student portal', body: 'Students see their timetable, assignments, results and report cards, take CBT exams, and open learning resources shared by their teachers.' },
            { heading: 'Study assistant', body: 'On the Advanced plan, students can ask for explanations of topics and practice questions inside the app.' },
            { heading: 'Progress over time', body: 'Attendance, results and behaviour notes accumulate on the record so teachers, counsellors and parents see the whole picture.' },
        ],
        related: ['/parents', '/cbt', '/e-learning', '/exams-results', '/features'],
    },
    {
        path: '/parents',
        eyebrow: 'For parents',
        h1: 'Parents see what matters, when it happens',
        intro: 'Attendance, results, fees and notices for every child — even across branches — with direct messaging to the school.',
        sections: [
            { heading: 'All children in one account', body: 'A parent with children in different branches sees all of them from one login.' },
            { heading: 'Fees without the queue', body: 'View invoices and outstanding balances, pay online through Paystack or Flutterwave, and keep receipts in the app.' },
            { heading: 'Results and report cards', body: 'Published results and report cards are available to parents the moment the school releases them.' },
            { heading: 'Notices and messages', body: 'School announcements, class notices and direct messages arrive in the app with notifications.' },
        ],
        related: ['/fees', '/exams-results', '/attendance', '/students', '/features'],
    },
    {
        path: '/attendance',
        eyebrow: 'Attendance management',
        h1: 'Attendance that takes a minute and is never lost',
        intro: 'Daily class attendance from any device, stored per student and per term, visible to administrators and parents.',
        sections: [
            { heading: 'Mark by class', body: 'Teachers open their class list and mark each student; a date that already has a record warns before it is overwritten.' },
            { heading: 'Reports for admins', body: 'Attendance by class, by student and by term on the admin dashboard, with the raw records exportable.' },
            { heading: 'Parents in the loop', body: 'A child\'s attendance shows on the parent dashboard as it is recorded.' },
        ],
        related: ['/teachers', '/parents', '/school-management', '/features'],
    },
    {
        path: '/fees',
        eyebrow: 'Fees management',
        h1: 'School fees: structured, invoiced, paid online',
        intro: 'Define fee structures once, invoice every student automatically, accept online payments and track what is outstanding.',
        sections: [
            { heading: 'Fee structures and invoices', body: 'Fees per class and term, with optional instalments; invoices generated per student.' },
            { heading: 'Online payment', body: 'Parents pay through Paystack or Flutterwave; payments reconcile to the invoice and a receipt is issued.' },
            { heading: 'Outstanding balances', body: 'Admins see who has paid, who has not, and how much is outstanding by class or branch.' },
            { heading: 'Platform billing is simple too', body: 'Oliskey itself bills per student per term: Basic ₦1,000, Advanced ₦3,000 (AI included), Free for core records.' },
        ],
        related: ['/parents', '/school-management', '/features'],
    },
    {
        path: '/exams-results',
        eyebrow: 'Exams and results',
        h1: 'From exam setup to published report card',
        intro: 'Set up exams per term, enter scores by subject, compute grades and positions, and publish report cards online.',
        sections: [
            { heading: 'Exam setup', body: 'Exams are defined per class, subject and term with their weightings; exam officers oversee the process.' },
            { heading: 'Score entry', body: 'Teachers enter continuous assessment and exam scores; totals, grades and positions are computed automatically.' },
            { heading: 'Report cards', body: 'Report cards are generated per student per term and published to students and parents when the school is ready.' },
            { heading: 'History', body: 'Results stay on the student record across terms and sessions for progress tracking.' },
        ],
        related: ['/cbt', '/teachers', '/students', '/parents', '/features'],
    },
    {
        path: '/cbt',
        eyebrow: 'Computer-based testing',
        h1: 'CBT software your school already owns',
        intro: 'Build question banks, run timed computer-based tests, and get automatic marking and instant results — no separate CBT centre software.',
        sections: [
            { heading: 'Question banks', body: 'Questions by subject and topic, reusable across tests; on the Advanced plan AI can draft questions for a teacher to review.' },
            { heading: 'Timed tests', body: 'Students sit tests in the app with a timer; submissions are marked automatically and results recorded.' },
            { heading: 'Practice and preparation', body: 'Use the same engine for class tests and for exam practice.' },
        ],
        related: ['/exams-results', '/students', '/teachers', '/ai', '/features'],
    },
    {
        path: '/e-learning',
        eyebrow: 'E-learning',
        h1: 'E-learning built into the timetable, not bolted on',
        intro: 'Lesson plans, notes, schemes of work, assignments and resources are shared with students as part of normal teaching.',
        sections: [
            { heading: 'Lesson plans and notes', body: 'Teachers file plans and notes per subject and week; students open the notes for their class.' },
            { heading: 'Assignments with submissions', body: 'Assignments carry attachments and due dates; students submit online and teachers grade in the app.' },
            { heading: 'Learning resources', body: 'Documents, images and links shared per class or subject.' },
            { heading: 'Mobile and offline-friendly', body: 'The app installs on a phone and keeps recently opened material available when the connection drops.' },
        ],
        related: ['/teachers', '/students', '/cbt', '/ai', '/features'],
    },
    {
        path: '/ai',
        eyebrow: 'AI-assisted workflows',
        h1: 'AI that does school work, inside the school system',
        intro: 'AI assistance is part of the Advanced plan and appears where the work happens — not as a separate chatbot you copy answers from.',
        sections: [
            { heading: 'For teachers', body: 'Draft lesson notes, schemes of work, quiz and exam questions from a topic and class level, then edit and file them.' },
            { heading: 'For students', body: 'Explanations of topics and practice questions tied to their subjects.' },
            { heading: 'For parents and administrators', body: 'Plain-language summaries of a child\'s progress; drafting help for notices and reports.' },
            { heading: 'How it is run', body: 'Requests go through Oliskey\'s server, which holds the provider keys; the browser never sees them. Content extracted from uploads is treated as data, never as instructions. If the primary provider is temporarily unavailable, a fallback provider answers, and if both fail the user gets a clear message rather than a hang.' },
        ],
        faqs: [
            { q: 'Which plan includes AI?', a: 'Advanced (₦3,000 per student per term). A school on Basic can also let individual users add AI for their own account.' },
            { q: 'Is student data sent to the AI provider?', a: 'Only what is needed for the specific request (for example a topic and class level), never whole records.' },
        ],
        related: ['/teachers', '/students', '/cbt', '/e-learning', '/features'],
    },
    {
        path: '/demo',
        eyebrow: 'Try it now',
        h1: 'Open the demo school — no sign-up',
        intro: 'The demo is the real app with a sample school. Sign in as Admin, Teacher, Student or Parent, make changes, and switch roles to see them from the other side.',
        sections: [
            { heading: 'What you can do', body: 'Enrol a student, mark attendance, enter results, publish a notice, set an assignment, run a CBT — everything a real school does.' },
            { heading: 'Switch roles instantly', body: 'A floating role switcher lets you move between Admin, Teacher, Student and Parent without signing out.' },
            { heading: 'Resets daily', body: 'The demo school returns to a clean state every 24 hours, so it is always ready for the next visitor.' },
            { heading: 'When you are ready', body: 'Create your school from the app: name, address, your own school code, branches, the owner account — and start a 30-day free trial.' },
        ],
        related: ['/features', '/school-management', '/fees'],
    },
];

export const findSchoolPage = (path: string) => SCHOOL_PAGES.find((p) => p.path === path);
