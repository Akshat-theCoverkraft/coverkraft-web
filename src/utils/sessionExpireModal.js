import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: -10 }
};

const SessionExpiredModal = ({ visible, onConfirm }) => {
  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
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
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            style={{
              background: '#121212',
              padding: '24px',
              borderRadius: '8px',
              textAlign: 'center',
              width: '600px',
              border: "1px solid rgb(90, 89, 89)",
              boxShadow: '0px 8px 30px rgba(0,0,0,0.3)'
            }}
          >
            <h3 style={{ marginBottom: '16px', fontSize: '2rem', fontWeight: 600 }}>Session Expired</h3>
            <p style={{ marginBottom: '24px', fontSize: '1.6rem', fontWeight: 400 }}>
              Your session has expired. Please log in again.
            </p>
            <button
              onClick={onConfirm}
              style={{
                padding: '6px 20px',
                backgroundColor: '#8AC642',
                fontSize: '1.8rem',
                fontWeight: 500,
                color: '#fff',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                width: '25%',
              }}
            >
              OKAY
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SessionExpiredModal;
