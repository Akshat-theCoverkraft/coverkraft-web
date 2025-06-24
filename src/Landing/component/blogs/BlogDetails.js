import React, {useEffect} from "react";
import Navbar from "../../../component/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import { Button as MuiButton } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import API_URL from "../../../ServiceModule/Service";
import IMAGE_PATH from "../../../ServiceModule/imagePath";
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
        // Only set moreBlogs with status 'active'
        const activeBlogs = (data?.moreBlogs || []).filter(blog => blog.status === 'active');
        setMoreBlogs(activeBlogs);
      } else {
        toast.error("Error fetching blog data:", data?.message);
      }
    } catch (error) {
      toast.error("Error fetching blog data:", error);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogDetails();
  },[id])

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
          className="text-secondary mb-4 d-inline-block"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i> Back
        </p>
        <h1 className="text-center mb-4">{capitalizeFirstLetter(type) === "News" ? 'News' : capitalizeFirstLetter(type) + 's'}</h1>
        {/* <div className="d-flex justify-content-center mb-4">
          <button className="btn mx-2" style={{background: 'rgb(138, 198, 66)', color: 'white'}}>Blog</button>
          <button className="btn btn-secondary mx-2">News</button>
          <button className="btn btn-secondary mx-2">Short</button>
        </div> */}
        <div className="card mb-4" style={{backgroundColor: THEME_COLOR.FADE_BACKGROUND, color: THEME_COLOR.SECONDARY_TEXT}}>
          <img
            src={blog?.newsImg}
            style={{ maxWidth: "80%", maxHeight: '80vh', margin: "auto" }}
            alt={blog?.subtitle}
          />
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
        {moreBlogs?.length > 1 && <>
        <h2 className="text-center mb-4">
          <strong>More Blogs</strong>
        </h2>
        <div className="row">
          {moreBlogs?.map((mBlog, index) => (
              <div className="col-md-4 mb-4" key={index} >
                <div className="card text-left" style={{backgroundColor: THEME_COLOR.FADE_BACKGROUND, color: THEME_COLOR.SECONDARY_TEXT}}>
                  <img
                    src={mBlog?.newsImg}
                    className="card-img-top"
                    alt={mBlog?.subtitle}
                  />
                  <div className="card-body">
                    <h3 className="card-title h4">
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
                    <p className="card-text">
                        {truncateString(mBlog?.description)}
                    </p>
                    <MuiButton onClick={() => navigate(`/coverkraft/feed/blog/${mBlog?._id}`)} variant="text" className="text-light">
                     Read More <img src={arrow} style={{height: '16px'}} className='ml-2' alt="arrow-right" />
                    </MuiButton>
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
