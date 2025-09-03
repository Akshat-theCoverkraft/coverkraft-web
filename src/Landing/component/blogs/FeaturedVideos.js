import React, { useEffect, useState, useRef } from "react";
import { Grid, Box, Skeleton } from "@mui/material";
import FeaturedVideoCard from "./FeaturedVideoCard";
import axios from "axios";
import API_URL from "../../../ServiceModule/Service";

const FeaturedVideos = ({ onReadMoreClick }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRefs = useRef({});

  const fetchFeaturedVideos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}featureVideo/getAll`);
      const featured = res.data.data?.filter((item) => item.status === "active") || [];
      setVideos(featured);
    } catch (error) {
      console.error("Error fetching featured videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedVideos();
  }, []);

  const renderSkeletonCards = () =>
    Array.from({ length: 9 }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "24px" }} />
      </Grid>
    ));

  return (
    <Grid container spacing={4}>
      {isLoading
        ? renderSkeletonCards()
        : videos.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <FeaturedVideoCard
                item={item}
                index={index}
                videoRefs={videoRefs}
                onReadMoreClick={onReadMoreClick}
              />
            </Grid>
          ))}
    </Grid>
  );
};

export default FeaturedVideos;
