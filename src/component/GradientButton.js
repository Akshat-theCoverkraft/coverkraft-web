import React from "react";

function GradientButton({
  onClick,
  text,
  className,
  size,
  block,
  startIcon,
  style = {},
}) {
  const defaultStyle = {
    background: "linear-gradient(122.01deg, #1DB1BB 7.48%, #B6E597 86.54%)",
    color: "white",
    borderColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: startIcon ? "center" : "center",
    padding: "9px 10px",
    borderRadius: "30px",
    border: "none",
    fontSize: "1.6rem",
    fontWeight: "bold",
  };

  return (
    <button
      type="button"
      className={` btn-lg ${size ? `btn-${size}` : ""} ${
        block ? "w-100" : ""
      } ${className || ""}`}
      style={{ ...defaultStyle, ...style }}
      onClick={onClick}
    >
      {startIcon && (
        <img
          src={startIcon}
          height={20}              // <<< SMALL ICON
          width={20}               // keeps it perfectly square
          alt="Start Icon"
          style={{ marginRight: "6px" }} // small spacing
        />
      )}
      {text}
    </button>
  );
}

export default GradientButton;



// import React from "react";

// function GradientButton({ onClick, text, className, size, block, startIcon }) {
//   const buttonStyle = {
//     background: "linear-gradient(122.01deg, #1DB1BB 7.48%, #B6E597 86.54%)", // Gradient background
//     color: "white",
//     borderColor: "transparent", // Optional: you can customize or remove this
//     // width: block ? "100%" : "",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: startIcon ? "space-evenly" : "center",
//     padding: "12px 10px",
//     borderRadius: "30px",
//     border: "none", // Ensure border is removed if not needed
//     fontSize: "1.6rem",
//     fontWeight: "bold",
//     height: "8%"
    
//   };

//   return (
//     <button
//       type="button"
//       className={`btn btn-lg ${size ? `btn-${size}` : ""} ${block ? "w-100" : ""
//         } ${className}`}
//       style={buttonStyle}
//       onClick={onClick}
//     >
//       {startIcon && (
//         <img src={startIcon} height={16} alt="Start Icon" style={{}} />
//       )}
//       {text}
//     </button>
//   );
// }

// export default GradientButton;
