import React from 'react';

interface MascotProps {
  state: 'idle' | 'happy' | 'thinking' | 'confused';
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ state, className = "w-32 h-32" }) => {
  // Simple color palette for the mascot
  const primary = "#2dd4bf"; // mint-400
  const secondary = "#5eead4"; // mint-300
  const cheek = "#fca5a5"; // red-300
  
  return (
    <div className={`${className} transition-all duration-500 animate-float`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body - Soft Blob Shape */}
        <path d="M100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20Z" fill={secondary} fillOpacity="0.2"/>
        <path d="M100 30C61.3401 30 30 61.3401 30 100C30 138.66 61.3401 170 100 170C138.66 170 170 138.66 170 100C170 61.3401 138.66 30 100 30Z" fill="white"/>
        
        {/* Medical Cross (Subtle) */}
        <path d="M100 50V70" stroke={primary} strokeWidth="8" strokeLinecap="round"/>
        <path d="M90 60H110" stroke={primary} strokeWidth="8" strokeLinecap="round"/>

        {/* Eyes */}
        <g className="transition-all duration-300">
           {state === 'thinking' ? (
             <>
                <path d="M70 100H90" stroke="#334155" strokeWidth="6" strokeLinecap="round"/>
                <path d="M110 100H130" stroke="#334155" strokeWidth="6" strokeLinecap="round"/>
             </>
           ) : state === 'confused' ? (
             <>
               <circle cx="80" cy="100" r="6" fill="#334155"/>
               <path d="M115 95L125 105M125 95L115 105" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
             </>
           ) : (
             <>
               <circle cx="75" cy="100" r="8" fill="#334155"/>
               <circle cx="125" cy="100" r="8" fill="#334155"/>
               {/* Shine in eyes */}
               <circle cx="78" cy="97" r="3" fill="white"/>
               <circle cx="128" cy="97" r="3" fill="white"/>
             </>
           )}
        </g>

        {/* Mouth */}
        <path 
          d={
            state === 'happy' ? "M85 120C85 120 92.5 130 100 130C107.5 130 115 120 115 120" :
            state === 'thinking' ? "M90 125C90 125 95 122 100 122C105 122 110 125 110 125" :
            state === 'confused' ? "M90 125C90 125 95 128 100 128C105 128 110 125 110 125" :
            "M90 120C90 120 95 125 100 125C105 125 110 120 110 120"
          } 
          stroke="#334155" 
          strokeWidth="4" 
          strokeLinecap="round" 
          fill="none"
        />

        {/* Cheeks */}
        <circle cx="65" cy="115" r="8" fill={cheek} opacity="0.6" />
        <circle cx="135" cy="115" r="8" fill={cheek} opacity="0.6" />
      </svg>
    </div>
  );
};

export default Mascot;
