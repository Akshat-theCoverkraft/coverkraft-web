import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography, Grid, Card, CardContent, CardMedia, Button as MuiButton, Pagination, CircularProgress } from "@mui/material";
import Navbar from "../../../component/Navbar";
import moment from "moment-timezone";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { truncateString } from "../../../utils/helpers";
import arrow from "../../../Images/arrowright.png";
import API_URL from "../../../ServiceModule/Service";
import IMAGE_PATH from "../../../ServiceModule/imagePath";

function Feeds() {
  const { type } = useParams(); // Get type from URL (blog, shorts, etc.)
  const navigate = useNavigate();
  
  const [selectedTab, setSelectedTab] = useState(type || "blog");
  const [contentData, setContentData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    fetchData(newValue, 1); // Reset to page 1 when changing tab
  };

  const fetchData = async (contentType, page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}news/getFeedByType?type=${contentType}&page=${page}&limit=${pagination?.limit}`);
      const { data, pagination: pageInfo } = response.data;

      setContentData(data);
      setPagination({
        currentPage: pageInfo.currentPage,
        totalPages: pageInfo.totalPages,
        totalCount: pageInfo.totalCount,
        limit: pageInfo.limit,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
        setIsLoading(false);
    }
  };

  // Fetch data when component mounts or when selected tab changes
  useEffect(() => {
    fetchData(selectedTab);
  }, [selectedTab]);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    fetchData(selectedTab, newPage); // Fetch data for the selected tab and new page
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Navbar />
      {/* Tabs Section */}
      <Tabs sx={{ pt: 3 }} value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Blogs" value="blog" sx={{ fontSize: '14px' }} />
        <Tab label="News" value="news" sx={{ fontSize: '14px' }} />
        <Tab label="Shorts" value="short" sx={{ fontSize: '14px' }} />
        {/* <Tab label="Videos" value="videos" /> */}
    </Tabs>

      {/* Content Section */}
      <Box sx={{ p: 2, pt: 5, width: '80%' }} className="container">
        {/* Show "No data found" if no contentData */}
        {isLoading ? (
          <Box sx={{ textAlign: "center", mt: 4, minHeight: '40vh',  }}>
            <CircularProgress size={50} sx={{ color: 'rgb(138, 198, 66)' }} />
          </Box>
        ) : contentData?.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No data found
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} className="d-flex justify-content-center">
            {contentData?.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                    },
                    overflow: 'hidden',
                  }}
                >
                  {item?.contentType === "video" ? (
                    <CardMedia
                      component="iframe"
                      src={item?.image}
                      title={item?.title}
                      height="200"
                      sx={{
                        objectFit: "cover",
                        borderBottom: '1px solid #ddd',
                      }}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height="200"
                      image={IMAGE_PATH + item?.newsImg}
                      alt={item?.newsImg}
                      sx={{
                        objectFit: "cover",
                        borderBottom: '1px solid #ddd',
                      }}
                    />
                  )}
                  <CardContent sx={{ padding: '16px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                      {truncateString(item?.subtitle, 50)}
                    </Typography>
                    <Typography className="text-muted mb-3">
                      <span className="mr-3">
                        <i className="fas fa-user" style={{color: 'rgb(138, 198, 66)'}}></i> {item?.createdBy || 'Super Admin'}
                      </span>
                      <span>
                        <i className="fas fa-calendar-alt" style={{color: 'rgb(138, 198, 66)'}}></i> {moment(item?.createdAt).format("MMM DD, YYYY")}
                      </span>
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                      {truncateString(item.description)}
                    </Typography>
                    <MuiButton onClick={() => navigate(`/coverkraft/feed/${selectedTab}/${item?._id}`)} variant="text">
                      Read More <img src={arrow} className='ml-2' alt="arrow-right" />
                    </MuiButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
       {pagination?.totalPages > 0 &&
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pagination?.totalPages}
            page={pagination?.currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '8px',
                border: '1px solid #ccc',
                color: '#555',
              },
              '& .MuiPaginationItem-ellipsis': {
                color: '#555',
              },
              '& .Mui-selected': {
                backgroundColor: 'rgb(138, 198, 66)',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgb(163, 219, 95)',
                },
              },
            }}
          />
        </Box>}
      </Box>
    </Box>
  );
}

export default Feeds;
