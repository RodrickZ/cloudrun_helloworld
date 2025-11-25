import React, { useState } from 'react';
import { generateDeploymentDocs } from '../services/geminiService';

export const DeploymentAssistant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setDocs(null);
    try {
      const result = await generateDeploymentDocs();
      setDocs(result);
    } catch (e) {
      setDocs("An error occurred while generating documentation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Cloud Run Deployment Kit</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Generate a production-ready <code>Dockerfile</code> and <code>deploy.sh</code> script.
          <br />
          <span className="text-indigo-400 text-sm">Now includes fixes for the PORT 8080 listening error.</span>
        </p>
      </div>

      {!docs && (
        <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-slate-800/20 to-slate-900/20 border border-slate-700 border-dashed rounded-3xl backdrop-blur-sm">
            {loading ? (
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <span className="text-2xl">✨</span>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-white font-medium text-lg">Designing Architecture...</p>
                        <p className="text-slate-500 text-sm">Configuring Nginx & Cloud Build</p>
                    </div>
                </div>
            ) : (
                <div className="text-center px-4">
                    <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl ring-1 ring-slate-700">
                        <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <button 
                        onClick={handleGenerate}
                        className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-2xl shadow-indigo-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                           <span>Generate Scripts</span>
                           <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                           </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    <p className="mt-6 text-xs text-slate-500">
                        Generates a Dockerfile (Nginx port 8080) and deploy.sh
                    </p>
                </div>
            )}
        </div>
      )}

      {docs && (
        <div className="space-y-4">
             <div className="flex justify-between items-center px-2">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                    Instructions
                 </h3>
                 <button 
                    onClick={() => setDocs(null)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                    Start Over
                </button>
             </div>
            
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-6 md:p-8 overflow-x-auto">
                    <div className="prose prose-invert prose-indigo max-w-none">
                        <pre className="font-mono text-sm leading-relaxed text-slate-300 bg-transparent p-0 border-0">
                            {docs}
                        </pre>
                    </div>
                </div>
                <div className="bg-slate-800/80 px-6 py-4 border-t border-slate-700 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                         <div className="p-1 bg-yellow-500/10 rounded-lg">
                            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                         </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white">Deployment Checklist</h4>
                            <p className="text-xs text-slate-400 mt-1">
                                1. Ensure <code>npm run build</code> is run before deploying.<br/>
                                2. Ensure your Dockerfile has the <code>sed</code> command to listen on port 8080.<br/>
                                3. Make sure you are authenticated with <code>gcloud auth login</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};