import { Button } from "@mui/material";

const ProfileInfoView = ({ username, useremail, onEdit }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <h2 style={{ color: "#fff", marginBottom: "0.25rem" }}>{username}</h2>
      <p style={{ color: "#ccc", marginBottom: "1rem" }}>{useremail}</p>
      <Button
        variant="contained"
        color="success"
        onClick={onEdit}
        sx={{
          borderRadius: "3rem",
          width: "100%",
          height: "40px",
          fontSize: "1.4rem",
        }}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileInfoView;
