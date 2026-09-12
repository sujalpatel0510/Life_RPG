import React from 'react';

export interface FloatingTextItem {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
}

interface FloatingCombatTextProps {
  items: FloatingTextItem[];
}

export const FloatingCombatText: React.FC<FloatingCombatTextProps> = ({ items }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute animate-float-up-enhanced font-fantasy font-black text-sm sm:text-base tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            color: item.color,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};