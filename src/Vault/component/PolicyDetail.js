import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import Button from "../../component/Button";
import GradientButton from "../../component/GradientButton";
import { updateDocument } from "../../store/action/action";
import { formatDate } from "../../utils/dateUtils";
import { THEME_COLOR } from "../../constants";
import API_URL from "../../ServiceModule/Service";
import IMAGE_PATH from "../../ServiceModule/imagePath";

// Import images
import EditIcon from "../../Images/edit.png";
import scooty from "../../Images/detail-scooty.png";
import family from "../../Images/Family.png";
import car from "../../Images/Car.png";
import Health from "../../Images/ic_health.png";
import premium from "../../Images/premium.png";
import value from "../../Images/value.png";
import startDate from "../../Images/startDate.png";
import dateEnd from "../../Images/endDate.png";
import redBg from "../../Images/red-img.png";
import share from "../../Images/share.png";
import download from "../../Images/ic-download1.png";
import view from "../../Images/ic-view.png";
import emptyImage from "../../Images/NoData.png";
import { red } from "@mui/material/colors";

const PolicyDetail = ({ policyId }) => {
  const [policyDetails, setPolicyDetails] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        setPolicyDetails(Array.isArray(data) ? data : []);
        sessionStorage.setItem("policyId", policyId);
      } catch (error) {
        console.error("Error fetching policy list:", error);
        setPolicyDetails([]);
      }
    };

    fetchPolicyDetails();
  }, [policyId]);

  const getPolicyImage = (policyType) => {
    const imageMap = {
      car_policy: car,
      bike_policy: scooty,
      other_vehicle: scooty,
      life: family,
      accident: family,
      health: Health,
      other_health: Health
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
      const diffInMs = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime() -
        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays <= 0) return "Expired";
      if (diffInDays <= 60) return `${diffInDays} days left`;
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
      accident: "/life-policy"
    };

    const route = routeMap[policyType];
    if (route) {
      navigate(route, { state: { policyDetails: responseData, mode: "edit" } });
    }
  };

  const handleDocument = async (documentPath, action) => {
    console.log('=== DOCUMENT HANDLER ===');
    console.log('Document Path:', documentPath);
    console.log('Action:', action);
    
    if (!documentPath) {
      console.error('Document path is missing');
      toast.error('Document not available');
      return;
    }

    // Check if it's a Gmail-synced policy (S3 URL) or manual upload
    const isGmailSync = documentPath.startsWith("https://") || documentPath.startsWith("http://");
    console.log('Is Gmail Sync:', isGmailSync);

    if (action === "view") {
      try {
        if (isGmailSync) {
          // For Gmail-synced policies, use Google Drive Viewer
          const googleViewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(documentPath)}`;
          console.log('Opening in Google Viewer:', googleViewerUrl);
          window.open(googleViewerUrl, "_blank");
        } else {
          // For manual uploads, use your server path
          const fullPath = documentPath.startsWith('/') ? documentPath : `/${documentPath}`;
          const viewUrl = `${IMAGE_PATH}${fullPath}`;
          console.log('Opening manual upload:', viewUrl);
          
          // Try Google Viewer first, fallback to direct link
          const googleViewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(viewUrl)}`;
          window.open(googleViewerUrl, "_blank");
        }
      } catch (error) {
        console.error('Error opening document for viewing:', error);
        toast.error('Unable to open document for viewing');
      }
      return;
    }

    if (action === "download") {
      try {
        if (isGmailSync) {
          // For Gmail-synced policies, open in new tab (browser will handle download)
          console.log('Opening Gmail-synced document for download:', documentPath);
          window.open(documentPath, "_blank");
          toast.success('Document opened in new tab. You can download it from there.');
        } else {
          // For manual uploads, use fetch to download
          const fullPath = documentPath.startsWith('/') ? documentPath : `/${documentPath}`;
          const downloadUrl = `${API_URL}${fullPath}`;
          console.log('Downloading manual upload from:', downloadUrl);
          
          const response = await fetch(downloadUrl);
          if (!response.ok) {
            throw new Error(`Download failed: ${response.status}`);
          }

          const blob = await response.blob();
          const fileName = documentPath.split("/").pop() || "policy_document.pdf";
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast.success('Document downloaded successfully');
        }
      } catch (error) {
        console.error('Error downloading document:', error);
        toast.error('Unable to download document. Please try again.');
      }
      return;
    }

    if (action === "share") {
      try {
        if (isGmailSync) {
          // For Gmail-synced policies, share the URL
          console.log('Sharing Gmail-synced document:', documentPath);
          
          if (navigator.share) {
            try {
              await navigator.share({
                title: "Policy Document",
                text: "Here is your policy document.",
                url: documentPath,
              });
              toast.success('Document shared successfully');
            } catch (shareError) {
              console.log('Native sharing failed, trying clipboard');
              // Fallback to clipboard
              if (navigator.clipboard) {
                await navigator.clipboard.writeText(documentPath);
                toast.success('Document link copied to clipboard');
              } else {
                // Final fallback - open in new tab
                window.open(documentPath, "_blank");
                toast.info('Document opened in new tab');
              }
            }
          } else {
            // No native share support
            if (navigator.clipboard) {
              await navigator.clipboard.writeText(documentPath);
              toast.success('Document link copied to clipboard');
            } else {
              // Final fallback - open in new tab
              window.open(documentPath, "_blank");
              toast.info('Document opened in new tab');
            }
          }
        } else {
          // For manual uploads, try to share file blob
          const fullPath = documentPath.startsWith('/') ? documentPath : `/${documentPath}`;
          const shareUrl = `${API_URL}${fullPath}`;
          console.log('Sharing manual upload from:', shareUrl);
          
          const response = await fetch(shareUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status}`);
          }

          const blob = await response.blob();
          const fileName = documentPath.split("/").pop() || "policy_document.pdf";
          const file = new File([blob], fileName, { type: "application/pdf" });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "Policy Document",
              text: "Here is your policy document.",
              files: [file],
            });
            toast.success('Document shared successfully');
          } else {
            // Fallback: save file and copy URL to clipboard
            const blobUrl = window.URL.createObjectURL(blob);
            if (navigator.clipboard) {
              await navigator.clipboard.writeText(shareUrl);
              toast.success('Document link copied to clipboard');
            } else {
              // Final fallback - trigger download
              const link = document.createElement("a");
              link.href = blobUrl;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.info('Document downloaded (sharing not supported)');
            }
            window.URL.revokeObjectURL(blobUrl);
          }
        }
      } catch (error) {
        console.error('Error sharing document:', error);
        toast.error('Unable to share document. Please try again.');
      }
      return;
    }
  };

  const handlePolicyAction = (action) => {
    const userId = sessionStorage.getItem("userId");
    const formData = new FormData();
    formData.append("_id", policyId);
    formData.append("userId", userId);
    formData.append("status", action);

    dispatch(updateDocument(API_URL, formData))
      .then(() => {
        const message = action === "archive" ? "Policy archived successfully" :
          action === "unarchive" ? "Policy removed from archive successfully" :
            "Feature Comming Soon";
        toast.success(message);
      })
      .catch(() => {
        toast.error("Some error occurred");
      });
  };

  const renderPolicyActions = (policy) => {
    const isArchived = policy?.status === "archive";

    if (isArchived) {
      return (
        <Grid item className="m-4" xs={12} md={12} style={{ paddingLeft: "30%" }}>
          <button
            className="btn btn-sm rounded-6"
            style={{
              borderColor: "#8AC642",
              color: "#8AC642",
              paddingLeft: "20px",
              width: "50%",
            }}
            onClick={() => handlePolicyAction("unarchive")}
          >
            Remove from Archive
          </button>
        </Grid>
      );
    }

    return (
      <Grid item className="m-4" xs={12} md={12} style={{ padding: "0 40px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            className="btn btn-sm rounded-6"
            style={{
              borderColor: "#8AC642",
              color: "#8AC642",
              padding: "15px 40px",
              minWidth: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handlePolicyAction("renew")}
          >
            Renew Policy
          </button>
          <button
            className="btn btn-sm rounded-7"
            style={{
              borderColor: "#8AC642",
              color: "#8AC642",
              padding: "15px 40px",
              minWidth: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
    <Tooltip style={{ fontSize: '1.8rem', padding: '8px 12px' }}>
      {text}
    </Tooltip>
  );

  if (policyDetails.length === 0) {
    return (
      <>
        <ToastContainer position="top-center" style={{ zIndex: 99999 }} />
        <Card
          className="rounded-5 border"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "85vh",
            boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
            backgroundColor: THEME_COLOR.BACKGROUND,
            color: THEME_COLOR.COLOR,
          }}
        >
          <img src={emptyImage} alt="No Data" style={{ width: '40%', height: 'auto', marginTop: '10%' }} />
          <p className="mt-5 fs-bold">Add your new policy effortlessly to your account</p>
        </Card>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" style={{ zIndex: 99999 }} />
      {policyDetails.map((policy, index) => {
        const status = getExpiryStatus(policy?.policyEndDate);
        const documentPath = policy?.documentDetails?.documentPath;

        return (
          <Card
            key={index}
            className="p-5 rounded-5"
            style={{
              justifyContent: "center",
              boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
              height: "78%",
              minHeight: "100%",
              marginBottom: "5vh",
              backgroundColor: "#121212",
              color: THEME_COLOR.COLOR,
              border: "0.5px solid white",
            }}
          >
            <div className="d-flex justify-content-between mb-5">
              <p style={{ fontSize: "24px", fontWeight: "700" }} className="fw-bold pl-4">
                Details
              </p>
              <GradientButton
                text="Edit"
                size="sm"
                className="fw-bold"
                startIcon={EditIcon}
                onClick={handleEdit}
              />
            </div>

            <div className="d-flex justify-content-between">
              <div>
                <p style={{ fontSize: "20px", fontWeight: "700" }} className="fw-bold pl-4">
                  {policy?.policyDetails?.make_Model || policy?.insuredName}
                </p>
                <p style={{ color: "#fff", fontSize: "16px", fontWeight: "500" }} className="pl-4">
                  {policy?.policyDetails?.registrationNumber || policy?.policyNumber}
                </p>
                <p style={{ color: "#fff", fontSize: "16px", fontWeight: "500" }} className="pl-4">
                  Expires on {formatDate(policy?.policyEndDate)}
                </p>
              </div>
              <div>
                <img src={getPolicyImage(policy?.policyType)} alt="Policy Type" />
              </div>
            </div>

            <div style={{ position: "relative" }}>
              {status && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: -89,
                      right: 0,
                      width: "200px",
                      height: "50px",
                      backgroundImage: `url(${redBg})`,
                      backgroundSize: "cover",
                      opacity: 1,
                      marginTop: "50px",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: -33,
                      right: 25,
                      color: "#ffffff",
                      fontSize: "24px",
                      fontWeight: "bold",
                      zIndex: 1,
                    }}
                  >
                    {status}
                  </div>
                </>
              )}

              <Card
                className="rounded-5"
                style={{
                  marginTop: "48px",
                  paddingTop: "50px",
                  width: "100%",
                  height: "50%",
                  boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
                  backgroundColor: "#212121",
                  color: THEME_COLOR.COLOR,
                }}
              >
                <div className="d-flex justify-content-end m-4">
                  <OverlayTrigger placement="top" overlay={renderTooltip("View Policy")}>
                    <img
                      src={view}
                      onClick={() => handleDocument(documentPath, "view")}
                      className="mr-2 cursor-pointer"
                      alt="View"
                    />
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={renderTooltip("Download Policy")}>
                    <img
                      src={download}
                      onClick={() => handleDocument(documentPath, "download")}
                      className="mr-2 cursor-pointer"
                      alt="Download"
                    />
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={renderTooltip("Share Policy")}>
                    <img
                      src={share}
                      onClick={() => handleDocument(documentPath, "share")}
                      className="cursor-pointer"
                      alt="Share"
                    />
                  </OverlayTrigger>
                </div>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                  <Grid item xs={6} md={6} className="d-flex" style={{ padding: "30px 40px" }}>
                    <div className="mr-2">
                      <img src={premium} height={50} alt="premium" />
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "600" }}>
                        Premium Paid
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "700" }} className="fw-bolder">
                        {policy?.premiumPaid}
                      </p>
                    </div>
                  </Grid>

                  <Grid item xs={6} md={6} className="d-flex" style={{ padding: "30px 40px" }}>
                    <div className="mr-2">
                      <img src={value} height={50} alt="value" />
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "600" }}>
                        Value (IDV)
                      </p>
                      <p className="fw-bolder">
                        {policy?.policyDetails?.idv || policy?.policyDetails?.sumInsured}
                      </p>
                    </div>
                  </Grid>

                  <Grid item xs={6} md={6} className="d-flex" style={{ padding: "30px 40px" }}>
                    <div className="mr-2">
                      <img src={startDate} height={50} alt="start date" />
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "600" }}>
                        Policy Start Date
                      </p>
                      <p className="fw-bolder">{policy?.policyStartDate}</p>
                    </div>
                  </Grid>

                  <Grid item xs={6} md={6} className="d-flex" style={{ padding: "30px 40px" }}>
                    <div className="mr-2">
                      <img src={dateEnd} height={50} alt="end date" />
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "600" }}>
                        Policy End Date
                      </p>
                      <p className="fw-bolder">{policy?.policyEndDate}</p>
                    </div>
                  </Grid>
                </Grid>

                {renderPolicyActions(policy)}
              </Card>
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default PolicyDetail;