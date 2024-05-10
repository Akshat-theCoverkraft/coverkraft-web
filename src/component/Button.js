import React from 'react';

function Button({ onClick, bgcolor, text, color, borderColor, className, size, block, startIcon }) {
  const buttonStyle = {
    backgroundColor: bgcolor || '#42988E', 
    color: color ?? 'white',
    borderColor: borderColor,
    width: block ? '100%' : '', // Set width to 100% if block prop is true
    display: 'flex', // Ensure content is displayed flexibly
    alignItems: 'center', // Align content vertically
    justifyContent: startIcon ? 'space-between' : 'center', // Space between if startIcon exists
    padding: '15px 20px', // Adjust padding for better icon positioning

  };

  return (
    <button
      type="button"
      className={`btn btn-lg ${size ? `btn-${size}` : ''} ${block ? 'w-100' : ''}  text-white ${className}`}
      style={buttonStyle}
      onClick={onClick}

    >
      {startIcon && <img src={startIcon} height={20} alt="Start Icon" style={{ marginRight: '10px' }} />} {/* Render startIcon if it exists */}
      {text}
    </button>
  );
}

export default Button;
