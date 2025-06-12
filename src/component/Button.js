function Button({
  onClick,
  text,
  className = '',
  size = '',
  block = false,
  startIcon,
  disabled = false,
  bgcolor,
  color,
  borderColor,
  width,
  height,
  padding,
  fontSize,
  borderRadius, // Accept via prop
  customStyle = {},
}) {
  const defaultStyle = {
    backgroundColor: bgcolor ?? '#8AC642',
    color: color ?? 'white',
    borderColor: borderColor ?? 'transparent',
    width: block ? '100%' : width ?? 'auto',
    height: height ?? 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: startIcon ? 'space-between' : 'center',
    padding: padding ?? '10px 20px',
    fontSize: fontSize ?? '16px',
    borderRadius: borderRadius ?? '30px', // 👈 Now it's dynamic
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
    transition: 'all 0.2s ease-in-out',
    ...customStyle, // Always allow full override at the end
  };

  return (
    <button
      type="button"
      className={`btn ${size ? `btn-${size}` : ''} ${block ? 'w-100' : ''} ${className}`}
      style={defaultStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && (
        <img
          src={startIcon}
          height={20}
          alt="Start Icon"
          style={{ marginRight: '10px', borderRadius: '5px' }}
        />
      )}
      {text}
    </button>
  );
}
export default Button;