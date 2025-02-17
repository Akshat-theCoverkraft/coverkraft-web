import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Button as MuiButton, Chip, Typography } from "@mui/material";
import "./CSS/afterglow.css";
import symbol from "../../Images/Symbol.png";
import API_URL from "../../ServiceModule/Service";
import IMAGE_PATH from "../../ServiceModule/imagePath";
import { Link, useNavigate } from "react-router-dom";
import { capitalizeFirstLetter, truncateString } from "../../utils/helpers";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the blog data from the API
    const fetchData = async () => {
      try {
        // const response = await fetch(`${API_URL}news/getAll`);
        const response = await fetch(`${API_URL}news/get-single-feed-type`);
        const result = await response.json();
        if (result?.success) {
          setPosts(result.data);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchData();
  }, []);

  // if (posts.length === 0) {
  //     return
  // }

  return (
    <Grid
      container
      justifyContent="center"
      className="p-5"
      style={{ backgroundColor: "#F7FAFE" }}
    >
      <div className="text-center">
        <h3 className="fw-bold" style={{ color: "#FF9906" }}>
          NEWS & BLOG
        </h3>
        <h1 className="my-4 fw-bold">Latest from the blog</h1>
      </div>

      <Grid container xs={12} md={12} spacing={8} justifyContent="center">
  {/* Main Blog Post on the Left */}
  {[...posts?.slice(0, 2)]?.map((post, index) => {
     const isOdd = posts?.slice(0, 2)?.length % 2 !== 0; 
     const isLastItem = index === posts?.slice(0, 2)?.length - 1; 
  
    return (
      <Grid
        item
        xs={12}
        md={6}
        key={post?._id}
        style={{
          ...(isOdd && isLastItem ? { justifyContent: "center" } : {}), // Apply center styling if last item and odd count
        }}
      >
        <div
          className=""
          style={{
            borderRadius: "25px",
            boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
          }}
          onClick={() => navigate(`/coverkraft/feed/${post?.type}`)}
        >
          <div
            className="hover-overlay mb-3"
            style={{ maxHeight: "300px", overflow: "hidden",   borderRadius: "25px", }}
          >
            <img
              src={post?.newsImg}
              className=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              alt={post?.title}
            />
          </div>

          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p
                className="card-title fw-bold fs-5"
                style={{ color: "#42988E" }}
              >
                {post?.date}
              </p>
              <Chip
                label={capitalizeFirstLetter(post?.type)}
                className="fw-bold"
                color="primary"
                variant="outlined"
                style={{ fontSize: "12px" }}
              />
            </div>
            <h2 className="card-text mb-3">{truncateString(post?.subtitle, 50)}</h2>
            <Typography variant="p" color="textSecondary" sx={{ mb: 2 }}>
                {truncateString(post?.description, 80)}
            </Typography>
            <div className="d-flex cursor-pointer mt-3">
              <Link
                to={`/coverkraft/feed/${post?.type}`}
                className="fw-bold mr-2"
              >
                See More {capitalizeFirstLetter(post?.type)}'s
              </Link>
              <img
                src={symbol}
                height={15}
                className="mt-2  cursor-pointer"
                alt="symbol"
              />
            </div>
          </div>
        </div>
      </Grid>
    );
  })}
    {(
    <Grid item xs={12} md={12} style={{ textAlign: "center" }}>
      <MuiButton
        variant="contained"
        color="primary"
        onClick={() => navigate(`/coverkraft/feed/${posts?.[0]?.type}`)}
        style={{ borderRadius: "25px", padding: "10px 20px", backgroundColor: "#8AC642" }}
      >
        View All
      </MuiButton>
    </Grid>
  )}
</Grid>

    </Grid>
  );
};

export default Blog;
