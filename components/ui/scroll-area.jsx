import React from 'react';

export function ScrollArea({ children, className, ...props }) {
  return (
    <div
      className={`relative overflow-auto max-h-[300px] border rounded-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
