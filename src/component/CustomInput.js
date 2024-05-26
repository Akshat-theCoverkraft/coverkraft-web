// import React from 'react';

// function CustomInput({ type,label, value, onChange,isValid,className, placeholder, onKeyDown,validationMessage ,required}) {
//   return (
//     <div data-mdb-input-init className="form-outline mb-4">
//       <label className="form-label fw-bold" htmlFor="inputField">
//         {label} {required && <span className='text-danger'>*</span>}
//       </label>
//       <input
//         type={type}
//         id="inputField"
//         className={`form-control form-control-lg ${className} `}
//         value={value}
//         onChange={onChange}
//         onKeyDown={onKeyDown}
//         placeholder={placeholder}
//         style={{padding:'28px 15px'}}

//       />
//        {validationMessage && (
//         <div className="invalid-feedback">{validationMessage}</div>
//       )}
//     </div>
//   );
// }


// export default CustomInput;


import React from 'react';

function CustomInput({ type, label, value, onChange, isValid, className, placeholder, onKeyDown, validationMessage, required, name, children }) {
  const inputId = `inputField-${name}`;
  return (
    <div data-mdb-input-init className="form-outline mb-4">
      <label className="form-label fw-bold" htmlFor="inputField">
        {label} {required && <span className='text-danger'>*</span>}
      </label>
      {type === 'select' ? (
        <select
          id={inputId}
          className={`form-control form-control-lg ${className} `}
          value={value}
          onChange={onChange}
          name={name}
          style={{ padding: '28px 15px' }}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          id="inputField"
          className={`form-control form-control-lg ${className} `}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={{ padding: '28px 15px' }}
        />
      )}
      {validationMessage && (
        <div className="invalid-feedback">{validationMessage}</div>
      )}
    </div>
  );
}

export default CustomInput;
