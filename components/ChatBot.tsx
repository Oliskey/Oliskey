import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Oliskey AI. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Knowledge Base Logic
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! Welcome to Oliskey. What can I build for you today?";
    }
    
    if (lowerQuery.includes('service') || lowerQuery.includes('offer') || lowerQuery.includes('do')) {
      return "We offer AI Solutions, Web & Mobile App Development, Custom Software, and UI/UX Design. You can verify this on our Services page.";
    }

    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('quote')) {
      return "Our pricing depends on the project scope. For courses, prices start at $39.99. For custom development, please email oliskeylee@gmail.com for a quote.";
    }

    if (lowerQuery.includes('course') || lowerQuery.includes('learn') || lowerQuery.includes('teach')) {
      return "We offer courses in Web Development, Python, Flutter, and UI/UX Design. Perfect for beginners and advanced learners.";
    }

    if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('phone') || lowerQuery.includes('reach')) {
      return "You can reach us at oliskeylee@gmail.com or call 09049417103.";
    }

    if (lowerQuery.includes('app')) {
      return "The Oliskey App is available for iOS and Android. It helps developers code smarter with challenges and snippets.";
    }

    if (lowerQuery.includes('invest') || lowerQuery.includes('partner')) {
      return "We are open to strategic partnerships. Please check our Investors page or email oliskeylee@gmail.com.";
    }

    if (lowerQuery.includes('location') || lowerQuery.includes('where')) {
      return "We are headquartered in Lagos, Nigeria, but we serve clients globally.";
    }

    // Default Fallback
    return "I'm not sure about that specific detail. For more complex inquiries, please email our team directly at oliskeylee@gmail.com.";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const responseText = generateResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-blue-600 transition-all duration-300 hover:scale-110"
          aria-label="Open Chat"
        >
          <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
          {/* Notification Dot */}
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[90vw] sm:w-[380px] h-[500px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col border border-gray-200 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-slate-900 p-4 rounded-t-2xl flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center relative">
                <Bot size={18} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm">Oliskey Assistant</h3>
                <p className="text-xs text-slate-300">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user' ? 'bg-gray-200 text-slate-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div 
                  className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-slate-700 shadow-sm rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                   <div className="flex gap-1">
                     <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                     <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              For specific inquiries, email <a href="mailto:oliskeylee@gmail.com" className="underline hover:text-blue-500">oliskeylee@gmail.com</a>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;