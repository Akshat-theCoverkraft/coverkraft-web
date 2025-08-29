import React, { createContext, useContext, useState, useCallback } from "react";
import API_URL from "../ServiceModule/Service";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PolicyContext = createContext();

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
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    const navigate = useNavigate();
    const itemsPerPage = 3;
    const TAB_CONFIGS = [
        { label: "Active", value: 0, key: "active" },
        { label: "Expired", value: 1, key: "expired" },
        { label: "Archive", value: 2, key: "archive" },
        { label: "Pending", value: 3, key: "pending" },
    ];
    const fetchPolicyData = async (endpoint, params = {}) => {
        const response = await axios.get(`${API_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId, ...params },
        });
        return response?.data?.data || [];
    };

    const fetchData = useCallback(
        async (endpoint, params, isArchive = false) => {
            setLoading(true);
            try {
                const data = await fetchPolicyData(endpoint, params);
                if (isArchive) {
                    setArchieveList(data);
                } else {
                    setPolicyList(data);
                    setPolicyListLength(data.length);
                    setAllPolicyIds?.(data.map((policy) => policy._id));
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    setShowSessionExpired(true);
                }
                console.error("Error fetching data:", error);
                if (isArchive) {
                    setArchieveList([]);
                } else {
                    setPolicyList([]);
                }
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const handleSessionExpiredOk = () => {
        setShowSessionExpired(false);
        navigate("/login");
        localStorage.clear();
        sessionStorage.clear();
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
                allPolicyIds, setAllPolicyIds,
                policyListLength, setPolicyListLength,
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