import React, { useState, useRef } from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { makeStyles } from "@mui/styles";
import share from "../Images/ic-share1.png";
import Button from "../component/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AddIcon from "../Images/addIcon.png";
import PolicyTabs from "./component/PolicyTabs";
import "./vault.css";
import PolicyDetail from "./component/PolicyDetail";
import uploadPdf from "../Images/uploadPdf.png";
import uploadImg from "../Images/uploadImg.png";
import { extractData } from "../store/action/action";
import API_URL from "../ServiceModule/Service";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import IMAGE_PATH from "../ServiceModule/imagePath";
import GradientButton from "../component/GradientButton";
import { THEME_COLOR } from "../constants";
//styling for breadcrumbs
const useStyles = makeStyles(() => ({
  separator: {
    color: "#42988E",
    fontSize: "1.6rem",
    marginBottom: "12px",
  },
  breadcrumbsContainer: {
    display: "flex",
    alignItems: "center",
    // backgroundColor: "red",
    // justifyContent: "center",
  },
}));

//styling for dialog box
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  borderRadius: "300px",
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Vault = () => {
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const inputRef = useRef();
  const imageRef = useRef();
  const navigate = useNavigate();
  const [selectedPolicyId, setSelectedPolicyId] = React.useState("");
  const [shareAllPolicy, setShareAllPolicy] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  //function for share icon
  const handleShareIconClick = () => {
    setShareAllPolicy((prevState) => !prevState);
    setShowShareDialog(false);
  };

  //function for checkbox selected for sharing card
  const handleCardClick = (policyId) => {
    console.log("what is policy id", policyId);
    setSelectedPolicyId(policyId);
    localStorage.setItem("selectedPolicyId", policyId);
  };
  // console.log("selectedpolicyid", selectedPolicyId);
  //function for share dialog
  const toggleShareDialog = () => {
    setShowShareDialog(!showShareDialog);
    // console.log("dialog of share", showShareDialog);
  };

  //add policy dialog box open and close function start
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };
  //confirm box open and close function end

  //upload pdf handle function start
  const handleFile = (e) => {
    setFiles(e.target.files);
    setConfirmDialogOpen(true);
  };
  //upload pdf handle function end

  //upload image handle function start
  const handleImage = (e) => {
    setImage(e.target.files);
    setConfirmDialogOpen(true);
  };
  //upload image handle function end

  //function to handle ocr data extraction API start
  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("ocrText", files[i]);
      }
    } else if (image) {
      for (let i = 0; i < image.length; i++) {
        formData.append("ocrText", image[i]);
      }
    }

    console.log(formData);

    setLoading(true);
    try {
      const response = await axios.post(
        API_URL + "document/ocrExtractData",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      if (response.status === 200) {
        const responseData = response.data; // Use the response data directly here
        setResponseData(responseData);
        console.log("responsedata", responseData);
        const documentId = responseData.documentId;
        localStorage.setItem("documentId", documentId);
        const ocrTextObject = JSON.parse(responseData.ocrText);
        const PolicyType = ocrTextObject.policyType.toLowerCase();
        console.log("policyytyype", PolicyType);
        if (
          PolicyType === "car_policy" ||
          PolicyType === "bike_policy" ||
          PolicyType === "other_vehicle"
        ) {
          navigate("/coverkraft/motor-policy", {
            state: { responseData: ocrTextObject },
          });
        } else if (PolicyType === "health" || PolicyType === "other_health") {
          navigate("/coverkraft/health-policy", {
            state: { responseData: ocrTextObject },
          });
        } else if (PolicyType === "life" || PolicyType === "accident") {
          navigate("/coverkraft/life-policy", {
            state: { responseData: ocrTextObject },
          });
        }
      } else {
        toast.error("File is not 200 status due to some issue!");
      }
      setFiles(null);
    } catch (error) {
      setLoading(false);
      toast.error("File is not extracted due to some issue!");
    }
  };

  //function to handle ocr data extraction API start

  //handle the css on breadcrumbs
  const classes = useStyles();

  // function to handle breadcrumbs start
  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  // function to handle breadcrumbs end

  const handleShareClick = async () => {
    console.log("policyids---------", selectedPolicies);
    try {
      const token = localStorage.getItem("token");
      const queryParams = selectedPolicies.map((id) => `_id=${id}`).join("&");

      const response = await axios.get(
        `${API_URL}policy/excelTable?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filePath = response.data.filePath;
      console.log("file path:", IMAGE_PATH + filePath);
      setPdfUrl(IMAGE_PATH + filePath);
      console.log("pdfurl", pdfUrl);

      // const link = document.createElement('a');
      // link.href = IMAGE_PATH + filePath;
      // link.setAttribute('download', 'policies.xlsx');
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      toggleShareDialog();
    } catch (error) {
      console.error("Error fetching policy list:", error);
    }
  };

  const handleSharePdf = async () => {
    console.log("policyids---------", selectedPolicies);

    try {
      const token = localStorage.getItem("token");
      const queryParams = selectedPolicies.map((id) => `_id=${id}`).join("&");

      // Step 1: Get the actual PDF file path from backend
      const response = await axios.get(
        `${API_URL}policy/pdfTable?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filePath = response.data.filePath;
      const url = IMAGE_PATH + filePath;
      console.log("file path:", url);

      // Step 2: Fetch the file as blob
      const pdfResponse = await fetch(url);
      const blob = await pdfResponse.blob();

      // Step 3: Create a File object from blob
      const filename = filePath.split("/").pop() || "policy.pdf";
      const file = new File([blob], filename, {
        type: "application/pdf",
        lastModified: new Date(),
      });

      // Step 4: Share using Web Share API with files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Policy Document",
          text: "Here is your policy document.",
          files: [file], // THIS is the actual document being shared
        });
      } else {
        alert("Your device/browser does not support direct document sharing.");

        // Optional fallback — auto download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toggleShareDialog();
    } catch (error) {
      console.error("Error sharing policy document:", error);
    }
  };

  const handleCheckboxChange = (policyId) => {
    setSelectedPolicies((prevSelected) =>
      prevSelected.includes(policyId)
        ? prevSelected.filter((id) => id !== policyId)
        : [...prevSelected, policyId]
    );
  };
  console.log("selected policiedddd", selectedPolicies);
  const [policyListLength, setPolicyListLength] = useState(0);
  const [archieveList, setArchieveList] = useState(0);

  const handlePolicyListLengthChange = (length) => {
    setPolicyListLength(length);
    console.log("policylistlength", policyListLength);
  };

  const handleArchieveListChange = (length) => {
    setArchieveList(length);
  };
  return (
    <>
      <div className="overflow-hidden">
        <Navbar />

        <div
          className="bg-color"
          style={{ backgroundColor: THEME_COLOR.BACKGROUND }}
        >
          <Stack spacing={2} className="p-5">
            <div className={classes.breadcrumbsContainer}>
              <Breadcrumbs
                // separator={<span className={classes.separator}>:</span>}
                aria-label="breadcrumb"
              >
                <Link
                  key="1"
                  className="text-decoration-none font-size"
                  onClick={handleClick}
                  style={{
                    paddingTop: '10px',
                    fontSize: '21px',
                    color: THEME_COLOR.COLOR,
                    display: 'inline-block'
                  }}
                >
                  My Link
                </Link>

                <Typography
                  className="cursor-pointer font-size"
                  style={{ paddingTop: '10px', fontSize: "21px", color: THEME_COLOR.COLOR }}
                >
                  My Policies
                </Typography>
              </Breadcrumbs>
              {policyListLength > 0 && (
                <img
                  src={share}
                  alt="Share Icon"
                  className="ml-4"
                  onClick={handleShareIconClick}
                  style={{
                    paddingTop: '10px',
                    height: '70px',
                    width: '50px', // maintain aspect ratio if needed
                    cursor: 'pointer',
                    objectFit: 'contain', // ensures it doesn’t stretch weirdly
                  }}
                  width={30}
                />
              )}
              <GradientButton
                text="Add Policy"
                size="ml"
                className="ml-5 mb-3"
                startIcon={AddIcon}
                onClick={handleClickOpen}
                style={{
                    paddingTop: '18px',
                    height: '70px',
                    width: '50px', // maintain aspect ratio if needed
                    cursor: 'pointer',
                    objectFit: 'contain', // ensures it doesn’t stretch weirdly
                  }}
              />
              {shareAllPolicy && (
                <>
                  <Button
                    text="Export to Excel"
                    size="md"
                    className="ml-4 "
                    onClick={handleShareClick}
                  />
                  <Button
                    text="Export to PDF"
                    size="md"
                    className="ml-4 "
                    onClick={handleSharePdf}
                  />
                </>
              )}
            </div>
          </Stack>
          <Grid container spacing={-4}>
            <Grid item xs={12} md={7} lg={7} xl={7}>
              <PolicyTabs
                handleCardClick={handleCardClick}
                shareAllPolicy={shareAllPolicy}
                selectedPolicies={selectedPolicies}
                handleCheckboxChange={handleCheckboxChange}
                onPolicyListLengthChange={handlePolicyListLengthChange}
                onArchieveListLength={handleArchieveListChange}
              />
            </Grid>
            <Grid item xs={12} md={5} lg={5} xl={5}>
              <PolicyDetail policyId={selectedPolicyId} />
            </Grid>
          </Grid>
        </div>
        <Footer />

        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          className=""
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            className="text-center fw-bold pt-5 fs-2"
            id="customized-dialog-title"
          >
            Add Policies
          </DialogTitle>
          <Typography
            className=" text-center px-5"
            style={{ color: "#616060", fontSize: "20px" }}
          >
            Effortlessly upload documents, fill forms with ease.
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent className="p-5">
            <Card
              className="border mx-3"
              style={{ boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px" }}
            >
              {!files ? (
                <React.Fragment>
                  <input
                    type="file"
                    multiple
                    onChange={handleFile}
                    hidden
                    ref={inputRef}
                  />
                  <Card
                    className=" p-3  cursor-pointer d-flex justify-content-center"
                    onClick={() => inputRef.current.click()}
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      fontSize: "18px",
                      boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
                    }}
                  >
                    <img src={uploadPdf} alt="" height={28} className="mr-3" />
                    <p>Upload Document</p>
                  </Card>
                </React.Fragment>
              ) : (
                Array.from(files).map((file, indx) => (
                  <Card
                    className="d-flex justify-content-between p-3 cursor-pointer "
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      fontSize: "18px",
                    }}
                    key={indx}
                  >
                    {file.name}
                    <IconButton
                      aria-label="close"
                      onClick={() => setFiles(null)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Card>
                ))
              )}
            </Card>

            <Card
              className="m-3 border"
              style={{ boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px" }}
            >
              {!image ? (
                <React.Fragment>
                  <input
                    type="file"
                    multiple
                    onChange={handleImage}
                    hidden
                    ref={imageRef}
                  />
                  <Card
                    className="d-flex justify-content-center card-detail p-3  cursor-pointer"
                    onClick={() => imageRef.current.click()}
                    style={{
                      fontSize: "18px",
                      boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
                    }}
                  >
                    <img src={uploadImg} alt="" height={32} className="mr-3" />
                    <p>Upload Image</p>
                  </Card>
                </React.Fragment>
              ) : (
                Array.from(image).map((image, indx) => (
                  <Card
                    className="d-flex justify-content-between p-3 cursor-pointer "
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      fontSize: "18px",
                    }}
                    key={indx}
                  >
                    {image.name}
                    <IconButton
                      aria-label="close"
                      onClick={() => setImage(null)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Card>
                ))
              )}
            </Card>
          </DialogContent>
        </BootstrapDialog>

        {/* Dialog box of confirm box start */}
       <BootstrapDialog
  onClose={handleConfirmDialogClose}
  aria-labelledby="confirmation-dialog-title"
  open={confirmDialogOpen}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    style: {
      borderRadius: '16px',
      padding: '24px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    },
  }}
>
  <DialogContent style={{ position: 'relative' }}>
    {loading && (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.7)',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '16px',
        }}
      >
        <Spinner
          style={{ width: '3rem', height: '3rem', color: '#8AC642' }}
          animation="border"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    )}

    <Typography
      variant="h6"
      align="center"
      gutterBottom
      style={{
        fontWeight: 600,
        fontSize: '20px',
        color: '#333',
        zIndex: 1,
        position: 'relative',
        paddingTop: loading ? '20px' : '0',
      }}
    >
      Are you sure you want to proceed?
    </Typography>
  </DialogContent>

  <DialogActions
    style={{
      justifyContent: 'center',
      padding: '16px 32px',
      gap: '16px',
    }}
  >
    <Button
      text="Cancel"
      size="md"
      block={false}
      onClick={handleConfirmDialogClose}
      style={{
        border: '2px solid #8AC642',
        color: '#8AC642',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        fontWeight: 600,
        padding: '8px 24px',
      }}
    />

    <Button
      text="Confirm"
      size="md"
      block={false}
      onClick={handleConfirm}
      style={{
        backgroundColor: '#8AC642',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        padding: '8px 24px',
      }}
    />
  </DialogActions>
</BootstrapDialog>        
      </div>
    </>
  );
};

export default Vault;
