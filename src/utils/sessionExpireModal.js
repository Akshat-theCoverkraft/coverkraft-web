import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SessionExpiredRedirect = ({ visible }) => {
  const navigate = useNavigate();
  const location = useLocation(); // get current page

  useEffect(() => {
    if (visible) {
      // Redirect to login and store previous page in state
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [visible, navigate, location.pathname]);

  return null; // nothing rendered
};

export default SessionExpiredRedirect;
