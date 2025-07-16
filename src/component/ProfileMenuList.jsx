import React from "react";
import { Card, Grid } from "@mui/material";
import rightArrow from "../Images/Symbol.png";

const ProfileMenuList = ({ items }) => {
  return (
    <Card sx={{ backgroundColor: "rgba(0,0,0,0.4)", color: "#fff", padding: 2, margin: 2 }}>
      {items.map((item, idx) => (
        <Grid
          container
          spacing={1}
          alignItems="center"
          key={idx}
          onClick={item.onClick}
          sx={{
            cursor: "pointer",
            borderBottom: idx === items.length - 1 ? "none" : "0.5px solid #fff",
            paddingBottom: 1,
            marginBottom: 1,
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <Grid item xs={2}>
            <img src={item.icon} alt={item.label} style={{ height: 32, width: 32, objectFit: "contain" }} />
          </Grid>
          <Grid item xs={8} sx={{ fontSize: "1rem", overflowWrap: "anywhere" }}>
            {item.label}
          </Grid>
          <Grid item xs={2} textAlign="right">
            <img src={rightArrow} alt="arrow" style={{ height: 24, width: 24 }} />
          </Grid>
        </Grid>
      ))}
    </Card>
  );
};

export default ProfileMenuList;
