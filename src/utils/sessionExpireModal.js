import React from 'react';

const SessionExpiredModal = ({ visible, onConfirm }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#3E3E3E',
          padding: '24px',
          borderRadius: '8px',
          textAlign: 'center',
          width: '600px',
          border:"1px solid rgb(90, 89, 89)  "
        }}
      >
        <h3 style={{ marginBottom: '16px',fontSize:'2rem', fontWeight:600 }}>Session Expired</h3>
        <p style={{ marginBottom: '24px', fontSize:'1.6rem', fontWeight:400 }}>
          Your session has expired. Please log in again.
        </p>
        <button
          onClick={onConfirm}
          style={{
            padding: '6px 20px',
            backgroundColor: '#8AC642',  
fontSize:'1.4rem', fontWeight:500,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
