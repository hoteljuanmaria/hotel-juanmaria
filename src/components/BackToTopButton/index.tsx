"use client";

import React from "react";

interface BackToTopButtonProps {
  text: string;
  enableAnimations?: boolean;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({ 
  text, 
  enableAnimations = true 
}) => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="text-center mt-12">
      <button
        onClick={handleScrollToTop}
        className="relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-8 py-4"
      >
        <span className="relative z-10 flex items-center justify-center text-white">
          {text}
          <div className="ml-2 w-2 h-2 bg-white/70 rounded-full group-hover:bg-white transition-colors duration-300" />
        </span>

        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        {enableAnimations && (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Shimmer effects */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute top-1 right-2 w-1 h-3 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse" />
              <div
                className="absolute bottom-1 left-3 w-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </>
        )}
      </button>
    </div>
  );
};