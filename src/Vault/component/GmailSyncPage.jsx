import React, { useState, useEffect } from "react";
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(
        `${API_URL}gmail-sync/last-sync?gmailAddress=${userEmail}&userId=${userId}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error("Request timeout: last-sync");
      } else {
        console.error("Error getting last fetch date:", error);
      }
      return null;
    }
  };

  const handleGoogleSignIn = async () => {
    if (signingIn) return;
    
    console.log("🚀 Starting Google Sign-In...");
    setSigningIn(true);

    const timeout = setTimeout(() => {
      console.error("⏰ Sign-in timeout after 30 seconds");
      setSigningIn(false);
      showToast({
        type: "error",
        message: "Sign-in took too long. Please try again.",
      });
    }, 40000); // 30 second timeout

    try {
      // Sign out any existing user first
      if (auth.currentUser) {
        console.log("🔄 Signing out existing user...");
        await auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Create a fresh provider instance with required scopes
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
      provider.addScope('https://www.googleapis.com/auth/gmail.modify');
      
      // Set custom parameters
      provider.setCustomParameters({
        prompt: 'select_account',
        access_type: 'offline'
      });

      console.log("🔐 Opening sign-in popup...");
      
      // Attempt sign in with popup
      const result = await signInWithPopup(auth, provider);
      
      clearTimeout(timeout);
      
      console.log("✅ Popup sign-in completed");
      
      // Get credentials from result
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result?.user;

      console.log("Token present:", !!token);
      console.log("User present:", !!user);

      // Validate we got what we need
      if (!token) {
        throw new Error("No access token received from Google");
      }

      if (!user) {
        throw new Error("No user information received");
      }

      const userEmail = user.email || user.providerData?.[0]?.email;

      if (!userEmail) {
        throw new Error("Could not retrieve email address");
      }

      console.log("✅ Authentication successful for:", userEmail);
      
      // Proceed with Gmail sync
      await fetchGmailMessages(token, userEmail, userIds);
      
    } catch (error) {
      clearTimeout(timeout);
      
      console.error("❌ Google sign-in error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = "Sign-in failed. Please try again.";
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in cancelled. Please try again.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Pop-up was blocked. Please allow pop-ups and try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Another sign-in is in progress. Please wait.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized. Please contact support.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google sign-in is not enabled. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      console.log("🏁 Sign-in process complete");
      setSigningIn(false);
    }
  };

  const fetchGmailMessages = async (accessToken, userEmail, userId) => {
    console.log("📧 Starting Gmail fetch...");
    console.log("Access token length:", accessToken?.length);
    console.log("User email:", userEmail);
    console.log("User ID:", userId);

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
        "bandhanlife.co.in",
        "mailer.axismaxlife.com",
        "policy.bond@bajajallianz.co.in"
      ];

      // Payment receipt whitelist patterns - these should ALWAYS be included
const paymentReceiptPatterns = [
  /payment\s*receipt/i,
  /premium\s*payment/i,
  /payment\s*confirmation/i,
  /payment\s*received/i,
  /payment\s*successful/i,
  /receipt\s*for\s*payment/i,
  /payment\s*acknowledgment/i,
  /premium\s*paid/i,
  /payment\s*processed/i,
  /transaction\s*receipt/i,
  /premium\s*receipt/i,
  /payment\s*complete/i,
  /thank\s*you\s*for\s*your\s*payment/i,
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

      // const isMarketingEmail = (subject,  body = '') => {
      //   return marketingExclusionPatterns.some((pattern) =>
      //     pattern.test(subject)
      //   );
      // };
      const isMarketingEmail = (subject, body = '') => {
  const combinedText = `${subject} ${body}`.toLowerCase();
  
  // FIRST: Check if it's a payment receipt - if yes, it's NOT marketing
  const isPaymentReceipt = paymentReceiptPatterns.some(pattern => 
    pattern.test(combinedText)
  );
  
  if (isPaymentReceipt) {
    console.log(`✅ Payment receipt detected: "${subject.substring(0, 50)}..."`);
    return false; // Not marketing, it's a legitimate payment receipt
  }
  
  // THEN: Check marketing patterns
  const isMarketing = marketingExclusionPatterns.some(pattern => 
    pattern.test(combinedText)
  );
  
  if (isMarketing) {
    console.log(`⚠️ Marketing email detected: "${subject.substring(0, 50)}..."`);
  }
  
  return isMarketing;
};

      // Helper function to extract text from email body parts
      const extractEmailBody = (payload) => {
        let bodyText = "";
        
        if (payload.body?.data) {
          // Single part email
          try {
            const decoded = atob(payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
            bodyText += decoded;
          } catch (e) {
            // Ignore decoding errors
          }
        }
        
        if (payload.parts) {
          for (const part of payload.parts) {
            if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
              if (part.body?.data) {
                try {
                  const decoded = atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
                  bodyText += decoded;
                } catch (e) {
                  // Ignore decoding errors
                }
              }
            } else if (part.parts) {
              // Nested parts
              const nestedText = extractEmailBody(part);
              bodyText += nestedText;
            }
          }
        }
        
        return bodyText;
      };

      // Helper function to extract original sender from forwarded email
      const extractOriginalSenderFromForwarded = (bodyText) => {
        // Pattern to match forwarded message format:
        // "---------- Forwarded message ---------"
        // "From: <email@domain.com>" or "From: email@domain.com"
        const forwardedPattern = /-{3,}\s*Forwarded\s+message\s+-{3,}/i;
        
        if (!forwardedPattern.test(bodyText)) {
          return null;
        }
        
        // Extract the "From:" line in the forwarded message section
        const fromPattern = /From:\s*<?([^<>@\s]+@[^<>\s]+)>?/i;
        const matches = bodyText.match(fromPattern);
        
        if (matches && matches[1]) {
          const originalEmail = matches[1].trim();
          const domain = originalEmail.split("@")[1];
          
          // Verify this domain is in our allowed list
          if (senderDomains.includes(domain)) {
            return { email: originalEmail, domain: domain };
          }
        }
        
        return null;
      };

      const domainQuery = senderDomains
        .map((domain) => `from:${domain}`)
        .join(" OR ");

      // Use in:all to search all mail (inbox, spam, sent, etc.)
      // Gmail API doesn't support OR with labels like (label:spam OR label:inbox)
      // Note: We also search for emails with PDF attachments in case of forwarded emails
      // Forwarded emails will be detected and processed using the extractOriginalSenderFromForwarded function
      const query = `(${domainQuery} OR (has:attachment filename:pdf)) in:all ${dateQuery}`;

      console.log("🔍 Gmail query:", query);

      const fetchAllMessages = async () => {
        let allMessages = [];
        let nextPageToken = null;
        let pageCount = 0;
        const maxResults = 500;

        do {
          pageCount++;
          console.log(`📄 Fetching page ${pageCount}...`);

          let gmailUrl = `https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`;

          if (nextPageToken) {
            gmailUrl += `&pageToken=${nextPageToken}`;
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 50000); // 30s timeout

          try {
            const response = await fetch(gmailUrl, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              signal: controller.signal,
            });
            console.log("response", response)

            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorText = await response.text();
              console.error("Gmail API error response:", errorText);
              throw new Error(`Gmail API request failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("📦 Gmail API response:", {
              messagesCount: data.messages?.length || 0,
              resultSizeEstimate: data.resultSizeEstimate,
              nextPageToken: data.nextPageToken ? "present" : "none"
            });

            if (data.messages && data.messages.length > 0) {
              allMessages = allMessages.concat(data.messages);
              console.log(`✅ Page ${pageCount}: Found ${data.messages.length} messages (Total: ${allMessages.length})`);
              console.log(`   Result size estimate: ${data.resultSizeEstimate || 'N/A'}`);
            } else {
              console.log(`✅ Page ${pageCount}: No messages found`);
            }

            nextPageToken = data.nextPageToken;

            if (nextPageToken) {
              console.log(`   ➡️  Next page token present, continuing pagination...`);
              await new Promise((resolve) => setTimeout(resolve, 100));
            } else {
              console.log(`   ✅ No more pages to fetch`);
            }
          } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
              throw new Error('Gmail API request timeout. Please try again.');
            }
            throw fetchError;
          }
        } while (nextPageToken);

        console.log(`📊 Total messages fetched: ${allMessages.length}`);
        return {
          messages: allMessages,
          resultSizeEstimate: allMessages.length,
        };
      };

      const data = await fetchAllMessages();

      if (!data.messages || data.messages.length === 0 || data.resultSizeEstimate === 0) {
        console.log("✅ No messages found");
        showToast({
          type: "success",
          message: "Sync completed successfully. No new policy documents found.",
        });
        return;
      }

      console.log(`🔄 Processing ${data.messages.length} messages...`);

      const domainHitCount = {};
      const skippedReasons = {
        marketing: 0,
        noAttachment: 0,
        wrongDomain: 0,
      };

      const emailsWithPriority = [];
      const processingBatchSize = 50;

      for (let batchStart = 0; batchStart < data.messages.length; batchStart += processingBatchSize) {
        const batchEnd = Math.min(batchStart + processingBatchSize, data.messages.length);
        const currentBatch = data.messages.slice(batchStart, batchEnd);

        console.log(`🔄 Processing batch ${Math.floor(batchStart / processingBatchSize) + 1} (${batchStart + 1}-${batchEnd} of ${data.messages.length})`);

        const batchPromises = currentBatch.map(async (msg, batchIndex) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout per email

            const emailData = await fetch(
              `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
                signal: controller.signal,
              }
            );

            clearTimeout(timeoutId);

            if (!emailData.ok) {
              throw new Error(`Failed to fetch email ${msg.id}: ${emailData.status}`);
            }

            const emailResponse = await emailData.json();
            const headers = emailResponse.payload.headers;
            const fromHeader = headers.find((h) => h.name === "From")?.value || "";
            const subject = headers.find((h) => h.name === "Subject")?.value || "";

            const emailMatch = fromHeader.match(/<([^>]+)>/);
            const senderEmail = emailMatch ? emailMatch[1] : fromHeader;
            let senderDomain = senderEmail.split("@")[1];

            // Check if this is a forwarded email
            const isForwarded = /^(Fwd?|Re.*Fwd?|FW|RE.*FW):\s*/i.test(subject);
            
            // Case 1: Direct email from insurance company (not forwarded)
            // Case 2: Forwarded email - need to extract original sender
            if (isForwarded) {
              // This is a forwarded email
              // Check if forwarder's domain matches first (in case it's also an insurance domain)
              if (!senderDomains.includes(senderDomain)) {
                // Forwarder is not from insurance domain, try to extract original sender
                const bodyText = extractEmailBody(emailResponse.payload);
                const originalSender = extractOriginalSenderFromForwarded(bodyText);
                
                if (originalSender) {
                  console.log(`📧 Forwarded email detected: ${senderEmail} → ${originalSender.email}`);
                  senderDomain = originalSender.domain;
                } else {
                  // Forwarded but couldn't extract original sender domain - skip it
                  console.log(`⚠️  Forwarded email from ${senderEmail} but couldn't extract original sender`);
                  skippedReasons.wrongDomain++;
                  return null;
                }
              } else {
                // Forwarder is from insurance domain (rare case but possible)
                // Still check original sender in case we want to use that instead
                const bodyText = extractEmailBody(emailResponse.payload);
                const originalSender = extractOriginalSenderFromForwarded(bodyText);
                
                if (originalSender && senderDomains.includes(originalSender.domain)) {
                  console.log(`📧 Forwarded email from insurance domain ${senderEmail}, original: ${originalSender.email}`);
                  senderDomain = originalSender.domain;
                }
                // Otherwise use forwarder's domain (which already matches)
              }
            } else {
              // Direct email (not forwarded) - use sender's domain as-is
              // Only log for accepted emails to reduce console noise
            }

            // Final check: if domain doesn't match, skip it
            if (!senderDomains.includes(senderDomain)) {
              skippedReasons.wrongDomain++;
              return null;
            }
            
            // Only log accepted emails to reduce console noise
            console.log(`✅ Email accepted: ${isForwarded ? `Forwarded from ${senderEmail.split("@")[1]}` : `Direct from ${senderEmail}`} → ${senderDomain}`);

            const isMarketing = isMarketingEmail(subject);
            if (isMarketing) {
              skippedReasons.marketing++;
              return null;
            }

            const parts = emailResponse.payload?.parts || [];
            const hasAttachment = parts.some((part) => part.body?.attachmentId);

            if (!hasAttachment) {
              skippedReasons.noAttachment++;
              return null;
            }

            domainHitCount[senderDomain] = (domainHitCount[senderDomain] || 0) + 1;

            return {
              id: msg.id,
              subject: subject,
              domain: senderDomain,
              priority: 1,
            };
          } catch (err) {
            console.error(`Error processing email ${msg.id}:`, err.message);
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

      console.log(`📊 Processing complete:`);
      console.log(`  - Valid emails: ${emailsWithPriority.length}`);
      console.log(`  - Skipped (marketing): ${skippedReasons.marketing}`);
      console.log(`  - Skipped (no attachment): ${skippedReasons.noAttachment}`);
      console.log(`  - Skipped (wrong domain): ${skippedReasons.wrongDomain}`);

      emailsWithPriority.sort((a, b) => b.priority - a.priority);
      const finalMatchedEmails = emailsWithPriority.map((email) => email.id);

      setCollectedFiles([]);

      if (finalMatchedEmails.length > 0) {
        showGlobalToast(
          {
            title: "Fetching your policies securely…",
            description: "This process typically takes 2–5 minutes to complete.",
          },
          "sync"
        );

        console.log(`📥 Downloading attachments from ${finalMatchedEmails.length} messages...`);

        const fileResults = await Promise.allSettled(
          finalMatchedEmails.map((msgId) =>
            fetchAndProcessPDF(msgId, accessToken)
          )
        );

        // Flatten results - handle both single files and multiple files per message
        const validFiles = [];
        fileResults.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            if (result.value._multipleFiles) {
              // Multiple files from one message
              validFiles.push(...result.value.files);
            } else {
              // Single file from one message
              validFiles.push(result.value);
            }
          }
        });

        console.log(`✅ Downloaded ${validFiles.length} valid PDFs from ${finalMatchedEmails.length} messages`);

        if (validFiles.length > 0) {
          setCollectedFiles(validFiles);
          await handleUploadDocFromGmail(validFiles, userEmail, userId);
        } else {
          showToast({
            type: "info",
            message: "No valid policy documents found to upload.",
          });
        }
      } else {
        showToast({
          type: "success",
          message: "Sync complete! No policy emails found in your inbox.",
        });
      }
    } catch (error) {
      console.error("❌ Gmail fetch error:", error);
      console.error("Error stack:", error.stack);
      
      showToast({
        type: "error",
        message: error.message || "Failed to fetch emails. Please try again.",
      });
    }
  };

  // Helper function to check if filename contains valid policy document keywords
  const isValidPolicyFilename = (filename) => {
    if (!filename) return false;
    
    // Convert to lowercase for case-insensitive matching
    const lowerFilename = filename.toLowerCase();
    
    // Check if filename contains "Schedule", "Certificate", or "Policy" anywhere (start, middle, or end)
    const validKeywords = ['schedule', 'certificate'];
    
    return validKeywords.some(keyword => lowerFilename.includes(keyword));
  };

  // Helper function to recursively find all PDF attachments in email parts (without filtering)
  const findAllPDFAttachments = (parts, attachments = []) => {
    if (!parts || !Array.isArray(parts)) return attachments;
    
    for (const part of parts) {
      if (part.mimeType === "application/pdf" && part.body?.attachmentId) {
        const filename = part.filename || `attachment_${part.body.attachmentId}.pdf`;
        
        // Collect all PDF attachments without filtering (filtering will be done later based on count)
        attachments.push({
          attachmentId: part.body.attachmentId,
          filename: filename,
          size: part.body.size
        });
      } else if (part.parts && Array.isArray(part.parts)) {
        // Recursively search nested parts
        findAllPDFAttachments(part.parts, attachments);
      }
    }
    
    return attachments;
  };

  const fetchAndProcessPDF = async (messageId, accessToken) => {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const messageUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
      const messageResponse = await fetch(messageUrl, { 
        headers,
        signal: controller.signal 
      });

      clearTimeout(timeoutId);

      if (!messageResponse.ok) throw new Error("Failed to fetch message");

      const message = await messageResponse.json();
      const parts = message.payload?.parts || [];

      // Find all PDF attachments in the email (without filtering yet)
      const allPdfAttachments = findAllPDFAttachments(parts);
      
      if (allPdfAttachments.length === 0) {
        // Fallback: check if the main body is a PDF
        if (message.payload?.mimeType === "application/pdf" && message.payload.body?.attachmentId) {
          // Single PDF as main body - include without filename check
          allPdfAttachments.push({
            attachmentId: message.payload.body.attachmentId,
            filename: `attachment_${messageId}.pdf`,
            size: message.payload.body.size
          });
          console.log(`ℹ️  Email ${messageId} has single PDF as main body - including without filename check`);
        } else {
          return null;
        }
      }

      // Filter attachments based on count:
      // - Single attachment: Include without filename check (likely the policy document)
      // - Multiple attachments: Filter by filename (only include those with Schedule/Certificate/Policy)
      let pdfAttachments;
      if (allPdfAttachments.length === 1) {
        // Single attachment - include without filename check
        pdfAttachments = allPdfAttachments;
        console.log(`✅ Email ${messageId} has single PDF attachment "${allPdfAttachments[0].filename}" - including without filename check`);
      } else {
        // Multiple attachments - filter by filename
        pdfAttachments = allPdfAttachments.filter(attachment => {
          const isValid = isValidPolicyFilename(attachment.filename);
          if (!isValid) {
            console.log(`⏭️  Skipping attachment "${attachment.filename}" - filename doesn't contain Schedule, Certificate, or Policy`);
          }
          return isValid;
        });
        
        if (pdfAttachments.length === 0) {
          console.log(`⚠️  Email ${messageId} has ${allPdfAttachments.length} PDF attachments but none contain Schedule/Certificate/Policy in filename`);
          return null;
        }
        
        console.log(`✅ Email ${messageId} has ${allPdfAttachments.length} PDF attachments, filtering to ${pdfAttachments.length} with valid policy document filenames`);
      }

      // Process all filtered PDF attachments and return an array
      const processedFiles = [];
      
      for (let i = 0; i < pdfAttachments.length; i++) {
        const attachment = pdfAttachments[i];
        
        try {
          const attachmentUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachment.attachmentId}`;
          
          const attachmentController = new AbortController();
          const attachmentTimeoutId = setTimeout(() => attachmentController.abort(), 30000); // 30s timeout
          
          const attachmentResponse = await fetch(attachmentUrl, { 
            headers,
            signal: attachmentController.signal 
          });

          clearTimeout(attachmentTimeoutId);

          if (!attachmentResponse.ok) {
            console.error(`Failed to fetch attachment ${attachment.attachmentId} for message ${messageId}`);
            continue;
          }

          const attachmentData = await attachmentResponse.json();
          let base64Data = attachmentData?.data;

          if (!base64Data) {
            console.error(`No data found for attachment ${attachment.attachmentId}`);
            continue;
          }

          base64Data = base64Data.replace(/-/g, "+").replace(/_/g, "/");

          const fileName = pdfAttachments.length > 1 
            ? `${attachment.filename.replace(/\.pdf$/i, '')}_${i + 1}_${messageId}.pdf`
            : attachment.filename || `attachment_${messageId}.pdf`;

          console.log(`✅ Including attachment: "${attachment.filename}"`);
          
          processedFiles.push({
            base64Data,
            fileName,
            messageId,
          });
        } catch (attachmentError) {
          console.error(`Error processing attachment ${attachment.attachmentId} for message ${messageId}:`, attachmentError);
          // Continue with other attachments
        }
      }

      // Return the first file if single, or all files if multiple
      // The caller expects a single object, but we'll handle arrays in the caller
      if (processedFiles.length === 0) {
        return null;
      } else if (processedFiles.length === 1) {
        return processedFiles[0];
      } else {
        // Return an object with a special flag to indicate multiple files
        // The caller will need to handle this
        return {
          _multipleFiles: true,
          files: processedFiles
        };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`Timeout fetching PDF for message ${messageId}`);
      } else {
        console.error(`Error fetching PDF for message ${messageId}:`, error);
      }
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

        // Batch upload files to avoid gateway timeout
        // Upload 5 files at a time for better reliability
        const BATCH_SIZE = 5;
        const batches = [];
        
        for (let i = 0; i < files.length; i += BATCH_SIZE) {
          batches.push(files.slice(i, i + BATCH_SIZE));
        }

        console.log(`📤 Uploading ${files.length} files in ${batches.length} batches of ${BATCH_SIZE}...`);

        let successCount = 0;
        let failCount = 0;
        const errors = [];

        // Upload each batch sequentially to avoid overwhelming the server
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex];
          const batchNumber = batchIndex + 1;
          
          try {
            console.log(`📤 Uploading batch ${batchNumber}/${batches.length} (${batch.length} files)...`);

            const formData = createGmailUploadFormData(batch, userId, userEmail);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout per batch

            const response = await fetch(`${API_URL}gmail-sync/sync`, {
              method: "POST",
              body: formData,
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorText = await response.text();
              let errorMessage;
              try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || `HTTP ${response.status}`;
              } catch {
                errorMessage = `HTTP ${response.status}: ${errorText.substring(0, 100)}`;
              }
              
              console.error(`❌ Batch ${batchNumber} upload failed:`, errorMessage);
              errors.push(`Batch ${batchNumber}: ${errorMessage}`);
              failCount += batch.length;
              continue;
            }

            const result = await response.json();
            
            if (result?.success) {
              console.log(`✅ Batch ${batchNumber}/${batches.length} uploaded successfully`);
              successCount += batch.length;
            } else {
              console.error(`❌ Batch ${batchNumber} upload failed:`, result?.message || "Unknown error");
              errors.push(`Batch ${batchNumber}: ${result?.message || "Upload failed"}`);
              failCount += batch.length;
            }

            // Small delay between batches to avoid overwhelming the server
            if (batchIndex < batches.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          } catch (error) {
            console.error(`❌ Batch ${batchNumber} upload error:`, error);
            
            let errorMessage = "An unexpected error occurred.";
            if (error.name === 'AbortError') {
              errorMessage = "Upload timeout";
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            errors.push(`Batch ${batchNumber}: ${errorMessage}`);
            failCount += batch.length;
          }
        }

        // Final summary
        console.log(`📊 Upload complete: ${successCount} successful, ${failCount} failed`);

        if (successCount > 0 && failCount === 0) {
          // All files uploaded successfully
          showToast({
            message: `Sync completed successfully. ${successCount} policy document(s) uploaded.`,
            type: "success",
          });
          resolve(true);
        } else if (successCount > 0 && failCount > 0) {
          // Partial success
          showToast({
            message: `Partial success: ${successCount} uploaded, ${failCount} failed. ${errors[0]}`,
            type: "warning",
          });
          resolve(true); // Still resolve as partial success
        } else {
          // All failed
          const errorMessage = errors.length > 0 ? errors[0] : "All uploads failed. Please try again.";
          showToast({
            message: errorMessage,
            type: "error",
          });
          reject(new Error(errorMessage));
        }
      } catch (error) {
        console.error("❌ Gmail sync error:", error);
        
        let errorMessage = "An unexpected error occurred. Please try again.";
        if (error.message) {
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