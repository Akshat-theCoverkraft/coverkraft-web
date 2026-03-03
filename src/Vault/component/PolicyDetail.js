import React, { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import CSS from "./PolicyDetail.css";
import Button from "../../component/Button";
import GradientButton from "../../component/GradientButton";
import ProgressBarCircle from "../../component/ProgressBarCircle"; // Import the component
import { updateDocument } from "../../store/action/action";
import { formatDate } from "../../utils/dateUtils";
import { THEME_COLOR } from "../../constants";
import API_URL from "../../ServiceModule/Service";
import IMAGE_PATH from "../../ServiceModule/imagePath";

// Import images
import EditIcon from "../../Images/edit.png";
import scooty from "../../Images/new_bike.png";
import family from "../../Images/new_health.png";
import car from "../../Images/ic_car.png";
import Health from "../../Images/new_health.png";
import premium from "../../Images/premium.png";
import value from "../../Images/value.png";
import startDate from "../../Images/startDate.png";
import dateEnd from "../../Images/endDate.png";
import redBg from "../../Images/red-img.png";
import share from "../../Images/share.png";
import download from "../../Images/ic-download1.png";
import view from "../../Images/ic-view.png";
import emptyImage from "../../Images/NoData.png";
import moment from "moment";
import SessionExpiredModal from "../../utils/sessionExpireModal";
import { usePolicyContext } from "../../store/policyContext";

const PolicyDetail = ({ policyId }) => {
  const [policyDetails, setPolicyDetails] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toastShownRef = useRef(new Set());
    const [showComingSoonModal, setShowComingSoonModal] = useState(false); // Add this state


  useEffect(() => {
    const fetchPolicyDetails = async () => {
      if (!policyId) return;

      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}policy/fetchFullData?_id=${policyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data?.data;
        console.log("data", data)
        setPolicyDetails(Array.isArray(data) ? data : []);
        sessionStorage.setItem("policyId", policyId);
         const documentId = data[0]?.documentDetails?._id;
        console.log("documentId", documentId);
        sessionStorage.setItem("documentId", documentId )
      } catch (error) {
        if (error.response?.status === 401) {
          setShowSessionExpired(true);
        }
        console.error("Error fetching policy list:", error);
        setPolicyDetails([]);
      }
    };

    fetchPolicyDetails();
  }, [policyId]);

  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate("/login");
    localStorage.clear();
    sessionStorage.clear();
  };

    // Map assetType string to vehicle_type number
  const getVehicleType = (assetType) => {
    if (!assetType) return 1;
    const normalized = assetType.trim().toLowerCase();
    const twoWheelerKeywords = ["two wheeler", "scooter", "bike", "motorcycle", "scooty"];
    const pcvKeywords = ["pcv", "passenger carrying vehicle", "bus", "taxi"];
    const gcvKeywords = ["gcv", "goods carrying vehicle", "truck", "lorry", "tempo"];
    if (twoWheelerKeywords.some((k) => normalized.includes(k))) return 2;
    if (pcvKeywords.some((k) => normalized.includes(k))) return 3;
    if (gcvKeywords.some((k) => normalized.includes(k))) return 4;
    return 1; // Default: Private Car / SUV / Sedan / Hatchback
  };

  // Function to calculate progress based on policy completeness
  const calculatePolicyProgress = (policy) => {
    if (!policy) return null;
console.log("policy---", policy)
    const requiredFields = [];
    const policyType = policy.policyType;

    if (isMotorPolicy(policyType)) {
      requiredFields.push(
        policy.policyNumber,
        policy.policyStartDate,
        policy.policyEndDate,
        policy?.totalPremium || policy?.policyDetails?.totalPremium || policy?.premiumPaid || "",
        policy.insuredName,
        policy.insuredCompany,
        policy.policyDetails?.registrationNumber,
        policy.policyDetails?.make,
        policy.policyDetails?.model,
        policy.policyDetails?.assetType,
        policy.policyDetails?.vehicleEngineNumber,
        policy.policyDetails?.idv
      );
    } else if (policyType === "health" || policyType === "other_health") {
      requiredFields.push(
        policy.policyNumber,
        policy.policyStartDate,
        policy.policyEndDate,
        policy.sumInsured || policy?.policyDetails?.sumInsured || "",
        policy?.totalPremium || policy?.policyDetails?.totalPremium || policy?.premiumPaid || "",
        policy.insuredName,
        policy.insuredCompany,
        policy?.policyName || policy.policyDetails?.policyName,
        policy.policyDetails?.dob
      );
    } else if (policyType === "life" || policyType === "accident") {
      requiredFields.push(
        policy.policyNumber,
        policy.policyStartDate,
        policy.premiumPaid,
        policy.insuredName,
        policy.insuredCompany,
        policy.policyDetails?.policyName,
        policy.policyDetails?.sumInsured
      );
    }

    const filledFields = requiredFields.filter(
      (field) => field && field !== ""
    ).length;
    const totalFields = requiredFields.length;

    if (totalFields === 0) return null;

    const progress = (filledFields / totalFields) * 100;

    return progress === 100 ? null : progress;
  };

  // New Modal for Coming Soon
const ComingSoonModal = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <div
        style={{
          background: "#1e1e1e",
          padding: "2em",
          borderRadius: "16px",
          maxWidth: "450px",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 0 20px rgba(0,0,0,0.7)",
        }}
      >
        <h2 style={{ marginBottom: "1em", fontSize: "1.5em" }}>Coming Soon 🚀</h2>
        <p style={{ marginBottom: "1.5em", color: "#ccc", lineHeight: 1.6 }}>
          You may send your requirement to{" "}
          <a
            href="mailto:Contact@thecoverkraft.com?subject=Requirement%20for%20Upcoming%20Feature"
            style={{
              color: "#4A90E2",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#8AC642")}
            onMouseLeave={(e) => (e.target.style.color = "#4A90E2")}
          >
            Contact@thecoverkraft.com
          </a>{" "}
          and our team will get in touch with you.
        </p>
        <Button text="OK" size="md" block={true} onClick={onClose} />
      </div>
    </div>
  );
};

  // Helper function to show toast only once
const showToastOnce = (message, type = "success") => {
  const toastKey = `${type}-${message}`;
  if (!toastShownRef.current.has(toastKey)) {
    toastShownRef.current.add(toastKey);

    if (type === "success") {
      toast.success(message); // Use toast here instead of calling ComingSoonModal
    } else if (type === "error") {
      toast.error(message);
    } else if (type === "info") {
      toast.info(message);
    }

    setTimeout(() => {
      toastShownRef.current.delete(toastKey);
    }, 3000);
  }
};


  const isMotorPolicy = (policyType) => {
    const motorPolicies = ["car_policy", "bike_policy", "other_vehicle"];
    return motorPolicies.includes(policyType);
  };

  const getPolicyImage = (policyType) => {
    const imageMap = {
      car_policy: car,
      bike_policy: scooty,
      other_vehicle: scooty,
      life: family,
      accident: family,
      health: Health,
      other_health: Health,
    };
    return imageMap[policyType] || scooty;
  };

  const getExpiryStatus = (policyEndDate) => {
    try {
      if (!policyEndDate) return null;

      const datePart = policyEndDate.split(" ")[0];
      const [day, month, year] = datePart.split("/");
      const endDate = new Date(year, month - 1, day);

      if (isNaN(endDate)) return null;

      const now = new Date();
      const diffInMs =
        new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        ).getTime() -
        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays < 0) return  { label: "Expired", diffInDays };
      if (diffInDays <= 60) return{ label: `${diffInDays} days left`, diffInDays };
      return null;
    } catch (error) {
      console.error("Error parsing policy end date:", error);
      return null;
    }
  };

  const handleEdit = () => {
    const responseData = policyDetails[0];
    const policyType = responseData.policyType;

    const routeMap = {
      car_policy: "/motor-policy",
      bike_policy: "/motor-policy",
      other_vehicle: "/motor-policy",
      health: "/health-policy",
      other_health: "/health-policy",
      life: "/life-policy",
      accident: "/life-policy",
    };

    const route = routeMap[policyType];
    if (route) {
      navigate(route, { state: { policyDetails: responseData, mode: "edit" } });
    }
  };

const handleDocument = async (documentPath, action) => {
  if (!documentPath) {
    console.error("Document path is missing");

    return;
  }

  // Determine full URL for API or external links
  const fullPath = documentPath.startsWith("http")
    ? documentPath
    : `${API_URL}${documentPath.startsWith("/") ? documentPath : `/${documentPath}`}`;

  // Extract filename for download
  const fileName = documentPath.split("/").pop() || "policy_document.pdf";

  try {
    if (action === "view") {
      // Open PDF directly in browser
      window.open(fullPath, "_blank");
      return;
    }

    if (action === "download") {
      // Direct download without fetch (avoids CORS issues)
      const link = document.createElement("a");
      link.href = fullPath;
      link.download = fileName; // suggested filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);


      return;
    }

  if (action === "share") {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Policy Document",
        text: "Here is your policy document.",
        url: fullPath, // just share the link
      });
      showToastOnce("Document link shared successfully", "success");
    } catch (err) {
      console.warn("Share failed, copying to clipboard", err);
      if (navigator.clipboard) await navigator.clipboard.writeText(fullPath);
      showToastOnce("Document link copied to clipboard", "success");
    }
  } else {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(fullPath);
      showToastOnce("Document link copied to clipboard", "success");
    } else {
      window.open(fullPath, "_blank");
      showToastOnce("Document opened in new tab", "info");
    }
  }
  return;
}


    // Unknown action
    console.warn(`Unknown action: ${action}`);

  } catch (error) {
    console.error(`Error handling document (${action}):`, error);

  }
};


const { setValue, setActiveTab } = usePolicyContext();

  // ─── Renewal handler ────────────────────────────────────────────────────────
  const handleRenewMotorPolicy = async (policy) => {
    const rcNumber = policy?.policyDetails?.registrationNumber;

    if (!rcNumber) {
      showToastOnce("Registration number not found", "error");
      return;
    }

    const assetType = policy?.policyDetails?.assetType;
    const vehicleType = getVehicleType(assetType);

    console.log("Renew API params — rc_number:", rcNumber, "vehicle_type:", vehicleType, "type: 0");

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}autoLogin/auto-login-url?rc_number=${encodeURIComponent(rcNumber)}`,
        { type: 0, vehicle_type: vehicleType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const redirectUrl = response.data?.redirect_url;
      console.log("Renewal redirect_url:", redirectUrl);

      if (redirectUrl) {
        window.open(redirectUrl, "_blank");
      } else {
        showToastOnce("Unable to get renewal URL. Please try again.", "error");
      }
    } catch (error) {
      console.error("Renewal API error:", error);
      if (error.response?.status === 401) {
        setShowSessionExpired(true);
      } else {
        showToastOnce("Failed to initiate renewal. Please try again.", "error");
      }
    }
  };

   const handlePolicyAction = async (action, policy) => {
      if (action === "renew") {
        if (isMotorPolicy(policy?.policyType)) {
          // Motor policies → call auto-login renewal API
          await handleRenewMotorPolicy(policy);
        } else {
          // Non-motor policies → Coming Soon modal
          setShowComingSoonModal(true);
        }
        return;
      }
  
      const userId = sessionStorage.getItem("userId");
      const formData = new FormData();
      formData.append("_id", policyId);
      formData.append("userId", userId);
      formData.append("status", action);
  
      dispatch(updateDocument(API_URL, formData))
        .then(() => {
          const message =
            action === "archive"
              ? "Policy archived successfully"
              : action === "unarchive"
              ? "Policy removed from archive successfully"
              : "Action completed successfully";
          showToastOnce(message, "success");
  
          if (action === "archive") {
            setTimeout(() => {
              setValue(2);
              setActiveTab("archive");
            }, 500);
          }
        })
        .catch(() => {
          showToastOnce("Some error occurred", "error");
        });
    };
  
// const handlePolicyAction = (action) => {
//   if (action === "renew") {
//     setShowComingSoonModal(true);
//     return;
//   }

//   const userId = sessionStorage.getItem("userId");
//   const formData = new FormData();
//   formData.append("_id", policyId);
//   formData.append("userId", userId);
//   formData.append("status", action);

//   dispatch(updateDocument(API_URL, formData))
//     .then(() => {
//       const message =
//         action === "archive"
//           ? "Policy archived successfully"
//           : action === "unarchive"
//           ? "Policy removed from archive successfully"
//           : "Action completed successfully";
//       showToastOnce(message, "success");

//       // Switch to Archive tab if archiving
//       if (action === "archive") {
//         setTimeout(() => {
//           setValue(2);
//           setActiveTab("archive");
//         }, 500);
//       }
//     })
//     .catch(() => {
//       showToastOnce("Some error occurred", "error");
//     });
// };

  const renderPolicyActions = (policy) => {
    const isArchived = policy?.status === "archive";
  const status = getExpiryStatus(policy?.policyEndDate);
  const showRenew = status !== null && status.diffInDays >= -7 && status.diffInDays <= 60;

    if (isArchived) {
      return (
        <Grid
          item
          xs={12}
          md={12}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <button
            className="btn btn-sm rounded-6"
            style={{
              border: "1px solid #8AC642",
              color: "#8AC642",
              padding: "12px 20px",
              width: "50%",
              maxWidth: "300px",
              minWidth: "200px",
            }}
            onClick={() => handlePolicyAction("unarchive")}
          >
            Remove from Archive
          </button>
        </Grid>
      );
    }

    return (
      <Grid
        item
        xs={12}
        md={12}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
           {showRenew && (
            <button
              className="btn btn-sm rounded-6"
              style={{
                border: "1px solid #8AC642",
                color: "#8AC642",
                padding: "15px 20px",
                width: "45%",
                minWidth: "150px",
                maxWidth: "280px",
                textAlign: "center",
              }}
              onClick={() => handlePolicyAction("renew", policy)}
            >
              Renew Policy
            </button>
          )}

          <button
            className="btn btn-sm rounded-7"
            style={{
              border: "1px solid #8AC642",
              color: "#8AC642",
              padding: "15px 20px",
              width: "45%",
              minWidth: "150px",
              maxWidth: "280px",
              textAlign: "center",
            }}
            onClick={() => handlePolicyAction("archive")}
          >
            Archive Policy
          </button>
        </div>
      </Grid>
    );
  };

  const renderTooltip = (text) => (
    <Tooltip style={{ fontSize: "1.4rem", padding: "8px 12px" }}>
      {text}
    </Tooltip>
  );

  if (policyDetails.length === 0) {
    return (
      <>
        <ToastContainer
          position="top-center"
          style={{
            zIndex: 100000,
            top: "110px",
          }}
          toastClassName="custom-toast"
          autoClose={3000}
        />
        <Card
          className="p-5 rounded-5"
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
            height: "750px",
            minHeight: "100% !important",
            marginBottom: "15px",
            backgroundColor: "#121212",
            color: THEME_COLOR.COLOR,
            border: "0.5px solid white",
          }}
        >
          <img
            src={emptyImage}
            alt="No Data"
            style={{ width: "30%", height: "auto", marginVertical: "25%" }}
          />
          <p className="mt-5 fs-bold">
            Add your new policy effortlessly to your account
          </p>
        </Card>
      </>
    );
  }

  return (
    <div style={{ minHeight: "620px" }}>
      <ToastContainer
        position="top-center"
        style={{
          zIndex: 100000,
          top: "110px",
        }}
        toastClassName="custom-toast"
        autoClose={3000}
      />

        {/* ComingSoonModal for renew action */}
      <ComingSoonModal 
        visible={showComingSoonModal} 
        onClose={() => setShowComingSoonModal(false)} 
      />


      <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
      {policyDetails.map((policy, index) => {
        const status = getExpiryStatus(policy?.policyEndDate);
        const documentPath = policy?.documentDetails?.documentPath;
        const progress = calculatePolicyProgress(policy);
        console.log("progress", progress)
        console.log("policy?.totalPremium", policy?.totalPremium)
        return (
          <Card
            key={index}
            className="p-4 rounded-5"
            style={{
              justifyContent: "center",
              boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
              height: "680px !important",
              backgroundColor: "#121212",
              color: THEME_COLOR.COLOR,
              border: "0.5px solid white",
            }}
          >
            <div className="d-flex justify-content-between pb-3">
              <p
                style={{ fontSize: "22px", fontWeight: "600" }}
                className="fw-bold pl-4"
              >
                Policy Details
              </p>

              <div className="d-flex align-items-center gap-3 mr-3">
                {progress !== null && progress < 100 && (
                  <div className="mr-3">
                    <ProgressBarCircle
                      progress={progress}
                      color="#8AC642"
                      size={50}
                      strokeWidth={5}
                    />
                  </div>
                )}
                <button
                  type="button"
                  style={{
                    background:
                      "linear-gradient(122.01deg, #1DB1BB 7.48%, #B6E597 86.54%)",
                    color: "white",
                    borderColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: EditIcon ? "space-evenly" : "center",
                    padding: "1px 20px",
                    borderRadius: "30px",
                    border: "none",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                  onClick={handleEdit}
                >
                  <img
                    src={EditIcon}
                    height={12}
                    alt="Start Icon"
                    style={{ marginRight: "8px" }}
                  />
                  Edit
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-start px-4">
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    width: "400px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "4px",
                    marginTop: 0,
                    cursor: "default",
                  }}
                  title={
                    policy?.policyDetails?.make_Model || policy?.insuredName
                  }
                >
                  {policy?.policyDetails?.make_Model || policy?.insuredName}
                </p>

                <p
                  style={{
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: "2px",
                  }}
                >
                  {policy?.policyDetails?.registrationNumber ||
                    policy?.policyNumber}
                </p>
                <p
                  style={{
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: "2px",
                  }}
                >
                  {policy?.insuredCompany}
                </p>
                <p
                  style={{
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: 0,
                  }}
                >
                   Expires on{" "}
  {policy?.policyEndDate &&
  moment(policy.policyEndDate, ["DD/MM/YYYY", "YYYY-MM-DD"], true).isValid()
    ? moment(policy.policyEndDate, [
        "DD/MM/YYYY",
        "YYYY-MM-DD",
      ]).format("DD MMM, YYYY")
    : "-"}
                </p>
              </div>

              <div className="d-flex align-items-center">
                {/* Progress Bar positioned to the left of car */}

                <div>
                  <img
                    src={getPolicyImage(policy?.policyType)}
                    alt="Policy Type"
                    style={{ maxWidth: "70px", height: "auto" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ position: "relative", marginTop: -30 }}>
              {status && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: -89,
                      right: 0,
                      width: "160px",
                      height: "40px",
                      backgroundImage: `url(${redBg})`,
                      backgroundSize: "cover",
                      opacity: 1,
                      marginTop: "50px",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: -30,
                      right: 25,
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: "bold",
                      zIndex: 1,
                    }}
                  >
                    {status.label}
                  </div>
                </>
              )}

              <Card
                className="rounded-5"
                style={{
                  marginTop: "48px",
                  paddingTop: "5px",
                  width: "100%",
                  height: "396px",
                  boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
                  backgroundColor: "#212121",
                  color: THEME_COLOR.COLOR,
                  paddingBottom: "20px",
                }}
              >
                <div className=" d-flex justify-content-end my-4">
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("View Policy")}
                  >
                    <img
                      src={view}
                      onClick={() => handleDocument(documentPath, "view")}
                      className="mr-2 cursor-pointer"
                      alt="View"
                    />
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Download Policy")}
                  >
                    <img
                      src={download}
                      onClick={() => handleDocument(documentPath, "download")}
                      className="mr-2 cursor-pointer"
                      alt="Download"
                    />
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Share Policy")}
                  >
                    <img
                      src={share}
                      onClick={() => handleDocument(documentPath, "share")}
                      className="cursor-pointer"
                      alt="Share"
                    />
                  </OverlayTrigger>
                </div>

                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 1, md: 1 }}
                >
                  <Grid
                    item
                    xs={6}
                    md={6}
                    className="d-flex"
                    style={{ padding: "30px 40px" }}
                  >
                    <div className="mr-2">
                      <img src={premium} height={50} alt="premium" />
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#fff",
                          fontSize: "1.2rem",
                          fontWeight: "600",
                        }}
                      >
                        Premium Paid
                      </p>
                      <p
                        style={{ fontSize: "16px", fontWeight: "700" }}
                        className="fw-bolder"
                      >
                               {  policy?.totalPremium || policy?.policyDetails?.totalPremium || policy?.premiumPaid ||"-"}
                      </p>
                    </div>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={6}
                    className="d-flex"
                    style={{ padding: "30px 40px" }}
                  >
                    <div className="mr-2">
                      <img src={value} height={50} alt="value" />
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#fff",
                          fontSize: "1.2rem",
                          fontWeight: "600",
                        }}
                      >
                        {isMotorPolicy(policy?.policyType)
                          ? "Value (IDV)"
                          : "Sum Insured"}
                      </p>
                      <p className="fw-bolder">
                        {policy?.policyDetails?.idv ||
                          policy?.policyDetails?.sumInsured ||
                          "Pending"}
                      </p>
                    </div>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={6}
                    className="d-flex"
                    style={{ padding: "30px 40px" }}
                  >
                    <div className="mr-2">
                      <img src={startDate} height={50} alt="start date" />
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#fff",
                          fontSize: "1.2rem",
                          fontWeight: "600",
                        }}
                      >
                        Policy Start Date
                      </p>
                      <p className="fw-bolder">
                        {policy?.policyStartDate || "Pending"}
                      </p>
                    </div>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={6}
                    className="d-flex"
                    style={{ padding: "30px 40px" }}
                  >
                    <div className="mr-2">
                      <img src={dateEnd} height={50} alt="end date" />
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#fff",
                          fontSize: "1.2rem",
                          fontWeight: "600",
                        }}
                      >
                        Policy End Date
                      </p>
                      <p className="fw-bolder">
                        {policy?.policyEndDate || "Pending"}
                      </p>
                    </div>
                  </Grid>
                </Grid>

                {renderPolicyActions(policy)}
              </Card>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PolicyDetail;
