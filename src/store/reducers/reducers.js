import { getAllState, updateDocument } from "../action/action";

const initialState = {

  customerregstionData: null,
  loginData: null,
  getPolicyType: [],
  getAllState: [],
  getUserById: [],
  updateUser: null,
  ocrData: null,
  saveData: null,
  updateDocument: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
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
