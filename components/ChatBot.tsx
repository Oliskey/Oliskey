import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronRight, ExternalLink, Image as ImageIcon } from 'lucide-react';
// @ts-ignore
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { useData } from '../context/DataContext';
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
  
  // Refs for AI persistence
  const chatRef = useRef<Chat | null>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);
  
  const { services, courses, portfolio, ecosystem, faqs } = useData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // Initialize AI Client
  useEffect(() => {
    if (!aiRef.current) {
        // @ts-ignore
        const apiKey = process.env.API_KEY;
        if (apiKey) {
            aiRef.current = new GoogleGenAI({ apiKey: apiKey });
        } else {
            console.warn("Gemini API Key is missing.");
        }
    }
  }, []);

  const getSystemInstruction = () => {
    const servicesList = services.map(s => `- ${s.title}: ${s.description}`).join('\n');
    const coursesList = courses.map(c => `- ${c.title} (${c.price}, ${c.level})`).join('\n');
    const projectsList = portfolio.map(p => `- ${p.title} (${p.category})`).join('\n');
    const ecosystemList = ecosystem.map(e => `- ${e.title} (${e.status})`).join('\n');
    const faqsList = faqs.map(f => `Q: ${f.question} A: ${f.answer}`).join('\n');

    return `You are Oliskey's AI Agent. You are helpful, professional, and concise.
You help users navigate the Oliskey platform and answer questions about our products.

Oliskey Vision: Systems that work. Culture that lasts. Creativity that never ends.
We build platforms, education tools, AI services, and media.

CORE IDENTITY & LEADERSHIP:
- Founder & Lead Architect: Oliskey Lee.
- Mission: To bridge the gap between complex engineering and human creativity. Building the infrastructure for the next generation of African innovation.
- Location: Lagos, Nigeria.
- Contact: oliskeylee@gmail.com | 09049417103
- Values: Reliability, Human-centered design, Endless innovation.

HERE IS THE CURRENT SITE DATA:
Services:
${servicesList}

Courses:
${coursesList}

Portfolio Projects:
${projectsList}

Ecosystem Products:
${ecosystemList}

FAQs:
${faqsList}

NAVIGATION PATHS:
- Home: /
- About: /about
- Services: /services
- Courses: /courses
- Portfolio: /portfolio
- Blog: /blog
- Contact: /contact
- Investors: /investors
- App: /app

INSTRUCTIONS:
1. Answer user questions based on the data above.
2. If the user explicitly asks to go to a page or your response implies looking at a specific section, use the 'navigate' tool.
3. If the user asks to generate, draw, or create an image, use the 'create_image' tool.
4. Keep responses short and engaging.
`;
  };

  const initChat = () => {
    if (!aiRef.current) return;

    const navigateTool = {
      name: 'navigate',
      description: 'Navigate the user to a specific path/URL in the application.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          path: {
            type: Type.STRING,
            description: 'The internal route path (e.g., /courses, /contact)',
          },
        },
        required: ['path'],
      },
    };

    const createImageTool = {
      name: 'create_image',
      description: 'Generate an image based on a prompt.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          prompt: {
            type: Type.STRING,
            description: 'The detailed description of the image to generate.',
          },
        },
        required: ['prompt'],
      },
    };

    chatRef.current = aiRef.current.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: getSystemInstruction(),
        tools: [{ functionDeclarations: [navigateTool, createImageTool] }],
      },
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Lazy init chat if not exists
      if (!chatRef.current) {
        initChat();
      }

      if (!chatRef.current || !aiRef.current) {
        // If still null, API key might be missing
        throw new Error("AI not initialized. Check API Key.");
      }

      // 2. Send Message to Model
      let response = await chatRef.current.sendMessage({ message: userMsg.text });
      
      // 3. Handle Function Calls Loop
      while (response.candidates?.[0]?.content?.parts?.some(p => p.functionCall)) {
         const parts = response.candidates[0].content.parts;
         const functionResponseParts = [];

         for (const part of parts) {
            if (part.functionCall) {
                const call = part.functionCall;
                let resultString = "Function executed successfully.";
                
                // --- NAVIGATE TOOL ---
                if (call.name === 'navigate') {
                    const path = call.args['path'] as string;
                    if (path) {
                        // We execute the navigation on the client
                        navigate(path);
                        resultString = `Navigated user to ${path}`;
                    }
                }
                
                // --- CREATE IMAGE TOOL ---
                if (call.name === 'create_image') {
                    const prompt = call.args['prompt'] as string;
                    try {
                        // Use a dedicated image model
                        const imgResponse = await aiRef.current.models.generateContent({
                            model: 'gemini-2.5-flash-image',
                            contents: { parts: [{ text: prompt }] },
                        });
                        
                        // Extract Image
                        let foundImage = false;
                        for (const p of imgResponse.candidates[0].content.parts) {
                            if (p.inlineData) {
                                const base64 = p.inlineData.data;
                                const mimeType = p.inlineData.mimeType;
                                const imageUrl = `data:${mimeType};base64,${base64}`;
                                
                                // Add Image Message to UI immediately
                                setMessages(prev => [...prev, {
                                    id: Date.now().toString(),
                                    text: `I've generated an image for: "${prompt}"`,
                                    sender: 'bot',
                                    timestamp: new Date(),
                                    imageUrl: imageUrl
                                }]);
                                foundImage = true;
                                resultString = "Image generated and displayed to user.";
                            }
                        }
                        if (!foundImage) resultString = "Failed to generate image content.";
                    } catch (err) {
                        console.error("Image gen error", err);
                        resultString = "Error generating image.";
                    }
                }

                functionResponseParts.push({
                    functionResponse: {
                        name: call.name,
                        response: { result: resultString },
                        id: call.id // Important: map response to the call ID
                    }
                });
            }
         }

         // Send the results back to the model so it can formulate a final text response
         if (functionResponseParts.length > 0) {
             response = await chatRef.current.sendMessage(functionResponseParts);
         } else {
             break; // Should not happen if loop condition is true
         }
      }

      // 4. Display Final Text Response
      const text = response.text;
      if (text) {
         setMessages(prev => [...prev, {
             id: Date.now().toString(),
             text: text,
             sender: 'bot',
             timestamp: new Date()
         }]);
      }

    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "I'm having trouble connecting to the Oliskey brain right now. Please try again later.",
          sender: 'bot',
          timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-blue-600 transition-all duration-300 hover:scale-110 relative overflow-hidden"
          aria-label="Open Chat"
        >
          <div className="relative z-10 group-hover:rotate-12 transition-transform duration-500">
             <Logo showText={false} variant="light" className="h-8 w-8" animated={false} />
          </div>
          
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
                   Oliskey Intelligence <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/30 border border-blue-400/30 text-blue-200 font-medium">GEMINI</span>
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
                    
                    {/* Visual Action Indicator for Navigation */}
                    {msg.actionPath && (
                        <div className="mt-1.5 ml-1">
                             <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <ExternalLink size={10} /> Navigating...
                            </span>
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
                placeholder="Ask Oliskey or type 'draw a car'..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-slate-900/10"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex justify-center mt-2 gap-3">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Sparkles size={8} /> Powered by Gemini
                </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;