import React, {useEffect} from "react";
import Navbar from "../../../component/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import { Button as MuiButton } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import API_URL from "../../../ServiceModule/Service";
import moment from 'moment-timezone'
import { capitalizeFirstLetter, truncateString } from "../../../utils/helpers";
import arrow from '../../../Images/Symbol.png'
import { THEME_COLOR } from "../../../constants";

const NewsBlog = () => {
  const navigate = useNavigate();
  const {type, id} = useParams();
  const [blog, setBlog] = React.useState({});
  const [moreBlogs, setMoreBlogs] = React.useState([]);
  
console.log(type, id, "<===type")
  const fetchBlogDetails = async () => {
  try {
    const { data } = await axios.get(`${API_URL}news/get-blog-details?blogId=${id}`);
    
    if (data?.success) {
      setBlog(data?.blog);

      // Only set moreBlogs with status 'active' and exclude current blog
      const activeBlogs = (data?.moreBlogs || []).filter(blog => blog.status === 'active' && blog._id !== id);
      setMoreBlogs(activeBlogs);
    } else {
      toast.error(data?.message || "Failed to load blog details.");
    }
  } catch (error) {
    // Optional: log detailed error for debugging
    console.error("Fetch error:", error);

    toast.error(
      error?.response?.data?.message || // from backend
      error?.message ||                 // fallback message
      "Something went wrong while loading the blog."
    );
  }
}


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogDetails();
  },[id])

  // Function to render media content (image or video)
  const renderMediaContent = (mediaUrl, altText, isMainBlog = false) => {
    if (!mediaUrl) return null;
    
    const isVideo = mediaUrl.match(/\.(mp4|mov|avi|mkv|webm)$/i);
    
    if (isVideo) {
      return (
        <video 
          controls 
          style={isMainBlog ? { maxWidth: "80%", maxHeight: '80vh', margin: "auto" } : { width: "100%", height: "200px", objectFit: "cover" }}
          className={isMainBlog ? "" : "card-img-top"}
        >
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={mediaUrl}
          style={isMainBlog ? { maxWidth: "80%", maxHeight: '80vh', margin: "auto" } : { width: "100%", height: "200px", objectFit: "cover" }}
          className={isMainBlog ? "" : "card-img-top"}
          alt={altText}
        />
      );
    }
  };

  const handleCardClick = (blogId) => {
    navigate(`/feed/blog/${blogId}`);
  };

  return (
    <>
    <ToastContainer />
    <div className="overflow-hidden">
        <Navbar />
        
      <div
        className="container my-4"
        style={{ marginTop: "100px", width: "80%" }}
      >
        <p
          className="text-white mb-4 d-inline-block"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <i className="fas color-white"></i> Back
        </p>
        <h1 className="text-center mb-5 ml-5">{capitalizeFirstLetter(type) === "News" ? 'News' : capitalizeFirstLetter(type) + 's'}</h1>
        
        <div className="card mb-4" style={{backgroundColor: THEME_COLOR.FADE_BACKGROUND, color: THEME_COLOR.SECONDARY_TEXT}}>
          {renderMediaContent(blog?.newsImg, blog?.subtitle, true)}
          <div className="card-body">
            <h2 className="text-center">
              <strong>
                {blog?.subtitle}
              </strong>
            </h2>
            <div className="text-muted mb-3">
              <span className="mr-3" style={{color: THEME_COLOR.SECONDARY_TEXT}}>
                <i className="fas fa-user" style={{color: 'rgb(138, 198, 66)'}}></i> {blog?.createdBy}
              </span>
              <span style={{color: THEME_COLOR.SECONDARY_TEXT}}>
                <i className="fas fa-calendar-alt primary-color" style={{color: 'rgb(138, 198, 66)'}}></i> {moment(blog?.createdAt).format("MMM DD, YYYY")}
              </span>
            </div>
            <p className="text-left">
                {blog?.description}
            </p>
          </div>
        </div>
        
        {moreBlogs?.length > 0 && <>
        <h2 className="text-center mb-4">
          <strong>More From Blogs And News</strong>
        </h2>
        <div className="row">
          {moreBlogs?.map((mBlog, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div 
                  className="card text-left h-100" 
                  style={{
                    backgroundColor: THEME_COLOR.FADE_BACKGROUND, 
                    color: THEME_COLOR.SECONDARY_TEXT,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                  onClick={() => handleCardClick(mBlog?._id)}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {renderMediaContent(mBlog?.newsImg, mBlog?.subtitle)}
                  <div className="card-body d-flex flex-column">
                    <h3 className="card-title h5">
                      {mBlog?.subtitle}
                    </h3>
                    <div className="text-muted mb-2">
                      <span className="mr-3" style={{color: THEME_COLOR.SECONDARY_TEXT}}>
                        <i className="fas fa-user" style={{color: 'rgb(138, 198, 66)'}}></i> {mBlog?.createdBy}
                      </span>
                      <span style={{color: THEME_COLOR.SECONDARY_TEXT}}>
                        <i className="fas fa-calendar-alt" style={{color: 'rgb(138, 198, 66)'}}></i> {moment(mBlog?.createdAt).format("MMM DD, YYYY")}
                      </span>
                    </div>
                    <p className="card-text flex-grow-1">
                        {truncateString(mBlog?.description)}
                    </p>
                    <div className="mt-auto">
                      <MuiButton 
                        variant="text" 
                      className="text-light p-0"
                      onClick={() => { 
                        handleCardClick(mBlog?._id)
                      }}
                        style={{
                          color: 'rgb(138, 198, 66)',
                          textTransform: 'none',
                          fontSize: '14px'
                        }}
                      >
                        Read More 
                        <img 
                          src={arrow} 
                          style={{
                            height: '16px', 
                            marginLeft: '8px',
                            filter: 'brightness(0) saturate(100%) invert(69%) sepia(45%) saturate(425%) hue-rotate(54deg) brightness(94%) contrast(89%)'
                          }} 
                          alt="arrow-right" 
                        />
                      </MuiButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        </>
        }
      </div>
    </div>
    </>
  );
};

export default NewsBlog;