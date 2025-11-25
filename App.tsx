import React, { useState } from 'react';
import { HelloWorld } from './components/HelloWorld';
import { DeploymentAssistant } from './components/DeploymentAssistant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'app' | 'deploy'>('app');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight">CloudRun<span className="text-indigo-400">Ready</span></span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('app')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'app' 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Application
              </button>
              <button
                onClick={() => setActiveTab('deploy')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'deploy' 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Deploy
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
         {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[128px]"></div>
        </div>

        <div className="relative w-full max-w-4xl">
          {activeTab === 'app' ? <HelloWorld /> : <DeploymentAssistant />}
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 bg-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Cloud Run Ready App. Powered by React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;