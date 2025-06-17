import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "../../component/Button";
import EditIcon from "../../Images/edit.png";
import scooty from "../../Images/detail-scooty.png";
import HealthInsurance from "../../Images/FamilyHealthInsurance.png";
import family from "../../Images/Family.png";
import car from "../../Images/Car.png";
import Health from "../../Images/ic_health.png";
import Life from "../../Images/ic_life.png";
import Grid from "@mui/material/Grid";
import premium from "../../Images/premium.png";
import value from "../../Images/value.png";
import startDate from "../../Images/startDate.png";
import dateEnd from "../../Images/endDate.png";
import redBg from "../../Images/red-img.png";
import share from "../../Images/share.png";
import download from "../../Images/ic-download1.png";
import view from "../../Images/ic-view.png";
import { useNavigate } from "react-router-dom";
import API_URL from "../../ServiceModule/Service";
import axios from "axios";
import emptyImage from "../../Images/ic-empty.png";
import IMAGE_PATH from "../../ServiceModule/imagePath";
import moment from "moment";
import { formatDate } from "../../utils/dateUtils";
import { updateDocument } from "../../store/action/action";
import { useDispatch } from "react-redux";
import GradientButton from "../../component/GradientButton";
import { toast } from "react-toastify";
import { THEME_COLOR } from "../../constants";

const PolicyDetail = ({ policyId }) => {
  console.log("policydetail ma gye", policyId);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [policyDetails, setPolicyDetails] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //useeffect
  useEffect(() => {
    const fetchPolicyDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}policy/fetchFullData?_id=${policyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the headers
            },
          }
        );
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          setPolicyDetails(response.data.data);
          console.log("policydetails", policyDetails);
          localStorage.setItem("policyId", policyId);
        } else {
          console.error("Expected an array but got:", response.data);
          setPolicyDetails([]);
        }
      } catch (error) {
        console.error("Error fetching policy list:", error);
        setPolicyDetails([]);
      }
    };

    if (policyId) {
      fetchPolicyDetails();
    }
  }, [policyId]);

  //function to view the pdf document
  const handleViewDocument = (documentPath) => {
    setPdfUrl(`${IMAGE_PATH}${documentPath}`);
    window.open(`${IMAGE_PATH}${documentPath}`, "_blank");
  };

  //function to download the pdf document
  const handleDownloadDocument = (documentPath) => {
    const url = `${API_URL}${documentPath}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          // If direct download fails, open the PDF in a new tab
          window.open(url, "_blank");
        } else {
          // If direct download is successful, initiate download
          response.blob().then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "policy_document.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        }
      })
      .catch((error) => {
        console.error("Error downloading document:", error);
        // If download fails, open the PDF in a new tab
        window.open(url, "_blank");
      });
  };

  //function for share dialog
  const toggleShareDialog = () => {
    setShowShareDialog(!showShareDialog);
  };

  //function for edit button
  const handleEdit = () => {
    const responseData = policyDetails[0];
    const PolicyType = policyDetails[0].policyType;

    console.log("polcyytype", responseData);
    if (
      PolicyType === "car_policy" ||
      PolicyType === "bike_policy" ||
      PolicyType === "other_vehicle"
    ) {
      navigate("/coverkraft/motor-policy", {
        state: { policyDetails: responseData, mode: "edit" },
      });
    } else if (PolicyType === "health" || PolicyType === "other_health") {
      navigate("/coverkraft/health-policy", {
        state: { policyDetails: responseData, mode: "edit" },
      });
    } else if (PolicyType === "life" || PolicyType === "accident") {
      navigate("/coverkraft/life-policy", {
        state: { policyDetails: responseData, mode: "edit" },
      });
    }
    // navigate('/coverkraft/edit-policy', { state: { policyDetails: policyDetails } });
  };

  //function for share policy document
  const sharePolicyDocument = async (documentPath) => {
    const url = `${IMAGE_PATH}${documentPath}`;
    const filename = documentPath.split("/").pop();

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Policy Document",
          text: "Here is the document you requested.",
          files: [file],
        });
      } else {
        alert("Your device/browser does not support file sharing.");
      }
    } catch (err) {
      console.error("Error sharing file:", err);
    }
  };

  const userId = localStorage.getItem("userId");
  const handleArchieve = () => {
    const archieve = "archive";
    const formData = new FormData();
    formData.append("_id", policyId);
    formData.append("userId", userId);
    formData.append("status", archieve);
    dispatch(updateDocument(API_URL, formData))
      .then(() => {
        toast.success("Policy Updated successfully");
      })
      .catch((error) => {
        toast.error("Some Error occur");
      });
  };

  return (
    <>
      {policyDetails.length === 0 ? (
        <Card
          className="rounded-4 border"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "98vh",
            boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
            backgroundColor: THEME_COLOR.BACKGROUND,
            color: THEME_COLOR.COLOR,
          }}
        >
          <img src={emptyImage} alt="No Data" />
          <p>Add your new policy effortlessly to your account</p>
        </Card>
      ) : (
        policyDetails.map((policy, index) => {
          let endDate, diffInDays, status;

          try {
            if (policy?.policyEndDate) {
              // Try to parse the date part of the policy end date
              const datePart = policy?.policyEndDate?.split(" ")[0];
              const [day, month, year] = datePart?.split("/");

              // Create a new Date object with the date components
              endDate = new Date(year, month - 1, day);

              if (isNaN(endDate)) throw new Error("Invalid date");

              const now = new Date();

              const endDateWithoutTime = new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate()
              );
              const nowWithoutTime = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
              );

              const diffInMs =
                endDateWithoutTime.getTime() - nowWithoutTime.getTime();
              diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

              if (diffInDays <= 0) {
                status = "Expired";
              } else if (diffInDays <= 60) {
                status = `${diffInDays} days left`;
              }
            }
          } catch (error) {
            console.error("Error parsing policy end date:", error);
          }

          const documentPath = policy?.documentDetails?.documentPath;

          return (
            <Card
              className="p-5 rounded-4"
              style={{
                justifyContent: "center",
                boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
                height: "100vh",
                minHeight: "90vh",
                marginBottom: "5vh",
                backgroundColor: THEME_COLOR.BACKGROUND,
                color: THEME_COLOR.COLOR,
                border: "0.5px solid grey",
              }}
            >
              <div className="d-flex justify-content-between mb-5">
                <p
                  style={{ fontSize: "24px", fontWeight: "700" }}
                  className="fw-bold pl-4"
                >
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
                  <p
                    style={{ fontSize: "20px", fontWeight: "700" }}
                    gutterBottom
                    className="fw-bold pl-4"
                  >
                    {policy?.policyDetails?.make_Model || policy?.insuredName}
                  </p>
                  <p
                    style={{
                      color: "#585858",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    className="pl-4"
                  >
                    {policy?.policyDetails?.registrationNumber ||
                      policy?.policyNumber}
                  </p>
                  <p
                    style={{
                      color: "#9E9E9E",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    className="pl-4"
                  >
                    Expires on {formatDate(policy?.policyEndDate)}
                  </p>
                </div>
                <div>
                  <img
                    src={
                      policy?.policyType === "car_policy"
                        ? car
                        : policy?.policyType === "bike_policy"
                        ? scooty
                        : policy?.policyType === "other_vehicle"
                        ? scooty
                        : policy?.policyType === "life"
                        ? family
                        : policy?.policyType === "accident"
                        ? family
                        : policy?.policyType === "health"
                        ? Health
                        : policy?.policyType === "other_health"
                        ? HealthInsurance
                        : emptyImage
                    }
                  />
                </div>
              </div>

              <div style={{ position: "relative" }}>
                {status && (
                  <>
                    <div
                      className=""
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
                    ></div>
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
                  className="rounded-4"
                  style={{
                    marginTop: "48px",
                    boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
                    backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                    color: THEME_COLOR.COLOR,
                  }}
                >
                  <div className="d-flex justify-content-end m-4">
                    <img
                      src={view}
                      onClick={() => handleViewDocument(documentPath)}
                      className="mr-2 cursor-pointer"
                    />
                    <img
                      src={download}
                      onClick={() => handleDownloadDocument(documentPath)}
                      className="mr-2 cursor-pointer"
                    />
                    <img
                      src={share}
                      onClick={() => sharePolicyDocument(documentPath)}
                      className="cursor-pointer"
                    />
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
                          {policy?.premiumPaid}
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
                          Value (IDV)
                        </p>
                        <p className="fw-bolder">
                          {policy?.policyDetails.idv ||
                            policy?.policyDetails?.sumInsured}
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
                        <p className="fw-bolder">{policy?.policyStartDate}</p>
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
                        <p className="fw-bolder">{policy?.policyEndDate}</p>
                      </div>
                    </Grid>
                  </Grid>
                  {!policy?.status ? (
                    <Grid
                      item
                      className="m-4"
                      xs={12}
                      md={12}
                      style={{ padding: "0 40px" }}
                    >
                      <button
                        className="btn btn-lg rounded-5"
                        style={{
                          borderColor: "#8AC642",
                          color: "#8AC642",
                          padding: "10px 70px",
                          width: "100%",
                        }}
                        onClick={handleArchieve}
                      >
                        Archive
                      </button>
                    </Grid>
                  ) : (
                    <p></p>
                  )}
                </Card>
                {/*  */}
              </div>
            </Card>
          );
        })
      )}
    </>
  );
};

export default PolicyDetail;
