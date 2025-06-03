import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './CSS/Testimonail.css';
import quote from '../../Images/quote-testimonial.png';
import profilePic from '../../Images/profilePic.png';
import IMAGE_PATH from "../../ServiceModule/imagePath";
import { THEME_COLOR } from "../../constants";

const testimonialsData = [
  {
    quote: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde.",
    author: "Author Name",
    profile: profilePic,
  },
  {
    quote: "Nam, adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde, culpa enim architecto dolorem accusamus magni.",
    author: "Author Name",
    profile: profilePic,
  },
  {
    quote: "Adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde, culpa enim architecto dolorem accusamus magni. Eveniet delectus illum libero odit rerum unde.",
    author: "Author Name",
    profile: profilePic,
  },
  {
    quote: "Nam, adipisci facilis! Consectetur repellendus, nam minima sint voluptas eveniet delectus illum libero odit rerum unde, culpa enim architecto dolorem accusamus magni.",
    author: "Author Name",
    profile: profilePic,
  }
];

export default function Testimonials() {
  const [slidesToShow, setSlidesToShow] = useState(window.innerWidth <= 620 ? 1 : 2);

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(window.innerWidth <= 620 ? 1 : 2);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    infinite: true,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      }
    ]
  };

  return (
    <>
      <div id="testimonials" className="text-center">
        <h3 className="fw-bold" style={{ color: "#FF9906" }}>Testimonials</h3>
        <h1 className="mt-3 fw-bold">Hear From our Clients</h1>
      </div>

      <div className="testimonials-container">
        <section className="testimonials">
          <div className="container">
            <Slider {...settings} className="quotes">
              {testimonialsData.map((testimonial, index) => (
                <div
                  key={index}
                  className="quote-wrapper card"
                  style={{
                    backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                    color: THEME_COLOR.COLOR,
                    padding: '20px',
                    margin: '10px',
                    borderRadius: '10px',
                    minHeight: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <img src={quote} className="mb-3" alt="quote" />
                  <div className="quote mb-3" style={{ lineHeight: '1.6' }}>
                    {testimonial.quote}
                  </div>
                  <div className="author d-flex align-items-center mt-2" style={{ gap: '10px' }}>
                    <img
                      src={testimonial.profile}
                      height={50}
                      width={50}
                      className="rounded-circle"
                      alt="author"
                      style={{ flexShrink: 0 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span
                        className="author-name fw-bold"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {testimonial.author}
                      </span>
                      <span
                        className="author-role"
                        style={{
                          fontSize: '0.85rem',
                          color: '#ccc'
                        }}
                      >
                        Designer
                      </span>
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
