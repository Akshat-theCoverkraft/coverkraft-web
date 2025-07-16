import React from "react";
import editIcon from "../Images/edit-icon.png";
import icDefaultProfile from "../Images/ic_default_profile.png";

const ProfileImageWithEdit = ({ profileImage, update, onEditClick, onFileChange }) => {
  return (
    <div className="profile-image-container" style={{ position: "relative" }}>
      <img
        src={profileImage || icDefaultProfile}
        alt="Profile"
        className="profile-image"
        style={{ width: "120px", height: "120px", borderRadius: "50%" }}
      />
      {update && (
        <>
          <label htmlFor="profile-image-upload" style={{ cursor: "pointer", position: "absolute", bottom: 0, right: 0 }}>
            <img src={editIcon} alt="Edit" style={{ width: "24px", height: "24px" }} onClick={onEditClick} />
          </label>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  );
};

export default ProfileImageWithEdit;
