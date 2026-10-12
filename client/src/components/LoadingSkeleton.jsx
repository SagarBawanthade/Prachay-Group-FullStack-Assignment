import React from 'react';

export const LoadingSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-4 animate-pulse p-4 w-full text-left">
      {/* Header bar skeleton */}
      <div className="h-8 bg-slate-200/80 dark:bg-slate-800 rounded-xl w-1/3"></div>
      
      {/* Metric cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200/70 dark:bg-slate-800 rounded-xl"></div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="space-y-2 pt-4">
        <div className="h-10 bg-slate-200/60 dark:bg-slate-800 rounded-lg"></div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};
