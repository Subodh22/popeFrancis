"use client";

import * as React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function Avatar({ className = "", children, ...props }: AvatarProps) {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

export function AvatarImage({ src, alt = "", ...props }: AvatarImageProps) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className="h-full w-full object-cover object-center" 
      {...props}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function AvatarFallback({ children, ...props }: AvatarFallbackProps) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-700"
      {...props}
    >
      {children}
    </div>
  );
} 