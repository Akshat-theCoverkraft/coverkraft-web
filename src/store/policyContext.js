import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import API_URL from "../ServiceModule/Service";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PolicyContext = createContext();

// ✅ Create Axios instance with interceptors
const api = axios.create({ baseURL: API_URL });

// Request interceptor → add token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor → handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(error);
  }
);

export const PolicyProvider = ({ children }) => {
  const [policyListLength, setPolicyListLength] = useState(0);
  const [allPolicyIds, setAllPolicyIds] = useState([]);
  const [value, setValue] = useState(0);
  const [pages, setPages] = useState({ active: 1, expired: 1, archive: 1 });
  const [policyList, setPolicyList] = useState([]);
  const [archieveList, setArchieveList] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const navigate = useNavigate();
  const itemsPerPage = 3;

  const TAB_CONFIGS = [
    { label: "Active", value: 0, key: "active" },
    { label: "Expired", value: 1, key: "expired" },
    { label: "Archive", value: 2, key: "archive" },
    { label: "Pending", value: 3, key: "pending" },
  ];

  // ✅ Global listener for session-expired event
  useEffect(() => {
    const handleSessionExpired = () => setShowSessionExpired(true);
    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  // ✅ Centralized GET function
  const fetchPolicyData = async (endpoint, params = {}) => {
    const userId = sessionStorage.getItem("userId");
    const response = await api.get(endpoint, { params: { userId, ...params } });
    return response?.data?.data || [];
  };

  const fetchData = useCallback(
    async (endpoint, params, isArchive = false) => {
      setLoading(true);
      try {
        const data = await fetchPolicyData(endpoint, params);
        if (isArchive) {
          setArchieveList(data);
          setAllPolicyIds(data.map((policy) => policy._id));
        } else {
          setPolicyList(data);
          setPolicyListLength(data.length);
          setAllPolicyIds(data.map((policy) => policy._id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isArchive) setArchieveList([]);
        else setPolicyList([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    sessionStorage.clear();
    navigate("/login");
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    sessionStorage.setItem("selectedTab", newValue.toString());
    if (newValue < 2) setActiveTab(TAB_CONFIGS[newValue].key);
    setPages((prev) => ({
      ...prev,
      [TAB_CONFIGS[newValue]?.key || "archive"]: 1,
    }));
    setSelectedPolicyId(null);
    sessionStorage.removeItem("selectedPolicyId");
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedTypeFilter("all");
    setPages({ active: 1, expired: 1, archive: 1 });
  };

  return (
    <PolicyContext.Provider
      value={{
        value,
        pages,
        policyList,
        archieveList,
        activeTab,
        loading,
        selectedPolicyId,
        searchTerm,
        selectedTypeFilter,
        showSessionExpired,
        itemsPerPage,
        allPolicyIds,
        policyListLength,
        setAllPolicyIds,
        setPolicyListLength,
        setValue,
        setPages,
        setPolicyList,
        setArchieveList,
        setActiveTab,
        setLoading,
        setSelectedPolicyId,
        setSearchTerm,
        setSelectedTypeFilter,
        fetchData,
        handleTabChange,
        handleClearAll,
        handleSessionExpiredOk,
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
};

export const usePolicyContext = () => {
  const ctx = useContext(PolicyContext);
  if (!ctx) throw new Error("usePolicyContext must be used within PolicyProvider");
  return ctx;
};
