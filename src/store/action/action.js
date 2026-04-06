//action.js
import { toast } from "react-toastify";
import axios from "axios";

// Add REGISTER
export const REGISTER_DATA_REQUEST = "REGISTER_DATA_REQEUST";
export const REGISTER_DATA_SUCCESS = "REGISTER_DATA_SUCCESS";
export const REGISTER_DATA_FAILURE = "REGISTER_DATA_FAILURE";

// Add GETALLTESTIMONIALS
export const GETALLTESTIMONIALS_DATA_REQUEST =
  "GETALLTESTIMONIALS_DATA_REQUEST";
export const GETALLTESTIMONIALS_DATA_SUCCESS =
  "GETALLTESTIMONIALS_DATA_SUCCESS";
export const GETALLTESTIMONIALS_DATA_FAILURE =
  "GETALLTESTIMONIALS_DATA_FAILURE";

//Verify user
export const VERIFY_DATA_REQUEST = "VERIFY_DATA_REQUEST";
export const VERIFY_DATA_SUCCESS = "VERIFY_DATA_SUCCESS";
export const VERIFY_DATA_FAILURE = "VERIFY_DATA_FAILURE";

//OCR extract data
export const OCR_DATA_REQUEST = "OCR_DATA_REQUEST";
export const OCR_DATA_SUCCESS = "OCR_DATA_SUCCESS";
export const OCR_DATA_FAILURE = "OCR_DATA_FAILURE";

//save doucment
export const SAVE_DATA_REQUEST = "SAVE_DATA_REQUEST";
export const SAVE_DATA_SUCCESS = "SAVE_DATA_SUCCESS";
export const SAVE_DATA_FAILURE = "SAVE_DATA_FAILURE";

//update doucment
export const UPDATEDOCUMENT_DATA_REQUEST = "UPDATEDOCUMENT_DATA_REQUEST";
export const UPDATEDOCUMENT_DATA_SUCCESS = "UPDATEDOCUMENT_DATA_SUCCESS";
export const UPDATEDOCUMENT_DATA_FAILURE = "UPDATEDOCUMENT_DATA_FAILURE";

//getall notification
export const GETALLNOTIFICATION_DATA_REQUEST =
  "GETALLNOTIFICATION_DATA_REQUEST";
export const GETALLNOTIFICATION_DATA_SUCCESS =
  "GETALLNOTIFICATION_DATA_SUCCESS";
export const GETALLNOTIFICATION_DATA_FAILURE =
  "GETALLNOTIFICATION_DATA_FAILURE";
//delete notification by userID
export const DELETE_NOTIFICATION_REQUEST = "DELETE_NOTIFICATION_REQUEST";
export const DELETE_NOTIFICATION_SUCCESS = "DELETE_NOTIFICATION_SUCCESS";
export const DELETE_NOTIFICATION_FAILURE = "DELETE_NOTIFICATION_FAILURE";
//delete all notification
export const DELETE_ALL_NOTIFICATIONS_REQUEST =
  "DELETE_ALL_NOTIFICATIONS_REQUEST";
export const DELETE_ALL_NOTIFICATIONS_SUCCESS =
  "DELETE_ALL_NOTIFICATIONS_SUCCESS";
export const DELETE_ALL_NOTIFICATIONS_FAILURE =
  "DELETE_ALL_NOTIFICATIONS_FAILURE";

//getall policytype doucment
export const GETPOLICYTYPE_DATA_REQUEST = "GETPOLICYTYPE_DATA_REQUEST";
export const GETPOLICYTYPE_DATA_SUCCESS = "GETPOLICYTYPE_DATA_SUCCESS";
export const GETPOLICYTYPE_DATA_FAILURE = "GETPOLICYTYPE_DATA_FAILURE";

//getbyId Users
export const GETBYID_USERS_DATA_REQUEST = "GETBYID_USERS_DATA_REQUEST";
export const GETBYID_USERS_DATA_SUCCESS = "GETBYID_USERS_DATA_SUCCESS";
export const GETBYID_USERS_DATA_FAILURE = "GETBYID_USERS_DATA_FAILURE";

//update user
export const UPDATEUSER_DATA_REQUEST = "UPDATEUSER_DATA_REQUEST";
export const UPDATEUSER_DATA_SUCCESS = "UPDATEUSER_DATA_SUCCESS";
export const UPDATEUSER_DATA_FAILURE = "UPDATEUSER_DATA_FAILURE";

//state
export const STATE_DATA_REQUEST = "STATE_DATA_REQUEST";
export const STATE_DATA_SUCCESS = "STATE_DATA_SUCCESS";
export const STATE_DATA_FAILURE = "STATE_DATA_FAILURE";

// Get All FAQs (For users)
export const GETALLFAQ_DATA_REQUEST = "GETALLFAQ_DATA_REQUEST";
export const GETALLFAQ_DATA_SUCCESS = "GETALLFAQ_DATA_SUCCESS";
export const GETALLFAQ_DATA_FAILURE = "GETALLFAQ_DATA_FAILURE";

// Delete account
export const DELETE_ACCOUNT_REQUEST = "DELETE_ACCOUNT_REQUEST";
export const DELETE_ACCOUNT_SUCCESS = "DELETE_ACCOUNT_SUCCESS";
export const DELETE_ACCOUNT_FAILURE = "DELETE_ACCOUNT_FAILURE";


//AgentForm
// src/redux/constants/agentConstants.js
export const SUBMIT_AGENT_REQUEST = "SUBMIT_AGENT_REQUEST";
export const SUBMIT_AGENT_SUCCESS = "SUBMIT_AGENT_SUCCESS";
export const SUBMIT_AGENT_FAILURE = "SUBMIT_AGENT_FAILURE";

//Claim
export const SUBMIT_CLAIM_REQUEST  = "SUBMIT_CLAIM_REQUEST";
export const SUBMIT_CLAIM_SUCCESS  = "SUBMIT_CLAIM_SUCCESS";
export const SUBMIT_CLAIM_FAILURE  = "SUBMIT_CLAIM_FAILURE";

export const FETCH_POLICIES_REQUEST = "FETCH_POLICIES_REQUEST";
export const FETCH_POLICIES_SUCCESS = "FETCH_POLICIES_SUCCESS";
export const FETCH_POLICIES_FAILURE = "FETCH_POLICIES_FAILURE";

export const FETCH_COMPANIES_REQUEST = "FETCH_COMPANIES_REQUEST";
export const FETCH_COMPANIES_SUCCESS = "FETCH_COMPANIES_SUCCESS";
export const FETCH_COMPANIES_FAILURE = "FETCH_COMPANIES_FAILURE";

export const PREFILL_POLICY_REQUEST = "PREFILL_POLICY_REQUEST";
export const PREFILL_POLICY_SUCCESS = "PREFILL_POLICY_SUCCESS";
export const PREFILL_POLICY_FAILURE = "PREFILL_POLICY_FAILURE";

export const TRACK_CLAIM_REQUEST = "TRACK_CLAIM_REQUEST";
export const TRACK_CLAIM_SUCCESS = "TRACK_CLAIM_SUCCESS";
export const TRACK_CLAIM_FAILURE = "TRACK_CLAIM_FAILURE";

// delete account api
export const deleteAccount = (API_URL, userId) => {
  return (dispatch) => {
    dispatch({ type: DELETE_ACCOUNT_REQUEST });
    const token = sessionStorage.getItem("token");
    axios
      .post(
        API_URL + `user/deleteUser`,
        { _id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        dispatch({ type: DELETE_ACCOUNT_SUCCESS, payload: response.data });
        // Optionally, you can clear the session storage or redirect the user
        sessionStorage.clear();
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Error deleting account";
        dispatch({ type: DELETE_ACCOUNT_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
      });
  };
};

// get all NOTIFICATION data
export const getAllNotification = (API_URL, data) => {
  return (dispatch) => {
    dispatch({ type: GETALLNOTIFICATION_DATA_REQUEST });
    axios
      .get(API_URL + `notification/getAll`, data)
      .then((response) => {
        dispatch({
          type: GETALLNOTIFICATION_DATA_SUCCESS,
          payload: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        dispatch({
          type: GETALLNOTIFICATION_DATA_FAILURE,
          payload: error.message,
        });
      });
  };
};

// Delete a single notification by ID
export const deleteNotification = (API_URL, notificationId) => {
  return (dispatch) => {
    dispatch({ type: DELETE_NOTIFICATION_REQUEST });
    axios
      .post(API_URL + "notification/delete", { _id: notificationId })
      .then((response) => {
        dispatch({ type: DELETE_NOTIFICATION_SUCCESS, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: DELETE_NOTIFICATION_FAILURE, payload: error.message });
      });
  };
};

// Delete all notifications for a user
export const deleteAllNotificationsByUser = (API_URL, userId) => {
  return (dispatch) => {
    dispatch({ type: DELETE_ALL_NOTIFICATIONS_REQUEST });
    axios
      .post(API_URL + "notification/deleteAllByUser", { userId })
      .then((response) => {
        dispatch({
          type: DELETE_ALL_NOTIFICATIONS_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: DELETE_ALL_NOTIFICATIONS_FAILURE,
          payload: error.message,
        });
      });
  };
};

export const registrationCustomer = (API_URL, data) => {
  return (dispatch) => {
    dispatch({ type: REGISTER_DATA_REQUEST });

    return axios
      .post(API_URL + "user/createUser", data)
      .then((response) => {
        if (response.data.status === false) {
          dispatch({
            type: REGISTER_DATA_FAILURE,
            payload: response.data.message,
          });
          throw new Error(response.data.message); // Manually throw
        }

        dispatch({
          type: REGISTER_DATA_SUCCESS,
          payload: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong";
        dispatch({ type: REGISTER_DATA_FAILURE, payload: message });
        throw new Error(message);
      });
  };
};

//VERIFY USER
export const verifyUser = (API_URL, data) => {
  return async (dispatch) => {
    dispatch({ type: VERIFY_DATA_REQUEST });
    const response = await axios
      .post(API_URL + `user/loginUser`, data)
      .then((response) => {
        dispatch({ type: VERIFY_DATA_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch((error) => {
        dispatch({ type: VERIFY_DATA_FAILURE, payload: error.message });
      });
    if (response?.user?.token) {
      sessionStorage.setItem("token", response?.user?.token);
    }
  };
};

export const extractData = (API_URL, data) => {
  return async (dispatch) => {
    dispatch({ type: OCR_DATA_REQUEST });
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        API_URL + "document/ocrExtractData",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: OCR_DATA_SUCCESS, payload: response.data });
      return response.data; // ← returned to component: await dispatch(extractData(...))
    } catch (error) {
      dispatch({ type: OCR_DATA_FAILURE, payload: error.message });
      return { success: false, message: error?.response?.data?.message || error.message };
    }
  };
};
 
//Save data
// export const saveDocument = (API_URL, data) => {
//     return (dispatch) => {
//         dispatch({ type: SAVE_DATA_REQUEST });
//         const token = sessionStorage.getItem('token');
//         return axios
//             .post(API_URL + `policy/create`,
//             data,{
//                 headers: {
//                     Authorization: `Bearer ${token}`, // Include the token in the headers
//                 },
//              })
//             .then((response) => {
//                 dispatch({ type: SAVE_DATA_SUCCESS, payload: response.data });
//                 return response.data;
//             })
//             .catch((error) => {
//                 dispatch({ type: SAVE_DATA_FAILURE, payload: error.message });
//             });
//     };
// }
export const saveDocument = (API_URL, data) => {
  return (dispatch) => {
    dispatch({ type: SAVE_DATA_REQUEST });
    const token = sessionStorage.getItem("token");
    return axios
      .post(`${API_URL}policy/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((response) => {
        dispatch({ type: SAVE_DATA_SUCCESS, payload: response.data });
        return response; // Return the full response here
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Error in creating policy details";
        dispatch({ type: SAVE_DATA_FAILURE, payload: errorMessage });
        return Promise.reject({
          status: error.response?.status,
          message: errorMessage,
        });
      });
  };
};
//update data
export const updateDocument = (API_URL, data) => {
  return (dispatch) => {
    dispatch({ type: UPDATEDOCUMENT_DATA_REQUEST });
    const token = sessionStorage.getItem("token");
    return axios
      .post(API_URL + `policy/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((response) => {
        dispatch({ type: UPDATEDOCUMENT_DATA_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch((error) => {
        dispatch({ type: UPDATEDOCUMENT_DATA_FAILURE, payload: error.message });
      });
  };
};

// get all Policytype data
export const getAllPolicyType = (API_URL, data) => {
  return (dispatch) => {
    dispatch({ type: GETPOLICYTYPE_DATA_REQUEST });
    axios
      .get(API_URL + `policyType/getAll`, data)
      .then((response) => {
        dispatch({ type: GETPOLICYTYPE_DATA_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch((error) => {
        dispatch({ type: GETPOLICYTYPE_DATA_FAILURE, payload: error.message });
      });
  };
};

//get by Id user data
export const getBYIDUsers = (API_URL, userId) => {
  return (dispatch) => {
    dispatch({ type: GETBYID_USERS_DATA_REQUEST });

    // Get token from localStorage
    const token = sessionStorage.getItem("token");


    axios
      .get(`${API_URL}user/getUserById`, {
        params: { _id: userId },
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => {
        dispatch({
          type: GETBYID_USERS_DATA_SUCCESS,
          payload: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        dispatch({
          type: GETBYID_USERS_DATA_FAILURE,
          payload: error.message,
        });
        console.error("Error fetching user by ID:", error);
      });
  };
};

export const updateUser = (API_URL, data) => {
  return (dispatch) => {
    dispatch({ type: UPDATEUSER_DATA_REQUEST });

    return axios
      .post(API_URL + `user/updateUser`, data)
      .then((response) => {
        if (response.data.status === false) {
          dispatch({
            type: UPDATEUSER_DATA_FAILURE,
            payload: response.data.message,
          });
        } else {
          dispatch({ type: UPDATEUSER_DATA_SUCCESS, payload: response.data });

          const userId = data.get("_id");
          const userEmail = data.get("userEmail");
          sessionStorage.setItem("userEmail", userEmail);
          dispatch(getBYIDUsers(API_URL, userId));
        }
        return response.data; // ✅ Return response to the component
      })
      .catch((error) => {
        dispatch({ type: UPDATEUSER_DATA_FAILURE, payload: error.message });
        return { status: false, message: error.message }; // ✅ Return error structure
      });
  };
};

// get all state data
export const getAllState = (API_URL, data) => {
  return (dispatch) => {
    dispatch({ type: STATE_DATA_REQUEST });
    axios
      .get(API_URL + `state/getAll`, data)
      .then((response) => {
        dispatch({ type: STATE_DATA_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch((error) => {
        dispatch({ type: STATE_DATA_FAILURE, payload: error.message });
      });
  };
};
export const getAllTestimonials = (API_URL) => {
  return (dispatch) => {
    dispatch({ type: GETALLTESTIMONIALS_DATA_REQUEST });

    axios
      .get(`${API_URL}testimonial/`) // Make sure your backend route matches
      .then((response) => {
        dispatch({
          type: GETALLTESTIMONIALS_DATA_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: GETALLTESTIMONIALS_DATA_FAILURE,
          payload: error.message,
        });
      });
  };
};

export const getAllFAQs = (API_URL) => {
  return (dispatch) => {
    dispatch({ type: GETALLFAQ_DATA_REQUEST });
    axios
      .get(`${API_URL}faq/all`) // This hits the `/faq/all` public route
      .then((response) => {
        dispatch({
          type: GETALLFAQ_DATA_SUCCESS,
          payload: response.data.data, // adjust if structure is different
        });
      })
      .catch((error) => {
        dispatch({
          type: GETALLFAQ_DATA_FAILURE,
          payload: error.message,
        });
      });
  };
};


// --------------------------------------------------



export const submitAgent = (API_URL, formData) => {
  return (dispatch) => {
    dispatch({ type: SUBMIT_AGENT_REQUEST });

    return axios
      .post(`${API_URL}api/agents/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          dispatch({
            type: SUBMIT_AGENT_FAILURE,
            payload: response.data.message,
          });
        } else {
          dispatch({
            type: SUBMIT_AGENT_SUCCESS,
            payload: response.data,
          });

          // ✅ Optional: Store agent ID
          if (response.data.data && response.data.data._id) {
            sessionStorage.setItem("agentId", response.data.data._id);
          }
        }

        return response.data; // ✅ Return to component
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to submit application";

        dispatch({
          type: SUBMIT_AGENT_FAILURE,
          payload: errorMessage,
        });

        return { status: false, message: errorMessage }; // ✅ Return consistent structure
      });
  };
};


const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  console.log("Retrieved token:", token); // Debug log
  return { Authorization: `Bearer ${token}` };
};

// ── 1. Submit Claim ───────────────────────────────────────────────────────────
export const submitClaim = (API_URL, formData) => {
  return (dispatch) => {
    dispatch({ type: SUBMIT_CLAIM_REQUEST });

    return axios
      .post(`${API_URL}api/claims/intimate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthHeader(),
        },
      })
      .then((response) => {
        if (response.data.success === false) {
          dispatch({ type: SUBMIT_CLAIM_FAILURE, payload: response.data.message });
        } else {
          dispatch({ type: SUBMIT_CLAIM_SUCCESS, payload: response.data });
        }
        return response.data;
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || error.message || "Failed to submit claim";
        dispatch({ type: SUBMIT_CLAIM_FAILURE, payload: errorMessage });
        return { success: false, message: errorMessage };
      });
  };
};

// ── 2. Fetch My Policies ──────────────────────────────────────────────────────
export const fetchMyPolicies = (API_URL) => {
  return (dispatch) => {
    dispatch({ type: FETCH_POLICIES_REQUEST });

    return axios
      .get(`${API_URL}api/claims/my-claims`, {
        headers: getAuthHeader(),
      })
      .then((response) => {
        dispatch({ type: FETCH_POLICIES_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: FETCH_POLICIES_FAILURE, payload: errorMessage });
        return { success: false, message: errorMessage };
      });
  };
};

// ── 3. Fetch Insurance Companies (Master Dropdown) ────────────────────────────
export const fetchInsuranceCompanies = (API_URL) => {
  return (dispatch) => {
    dispatch({ type: FETCH_COMPANIES_REQUEST });

    return axios
      .get(`${API_URL}api/claims/master/insurance-companies`)
      .then((response) => {
        dispatch({ type: FETCH_COMPANIES_SUCCESS, payload: response.data.data });
        return response.data;
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: FETCH_COMPANIES_FAILURE, payload: errorMessage });
        return { success: false, message: errorMessage };
      });
  };
};

// ── 4. Prefill Policy Data (Step 2 auto-fill) ─────────────────────────────────
export const prefillPolicyData = (API_URL, policyId) => {
  return (dispatch) => {
    dispatch({ type: PREFILL_POLICY_REQUEST });

    return axios
      .get(`${API_URL}api/claims/prefill/${policyId}`, {
        headers: getAuthHeader(),
      })
      .then((response) => {
        dispatch({ type: PREFILL_POLICY_SUCCESS, payload: response.data.data });
        return response.data;
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: PREFILL_POLICY_FAILURE, payload: errorMessage });
        return { success: false, message: errorMessage };
      });
  };
};

export const trackClaim = (API_URL, claimRefNo) => {
  return (dispatch) => {
    dispatch({ type: TRACK_CLAIM_REQUEST });
 
    // Public API — no auth header required
    return axios
      .get(`${API_URL}api/claims/track/${claimRefNo}`)
      .then((response) => {
        dispatch({ type: TRACK_CLAIM_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: TRACK_CLAIM_FAILURE, payload: errorMessage });
        return { success: false, message: errorMessage };
      });
  };
};
 