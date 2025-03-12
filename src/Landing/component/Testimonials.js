import React from "react";
import Slider from "react-slick"; // For slick slider
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './CSS/Testimonail.css';
import quote from '../../Images/quote-testimonial.png'
import profilePic from '../../Images/profilePic.png'
import IMAGE_PATH from "../../ServiceModule/imagePath";
const testimonialsData = [
  {
    quote: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde.",
    author: "Author Name",
    profile:profilePic,
  },
  {
    quote: "Nam, adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde, culpa enim architecto dolorem accusamus magni.",
    author: "Author Name",
    profile:profilePic,
  },
  {
    quote: "Adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde, culpa enim architecto dolorem accusamus magni. Eveniet delectus illum libero odit rerum unde.",
    author: "Author Name",
    profile:profilePic,
  },
  {
    quote: "Nam, adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde, culpa enim architecto dolorem accusamus magni.",
    author: "Author Name",
    profile:profilePic,
  }
];

export default function Testimonials() {
  const settings = {
    infinite: true,
    slidesToShow: window.innerWidth <= 620 ? 1 : 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  return (
    <>
      <div className="text-center">
        <h3 className="fw-bold" style={{ color: "#FF9906" }}>
          Testimonials
        </h3>
        <h1 className="mt-3 fw-bold">Hear From our Clients</h1>
      </div>
      <div className="testimonials-container">
        <section className="testimonials">
          <div className="container">
            <Slider {...settings} className="quotes">
              {testimonialsData.map((testimonial, index) => (
                <div key={index} className="quote-wrapper card">
                  <img src={quote} className="mb-4"/>
                  <div className="quote" style={{maxHeight:'65px',minHeight:'65px'}}>{testimonial.quote}</div>
                  <div className="author ">
                   <img src={testimonial.profile} height={50} width={50} className="mr-3"/>
                   <div className="">
                    <div className="author-name" >{testimonial.author}</div>
                    <div className="author-name">Designer</div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </div>
    </>
  );
}
