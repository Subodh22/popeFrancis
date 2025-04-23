"use client";

import { useState } from "react";
import Image from "next/image";

export default function PopeImage() {
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);
  
  return (
    <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-yellow-400">
      <Image 
        src={fallbackSrc || "/pope-francis.jpg"} 
        alt="Pope Francis" 
        width={48}
        height={48}
        className="w-full h-full object-cover"
        onError={() => {
          setFallbackSrc("https://www.vatican.va/content/dam/francesco/images/ritratto/ritratto-ufficiale-papa-francesco.jpg");
        }}
      />
    </div>
  );
} 