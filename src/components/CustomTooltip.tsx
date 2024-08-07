import React from "react";

interface TooltipProps {
  content: string;
  position: { x: number; y: number };
}

const CustomTooltip: React.FC<TooltipProps> = ({ content, position }) => {
  return (
    <div
      className={`tooltip`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {content}
    </div>
  );
};

export default CustomTooltip;
