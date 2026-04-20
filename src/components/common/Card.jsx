import React from 'react';

export default function Card({ children, className = '', hover, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 p-6 ${hover ? 'hover:shadow-md hover:border-slate-200 transition-all duration-300 cursor-pointer' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}