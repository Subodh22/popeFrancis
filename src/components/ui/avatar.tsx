"use client";

import * as React from "react";
import Image from "next/image";

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

interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
  [key: string]: any;
}

export function AvatarImage({ src, alt = "", className, ...props }: AvatarImageProps) {
  return (
    <Image 
      src={src || "/placeholder-avatar.png"}
      alt={alt} 
      width={40}
      height={40}
      className={`h-full w-full object-cover ${className || ""}`}
      {...props} 
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