import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CSS/Testimonail.css';
import quote from '../../Images/quote-testimonial.png';
import { THEME_COLOR } from "../../constants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Typography } from "@mui/material";

export default function Testimonials() {
  const [slidesToShow, setSlidesToShow] = useState(window.innerWidth <= 620 ? 1 : 2);
  const [carouselKey, setCarouselKey] = useState(Date.now());
  const sliderRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(window.innerWidth <= 620 ? 1 : 2);
      setCarouselKey(Date.now());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    infinite: true,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3500,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      }
    ]
  };

  const testimonials = [
    {
      quote: "This is a fantastic service! Totally changed my life.",
      author: "Jane Doe",
      role: "UI/UX Designer",
      profile: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    },
    {
      quote: "Reliable, professional, and fast. Highly recommended!",
      author: "John Smith",
      role: "Software Engineer",
      profile: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      video: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  ];

  return (
    <>

      <div className="position-relative mb-4 px-3" style={{ minHeight: '100px' }}>
        {/* Centered Heading Block */}
        <div className="text-center" style={{ maxWidth: '100%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
      <Typography variant="h3" sx={{ color: '#FF9906', fontWeight: 700, mb: 1, textAlign: 'center', fontSize: { xs: '24px', sm: '28px', md: '30px' } }}>
            Testimonials
       </Typography>     
      <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700, mb: 4, textAlign: 'center', fontSize: { xs: '26px', sm: '30px', md: '32px' } }}>
            Hear From our Clients
      </Typography>
        </div>

        {/* Navigation Buttons aligned right */}
        <div className="d-flex gap-2 position-absolute top-0 end-0 mt-2 me-3">
          <button
            onClick={() => sliderRef.current.slickPrev()}
            className="btn btn-outline-dark"
            style={{ width: '40px', height: '40px' }}
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => sliderRef.current.slickNext()}
            className="btn btn-outline-dark"
            style={{ width: '40px', height: '40px' }}
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="testimonials-container px-3">
        <section className="testimonials">
          <div className="container">
            <Slider ref={sliderRef} key={carouselKey} {...settings} className="quotes">
              {testimonials.map((testimonial, index) => {
                const hasVideo = Boolean(testimonial.video);
                return (
                  <div key={index} className="p-2">
                    <div
                      className={`quote-wrapper card d-flex ${hasVideo ? 'flex-row has-video' : 'flex-column'}`}
                      style={{
                        backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                        color: THEME_COLOR.COLOR,
                        padding: '20px',
                        borderRadius: '12px',
                        height: '250px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      {/* Blue vertical bar */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '4px',
                        height: '100%',
                        backgroundColor: '#226089',
                        zIndex: 1
                      }}></div>

                      {hasVideo && (
                        <div className="video-section" style={{ flex: '1 1 50%', paddingRight: '20px' }}>
                          <video
                            controls
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '10px'
                            }}
                          >
                            <source src={testimonial.video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}

                      {/* Text Content */}
                      <div className="text-section" style={{ flex: '1 1 50%' }}>
                        <img src={quote} alt="quote" className="mb-3" style={{ width: '30px' }} />
                        <div className="quote mb-3" style={{ lineHeight: '1.6', textAlign: 'left' }}>
                          {testimonial.quote}
                        </div>
                        <div className="author d-flex align-items-center mt-2" style={{ gap: '10px' }}>
                          <img
                            src={testimonial.profile}
                            height={50}
                            width={50}
                            className="rounded-circle"
                            alt={`${testimonial.author} profile image`}
                            onError={(e) => e.target.src = "https://via.placeholder.com/50"}
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
                              {testimonial.role || "Client"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </section>
      </div>

      {/* Responsive media styling */}
      <style jsx>{`
        @media screen and (max-width: 620px) {
          .has-video {
            flex-direction: column !important;
          }
          .has-video .video-section {
            padding-right: 0 !important;
            margin-bottom: 15px;
          }
          .quote-wrapper {
            height: auto !important;
            min-height: 450px !important;
          }
        }
      `}</style>
    </>
  );
}
