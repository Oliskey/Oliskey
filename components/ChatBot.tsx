import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronRight, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { servicesData, coursesData, portfolioData, ecosystemData } from '../data';
import { Course, Service, Project } from '../types';
import Logo from './Logo';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  actionPath?: string;
  actionLabel?: string;
  imageUrl?: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Oliskey's AI Agent. I can help you navigate the app, explain our vision, or even generate concepts/images for you. Try asking me to 'draw a futuristic city'.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // --- AI LOGIC CORE ---

  const findBestMatch = (query: string) => {
    const lower = query.toLowerCase();

    // 1. Search Courses
    const course = coursesData.find(c => 
      c.title.toLowerCase().includes(lower) || 
      c.tags.some(t => lower.includes(t.toLowerCase()))
    );
    if (course) return { type: 'course', data: course };

    // 2. Search Services
    const service = servicesData.find(s => 
      s.title.toLowerCase().includes(lower) || 
      s.description.toLowerCase().includes(lower)
    );
    if (service) return { type: 'service', data: service };

    // 3. Search Portfolio
    const project = portfolioData.find(p => 
      p.title.toLowerCase().includes(lower) || 
      p.category.toLowerCase().includes(lower)
    );
    if (project) return { type: 'project', data: project };

    // 4. Search Ecosystem/Products
    const product = ecosystemData.find(e => e.title.toLowerCase().includes(lower));
    if (product) return { type: 'product', data: product };

    return null;
  };

  const processQuery = (query: string): { text: string, path?: string, label?: string, imageUrl?: string } => {
    const lower = query.toLowerCase();

    // --- IMAGE GENERATION (Simulated) ---
    if (lower.startsWith('generate') || lower.startsWith('draw') || lower.startsWith('create image') || lower.includes('picture of') || lower.includes('image of')) {
        const subject = query.replace(/(generate|draw|create|picture|image|of|an|a|show|me)/gi, '').trim();
        // Use a random seed based on time to simulate a unique generation each time
        const randomSeed = Date.now(); 
        return {
            text: `I've generated a concept image based on "${subject || 'your request'}". Here is the visual representation:`,
            imageUrl: `https://picsum.photos/seed/${randomSeed}/800/600` // High quality random image
        };
    }

    // --- NAVIGATION COMMANDS (Agent Capabilities) ---
    if (lower.includes('go to') || lower.includes('open') || lower.includes('take me') || lower.includes('show me')) {
      if (lower.includes('home')) return { text: "Navigating to Home...", path: '/' };
      if (lower.includes('about')) return { text: "Opening About page.", path: '/about' };
      if (lower.includes('service')) return { text: "Taking you to Services.", path: '/services' };
      if (lower.includes('course')) return { text: "Opening Courses catalog.", path: '/courses' };
      if (lower.includes('portfolio') || lower.includes('work')) return { text: "Showing our Portfolio.", path: '/portfolio' };
      if (lower.includes('blog')) return { text: "Loading the Blog.", path: '/blog' };
      if (lower.includes('contact')) return { text: "Opening Contact page.", path: '/contact' };
      if (lower.includes('invest')) return { text: "Opening Investor Relations.", path: '/investors' };
      if (lower.includes('app')) return { text: "Showing App details.", path: '/app' };
    }

    // --- VISION & IDENTITY ---
    if (lower.includes('vision') || lower.includes('mission') || lower.includes('who are you') || lower.includes('scc')) {
      return { 
        text: "Oliskey is a global infrastructure brand built on the S.C.C framework: System (Reliable platforms), Culture (Enduring communities), and Creativity (Limitless innovation). We build products that last.",
        path: '/about',
        label: "Read Manifesto"
      };
    }

    // --- REAL WORLD PROBLEMS ---
    if (lower.includes('scale') || lower.includes('slow') || lower.includes('performance') || lower.includes('traffic')) {
      return { 
        text: "Scalability is a core pillar of our 'System' philosophy. We engineer architectures that handle massive growth without compromising performance. Our Custom Software and AI solutions are built for this.",
        path: '/services',
        label: "View Solutions"
      };
    }
    if (lower.includes('design') || lower.includes('ugly') || lower.includes('user experience') || lower.includes('ux')) {
      return {
        text: "Great products need 'Culture' and 'Creativity'. We focus on human-centered design to ensure your users love the product. Our UI/UX Design service specifically solves retention and engagement problems.",
        path: '/services',
        label: "See Design Services"
      };
    }

    // --- SPECIFIC DATA LOOKUP ---
    const match = findBestMatch(query);
    if (match) {
      if (match.type === 'course') {
        const course = match.data as Course;
        return { 
          text: `I found the "${course.title}" course. It's a ${course.level} level course covering ${course.tags.join(', ')}. Price: ${course.price}.`,
          path: '/courses',
          label: "View Course"
        };
      }
      if (match.type === 'service') {
        const service = match.data as Service;
        return { 
          text: `Yes, we specialize in ${service.title}. ${service.description} We can help you implement this.`,
          path: '/services',
          label: "View Services"
        };
      }
      if (match.type === 'project') {
        const project = match.data as Project;
        return { 
          text: `We built "${project.title}", a ${project.category}. You can see the case study details in our portfolio.`,
          path: '/portfolio',
          label: "View Portfolio"
        };
      }
    }

    // --- CATEGORY SEARCH ---
    if (lower.includes('learn') || lower.includes('teach') || lower.includes('study')) {
      return { text: "We offer project-based courses in Web Dev, Python, Flutter, and Design. Our goal is to get you hired or help you build a startup.", path: '/courses', label: "Browse Courses" };
    }
    if (lower.includes('build') || lower.includes('develop') || lower.includes('app') || lower.includes('website')) {
      return { text: "We can build that for you. From simple websites to complex AI-powered apps, our engineering team is ready.", path: '/services', label: "Our Services" };
    }
    if (lower.includes('invest') || lower.includes('partner') || lower.includes('funding')) {
      return { text: "We are currently onboarding strategic partners. We have 3 MVPs live and over 10k waitlist users. View our pitch deck info here.", path: '/investors', label: "Investor Info" };
    }
    if (lower.includes('contact') || lower.includes('hire') || lower.includes('email') || lower.includes('phone')) {
      return { text: "You can reach us at oliskeylee@gmail.com or call 09049417103. We are based in Lagos but work globally.", path: '/contact', label: "Contact Us" };
    }

    // --- FALLBACK ---
    return { text: "I can help you navigate our Services, Courses, Portfolio, or Investor information. You can also ask me to 'generate an image' of something." };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate AI Processing Delay (Dynamic)
    const delay = Math.max(1000, Math.floor(Math.random() * 2000));

    setTimeout(() => {
        const result = processQuery(userMsg.text);
        
        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: result.text,
            sender: 'bot',
            timestamp: new Date(),
            actionPath: result.path,
            actionLabel: result.label,
            imageUrl: result.imageUrl
        };
        
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);

        // 3. Auto-Navigation (AI Agent Behavior)
        // Only navigate if path is valid and we aren't already there
        if (result.path && location.pathname !== result.path) {
            setTimeout(() => {
                navigate(result.path!);
            }, 1200); // Slight delay after message so user can read "Navigating..."
        }
    }, delay);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Toggle Button - NOW USES OLISKEY LOGO */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-blue-600 transition-all duration-300 hover:scale-110 relative overflow-hidden"
          aria-label="Open Chat"
        >
          {/* Logo Component as Icon */}
          <div className="relative z-10 group-hover:rotate-12 transition-transform duration-500">
             <Logo showText={false} variant="light" className="h-8 w-8" animated={false} />
          </div>
          
          {/* Notification Dot */}
          <span className="absolute top-3 right-3 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-slate-900"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[90vw] sm:w-[380px] h-[550px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col border border-gray-200 animate-in slide-in-from-bottom-5 fade-in duration-300 overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-2xl rounded-full pointer-events-none"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-lg border border-white/10">
                 <Logo showText={false} variant="light" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1">
                   Oliskey Intelligence <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/30 border border-blue-400/30 text-blue-200 font-medium">BETA</span>
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors relative z-10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden ${
                  msg.sender === 'user' ? 'bg-white border border-gray-200 text-slate-600' : 'bg-slate-900 text-white'
                }`}>
                  {msg.sender === 'user' ? <User size={16} /> : <Logo showText={false} variant="light" className="h-5 w-5" />}
                </div>
                
                <div className={`flex flex-col items-start max-w-[85%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
                    <div 
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-100 text-slate-700 rounded-tl-none'
                    }`}
                    >
                        {msg.text}
                        
                        {/* Render Generated Image */}
                        {msg.imageUrl && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative group">
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm z-10 flex items-center gap-1">
                                    <Sparkles size={10} /> AI Generated
                                </div>
                                <img 
                                    src={msg.imageUrl} 
                                    alt="AI Generated Content" 
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Action Button/Link if provided by Bot */}
                    {msg.sender === 'bot' && msg.actionPath && (
                        <div className="mt-1.5 ml-1">
                            {msg.actionLabel ? (
                                <button 
                                    onClick={() => navigate(msg.actionPath!)}
                                    className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                                >
                                    {msg.actionLabel} <ChevronRight size={12} />
                                </button>
                            ) : (
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <ExternalLink size={10} /> Navigating...
                                </span>
                            )}
                        </div>
                    )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                  <Logo showText={false} variant="light" className="h-5 w-5" />
                </div>
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                   <div className="flex gap-1">
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type 'draw a car' or 'go to services'..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-slate-900/10"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex justify-center mt-2 gap-3">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Sparkles size={8} /> Powered by Oliskey GenAI
                </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;