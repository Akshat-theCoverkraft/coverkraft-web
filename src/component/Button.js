import React from 'react';

function Button({ onClick, bgcolor, text, color, borderColor, className, size, block, startIcon }) {
  const buttonStyle = {
    backgroundColor: bgcolor || '#8AC642',
    color: color ?? 'white',
    borderColor: borderColor,
    width: block ? '100%' : '',
    display: 'flex',
    alignItems: 'center',
    justifyContent: startIcon ? 'space-between' : 'center',
    padding: '10px 10px',
    borderRadius: '30px',
    fontSize: '14px', // Increase the text size here
  };

  return (
    <button
      type="button"
      className={`btn btn-lg ${size ? `btn-${size}` : ''} ${block ? 'w-100' : ''} text-white ${className}`}
      style={buttonStyle}
      onClick={onClick}
    >
      {startIcon && <img src={startIcon} height={20} alt="Start Icon" style={{ marginRight: '10px' }} />}
      {text}
    </button>
  );
}

export default Button;
