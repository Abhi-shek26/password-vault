import React from 'react';

const Slider: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      type="range"
      {...props}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
    />
  );
};

export default Slider;
