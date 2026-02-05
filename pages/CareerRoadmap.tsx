import React, { useState, useEffect } from 'react';
import {
    Zap,
    Cpu,
    Globe,
    TrendingUp,
    ShieldCheck,
    ArrowRight,
    Rocket,
    Atom,
    Binary,
    Layers,
    ChevronRight,
    Sparkles,
    Bot,
    Network,
    Activity,
    ShieldAlert,
    Coins,
    Medal,
    Terminal,
    Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerRoadmap: React.FC = () => {
    const [activeTrack, setActiveTrack] = useState<'software' | 'hardware'>('software');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const completedLessons = JSON.parse(localStorage.getItem('oliskey_progress') || '[]');
    const isAgenticAIInProgress = completedLessons.length > 0;
    const isAgenticAICompleted = completedLessons.length >= 8; // Total 8 modules in hub

    const softwareCourses = [
        {
            title: "Agentic AI Architect",
            provider: "AWS / Microsoft",
            cert: "AWS 'Agentic AI' Microcredential",
            rating: 5,
            description: "Moving from Generative AI to Agentic AI. Orchestrating multi-agent systems using Amazon Bedrock and Model Context Protocol (MCP).",
            monetization: "AAA (AI Automation Agency): Selling digital workers to SMBs.",
            modules: ["Multi-Agent Orchestration", "MCP Integration", "Bedrock Agents"],
            color: "blue",
            futureSkill: "Vibe Coding (Natural Language App Dev)"
        },
        {
            title: "Hybrid Automation Dev",
            provider: "Microsoft",
            cert: "Power Platform Developer (PL-400)",
            rating: 4,
            description: "Merging low-code and pro-code for enterprise automation. Building internal tools that bridge legacy systems with AI agents.",
            monetization: "Building custom automation stacks for mid-market enterprises.",
            modules: ["Pro-Code/Low-Code Hybrid", "Azure AI Orchestrator", "PL-400 Essentials"],
            color: "indigo",
            futureSkill: "Natural Language Logic Mapping"
        },
        {
            title: "Quantum-Safe Architect",
            provider: "IBM / Google",
            cert: "IBM Certified Associate - Qiskit",
            rating: 5,
            description: "Securing systems against quantum decryptors using post-quantum algorithms and lattice-based cryptography.",
            monetization: "High-ticket consulting for government and financial security.",
            modules: ["PQC Algorithms", "Qiskit Dev", "Quantum Error Correction"],
            color: "cyan",
            futureSkill: "Neural Cryptography"
        }
    ];

    const hardwareCourses = [
        {
            title: "Edge AI VLSI Engineer",
            provider: "Intel / NVIDIA",
            cert: "Intel AI for Future Workforce",
            rating: 5,
            description: "Designing specialized ASICs and neuromorphic chips (like Loihi) for extreme energy efficiency at the edge.",
            monetization: "Freelance RTL coding and FPGA verification on global platforms.",
            modules: ["OpenRoad PDK (Sky130)", "Neuromorphic Design", "Verilog/SystemVerilog"],
            color: "orange",
            futureSkill: "Neuromorphic Spiking Neural Nets"
        },
        {
            title: "Embedded IoT Specialist",
            provider: "ARM / NVIDIA",
            cert: "NVIDIA Jetson AI Specialist",
            rating: 5,
            description: "Building the 'eyes and ears' of industry using Jetson Nano and ARM Cortex-M architecture for real-time inference.",
            monetization: "Industrial automation contracts and smart city hardware design.",
            modules: ["Jetson/CUDA Optimization", "Real-time IoT Firmware", "Sensor Fusion"],
            color: "amber",
            futureSkill: "Bio-mimetic Soft Robotics"
        },
        {
            title: "Spatial Computing Architect",
            provider: "Apple / Meta",
            cert: "Apple Vision Pro/RealityKit Cert",
            rating: 4,
            description: "Designing industrial digital twins and spatial UX for the next generation of MR/AR hardware interfaces.",
            monetization: "Creating high-end spatial training modules for manufacturing.",
            modules: ["RealityKit / Swift", "Spatial UX Archetypes", "Lidar Mesh Integrity"],
            color: "emerald",
            futureSkill: "Neurolink Contextual Interfaces"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden pt-20">
            {/* Hero Section */}
            <section className="relative py-20 px-4">
                {/* Background Accents */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                    <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="glass-morphism p-8 md:p-12 rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl shadow-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <Sparkles size={14} /> The Siliconomy 2026–2030
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                                    2030 Tech Workforce <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-2xl sm:text-3xl md:text-5xl lg:text-6xl">Dual-Track Strategy.</span>
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
                                    Beyond Generative AI. Master the convergence of <span className="text-blue-600 font-bold">Autonomous Agents</span> and <span className="text-emerald-500 font-bold">Specialized Physics-based Hardware</span>.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                        <Medal className="text-blue-500" size={18} />
                                        <span className="text-sm font-bold opacity-80">AWS/MS Certified Tracks</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                        <Coins className="text-emerald-500" size={18} />
                                        <span className="text-sm font-bold opacity-80">AAA Monetization Ready</span>
                                    </div>
                                </div>
                            </div>

                            {/* Forecast Table */}
                            <div className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-6 border border-white/50 dark:border-slate-800 shadow-inner">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Market Shifts (Strategic Foresight)</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "Agentic AI Orchestration", value: "+450%", detail: "From Chatbots to Autonomous Execs" },
                                        { label: "ASIC & Edge Hardware", value: "+310%", detail: "AI Energy Crisis Response" },
                                        { label: "Spatial & Sustainable Comp", value: "+180%", detail: "RealityKit & GreenOps Convergence" },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-50 dark:border-slate-700/50">
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-sm">{row.label}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{row.detail}</div>
                                            </div>
                                            <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                                                {row.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dual Track Switcher */}
            <section className="py-20 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Select Your Convergence Track</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        The highest paid 2030 profiles combine ONE hardware skill (Atoms) with ONE software skill (Bits).
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative flex p-1 bg-gray-100 dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 w-full max-w-sm sm:max-w-md mb-12 sm:mb-16">
                        <button
                            onClick={() => setActiveTrack('software')}
                            className={`relative z-10 flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.8rem] text-sm font-bold transition-all duration-500 ${activeTrack === 'software' ? 'text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Binary size={16} className="flex-shrink-0" /> <span className="truncate">Bits (Software)</span>
                        </button>
                        <button
                            onClick={() => setActiveTrack('hardware')}
                            className={`relative z-10 flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-[1.8rem] text-[11px] sm:text-sm font-bold transition-all duration-500 ${activeTrack === 'hardware' ? 'text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Atom size={16} className="flex-shrink-0" /> <span className="truncate">Atoms (Hardware)</span>
                        </button>

                        {/* Sliding Highlight */}
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[1.8rem] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-lg ${activeTrack === 'software'
                                ? 'left-1 bg-gradient-to-r from-blue-600 to-indigo-600'
                                : 'left-[calc(50%+2px)] bg-gradient-to-r from-orange-500 to-amber-500'
                                }`}
                        ></div>
                    </div>

                    {/* Track Content Grid */}
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(activeTrack === 'software' ? softwareCourses : hardwareCourses).map((course, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl bg-${course.color}-50 dark:bg-${course.color}-900/20 text-${course.color}-600 dark:text-${course.color}-400`}>
                                        <Terminal size={24} />
                                    </div>
                                    <div className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                        {course.provider}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Industry Track</span>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                            {course.title}
                                        </h3>
                                        {course.title === "Agentic AI Architect" && (
                                            <>
                                                {isAgenticAICompleted ? (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/50">
                                                        <CheckCircle size={10} /> Completed
                                                    </span>
                                                ) : isAgenticAIInProgress ? (
                                                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800/50 animate-pulse">
                                                        In Progress
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <Medal size={12} className="text-orange-400" /> Target Cert
                                    </p>
                                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                                        {course.cert}
                                    </p>
                                </div>

                                <div className="mb-6 border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">2030 Workforce Delta</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                        "{course.description}"
                                    </p>
                                </div>

                                {/* Monetization Strategy */}
                                <div className="mb-6">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <Coins size={12} /> Monetization Strategy
                                    </p>
                                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-900/10 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/20">
                                        {course.monetization}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-8 flex-grow">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Core Competencies</p>
                                        <div className="flex flex-wrap gap-2">
                                            {course.modules.map((module, i) => (
                                                <span key={i} className="text-[9px] font-bold px-2 py-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-md text-slate-500">
                                                    {module}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">2030 Skill Stack Expansion</p>
                                        <p className="text-[10px] font-black text-blue-500">
                                            + {course.futureSkill}
                                        </p>
                                    </div>
                                </div>

                                {/* Audit Badge Section */}
                                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900 transition-all group-hover:bg-emerald-500 group-hover:text-white duration-500">
                                        <ShieldCheck size={20} className="text-emerald-500 group-hover:text-white transition-colors" />
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest">2030 Audit Badge</div>
                                            <div className="text-[10px] font-bold opacity-80">R&D Resilience Verified</div>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to="/learning-hub"
                                    className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white dark:bg-blue-600 font-bold text-xs hover:scale-[1.02] transition-all shadow-lg active:scale-95"
                                >
                                    Launch Strategy Track <ArrowRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Skills Taxonomy Section */}
            <section className="py-20 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
                {/* Animated Background Gradients */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] -mr-64 -mt-64"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[150px] -ml-64 -mb-64"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block px-4 py-1 rounded-full border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                            Taxonomy 2.0
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">The <span className="text-blue-500">Siliconomy</span> <br /> Competency Matrix.</h2>
                        <p className="text-slate-400 mb-10 text-lg leading-relaxed max-w-xl">
                            We bridge the gap between human intuition and machine execution. Our 2030 matrix focuses on "The Convergence"—where software logic meets physical fabrication.
                        </p>

                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                                    <Binary size={16} /> Bits Evolution
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { skill: "Multi-Agent Orchestration", level: "Critical" },
                                        { skill: "MCP / Bedrock Native Dev", level: "High" },
                                        { skill: "Neural Cryptography", level: "Strategic" }
                                    ].map((s, i) => (
                                        <div key={i} className="group cursor-default">
                                            <div className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{s.skill}</div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase">{s.level} Priority</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-orange-400 flex items-center gap-2">
                                    <Atom size={16} /> Atoms Renaissance
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { skill: "Neuromorphic IC Design", level: "Critical" },
                                        { skill: "Edge AI / CUDA Optimization", level: "High" },
                                        { skill: "Bio-mimetic Soft Robotics", level: "Emerging" }
                                    ].map((s, i) => (
                                        <div key={i} className="group cursor-default">
                                            <div className="text-sm font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{s.skill}</div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase">{s.level} Priority</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 max-w-lg">
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                "The 2030 premium profile is no longer just a 'Coder'. It's a Strategist who understands how to orchestrate a swarm of agents (Software) to optimize a neuromorphic edge-node (Hardware)."
                            </p>
                        </div>
                    </div>

                    <div className="relative lg:block hidden">
                        <div className="aspect-square bg-blue-600/10 rounded-[3rem] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-600/20"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-32 h-32 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center mb-8 border border-white/20 shadow-2xl animate-bounce-slow">
                                    <Rocket size={54} className="text-white" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-black tracking-tight mb-2">Ready to Converge?</h3>
                                    <span className="text-xs font-black tracking-[0.2em] uppercase text-blue-400">Launch Your 2030 Career</span>
                                </div>
                            </div>

                            {/* Decorative nodes */}
                            <div className="absolute top-20 right-20 w-8 h-8 bg-blue-500/30 rounded-full blur-xl"></div>
                            <div className="absolute bottom-20 left-20 w-12 h-12 bg-emerald-500/30 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        .glass-morphism {
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default CareerRoadmap;
