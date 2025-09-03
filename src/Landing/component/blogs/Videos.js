import React, { useEffect, useState, useRef } from "react";
import { Grid, Box, Pagination, Skeleton } from "@mui/material";
import VideoCard from "./VideoCard";
import axios from "axios";
import API_URL from "../../../ServiceModule/Service";

const Videos = ({ onReadMoreClick }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0, limit: 9 });
  const videoRefs = useRef({});

  const fetchVideos = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}news/getFeedByType`, {
        params: { type: "video", page, limit: pagination.limit },
      });
      setVideos(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const handlePageChange = (_, page) => fetchVideos(page);

  const renderSkeletonCards = () =>
    Array.from({ length: 9 }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "24px" }} />
      </Grid>
    ));

  return (
    <>
      <Grid container spacing={4}>
        {isLoading
          ? renderSkeletonCards()
          : videos.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <VideoCard
                  item={item}
                  index={index}
                  videoRefs={videoRefs}
                  onReadMoreClick={onReadMoreClick}
                />
              </Grid>
            ))}
      </Grid>

      {!isLoading && pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#8BC642",
                borderColor: "rgba(255,255,255,0.2)",
                "&.Mui-selected": {
                  backgroundColor: "#8BC642",
                  color: "#121212",
                  fontWeight: 700,
                },
              },
            }}
          />
        </Box>
      )}
    </>
  );
};

export default Videos;
