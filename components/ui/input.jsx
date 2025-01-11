import React from 'react';

export function Input({ type = 'text', className, ...props }) {
  return (
    <input
      type={type}
      className={`block w-full px-4 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
}
