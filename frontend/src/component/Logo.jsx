import React from 'react'

const Logo = ({ w = 120, h = 40 }) => {
  return (
    <div className="flex items-center gap-1 cursor-pointer">
      {/* SVG Shopping/Flame Icon */}
      <svg 
        width={w} 
        height={h} 
        viewBox="0 0 100 100" 
        className="overflow-visible flex-shrink-0"
      >
        {/* Shopping Cart Base & Wheels */}
        <path 
          d="M20 40 L30 70 L75 70 L85 40 Z" 
          fill="none" 
          stroke="#292929" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="35" cy="82" r="6" fill="#dc2626" />
        <circle cx="70" cy="82" r="6" fill="#dc2626" />
        
        {/* Handle */}
        <path 
          d="M10 25 L22 40" 
          fill="none" 
          stroke="#dc2626" 
          strokeWidth="6" 
          strokeLinecap="round"
        />

        {/* Flame on top */}
        <path 
          d="M45 40 Q55 10 40 2 Q65 15 60 40 Z" 
          fill="#dc2626" 
        />
      </svg>
      
      {/* Brand Text - pulled close to icon */}
      <div className="flex flex-col -ml-13 justify-center">
        <span className="font-bold text-base tracking-tight text-slate-800 leading-none">
          Johnnyc'<span className="text-red-600">Blaze</span>
        </span>
        <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-0.5">
          Shopping HUB
        </span>
      </div>
    </div>
  )
}

export default Logo