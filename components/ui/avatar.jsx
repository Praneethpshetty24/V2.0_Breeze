import React from 'react';

export function Avatar({ className, ...props }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 ${className}`}
      {...props}
    />
  );
}

export function AvatarImage({ src, alt, className, ...props }) {
  return (
    <img
      src={src}
      alt={alt || 'Avatar'}
      className={`w-full h-full rounded-full object-cover ${className}`}
      {...props}
    />
  );
}

export function AvatarFallback({ children, className, ...props }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-400 text-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
