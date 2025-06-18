import { deleteAllNotificationsByUser, deleteNotification, getAllState, updateDocument } from "../action/action";

const initialState = {
  getAllNotification: [],
  customerregstionData: null,
  loginData: null,
  getPolicyType: [],
  getAllState: [],
  getUserById: [],
  getAllTestimonials: [],
  updateUser: null,
  ocrData: null,
  saveData: null,
  updateDocument: null,
  loading: false,
  error: null,
  deleteNotification: null,
  deleteAllNotificationsByUser: null,
  getAllFAQs: [],

};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Then in the reducer:
    case "GETALLFAQ_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "GETALLFAQ_DATA_SUCCESS":
      return {
        ...state,
        getAllFAQs: action.payload,
        loading: false,
        error: null,
      };
    case "GETALLFAQ_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //GETALLPOLICYTYPE 
    case "GETALLNOTIFICATION_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "GETALLNOTIFICATION_DATA_SUCCESS":
      return {
        ...state,
        getAllNotification: action.payload,
        loading: false,
        error: null,
      };
    case "GETALLNOTIFICATION_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    // Handle the request for deleting a specific notification or all notifications
    case "DELETE_NOTIFICATION_REQUEST":
    case "DELETE_ALL_NOTIFICATIONS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    // Handle the success case for deleting a notification or all notifications
    case "DELETE_NOTIFICATION_SUCCESS":
    case "DELETE_ALL_NOTIFICATIONS_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        // Optionally refetch or filter getAllNotification here if needed
      };
    // Handle the specific notification deletion
    case "DELETE_NOTIFICATION_FAILURE":
    case "DELETE_ALL_NOTIFICATIONS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //delete notification
    //customer registion start
    case "REGISTER_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "REGISTER_DATA_SUCCESS":
      return {
        ...state,
        customerregstionData: action.payload,
        loading: false,
        error: null,
      };
    case "REGISTER_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    //customer registion end

    //verify user mobileno start
    case "VERIFY_DATA_REQUES":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "VERIFY_DATA_SUCCESS":
      return {
        ...state,
        loginData: action.payload,
        loading: false,
        error: null,
      };
    case "VERIFY_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //verify user mobileno end

    //ocr extract data start
    case "OCR_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "OCR_DATA_SUCCESS":
      return {
        ...state,
        ocrData: action.payload,
        loading: false,
        error: null,
      };
    case "OCR_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //ocr extract data end
    // GET ALL TESTIMONIALS
    case "GETALLTESTIMONIALS_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "GETALLTESTIMONIALS_DATA_SUCCESS":
      return {
        ...state,
        getAllTestimonials: action.payload,
        loading: false,
        error: null,
      };
    case "GETALLTESTIMONIALS_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    //SAVE DOCUMENT
    case "SAVE_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "SAVE_DATA_SUCCESS":
      return {
        ...state,
        saveData: action.payload,
        loading: false,
        error: null,
      };
    case "SAVE_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //SAVE DOCUMENT end

    //update DOCUMENT
    case "UPDATEDOCUMENT_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "UPDATEDOCUMENT_DATA_SUCCESS":
      return {
        ...state,
        updateDocument: action.payload,
        loading: false,
        error: null,
      };
    case "UPDATEDOCUMENT_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //update DOCUMENT end

    //GETALLPOLICYTYPE 
    case "GETPOLICYTYPE_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "GETPOLICYTYPE_DATA_SUCCESS":
      return {
        ...state,
        getPolicyType: action.payload,
        loading: false,
        error: null,
      };
    case "GETPOLICYTYPE_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //GETALLPOLICYTYPE DOCUMENT end
    //update user
    case "UPDATEUSER_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "UPDATEUSER_DATA_SUCCESS":
      return {
        ...state,
        updateUser: action.payload,
        loading: false,
        error: null,
      };
    case "UPDATEUSER_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //update user end
    // user get by Id start
    case "GETBYID_USERS_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "GETBYID_USERS_DATA_SUCCESS":
      return {
        ...state,
        getUserById: action.payload,
        loading: false,
        error: null,
      };
    case "GETBYID_USERS_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //user by Idend
    case "STATE_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "STATE_DATA_SUCCESS":
      return {
        ...state,
        getAllState: action.payload,
        loading: false,
        error: null,
      };
    case "STATE_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }

};

export default userReducer;
