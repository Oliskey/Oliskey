import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 bg-white">
      <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
      <p className="text-sm font-medium animate-pulse">Loading Oliskey...</p>
    </div>
  );
};

export default PageLoader;