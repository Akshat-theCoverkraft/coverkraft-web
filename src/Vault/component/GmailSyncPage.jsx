import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Typography,
    Button,
    Card,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import gmailImage from "../../Images/Gmail.png"; // Gmail cloud & phone image
import gmailIcon from "../../Images/logos_google-gmail.png"; // small Gmail icon

const GmailSyncPage = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                backgroundColor: "#121212",
                minHeight: "100vh",
                padding: "20px",
                color: "#ffffff",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                <ArrowBackIosNewIcon
                    style={{ color: "#ffffff", cursor: "pointer", marginRight: "8px" }}
                    onClick={() => navigate(-1)}
                />
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                    Fetching policies from Gmail
                </Typography>
            </div>

            {/* Illustration */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <img
                    src={gmailImage}
                    alt="gmail cloud"
                    style={{ width: "80%", maxWidth: "500px", height: "auto" }}
                />
            </div>

            {/* Gmail Sign-in Button */}
            <div style={{ textAlign: "center", marginBottom: "40px",  }}>
                <Button
                    variant="contained"
                    style={{
                        backgroundColor: "#7ED957",
                        borderRadius: "100px",
                        padding: "12px 24px",
                        color: "#000",
                        fontWeight: 600,
                        fontSize: "16px",
                        textTransform: "none",
                        maxWidth: "520px",
                    }}
                    startIcon={
                        <img src={gmailIcon} alt="Gmail" style={{ width: 24, height: 24 }} />
                    }
                >
                    Sign in with Gmail
                </Button>
            </div>

            {/* CoverKraft's Promise */}
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
                <Typography variant="h5" style={{ marginBottom: "16px", fontWeight: 700, textAlign: "left" }}>
                    CoverKraft’s Promise
                </Typography>

                <List dense>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleIcon sx={{ color: "#7ED957", fontSize: 28 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Your data is 100% safe & secure"
                            primaryTypographyProps={{ fontSize: "16px", fontWeight: 500 }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleIcon sx={{ color: "#7ED957", fontSize: 28 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Quick and hassle-free setup"
                            primaryTypographyProps={{ fontSize: "16px", fontWeight: 500 }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleIcon sx={{ color: "#7ED957", fontSize: 28 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Unlink Gmail anytime with ease"
                            primaryTypographyProps={{ fontSize: "16px", fontWeight: 500 }}
                        />
                    </ListItem>
                </List>
            </Card>


        </div>
    );
};

export default GmailSyncPage;
