import React from 'react';
import {
   Check, School, Users, BarChart, Calendar, Shield, ArrowRight,
   Layout, GraduationCap, Cpu, WifiOff, Gamepad2, MessageCircle,
   FileText, CreditCard, Lock, Activity, TrendingUp, Globe, MonitorPlay
} from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage';

const SchoolApp: React.FC = () => {
   return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
         {/* Hero Section */}
         <section className="pt-32 pb-20 sm:pt-40 sm:pb-32 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-50 dark:bg-slate-900/30 -skew-y-3 transform origin-top-left -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
               <div className="text-center max-w-5xl mx-auto">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-200 dark:border-indigo-800">
                     <School size={14} className="mr-2" /> Oliskey Schools OS
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                     The Future of <span className="text-indigo-600 dark:text-indigo-400">School Management</span>
                  </h1>
                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-3xl mx-auto">
                     A next-generation, all-in-one platform integrating administration, academics, communication, and cutting-edge AI-powered learning tools.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <a
                        href="https://school-app-one-fawn.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 block sm:inline-block"
                     >
                        Request Live Demo
                     </a>
                     <Link to="/contact" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">
                        Contact Sales
                     </Link>
                  </div>
               </div>

               {/* Dashboard Preview */}
               <div className="mt-20 relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 mx-auto max-w-6xl group">
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gray-100 dark:bg-slate-800 flex items-center px-4 space-x-2 border-b border-gray-200 dark:border-slate-700 z-10">
                     <div className="w-3 h-3 rounded-full bg-red-400"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                     <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="pt-10 bg-slate-50 dark:bg-slate-900">
                     <OptimizedImage
                        src="/school-dashboard.png"
                        alt="School Dashboard Interface"
                        className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                     />
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute bottom-8 right-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 flex items-center gap-4 animate-bounce-slow hidden md:flex">
                     <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <Activity size={24} />
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">System Status</p>
                        <p className="text-slate-900 dark:text-white font-bold">AI Analytics Active</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Key Objectives */}
         <section className="py-12 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                  <ObjectiveItem icon={<Layout />} text="Automate Operations" />
                  <ObjectiveItem icon={<Cpu />} text="AI-Driven Insights" />
                  <ObjectiveItem icon={<MonitorPlay />} text="Secure CBT Exams" />
                  <ObjectiveItem icon={<MessageCircle />} text="Real-time Comms" />
                  <ObjectiveItem icon={<BarChart />} text="Actionable Analytics" />
               </div>
            </div>
         </section>

         {/* Feature Block: Academic & Learning (The Core) */}
         <section className="py-24 bg-gray-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="mb-16">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-sm">Academic Excellence</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">Redefining how students learn and test.</h2>
               </div>

               <div className="grid lg:grid-cols-3 gap-8">
                  {/* CBT Highlight */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
                     <div className="relative z-10">
                        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                           <MonitorPlay size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Computer-Based Testing (CBT)</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6 max-w-xl">
                           Fully digital exams for quizzes, midterms, and finals. Supports MCQs, essays, and matching formats with auto-grading and instant results. Secure, timed, and anti-cheating enabled.
                        </p>
                        <ul className="space-y-3 mb-8">
                           <ListItem text="Instant feedback for students and teachers" />
                           <ListItem text="Secure environment with anti-cheating protocols" />
                           <ListItem text="Supports Nigerian & British Curriculum formats" />
                        </ul>
                     </div>
                     <div className="absolute right-0 bottom-0 w-1/3 h-full bg-gradient-to-l from-indigo-50 dark:from-indigo-900/20 to-transparent hidden sm:block"></div>
                  </div>

                  {/* AI Learning */}
                  <div className="bg-slate-900 dark:bg-black text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-slate-800">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                     <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-purple-300">
                           <Cpu size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">AI-Powered Assistance</h3>
                        <p className="text-slate-300 mb-6 leading-relaxed">
                           Personalized study recommendations based on performance. AI identifies weak areas and suggests videos, notes, and generated practice tests.
                        </p>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                           <p className="text-sm font-mono text-purple-300 mb-1">AI Insight:</p>
                           <p className="text-xs text-slate-400">"Student is struggling with Algebra. Recommending 'Linear Equations' module."</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid md:grid-cols-3 gap-8 mt-8">
                  <FeatureCardSmall
                     icon={<GraduationCap className="text-blue-500" />}
                     title="Curriculum Support"
                     desc="Nigerian & British systems (Primary to SSS3). Subjects arranged by level."
                  />
                  <FeatureCardSmall
                     icon={<FileText className="text-green-500" />}
                     title="Lesson Notes"
                     desc="Pre-built, editable templates with multimedia integration (videos, simulations)."
                  />
                  <FeatureCardSmall
                     icon={<BarChart className="text-orange-500" />}
                     title="Performance Analytics"
                     desc="Real-time dashboards tracking progress by student, class, or subject."
                  />
               </div>
            </div>
         </section>

         {/* Feature Block: Admin & Operations */}
         <section className="py-24 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1">
                     <span className="text-pink-600 dark:text-pink-400 font-bold tracking-wider uppercase text-sm">Administrative Power</span>
                     <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">Effortless Operations.</h2>
                     <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                        Reduce manual work and overhead costs. From secure fee collection to automated attendance, we handle the boring stuff so you can focus on education.
                     </p>

                     <div className="space-y-6">
                        <DetailRow
                           icon={<CreditCard size={20} className="text-blue-600" />}
                           title="Fee Management & Payments"
                           desc="Secure online payments, invoicing, and automated reminders for due payments."
                        />
                        <DetailRow
                           icon={<Calendar size={20} className="text-purple-600" />}
                           title="Attendance & Timetables"
                           desc="Automated daily tracking and digital timetables accessible to all staff."
                        />
                        <DetailRow
                           icon={<Lock size={20} className="text-green-600" />}
                           title="Secure Data Management"
                           desc="Cloud-based storage with encryption, backup, and disaster recovery."
                        />
                        <DetailRow
                           icon={<Users size={20} className="text-orange-600" />}
                           title="Staff & HR Portal"
                           desc="Manage payroll, schedules, and performance reviews in one secure portal."
                        />
                     </div>
                  </div>
                  <div className="order-1 lg:order-2 relative">
                     <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-3"></div>
                     <div className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden aspect-square flex items-center justify-center p-8">
                        {/* Abstract Admin UI Representation */}
                        <div className="w-full space-y-4">
                           <div className="flex justify-between items-center mb-6">
                              <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/30 rounded-full"></div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="h-24 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-4">
                                 <div className="h-8 w-8 bg-blue-200 dark:bg-blue-800 rounded-full mb-2"></div>
                                 <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                              </div>
                              <div className="h-24 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30 p-4">
                                 <div className="h-8 w-8 bg-green-200 dark:bg-green-800 rounded-full mb-2"></div>
                                 <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                              </div>
                           </div>
                           <div className="h-40 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 space-y-3">
                              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                              <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                              <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Feature Block: Innovation & Communication */}
         <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Innovation Features</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg">Pushing boundaries with features designed for the modern African educational landscape.</p>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <InnovationCard
                     icon={<WifiOff size={32} />}
                     title="Offline Access"
                     desc="Lesson notes and assignments accessible without internet. Auto-syncs when online."
                     color="text-red-400"
                  />
                  <InnovationCard
                     icon={<Gamepad2 size={32} />}
                     title="Gamified Learning"
                     desc="Quizzes, challenges, and leaderboards to motivate students and increase engagement."
                     color="text-purple-400"
                  />
                  <InnovationCard
                     icon={<MessageCircle size={32} />}
                     title="Smart Comms"
                     desc="In-app chat, discussion forums, and automated alerts for parents and teachers."
                     color="text-blue-400"
                  />
                  <InnovationCard
                     icon={<TrendingUp size={32} />}
                     title="Adaptive Learning"
                     desc="AI identifies the learning pace of each student and adjusts recommendations automatically."
                     color="text-green-400"
                  />
               </div>

               <div className="mt-20 text-center">
                  <p className="text-slate-400 mb-6">Also featuring custom branding for schools</p>
                  <div className="flex justify-center gap-4 flex-wrap opacity-50">
                     <div className="bg-white/10 px-4 py-2 rounded-lg text-sm">Custom Domain</div>
                     <div className="bg-white/10 px-4 py-2 rounded-lg text-sm">School Logo</div>
                     <div className="bg-white/10 px-4 py-2 rounded-lg text-sm">Theme Colors</div>
                  </div>
               </div>
            </div>
         </section>

         {/* Why Choose Oliskey */}
         <section className="py-24 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 rounded-[3rem] p-8 md:p-16 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12">Why Oliskey Stands Out</h2>

                  <div className="grid md:grid-cols-3 gap-12">
                     <div>
                        <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">All-in-One</div>
                        <p className="text-slate-600 dark:text-slate-400">Academics, Admin, AI, and CBT in a single platform. Stop paying for multiple tools.</p>
                     </div>
                     <div>
                        <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Offline</div>
                        <p className="text-slate-600 dark:text-slate-400">Built for reality. Works seamlessly even with unstable internet connections.</p>
                     </div>
                     <div>
                        <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Secure</div>
                        <p className="text-slate-600 dark:text-slate-400">Enterprise-grade security ensuring exam integrity and data privacy.</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* CTA */}
         <section className="py-20 bg-indigo-900 dark:bg-indigo-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
               <h2 className="text-4xl font-bold mb-6">Ready to join the revolution?</h2>
               <p className="text-indigo-200 text-lg mb-8">
                  Empower teachers, engage students, and delight parents with Oliskey.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                     href="https://school-app-one-fawn.vercel.app/"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors"
                  >
                     Request Live Demo <ArrowRight className="ml-2" />
                  </a>
                  <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                     Contact Sales
                  </Link>
               </div>
            </div>
         </section>

      </div>
   );
};

const ObjectiveItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
   <div className="flex flex-col items-center group">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center mb-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
         {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{text}</span>
   </div>
);

const FeatureCardSmall = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
   <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
   </div>
);

const DetailRow = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
   <div className="flex gap-4">
      <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg h-fit shrink-0 border border-gray-100 dark:border-slate-800">
         {icon}
      </div>
      <div>
         <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
         <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
   </div>
);

const ListItem = ({ text }: { text: string }) => (
   <li className="flex items-center text-slate-600 dark:text-slate-300">
      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mr-3 shrink-0">
         <Check size={12} strokeWidth={3} />
      </div>
      {text}
   </li>
);

const InnovationCard = ({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) => (
   <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
      <div className={`mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
   </div>
);

export default SchoolApp;