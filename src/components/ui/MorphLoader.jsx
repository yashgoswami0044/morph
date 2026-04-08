import React from 'react';

/**
 * MorphLoader — inline SVG stroke animation of the Morph logo mark.
 * No external file import needed; safe for Vite production builds.
 */
const MorphLoader = ({ size = 80 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Math.round(size * (32 / 38))}
      fill="none"
      viewBox="0 0 38 32"
    >
      <style>{`
        @keyframes morphDraw {
          0%   { stroke-dashoffset: 170.46; }
          100% { stroke-dashoffset: 0; }
        }
        .morph-path {
          stroke-dasharray: 170.46px;
          stroke-dashoffset: 170.46px;
          animation: morphDraw 0.85s ease-in-out infinite alternate;
        }
      `}</style>
      <defs>
        {/* <linearGradient id="morphGrad" x1="1.5" y1="-1.774" x2="28.5" y2="31.227" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A88944" />
          <stop offset="1" stopColor="#D4A853" />
        </linearGradient> */}
        <linearGradient id="morphGrad" x1="1.5" y1="-1.774" x2="28.5" y2="31.227" gradientUnits="userSpaceOnUse">
          <stop stopColor="#710f1c" />
          <stop offset="1" stopColor="#e31c24" />
        </linearGradient>
      </defs>
      <path
        className="morph-path"
        d="M17.029 18.227h15c1.167 0 3.6-.7 4-3.5.5-3.5-8-12.5-12-7.5-3.2 4-9.667 14-12.5 18.5-1 1.166-3.7 2.3-6.5-2.5-1.5-2-1-4.5 3-4.5h6.5l2 .5 4.5 2c2.833 1.333 7.6 4.5 4 6.5-2 1-6 5-8-.5-.4-1.6-.167-5 0-6.5l-1-4v-8.5c.167-3.334-1.2-9.3-8-6.5-7.5 3.5-10 6.5-2.5 10.5 6 3.2 10.167 5.333 11.5 6Z"
        stroke="url(#morphGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MorphLoader;
