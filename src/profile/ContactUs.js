import React from "react";
import { Drawer, Box } from "@mui/material";

function ContactUs({ help, onHelpClose }) {
  return (
    <Drawer anchor="right" open={help} onClose={onHelpClose}>
      <Box sx={{ width: 750, padding: 0 }} role="presentation">
        Contact Us
      </Box>
    </Drawer>
  );
}

export default ContactUs;
