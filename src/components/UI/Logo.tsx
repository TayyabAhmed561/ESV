import React from 'react';
import { Leaf, Eye, MapPin } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'compact' | 'icon-only';
  className?: string;
}

/**
 * A beautiful logo component for ESV (Endangered Species Visualizer).
 * Features a leaf and eye symbol representing conservation and visualization.
 */
const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const containerClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };

  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative group">
          {/* Main leaf icon */}
          <Leaf className={`${iconSizes[size]} text-emerald-600 transition-transform duration-300 group-hover:scale-110`} />
          {/* Eye overlay for visualization */}
          <Eye className={`${iconSizes[size]} text-blue-600 absolute inset-0 opacity-60 transition-all duration-300 group-hover:opacity-80`} />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center ${containerClasses[size]} ${className} group`}>
        <div className="relative">
          <Leaf className={`${iconSizes[size]} text-emerald-600 transition-transform duration-300 group-hover:scale-110`} />
          <Eye className={`${iconSizes[size]} text-blue-600 absolute inset-0 opacity-60 transition-all duration-300 group-hover:opacity-80`} />
        </div>
        <div className="flex flex-col">
          <span className={`font-bold text-gray-900 ${sizeClasses[size]} transition-colors duration-300 group-hover:text-emerald-700 tracking-wide`}>ESV</span>
          <span className={`text-xs text-gray-600 -mt-1 transition-colors duration-300 group-hover:text-gray-700 font-medium`}>Species Visualizer</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${containerClasses[size]} ${className} group`}>
      {/* Logo Symbol */}
      <div className="relative">
        <Leaf className={`${iconSizes[size]} text-emerald-600 transition-transform duration-300 group-hover:scale-110`} />
        <Eye className={`${iconSizes[size]} text-blue-600 absolute inset-0 opacity-60 transition-all duration-300 group-hover:opacity-80`} />
      </div>
      
      {/* Text Content */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className={`font-bold text-gray-900 ${sizeClasses[size]} transition-colors duration-300 group-hover:text-emerald-700`}>ESV</span>
          <span className={`text-xs text-gray-500 ${sizeClasses[size]}`}>(Endangered Species Visualizer)</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700">Ontario Conservation</span>
        </div>
      </div>
    </div>
  );
};

export default Logo; 