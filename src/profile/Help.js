import React from "react";
import { Drawer, Box } from "@mui/material";

const Help = ({ help, onHelpClose }) => {
  return (
    <Drawer anchor="right" open={help} onClose={onHelpClose}>
      <Box sx={{ width: 750, padding: 0 }} role="presentation">
        help
      </Box>
    </Drawer>
  );
};

export default Help;
