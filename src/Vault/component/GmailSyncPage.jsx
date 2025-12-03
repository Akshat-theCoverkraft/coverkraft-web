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
import { auth } from "../component/Firebase";
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
      // Sign out any existing user first
      if (auth.currentUser) {
        await auth.signOut();
        // Wait a bit for signOut to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Create a fresh provider instance with required scopes
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
      provider.addScope('https://www.googleapis.com/auth/gmail.modify');
      
      // Set custom parameters to force account selection
      provider.setCustomParameters({
        prompt: 'select_account',
        access_type: 'offline'
      });

      // Attempt sign in with popup
      const result = await signInWithPopup(auth, provider);
      
      // Get credentials from result
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result?.user;

      // Validate we got what we need
      if (!token || !user) {
        throw new Error("Missing authentication credentials");
      }

      const userEmail = user.email || user.providerData?.[0]?.email;

      if (!userEmail) {
        throw new Error("Could not retrieve email address");
      }

      console.log("✅ Authentication successful for:", userEmail);
      
      // Proceed with Gmail sync
      await fetchGmailMessages(token, userEmail, userIds);
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      let errorMessage = "Sign-in failed. Please try again.";
      
      // Handle specific Firebase error codes
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign-in cancelled. Please try again.";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Pop-up was blocked by your browser. Please allow pop-ups and try again.";
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = "Another sign-in is in progress. Please wait.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your connection.";
          break;
        case 'auth/unauthorized-domain':
          errorMessage = "This domain is not authorized. Please contact support.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Google sign-in is not enabled. Please contact support.";
          break;
        default:
          if (error.message) {
            errorMessage = error.message;
          }
      }
      
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
      const lastFetchData = await getLastFetchDate(userEmail, userId);
      let dateQuery = "";
      const currentDate = new Date();

      const tomorrowDate = new Date(currentDate);
      tomorrowDate.setDate(currentDate.getDate() + 1);

      if (!lastFetchData || !lastFetchData.lastSyncedAt) {
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

        const fromDate = formatDateForGmail(threeYearsAgo);
        const toDate = formatDateForGmail(tomorrowDate);

        dateQuery = `after:${fromDate} before:${toDate}`;
      } else {
        const lastFetchDate = new Date(lastFetchData.lastSyncedAt);
        const fromDate = formatDateForGmail(lastFetchDate);
        const toDate = formatDateForGmail(currentDate);

        dateQuery = `after:${fromDate} before:${toDate}`;
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
        "sbigeneral.in",
        "shriramgi.com",
        "tataaig.com",
        "newindia.co.in",
        "orientalinsurance.co.in",
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
        "emailer.futuregenerali.in",
      ];

      // Enhanced marketing exclusion patterns to catch more marketing emails
    const marketingExclusionPatterns = [
    /quotation/i,
    /quote/i,
    /renewal\s*quotation/i,
    /renewal\s*quote/i,
    /insurance\s*quotation/i,
    /insurance\s*quote/i,
    /get\s*(free\s*)?quote/i,
    /pay/i,
    /proposal/i,
    /insurance\s*proposal/i,
    /policy\s*proposal/i,
    /revised\s*proposal/i,
    /rfp/i,
    /fnf/i,
    /renewal\s*notice/i,
    /renewal\s*notification/i,
    /renewal\s*reminder/i,
    /renewal\s*alert/i,
    /policy\s*renewal\s*notice/i,
    /insurance\s*renewal\s*notice/i,
    /contract\s*renewal\s*notice/i,
    /subscription\s*renewal\s*notice/i,
    /membership\s*renewal\s*notice/i,
    /license\s*renewal\s*notice/i,
    /renewal\s*due/i,
    /renewal\s*approaching/i,
    /renewal\s*expires/i,
    /renewal\s*expiry/i,
    /renewal\s*expiration/i,
    /renewal\s*deadline/i,
    /renewal\s*date/i,
    /auto\s*renewal\s*notice/i,
    /automatic\s*renewal\s*notice/i,
    /renewal\s*confirmation/i,
    /renewal\s*successful/i,
    /renewal\s*completed/i,
    /renewal\s*processed/i,
    /renewal\s*failed/i,
    /renewal\s*declined/i,
    /renewal\s*pending/i,
    /renewal\s*required/i,
    /renewal\s*available/i,
    /renewal\s*offer/i,
    /renewal\s*invitation/i,
    /time\s*to\s*renew/i,
    /renew\s*now/i,
    /renew\s*today/i,
    /renew\s*your/i,
    /renew\s*before/i,
    /don't\s*forget\s*to\s*renew/i,
    /renewal\s*terms/i,
    /renewal\s*rate/i,
    /renewal\s*premium/i,
    /renewal\s*price/i,
    /renewal\s*cost/i,
    /renewal\s*amount/i,
    /up\s*for\s*renewal/i,
    /coming\s*up\s*for\s*renewal/i,
    /eligible\s*for\s*renewal/i,
    /renewal\s*options/i,
    /renewal\s*plans/i,
    /renewal\s*package/i,
 
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
    /resignation/i,
    /travel/i,
    /travel\s*insurance/i,
    /resign/i,
    /quit/i,
    /termination/i,
    /separation/i,
    /relieving/i,
    /notice\s*period/i,
    /last\s*working\s*day/i,
    /exit\s*interview/i,
    /trip/i,
    /vacation/i,
    /holiday/i,
    /journey/i,
    /flight/i,
    /booking/i,
    /itinerary/i,
    /hotel/i,
    /accommodation/i,
    /reservation/i,
    /ticket/i,
    /ticket\s*booking/i,
    /visa/i,
 
    // Additional marketing patterns
    /promo\s*(code|offer)/i,
    /limited\s*stock/i,
    /flash\s*sale/i,
    /today\s*only/i,
    /expires\s*(today|soon)/i,
    /don't\s*wait/i,
    /order\s*now/i,
    /shop\s*now/i,
    /click\s*here/i,
    /subscribe/i,
    /sign\s*up/i,
    /join\s*(us|now)/i,
    /membership/i,
    /referral/i,
    /cashback/i,
    /reward/i,
    /bonus/i,
    /gift\s*card/i,
    /sweepstakes/i,
    /contest/i,
    /giveaway/i,
  ];

      const isMarketingEmail = (subject) => {
        return marketingExclusionPatterns.some((pattern) =>
          pattern.test(subject)
        );
      };

      const getSubjectPriority = (subject) => {
        return isMarketingEmail(subject) ? 0 : 1;
      };

      const domainQuery = senderDomains
        .map((domain) => `from:${domain}`)
        .join(" OR ");

      const query = `(${domainQuery}) (label:spam OR label:inbox OR label:junk OR label: all mail) ${dateQuery}`;

      const fetchAllMessages = async () => {
        let allMessages = [];
        let nextPageToken = null;
        let pageCount = 0;
        const maxResults = 500;

        do {
          pageCount++;

          let gmailUrl = `https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(
            query
          )}`;

          if (nextPageToken) {
            gmailUrl += `&pageToken=${nextPageToken}`;
          }

          const response = await fetch(gmailUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Gmail API request failed: ${response.status}`);
          }

          const data = await response.json();

          if (data.messages && data.messages.length > 0) {
            allMessages = allMessages.concat(data.messages);
          }

          nextPageToken = data.nextPageToken;

          if (nextPageToken) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } while (nextPageToken);

        return {
          messages: allMessages,
          resultSizeEstimate: allMessages.length,
        };
      };

      const data = await fetchAllMessages();

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

      const processingBatchSize = 50;

      for (
        let batchStart = 0;
        batchStart < data.messages.length;
        batchStart += processingBatchSize
      ) {
        const batchEnd = Math.min(
          batchStart + processingBatchSize,
          data.messages.length
        );
        const currentBatch = data.messages.slice(batchStart, batchEnd);

        const batchPromises = currentBatch.map(async (msg, batchIndex) => {
          const globalIndex = batchStart + batchIndex;

          try {
            const emailData = await fetch(
              `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );

            if (!emailData.ok) {
              throw new Error(
                `Failed to fetch email ${msg.id}: ${emailData.status}`
              );
            }

            const emailResponse = await emailData.json();

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
              return null;
            }

            const isMarketing = isMarketingEmail(subject);
            if (isMarketing) {
              skippedReasons.marketing++;
              skippedSubjects.marketing.push({
                subject: subject,
                domain: senderDomain,
              });
              return null;
            }

            const parts = emailResponse.payload?.parts || [];
            const hasAttachment = parts.some((part) => part.body?.attachmentId);

            if (!hasAttachment) {
              skippedReasons.noAttachment++;
              skippedSubjects.noAttachment.push({
                subject: subject,
                domain: senderDomain,
              });
              return null;
            }

            const subjectPriority = 1;

            domainHitCount[senderDomain] =
              (domainHitCount[senderDomain] || 0) + 1;

            const emailData_processed = {
              id: msg.id,
              subject: subject,
              domain: senderDomain,
              priority: subjectPriority,
            };

            return emailData_processed;
          } catch (err) {
            console.error(
              `Error processing email ${msg.id}:`,
              err.message
            );
            return null;
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            emailsWithPriority.push(result.value);
          }
        });

        if (batchEnd < data.messages.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      emailsWithPriority.sort((a, b) => b.priority - a.priority);

      const finalMatchedEmails = emailsWithPriority.map((email) => email.id);

      // Log skipped emails for debugging
      // console.log(`\n📊 Processing Summary:`);
      // console.log(`Total messages found: ${data.messages.length}`);
      // console.log(`Marketing emails excluded: ${skippedReasons.marketing}`);
      // console.log(`Emails without attachments: ${skippedReasons.noAttachment}`);
      // console.log(`Wrong domain emails: ${skippedReasons.wrongDomain}`);
      // console.log(`Final emails to process: ${finalMatchedEmails.length}`);

      if (skippedSubjects.marketing.length > 0) {
        // console.log(`\n🚫 Marketing emails excluded:`);
        skippedSubjects.marketing.forEach((item, index) => {
          // console.log(
          //   `Marketing ${index + 1}: "${item.subject}" (${item.domain})`
          // );
        });
      }

      if (skippedSubjects.noAttachment.length > 0) {
        // console.log(`\n📎 Emails without attachments:`);
        skippedSubjects.noAttachment.forEach((item, index) => {
          // console.log(
          //   `No Attachment ${index + 1}: "${item.subject}" (${item.domain})`
          // );
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

      if (!attachmentResponse.ok) throw new Error("Failed to fetch attachment");

      const attachmentData = await attachmentResponse.json();
      let base64Data = attachmentData?.data;

      if (!base64Data) {
        throw new Error("No attachment data found");
      }

      base64Data = base64Data.replace(/-/g, "+").replace(/_/g, "/");

      const fileName = `attachment_${messageId}.pdf`;

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
    return new Promise(async (resolve, reject) => {
      try {
        if (!files?.length) return reject("No files to upload");

        const formData = createGmailUploadFormData(files, userId, userEmail);

        const response = await fetch(`${API_URL}gmail-sync/sync`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

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
      display: "flex",
      justifyContent: "center",
    }}
  >
    {/* MAIN CENTERED CONTAINER */}
    <div style={{ width: "100%", maxWidth: "520px" }}>
      
      {/* Header */}
      <div onClick={() => navigate(-1)} style={{ display: "flex",  cursor: "pointer", alignItems: "center", marginBottom: "24px" }}>
        <ArrowBackIosNewIcon
          style={{ color: "#ffffff", marginRight: "8px" }}
          
        />
        <Typography variant="h6" style={{ fontWeight: 700 }}>
          Fetching policies from Gmail
        </Typography>
      </div>

      {/* Image */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <img
          src={gmailImage}
          alt="gmail cloud"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* Button */}
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
            width: "100%",     // 👈 SAME SIZE
            maxWidth: "520px", // 👈 SAME SIZE
          }}
          startIcon={
            signingIn ? (
              <CircularProgress size={24} style={{ color: "#666666" }} />
            ) : (
              <img src={gmailIcon} alt="Gmail" style={{ width: 24, height: 24 }} />
            )
          }
        >
          {signingIn ? "Syncing..." : "Sign in with Gmail"}
        </Button>
      </div>

      {/* Promise Card */}
      <Card
        style={{
          backgroundColor: "#212121",
          padding: "20px",
          borderRadius: "20px",
          color: "#fff",
          width: "100%",      // 👈 SAME SIZE
          maxWidth: "520px",  // 👈 SAME SIZE
          margin: "0 auto",
          marginTop: "32px",
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
  </div>
);

};

export default GmailSyncPage;