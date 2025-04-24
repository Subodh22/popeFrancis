"use client";

import { useState } from "react";
import Image from "next/image";

export default function PopeImage() {
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-yellow-400 flex items-center justify-center bg-white shadow-md">
      {fallbackSrc || imageError ? (
        <img 
          src={fallbackSrc || "/pope-francis-new.jpg"} 
          alt="Pope Francis" 
          className="w-full h-full object-cover object-top"
          onError={() => {
            if (!fallbackSrc) {
              setFallbackSrc("https://www.vatican.va/content/dam/francesco/images/ritratto/ritratto-ufficiale-papa-francesco.jpg");
            } else {
              setImageError(true);
            }
          }}
        />
      ) : (
        <Image 
          src="/pope-francis-new.jpg" 
          alt="Pope Francis" 
          width={56} 
          height={56}
          className="object-cover object-center"
          onError={() => {
            setImageError(true);
          }}
          priority
        />
      )}
    </div>
  );
} 