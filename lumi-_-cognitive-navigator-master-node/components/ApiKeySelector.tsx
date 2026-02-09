import React, { useEffect, useState } from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
      if (selected) {
        onKeySelected();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success as per instructions to mitigate race condition
      setHasKey(true);
      onKeySelected();
    }
  };

  if (loading) return null;

  if (hasKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-8 max-w-md w-full shadow-2xl text-center">
        <div className="mb-6 flex justify-center text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 serif-font">Authentication Required</h2>
        <p className="text-slate-400 mb-6">
          To access the High Court of the Dharmata Bardo visualizer, you must provide a valid API Key with billing enabled.
        </p>
        
        <button
          onClick={handleSelectKey}
          className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md transition-all flex items-center justify-center gap-2"
        >
          Select Google Cloud API Key
        </button>

        <div className="mt-4 text-xs text-slate-500">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 underline">
                Review Billing Documentation
            </a>
        </div>
      </div>
    </div>
  );
};