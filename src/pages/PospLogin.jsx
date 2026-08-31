import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import API_URL from "../ServiceModule/Service";
import Loader from "../component/Loader";
import "./PospLogin.css";

const POSP_LOGIN_ENDPOINT = "user/posp-login-url";

const PospLogin = () => {
  const navigate = useNavigate();
  const [loginUrl, setLoginUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [frameLoading, setFrameLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPospLoginUrl = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    setLoading(true);
    setErrorMessage("");
    setLoginUrl("");

    if (!userId || !token) {
      toast.error("Please login again to access POSP.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}${POSP_LOGIN_ENDPOINT}`, {
        params: { _id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData = response?.data;
      const nextLoginUrl = responseData?.loginUrl;

      if (responseData?.status && responseData?.pospLogin && nextLoginUrl) {
        setFrameLoading(true);
        setLoginUrl(nextLoginUrl);
      } else {
        setErrorMessage(
          responseData?.message || "POSP login is not available for this account."
        );
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to open POSP login. Please try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPospLoginUrl();
  }, [fetchPospLoginUrl]);

  return (
    <main className="posp-login-page">
      <header className="posp-login-header">
        <button
          type="button"
          className="posp-icon-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          title="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1>POSP Login</h1>
        <button
          type="button"
          className="posp-icon-button"
          onClick={fetchPospLoginUrl}
          aria-label="Retry"
          title="Retry"
          disabled={loading}
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <section className="posp-login-content">
        {loading ? (
          <div className="posp-centered">
            <Loader />
          </div>
        ) : null}

        {!loading && errorMessage ? (
          <div className="posp-centered">
            <p>{errorMessage}</p>
            <button type="button" className="posp-retry-button" onClick={fetchPospLoginUrl}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !errorMessage && loginUrl ? (
          <>
            {frameLoading ? (
              <div className="posp-frame-loader">
                <Loader />
              </div>
            ) : null}
            <iframe
              className="posp-login-frame"
              src={loginUrl}
              title="POSP Login"
              onLoad={() => setFrameLoading(false)}
              onError={() => {
                setFrameLoading(false);
                setErrorMessage("Unable to load POSP login page.");
              }}
            />
          </>
        ) : null}
      </section>
    </main>
  );
};

export default PospLogin;
