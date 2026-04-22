import React from 'react';

export default function Skeleton({ className = '', variant = 'text', width, height }) {
  const baseClass = "bg-slate-200 animate-pulse rounded";
  
  const variantClasses = {
    text: "h-3 w-full mb-2",
    title: "h-5 w-3/4 mb-4",
    circle: "rounded-full",
    rect: "w-full h-full",
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div 
      className={`${baseClass} ${variantClasses[variant] || ''} ${className}`} 
      style={style}
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500">
      <div className="flex gap-4 mb-6">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} variant="rect" height="12px" className="flex-1" />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-4 border-b border-slate-50">
          {[...Array(columns)].map((_, j) => (
            <Skeleton 
              key={j} 
              variant="rect" 
              height="14px" 
              className={`flex-1 ${j === 0 ? 'w-12 flex-none' : ''}`} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}
