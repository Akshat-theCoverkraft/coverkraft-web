// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Typography,
//   Button,
//   Card,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   CircularProgress,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import gmailImage from "../../Images/Gmail.png";
// import gmailIcon from "../../Images/logos_google-gmail.png";
// import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { auth, provider } from "../component/Firebase";
// import API_URL from "../../ServiceModule/Service";

// const GmailSyncPage = () => {
//   const navigate = useNavigate();
//   const [signingIn, setSigningIn] = useState(false);
//   const [toast, setToast] = useState({
//     open: false,
//     message: "",
//     type: "success",
//   });

//   const userIds = sessionStorage.getItem("userId");

//   // Show toast notification
//   const showToast = ({ message, type }) => {
//     setToast({ open: true, message, type });
//   };

//   // Close toast
//   const handleCloseToast = () => {
//     setToast({ ...toast, open: false });
//   };

//   // Format date for Gmail query (YYYY/MM/DD)
//   const formatDateForGmail = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}/${month}/${day}`;
//   };

//   // Get last fetch date (mock implementation - replace with actual API call)
//   const getLastFetchDate = async (userEmail, userId) => {
//     try {
//       // Replace with actual API call to get last sync date
//       const response = await fetch(
//         `${API_URL}gmail-sync/last-sync?gmailAddress=${userEmail}&userId=${userIds}`
//       );
//       if (response.ok) {
//         return await response.json();
//       }
//       return null;
//     } catch (error) {
//       console.error("Error getting last fetch date:", error);
//       return null;
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     if (signingIn) return;
//     setSigningIn(true);

//     try {
//       // Sign out if previously signed in
//       if (auth.currentUser) {
//         await auth.signOut();
//       }

//       const result = await signInWithPopup(auth, provider);

//       console.lof("result", result);
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential?.accessToken;
//       const user = result?.user;

//       if (!token || !user) {
//         console.error("Missing token or user info:", { credential, user });
//         showToast({
//           type: "error",
//           message: "Google sign-in failed to retrieve credentials.",
//         });
//         return;
//       }

//       const userEmail = user.email || user.providerData?.[0]?.email;
//       const userId = user.uid;

//       if (!userEmail) {
//         console.error("User email not found:", user);
//         showToast({
//           type: "error",
//           message: "Could not fetch your email. Please try again.",
//         });
//         return;
//       }

//       console.log("Authenticated user:", userEmail);
//       await fetchGmailMessages(token, userEmail, userIds);
//     } catch (error) {
//       showToast({
//         type: "error",
//         message: `Please select email account to start sync.`,
//       });
//     } finally {
//       setSigningIn(false);
//     }
//   };

//   const fetchGmailMessages = async (accessToken, userEmail, userId) => {
//     try {
//       // Get last fetch date to determine query range
//       const lastFetchData = await getLastFetchDate(userEmail, userId);
//       let dateQuery = "";
//       const currentDate = new Date();

//       const tomorrowDate = new Date(currentDate);
//       tomorrowDate.setDate(currentDate.getDate() + 1);

//       if (!lastFetchData || !lastFetchData.lastSyncedAt) {
//         // First time sync - get last 3 years
//         const threeYearsAgo = new Date();
//         threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

//         const fromDate = formatDateForGmail(threeYearsAgo);
//         const toDate = formatDateForGmail(tomorrowDate);

//         dateQuery = `after:${fromDate} before:${toDate}`;
//         console.log(
//           `3 years fetch: Getting data from ${fromDate} to ${toDate}`
//         );
//       } else {
//         // Incremental sync
//         const lastFetchDate = new Date(lastFetchData.lastSyncedAt);
//         const fromDate = formatDateForGmail(lastFetchDate);
//         const toDate = formatDateForGmail(currentDate);

//         dateQuery = `after:${fromDate} before:${toDate}`;
//         console.log(
//           `Incremental fetch: Getting data from ${fromDate} to ${toDate}`
//         );
//       }

//       const senderDomains = [
//         "bytesfarms.com",
//         "licindia.com",
//         "maxlifeinsurance.com",
//         "hdfclife.com",
//         "iciciprulife.com",
//         "kotak.com",
//         "adityabirlacapital.com",
//         "tataaia.com",
//         "sbilife.co.in",
//         "bajajallianz.co.in",
//         "pnbmetlife.co.in",
//         "relianceada.com",
//         "avivaindia.com",
//         "sahara.in",
//         "shriramlife.in",
//         "bhartiaxa.com",
//         "futuregenerali.in",
//         "ageasfederal.com",
//         "canarahsbclife.in",
//         "bandhanlife.com",
//         "pramericalife.in",
//         "sudlife.in",
//         "indiafirstlife.com",
//         "edelweisslife.in",
//         "calife.in",
//         "acko.com",
//         "godigit.com",
//         "aicofindia.com",
//         "cholams.murugappa.com",
//         "ecgc.in",
//         "hdfcergo.com",
//         "icicilombard.com",
//         "iffcotokio.co.in",
//         "zurichkotak.com",
//         "kshema.co",
//         "libertyinsurance.in",
//         "magmainsurance.com",
//         "nic.co.in",
//         "navi.com",
//         "rahejaqbe.com",
//         "royalsundaram.in",
//         "sbigeneral.in",
//         "shriramgi.com",
//         "tataaig.com",
//         "newindia.co.in",
//         "orientalinsurance.co.in",
//         "uiic.co.in",
//         "universalsompo.com",
//         "hizuno.com",
//         "careinsurance.com",
//         "galaxyhealth.com",
//         "narayanahealth.insurance",
//         "manipalcigna.com",
//         "nivabupa.com",
//         "starhealth.in",
//         "trans.hdfcergo.email",
//       ];

//       const subjectRegexPatterns = [
//         /policy\s*(document|doc|copy|papers?)/i,
//         /insurance\s*(policy|document|papers?|certificate)/i,
//         /certificate\s*(of\s*)?(insurance|policy)/i,
//         /(policy|insurance).*pdf/i,
//         /e-?(policy|document|certificate)/i,
//         /policy.*issued/i,
//         /policy/i, // This will match any email with "policy" in subject
//         /certificate/i, // This will match any email with "certificate" in subject
//         /renewal\s*(confirmation|receipt|document)/i,
//         /(premium|payment)\s*(paid|received|confirmation).*policy/i,
//       ];

//       const marketingExclusionPatterns = [
//         /quotation/i,
//         /quote/i,
//         /renewal\s*quotation/i,
//         /renewal\s*quote/i,
//         /insurance\s*quotation/i,
//         /insurance\s*quote/i,
//         /get\s*(free\s*)?quote/i,
//         /pay/i,

//         /(limited\s*time|exclusive|special).*offer/i,
//         /save\s*(up\s*to\s*)?\d+%/i,
//         /discount.*\d+%/i,
//         /\d+%.*off/i,
//         /buy\s*now/i,
//         /compare\s*(plans|rates)/i,
//         /call\s*(us\s*)?(now|today)/i,
//         /newsletter/i,
//         /weekly\s*digest/i,
//         /monthly\s*update(?!.*policy)/i,
//         /(winner|congratulations).*selected/i,
//         /claim\s*your\s*(prize|reward|gift)/i,
//         /you.*won/i,
//         /follow\s*us\s*on/i,
//         /like\s*us\s*on\s*facebook/i,
//         /limited\s*period(?!.*policy)/i,
//         /hurry\s*up/i,
//         /don't\s*miss\s*out/i,
//         /act\s*now/i,
//         /cheapest\s*premium/i,
//         /lowest\s*rates/i,
//         /best\s*deal/i,
//         /take\s*our\s*survey/i,
//         /rate\s*us/i,
//         /feedback.*survey/i,
//         /unsubscribe/i,
//         /promotional/i,
//         /advertisement/i,
//         /marketing/i,
//         /webinar/i,
//         /seminar/i,
//         /workshop/i,
//         /event\s*invitation/i,
//         /register\s*now/i,
//         /book\s*now/i,
//         /free\s*trial/i,
//         /demo/i,
//       ];

//       const isMarketingEmail = (subject) => {
//         return marketingExclusionPatterns.some((pattern) =>
//           pattern.test(subject)
//         );
//       };

//       const getSubjectPriority = (subject: any) => {
//         return subjectRegexPatterns.some((pattern) => pattern.test(subject))
//           ? 1
//           : 0;
//       };

//       const domainQuery = senderDomains
//         .map((domain) => `from:${domain}`)
//         .join(" OR ");

//       const query = `(${domainQuery}) (label:spam OR label:inbox OR label:junk) ${dateQuery}`;

//       const gmailUrl = `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(
//         query
//       )}`;

//       const response = await fetch(gmailUrl, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       const data = await response.json();

//       if (
//         !data.messages ||
//         data.messages.length === 0 ||
//         data.resultSizeEstimate === 0
//       ) {
//         showToast({
//           type: "success",
//           message:
//             "Sync completed successfully. No new policy documents found.",
//         });
//         return;
//       }

//       console.log("response", data);
//       console.log(`Found ${data.messages.length} messages to process`);

//       const domainHitCount = {};

//       const skippedReasons = {
//         marketing: 0,
//         noAttachment: 0,
//         wrongDomain: 0,
//       };

//       const skippedSubjects = {
//         marketing: [],
//         noAttachment: [],
//         wrongDomain: [],
//       };

//       const emailsWithPriority = [];

//       // Filter emails with attachments from target domains
//       for (let index = 0; index < data.messages.length; index++) {
//         const msg = data.messages[index];

//         try {
//           const emailData = await fetch(
//             `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
//             {
//               headers: { Authorization: `Bearer ${accessToken}` },
//             }
//           );

//           const emailResponse = await emailData.json();
//           console.log("this is emailData", emailResponse);

//           const headers = emailResponse.payload.headers;
//           const fromHeader =
//             headers.find((h) => h.name === "From")?.value || "";

//           const emailMatch = fromHeader.match(/<([^>]+)>/);
//           const senderEmail = emailMatch ? emailMatch[1] : fromHeader;
//           const senderDomain = senderEmail.split("@")[1];

//           if (!senderDomains.includes(senderDomain)) {
//             skippedReasons.wrongDomain++;
//             skippedSubjects.wrongDomain.push({
//               subject: subject,
//               domain: senderDomain,
//             });
//             continue;
//           }

//           const isMarketing = isMarketingEmail(subject);
//           if (isMarketing) {
//             skippedReasons.marketing++;
//             skippedSubjects.marketing.push({
//               subject: subject,
//               domain: senderDomain,
//             });
//             continue;
//           }

//           const parts = emailData.data.payload?.parts || [];
//           const hasAttachment = parts.some((part) => part.body?.attachmentId);

//           if (!hasAttachment) {
//             skippedReasons.noAttachment++;
//             skippedSubjects.noAttachment.push({
//               subject: subject,
//               domain: senderDomain,
//             });
//             continue;
//           }

//           const subjectPriority = getSubjectPriority(subject);

//           domainHitCount[senderDomain] =
//             (domainHitCount[senderDomain] || 0) + 1;

//           emailsWithPriority.push({
//             id: msg.id,
//             subject: subject,
//             domain: senderDomain,
//             priority: subjectPriority,
//           });
//         } catch (err) {
//           console.error(`Error filtering email ${msg.id}:`, err);
//         }
//       }

//       emailsWithPriority.sort((a, b) => b.priority - a.priority);

//       const finalMatchedEmails = emailsWithPriority.map((email) => email.id);

//       if (skippedSubjects.marketing.length > 0) {
//         skippedSubjects.marketing.forEach((item, index) => {
//           console.log(
//             `Marketing ${index + 1}: ${item.subject} (${item.domain})`
//           );
//         });
//       }

//       if (skippedSubjects.noAttachment.length > 0) {
//         skippedSubjects.noAttachment.forEach((item, index) => {
//           console.log(
//             `No Attachment ${index + 1}: ${item.subject} (${item.domain})`
//           );
//         });
//       }

//       collectedFiles.length = 0;

//       if (finalMatchedEmails.length > 0) {
//         showGlobalToast(
//           {
//             title: "Fetching your policies securely…",
//             description:
//               "FetchingThis process typically takes 2–5 minutes to complete.",
//           },
//           "sync"
//         );
//         await Promise.allSettled(
//           finalMatchedEmails.map((msg) =>
//             fetchAndSavePDF(msg, tokens.accessToken)
//           )
//         );

//         if (collectedFiles.length > 0) {
//           await handleUploadDocFromGmail(collectedFiles, userEmail);
//         }

//         Object.entries(domainHitCount).forEach(([domain, count]) =>
//           console.log(`- ${domain}: ${count} email(s)`)
//         );
//       } else {
//         showToast({
//           type: "success",
//           message: "Sync complete! No policy emails found in your inbox.",
//         });
//       }
//     } catch (error) {
//       console.error("Gmail fetch error:", error);
//       showToast({
//         type: "error",
//         message: "Oops! Something went wrong.",
//       });
//     }
//   };

//   const fetchAndProcessPDF = async (messageId, accessToken) => {
//     try {
//       const headers = { Authorization: `Bearer ${accessToken}` };

//       const messageUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
//       const messageResponse = await fetch(messageUrl, { headers });

//       if (!messageResponse.ok) throw new Error("Failed to fetch message");

//       const message = await messageResponse.json();
//       const parts = message.payload?.parts || [];

//       const pdfAttachment = parts.find(
//         (part) => part?.mimeType === "application/pdf"
//       );

//       if (!pdfAttachment || !pdfAttachment.body.attachmentId) {
//         return null;
//       }

//       const attachmentUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${pdfAttachment.body.attachmentId}`;
//       const attachmentResponse = await fetch(attachmentUrl, { headers });

//       console.log("attachment response", attachmentResponse);

//       if (!attachmentResponse.ok) throw new Error("Failed to fetch attachment");

//       const attachmentData = await attachmentResponse.json();
//       let base64Data = attachmentData?.data;

//       if (!base64Data) {
//         throw new Error("No attachment data found");
//       }

//       // Convert URL-safe base64 to standard base64
//       base64Data = base64Data.replace(/-/g, "+").replace(/_/g, "/");

//       const fileName = `attachment_${messageId}.pdf`;

//       console.log(`PDF processed: ${fileName}`);

//       return {
//         base64Data,
//         fileName,
//         messageId,
//       };
//     } catch (error) {
//       console.error(`Error fetching PDF for message ${messageId}:`, error);
//       showToast({
//         type: "error",
//         message: `Error fetching PDF for message ${messageId}`,
//       });
//       return null;
//     }
//   };

//   // Helper function to convert base64 to Blob
//   const base64ToBlob = (base64Data, mimeType = "application/pdf") => {
//     const byteCharacters = atob(base64Data);
//     const byteNumbers = new Array(byteCharacters.length);

//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }

//     const byteArray = new Uint8Array(byteNumbers);
//     return new Blob([byteArray], { type: mimeType });
//   };

//   // Solution 1: Send as JSON string (Recommended for web)
//   // const createGmailUploadFormData = (files, userId, gmailAddress, emailId = null, fileType = 'application/pdf') => {
//   //     const formData = new FormData();
//   //     formData.append('userId', userId);
//   //     formData.append('gmailAddress', gmailAddress);
//   //     formData.append('emailId', emailId);
//   //     formData.append('fileType', fileType);
//   //     console.log('this is files : ', files)
//   //     const attachments = files.map(({ base64Data, fileName }) => ({
//   //         uri: `data:${fileType};base64,${base64Data}`,
//   //         name: fileName,
//   //         type: fileType,
//   //     }));
//   //     // Send as JSON string
//   //     formData.append('attachments', JSON.stringify(attachments));
//   //     console.log(`Added ${files.length} attachments as JSON`);
//   //     return formData;
//   // };
//   ///updated code

//   const createGmailUploadFormData = (
//     files,
//     userId,
//     gmailAddress,
//     emailId = null,
//     fileType = "application/pdf"
//   ) => {
//     const formData = new FormData();
//     formData.append("userId", userId);
//     formData.append("gmailAddress", gmailAddress);
//     if (emailId) formData.append("emailId", emailId);
//     formData.append("fileType", fileType);

//     console.log("Preparing to append files to FormData:", files.length);

//     files.forEach(({ base64Data, fileName }, index) => {
//       const byteString = atob(base64Data);
//       const byteArray = new Uint8Array(byteString.length);
//       for (let i = 0; i < byteString.length; i++) {
//         byteArray[i] = byteString.charCodeAt(i);
//       }

//       const blob = new Blob([byteArray], { type: fileType });

//       formData.append("attachments", blob, fileName);
//     });

//     return formData;
//   };

//   const handleUploadDocFromGmail = async (files, userEmail, userId) => {
//     console.log("userData from doc : ", files, userEmail, userId);
//     return new Promise(async (resolve, reject) => {
//       try {
//         if (!files?.length) return reject("No files to upload");

//         console.log(
//           `Starting batch upload of ${files.length} files for user: ${userEmail}`
//         );

//         // Create FormData using the helper function that matches documentUploadFormDataGmail pattern
//         const formData = createGmailUploadFormData(files, userId, userEmail);

//         console.log("Uploading form data...", formData);

//         const response = await fetch(`${API_URL}gmail-sync/sync`, {
//           method: "POST",
//           body: formData,
//         });

//         const result = await response.json();
//         console.log("Upload result:", result);

//         if (result?.success) {
//           showToast({
//             message: "Sync completed successfully.",
//             type: "success",
//           });
//           resolve(true);
//         } else {
//           showToast({
//             message: result?.message || "Gmail sync failed. Please try again.",
//             type: "error",
//           });
//           reject(new Error(result?.message || "Upload failed"));
//         }
//       } catch (error) {
//         console.error("Gmail sync error:", error);

//         // Handle different types of errors
//         let errorMessage = "An unexpected error occurred. Please try again.";

//         if (error.response) {
//           const status = error.response.status;
//           const responseError =
//             error.response.data?.message || error.response.data?.error;

//           switch (status) {
//             case 400:
//               errorMessage =
//                 responseError || "Invalid request. Please check your data.";
//               break;
//             case 401:
//               errorMessage = "Authentication failed. Please login again.";
//               break;
//             case 403:
//               errorMessage =
//                 "Access denied. You don't have permission to sync Gmail.";
//               break;
//             case 429:
//               errorMessage =
//                 "Too many requests. Please wait a moment and try again.";
//               break;
//             case 500:
//               errorMessage = "Server error. Please try again later.";
//               break;
//             default:
//               errorMessage =
//                 responseError || `Request failed with status ${status}`;
//           }
//         } else if (error.request) {
//           errorMessage =
//             "Network error. Please check your connection and try again.";
//         } else if (error.message) {
//           errorMessage = error.message;
//         }

//         showToast({
//           message: errorMessage,
//           type: "error",
//         });

//         reject(error);
//       }
//     });
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#121212",
//         minHeight: "100vh",
//         padding: "20px",
//         color: "#ffffff",
//       }}
//     >
//       <div
//         style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}
//       >
//         <ArrowBackIosNewIcon
//           style={{ color: "#ffffff", cursor: "pointer", marginRight: "8px" }}
//           onClick={() => navigate(-1)}
//         />
//         <Typography variant="h6" style={{ fontWeight: 700 }}>
//           Fetching policies from Gmail
//         </Typography>
//       </div>

//       <div style={{ textAlign: "center", marginBottom: "32px" }}>
//         <img
//           src={gmailImage}
//           alt="gmail cloud"
//           style={{ width: "80%", maxWidth: "500px", height: "auto" }}
//         />
//       </div>

//       <div style={{ textAlign: "center", marginBottom: "40px" }}>
//         <Button
//           onClick={handleGoogleSignIn}
//           variant="contained"
//           disabled={signingIn}
//           style={{
//             backgroundColor: signingIn ? "#cccccc" : "#7ED957",
//             borderRadius: "100px",
//             padding: "12px 24px",
//             color: signingIn ? "#666666" : "#000",
//             fontWeight: 600,
//             fontSize: "16px",
//             textTransform: "none",
//             maxWidth: "520px",
//             position: "relative",
//           }}
//           startIcon={
//             signingIn ? (
//               <CircularProgress size={24} style={{ color: "#666666" }} />
//             ) : (
//               <img
//                 src={gmailIcon}
//                 alt="Gmail"
//                 style={{ width: 24, height: 24 }}
//               />
//             )
//           }
//         >
//           {signingIn ? "Syncing..." : "Sign in with Gmail"}
//         </Button>
//       </div>

//       <Card
//         style={{
//           backgroundColor: "#212121",
//           padding: "20px",
//           borderRadius: "20px",
//           color: "#fff",
//           margin: "0 auto",
//           marginTop: "32px",
//           maxWidth: "520px",
//         }}
//       >
//         <Typography
//           variant="h5"
//           style={{ marginBottom: "16px", fontWeight: 700, textAlign: "left" }}
//         >
//           CoverKraft's Promise
//         </Typography>

//         <List dense>
//           {[
//             "Your data is 100% safe & secure",
//             "Quick and hassle-free setup",
//             "Unlink Gmail anytime with ease",
//           ].map((text, i) => (
//             <ListItem key={i}>
//               <ListItemIcon>
//                 <CheckCircleIcon sx={{ color: "#7ED957", fontSize: 28 }} />
//               </ListItemIcon>
//               <ListItemText
//                 primary={text}
//                 primaryTypographyProps={{ fontSize: "16px", fontWeight: 500 }}
//               />
//             </ListItem>
//           ))}
//         </List>
//       </Card>

//       {/* Toast Notification */}
//       <Snackbar
//         open={toast.open}
//         autoHideDuration={6000}
//         onClose={handleCloseToast}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseToast}
//           severity={toast.type === "error" ? "error" : toast.type}
//           sx={{ width: "100%" }}
//         >
//           {toast.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default GmailSyncPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import gmailImage from "../../Images/Gmail.png";
import gmailIcon from "../../Images/logos_google-gmail.png";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../component/Firebase";
import API_URL from "../../ServiceModule/Service";

const GmailSyncPage = () => {
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const userIds = sessionStorage.getItem("userId");

  const [collectedFiles, setCollectedFiles] = useState([]);

  const showToast = ({ message, type }) => {
    setToast({ open: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const showGlobalToast = (config, type) => {
    console.log(`Global Toast (${type}):`, config);
    showToast({
      message: `${config.title} - ${config.description}`,
      type: "info",
    });
  };

  const formatDateForGmail = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const getLastFetchDate = async (userEmail, userId) => {
    try {
      const response = await fetch(
        `${API_URL}gmail-sync/last-sync?gmailAddress=${userEmail}&userId=${userIds}`
      );
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error getting last fetch date:", error);
      return null;
    }
  };

  const handleGoogleSignIn = async () => {
    if (signingIn) return;
    setSigningIn(true);

    try {
      // Sign out if previously signed in
      if (auth.currentUser) {
        await auth.signOut();
      }

      const result = await signInWithPopup(auth, provider);

      // Fixed typo: console.lof -> console.log
      console.log("result", result);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result?.user;

      if (!token || !user) {
        console.error("Missing token or user info:", { credential, user });
        showToast({
          type: "error",
          message: "Google sign-in failed to retrieve credentials.",
        });
        return;
      }

      const userEmail = user.email || user.providerData?.[0]?.email;
      const userId = user.uid;

      if (!userEmail) {
        console.error("User email not found:", user);
        showToast({
          type: "error",
          message: "Could not fetch your email. Please try again.",
        });
        return;
      }

      console.log("Authenticated user:", userEmail);
      await fetchGmailMessages(token, userEmail, userIds);
    } catch (error) {
      console.error("Google sign-in error:", error);
      showToast({
        type: "error",
        message: `Please select email account to start sync.`,
      });
    } finally {
      setSigningIn(false);
    }
  };

  const fetchGmailMessages = async (accessToken, userEmail, userId) => {
    try {
      // Get last fetch date to determine query range
      const lastFetchData = await getLastFetchDate(userEmail, userId);
      let dateQuery = "";
      const currentDate = new Date();

      const tomorrowDate = new Date(currentDate);
      tomorrowDate.setDate(currentDate.getDate() + 1);

      if (!lastFetchData || !lastFetchData.lastSyncedAt) {
        // First time sync - get last 3 years
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

        const fromDate = formatDateForGmail(threeYearsAgo);
        const toDate = formatDateForGmail(tomorrowDate);

        dateQuery = `after:${fromDate} before:${toDate}`;
        console.log(
          `3 years fetch: Getting data from ${fromDate} to ${toDate}`
        );
      } else {
        // Incremental sync
        const lastFetchDate = new Date(lastFetchData.lastSyncedAt);
        const fromDate = formatDateForGmail(lastFetchDate);
        const toDate = formatDateForGmail(currentDate);

        dateQuery = `after:${fromDate} before:${toDate}`;
        console.log(
          `Incremental fetch: Getting data from ${fromDate} to ${toDate}`
        );
      }

      const senderDomains = [
        "bytesfarms.com",
        "licindia.com",
        "maxlifeinsurance.com",
        "hdfclife.com",
        "iciciprulife.com",
        "kotak.com",
        "adityabirlacapital.com",
        "tataaia.com",
        "sbilife.co.in",
        "bajajallianz.co.in",
        "pnbmetlife.co.in",
        "relianceada.com",
        "avivaindia.com",
        "sahara.in",
        "shriramlife.in",
        "bhartiaxa.com",
        "futuregenerali.in",
        "ageasfederal.com",
        "canarahsbclife.in",
        "bandhanlife.com",
        "pramericalife.in",
        "sudlife.in",
        "indiafirstlife.com",
        "edelweisslife.in",
        "calife.in",
        "acko.com",
        "godigit.com",
        "aicofindia.com",
        "cholams.murugappa.com",
        "ecgc.in",
        "hdfcergo.com",
        "icicilombard.com",
        "iffcotokio.co.in",
        "zurichkotak.com",
        "kshema.co",
        "libertyinsurance.in",
        "magmainsurance.com",
        "nic.co.in",
        "navi.com",
        "rahejaqbe.com",
        "royalsundaram.in",
        "sbigeneral.in",
        "shriramgi.com",
        "tataaig.com",
        "newindia.co.in",
        "orientalinsurance.co.in",
        "uiic.co.in",
        "universalsompo.com",
        "universalsompo.co.in",
        "hizuno.com",
        "careinsurance.com",
        "galaxyhealth.com",
        "narayanahealth.insurance",
        "manipalcigna.com",
        "nivabupa.com",
        "starhealth.in",
        "trans.hdfcergo.email",
      ];

      const subjectRegexPatterns = [
        /policy\s*(document|doc|copy|papers?)/i,
        /insurance\s*(policy|document|papers?|certificate)/i,
        /certificate\s*(of\s*)?(insurance|policy)/i,
        /(policy|insurance).*pdf/i,
        /e-?(policy|document|certificate)/i,
        /policy.*issued/i,
        /policy/i, // This will match any email with "policy" in subject
        /certificate/i, // This will match any email with "certificate" in subject
        /renewal\s*(confirmation|receipt|document)/i,
        /(premium|payment)\s*(paid|received|confirmation).*policy/i,
      ];

      const marketingExclusionPatterns = [
        /quotation/i,
        /quote/i,
        /renewal\s*quotation/i,
        /renewal\s*quote/i,
        /insurance\s*quotation/i,
        /insurance\s*quote/i,
        /get\s*(free\s*)?quote/i,
        /pay/i,
        /(limited\s*time|exclusive|special).*offer/i,
        /save\s*(up\s*to\s*)?\d+%/i,
        /discount.*\d+%/i,
        /\d+%.*off/i,
        /buy\s*now/i,
        /compare\s*(plans|rates)/i,
        /call\s*(us\s*)?(now|today)/i,
        /newsletter/i,
        /weekly\s*digest/i,
        /monthly\s*update(?!.*policy)/i,
        /(winner|congratulations).*selected/i,
        /claim\s*your\s*(prize|reward|gift)/i,
        /you.*won/i,
        /follow\s*us\s*on/i,
        /like\s*us\s*on\s*facebook/i,
        /limited\s*period(?!.*policy)/i,
        /hurry\s*up/i,
        /don't\s*miss\s*out/i,
        /act\s*now/i,
        /cheapest\s*premium/i,
        /lowest\s*rates/i,
        /best\s*deal/i,
        /take\s*our\s*survey/i,
        /rate\s*us/i,
        /feedback.*survey/i,
        /unsubscribe/i,
        /promotional/i,
        /advertisement/i,
        /marketing/i,
        /webinar/i,
        /seminar/i,
        /workshop/i,
        /event\s*invitation/i,
        /register\s*now/i,
        /book\s*now/i,
        /free\s*trial/i,
        /demo/i,
      ];

      const isMarketingEmail = (subject) => {
        return marketingExclusionPatterns.some((pattern) =>
          pattern.test(subject)
        );
      };

      // Fixed TypeScript annotation in JavaScript file
      const getSubjectPriority = (subject) => {
        return subjectRegexPatterns.some((pattern) => pattern.test(subject))
          ? 1
          : 0;
      };

      const domainQuery = senderDomains
        .map((domain) => `from:${domain}`)
        .join(" OR ");

      const query = `(${domainQuery}) (label:spam OR label:inbox OR label:junk) ${dateQuery}`;

      const gmailUrl = `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(
        query
      )}`;

      const response = await fetch(gmailUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (
        !data.messages ||
        data.messages.length === 0 ||
        data.resultSizeEstimate === 0
      ) {
        showToast({
          type: "success",
          message:
            "Sync completed successfully. No new policy documents found.",
        });
        return;
      }

      console.log("response", data);
      console.log(`Found ${data.messages.length} messages to process`);

      const domainHitCount = {};

      const skippedReasons = {
        marketing: 0,
        noAttachment: 0,
        wrongDomain: 0,
      };

      const skippedSubjects = {
        marketing: [],
        noAttachment: [],
        wrongDomain: [],
      };

      const emailsWithPriority = [];

      // Filter emails with attachments from target domains
      for (let index = 0; index < data.messages.length; index++) {
        const msg = data.messages[index];

        try {
          const emailData = await fetch(
            `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          const emailResponse = await emailData.json();
          console.log("this is emailData", emailResponse);

          const headers = emailResponse.payload.headers;
          const fromHeader =
            headers.find((h) => h.name === "From")?.value || "";

          const subject =
            headers.find((h) => h.name === "Subject")?.value || "";

          const emailMatch = fromHeader.match(/<([^>]+)>/);
          const senderEmail = emailMatch ? emailMatch[1] : fromHeader;
          const senderDomain = senderEmail.split("@")[1];

          if (!senderDomains.includes(senderDomain)) {
            skippedReasons.wrongDomain++;
            skippedSubjects.wrongDomain.push({
              subject: subject,
              domain: senderDomain,
            });
            continue;
          }

          const isMarketing = isMarketingEmail(subject);
          if (isMarketing) {
            skippedReasons.marketing++;
            skippedSubjects.marketing.push({
              subject: subject,
              domain: senderDomain,
            });
            continue;
          }

          const parts = emailResponse.payload?.parts || [];
          const hasAttachment = parts.some((part) => part.body?.attachmentId);

          if (!hasAttachment) {
            skippedReasons.noAttachment++;
            skippedSubjects.noAttachment.push({
              subject: subject,
              domain: senderDomain,
            });
            continue;
          }

          const subjectPriority = getSubjectPriority(subject);

          domainHitCount[senderDomain] =
            (domainHitCount[senderDomain] || 0) + 1;

          emailsWithPriority.push({
            id: msg.id,
            subject: subject,
            domain: senderDomain,
            priority: subjectPriority,
          });
        } catch (err) {
          console.error(`Error filtering email ${msg.id}:`, err);
        }
      }

      emailsWithPriority.sort((a, b) => b.priority - a.priority);

      const finalMatchedEmails = emailsWithPriority.map((email) => email.id);

      if (skippedSubjects.marketing.length > 0) {
        skippedSubjects.marketing.forEach((item, index) => {
          console.log(
            `Marketing ${index + 1}: ${item.subject} (${item.domain})`
          );
        });
      }

      if (skippedSubjects.noAttachment.length > 0) {
        skippedSubjects.noAttachment.forEach((item, index) => {
          console.log(
            `No Attachment ${index + 1}: ${item.subject} (${item.domain})`
          );
        });
      }

      setCollectedFiles([]);

      if (finalMatchedEmails.length > 0) {
        showGlobalToast(
          {
            title: "Fetching your policies securely…",
            description:
              "This process typically takes 2–5 minutes to complete.",
          },
          "sync"
        );

        const fileResults = await Promise.allSettled(
          finalMatchedEmails.map((msgId) =>
            fetchAndProcessPDF(msgId, accessToken)
          )
        );

        const validFiles = fileResults
          .filter((result) => result.status === "fulfilled" && result.value)
          .map((result) => result.value);

        if (validFiles.length > 0) {
          setCollectedFiles(validFiles);
          await handleUploadDocFromGmail(validFiles, userEmail, userId);
        }

        Object.entries(domainHitCount).forEach(([domain, count]) =>
          console.log(`- ${domain}: ${count} email(s)`)
        );
      } else {
        showToast({
          type: "success",
          message: "Sync complete! No policy emails found in your inbox.",
        });
      }
    } catch (error) {
      console.error("Gmail fetch error:", error);
      showToast({
        type: "error",
        message: "Oops! Something went wrong.",
      });
    }
  };

  const fetchAndProcessPDF = async (messageId, accessToken) => {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };

      const messageUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
      const messageResponse = await fetch(messageUrl, { headers });

      if (!messageResponse.ok) throw new Error("Failed to fetch message");

      const message = await messageResponse.json();
      const parts = message.payload?.parts || [];

      const pdfAttachment = parts.find(
        (part) => part?.mimeType === "application/pdf"
      );

      if (!pdfAttachment || !pdfAttachment.body.attachmentId) {
        return null;
      }

      const attachmentUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${pdfAttachment.body.attachmentId}`;
      const attachmentResponse = await fetch(attachmentUrl, { headers });

      console.log("attachment response", attachmentResponse);

      if (!attachmentResponse.ok) throw new Error("Failed to fetch attachment");

      const attachmentData = await attachmentResponse.json();
      let base64Data = attachmentData?.data;

      if (!base64Data) {
        throw new Error("No attachment data found");
      }

      // Convert URL-safe base64 to standard base64
      base64Data = base64Data.replace(/-/g, "+").replace(/_/g, "/");

      const fileName = `attachment_${messageId}.pdf`;

      console.log(`PDF processed: ${fileName}`);

      return {
        base64Data,
        fileName,
        messageId,
      };
    } catch (error) {
      console.error(`Error fetching PDF for message ${messageId}:`, error);
      showToast({
        type: "error",
        message: `Error fetching PDF for message ${messageId}`,
      });
      return null;
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64Data, mimeType = "application/pdf") => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const createGmailUploadFormData = (
    files,
    userId,
    gmailAddress,
    emailId = null,
    fileType = "application/pdf"
  ) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("gmailAddress", gmailAddress);
    if (emailId) formData.append("emailId", emailId);
    formData.append("fileType", fileType);

    console.log("Preparing to append files to FormData:", files.length);

    files.forEach(({ base64Data, fileName }, index) => {
      const byteString = atob(base64Data);
      const byteArray = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: fileType });

      formData.append("attachments", blob, fileName);
    });

    return formData;
  };

  const handleUploadDocFromGmail = async (files, userEmail, userId) => {
    console.log("userData from doc : ", files, userEmail, userId);
    return new Promise(async (resolve, reject) => {
      try {
        if (!files?.length) return reject("No files to upload");

        console.log(
          `Starting batch upload of ${files.length} files for user: ${userEmail}`
        );

        // Create FormData using the helper function that matches documentUploadFormDataGmail pattern
        const formData = createGmailUploadFormData(files, userId, userEmail);

        console.log("Uploading form data...", formData);

        const response = await fetch(`${API_URL}gmail-sync/sync`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("Upload result:", result);

        if (result?.success) {
          showToast({
            message: "Sync completed successfully.",
            type: "success",
          });
          resolve(true);
        } else {
          showToast({
            message: result?.message || "Gmail sync failed. Please try again.",
            type: "error",
          });
          reject(new Error(result?.message || "Upload failed"));
        }
      } catch (error) {
        console.error("Gmail sync error:", error);

        // Handle different types of errors
        let errorMessage = "An unexpected error occurred. Please try again.";

        if (error.response) {
          const status = error.response.status;
          const responseError =
            error.response.data?.message || error.response.data?.error;

          switch (status) {
            case 400:
              errorMessage =
                responseError || "Invalid request. Please check your data.";
              break;
            case 401:
              errorMessage = "Authentication failed. Please login again.";
              break;
            case 403:
              errorMessage =
                "Access denied. You don't have permission to sync Gmail.";
              break;
            case 429:
              errorMessage =
                "Too many requests. Please wait a moment and try again.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage =
                responseError || `Request failed with status ${status}`;
          }
        } else if (error.request) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        showToast({
          message: errorMessage,
          type: "error",
        });

        reject(error);
      }
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        padding: "20px",
        color: "#ffffff",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}
      >
        <ArrowBackIosNewIcon
          style={{ color: "#ffffff", cursor: "pointer", marginRight: "8px" }}
          onClick={() => navigate(-1)}
        />
        <Typography variant="h6" style={{ fontWeight: 700 }}>
          Fetching policies from Gmail
        </Typography>
      </div>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <img
          src={gmailImage}
          alt="gmail cloud"
          style={{ width: "80%", maxWidth: "500px", height: "auto" }}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Button
          onClick={handleGoogleSignIn}
          variant="contained"
          disabled={signingIn}
          style={{
            backgroundColor: signingIn ? "#cccccc" : "#7ED957",
            borderRadius: "100px",
            padding: "12px 24px",
            color: signingIn ? "#666666" : "#000",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            maxWidth: "520px",
            position: "relative",
          }}
          startIcon={
            signingIn ? (
              <CircularProgress size={24} style={{ color: "#666666" }} />
            ) : (
              <img
                src={gmailIcon}
                alt="Gmail"
                style={{ width: 24, height: 24 }}
              />
            )
          }
        >
          {signingIn ? "Syncing..." : "Sign in with Gmail"}
        </Button>
      </div>

      <Card
        style={{
          backgroundColor: "#212121",
          padding: "20px",
          borderRadius: "20px",
          color: "#fff",
          margin: "0 auto",
          marginTop: "32px",
          maxWidth: "520px",
        }}
      >
        <Typography
          variant="h5"
          style={{ marginBottom: "16px", fontWeight: 700, textAlign: "left" }}
        >
          CoverKraft's Promise
        </Typography>

        <List dense>
          {[
            "Your data is 100% safe & secure",
            "Quick and hassle-free setup",
            "Unlink Gmail anytime with ease",
          ].map((text, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: "#7ED957", fontSize: 28 }} />
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{ fontSize: "16px", fontWeight: 500 }}
              />
            </ListItem>
          ))}
        </List>
      </Card>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.type === "error" ? "error" : toast.type}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GmailSyncPage;
