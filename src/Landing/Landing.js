import React from "react";
import Navbar from "../component/Navbar";
import HeroSection from "./component/HeroSection";
import PolicyType from "./component/PolicyType";
import Footer from "./component/Footer";
import Afterglow from "./component/Afterglow";
import Coverkraft from "./component/Coverkraft";
import Blog from "./component/Blog";
import Card from "./component/Card";
import About from "./component/About";
import Carousel from "./component/Carousel";
import Cards3d from "./component/3dCard";
// import Count from "./component/Count";
import Faq from "./component/Faq";
import Testimonials from "./component/Testimonials";
import Service from "./component/service";
import { ToastContainer } from "react-toastify";
import BlogSection from "./component/NewsBlogs";
const Landing = () => {
  return (
    <div className="overflow-hidden">
      <ToastContainer />
      <Navbar />
      <HeroSection />
      <Afterglow />
      <PolicyType />
      <Cards3d />
      <BlogSection/>
      {/* <About /> */}
      
      {/* <Card/> */}
      {/* <Blog /> */}
      {/* <Count /> */}
      <Coverkraft />
      <Testimonials />
      <Faq />

      {/* <Carousel/> */}

      <Service />
      <Footer />
    </div>
  );
};

export default Landing;
