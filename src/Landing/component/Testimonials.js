import * as React from "react";
import Slider from "react-slick"; // For slick slider
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './CSS/Testimonail.css'
const testimonialsData = [
  {
    quote: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde.",
    author: "Author Name"
  },
  {
    quote: "Nam, adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde, culpa enim architecto dolorem accusamus magni.",
    author: "Author Name"
  },
  {
    quote: "Adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde, culpa enim architecto dolorem accusamus magni. Eveniet delectus illum libero odit rerum unde.",
    author: "Author Name"
  },
  {
    quote: "Nam, adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde, culpa enim architecto dolorem accusamus magni.",
    author: "Author Name"
  }
];

export default function Testimonials() {
  const settings = {
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };


  return (
    <>
      <div className="text-center ">
        <h3 className=" fw-bold" style={{ color: "#FF9906" }}>
          Testimonials
        </h3>
        <h1 className="mt-3 fw-bold">Here From our Clients</h1>
      </div>
      <div style={{ width: "50%", margin: "0 auto", borderRadius: "65px" }}>
      <section className="testimonials">
      <div className="container ">
        <Slider {...settings} className="quotes">
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="quote-wrapper card">
              <div className="quote">
                {testimonial.quote}
              </div>
              <div className="author">
                <div className="author-name">
                  {testimonial.author}
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
