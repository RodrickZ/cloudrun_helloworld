import React, { useState } from 'react';

export const HelloWorld: React.FC = () => {
  const [deployed, setDeployed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-fade-in-up">
      {/* Status Indicator */}
      <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        SYSTEM_ONLINE
      </div>

      {/* Main Card */}
      <div className="relative group w-full max-w-lg">
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative flex flex-col items-center bg-slate-900 border border-slate-800 p-10 rounded-xl shadow-2xl overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="z-10 text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                   <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                    Hello <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">World</span>
                </h1>

                <p className="text-slate-400 text-lg">
                    Ready for Serverless Deployment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button 
                        onClick={() => setDeployed(!deployed)}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${deployed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/50' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'}`}
                    >
                        {deployed ? 'Deployment Simulated' : 'Initiate Sequence'}
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center w-full max-w-4xl px-4">
          <Stat label="Latency" value="< 50ms" />
          <Stat label="Uptime" value="99.99%" />
          <Stat label="Region" value="global" />
          <Stat label="Scale" value="Auto" />
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</div>
        <div className="text-slate-200 font-semibold">{value}</div>
    </div>
);