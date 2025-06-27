import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CSS/Testimonail.css';
import quote from '../../Images/quote-testimonial.png';
import { THEME_COLOR } from "../../constants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Typography } from "@mui/material";
import TRight from "../../Images/TRight.png"
import TLeft from "../../Images/TLeft.png"
import API_URL from "../../ServiceModule/Service";

export default function Testimonials() {
  const [slidesToShow, setSlidesToShow] = useState(window.innerWidth <= 620 ? 1 : 2);
  const [carouselKey, setCarouselKey] = useState(Date.now());
  const [testimonials, setTestimonials] = useState([]);
  const sliderRef = useRef();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}testimonials`);
        const json = await res.json();

        console.log("Backend Response:", json);

        if (Array.isArray(json.data)) {
          const activeTestimonials = json.data.filter(t => t.status === 'active');
          setTestimonials(activeTestimonials);
        } else {
          console.error("Invalid data format from backend");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(window.innerWidth <= 620 ? 1 : 2);
      setCarouselKey(Date.now());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    infinite: testimonials.length > 1,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3500,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      }
    ]
  };

  const renderMediaSection = (testimonial) => {
    const hasVideo = testimonial.media && testimonial.media.type === 'video';
    const hasImage = testimonial.media && testimonial.media.type === 'image';

    if (hasVideo) {
      return (
        <div id="testimonials" className="media-section" style={{ flex: '1 1 50%', paddingRight: '5%' }}>
          <video
            controls
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px'
            }}
          >
            <source src={testimonial.media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (hasImage) {
      return (
        <div className="media-section" style={{ flex: '1 1 50%', paddingRight: '20px' }}>
          <img
            src={testimonial.media.url}
            alt="Testimonial media"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px'
            }}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="position-relative mb-4 px-3" style={{ minHeight: '100px', paddingRight: '20%', paddingLeft: '20%' }}>
        <div className="text-center" style={{ maxWidth: '100%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Typography variant="h3" sx={{ color: '#FF9906', fontWeight: 700, mb: 1, textAlign: 'center', fontSize: { xs: '24px', sm: '28px', md: '30px' } }}>
            Testimonials
          </Typography>
          <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700, mb: 4, textAlign: 'center', fontSize: { xs: '26px', sm: '30px', md: '32px' } }}>
            Hear From our Clients
          </Typography>
        </div>

        <div className="d-flex gap-2 position-absolute top-0 end-0 mt-2 me-5">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="testimonial-arrow-btn"
            aria-label="Previous"
          >
            <img src={TLeft} alt="Previous" style={{ width: 40, height: 40}} />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="testimonial-arrow-btn"
            aria-label="Next"
          >
            <img src={TRight} alt="Next" style={{ width: 40, height: 40 }} />
          </button>
        </div>
      </div>

      <div className="testimonials-container px-3">
        <section className="testimonials">
          <div className="container">
            {testimonials.length === 0 ? (
              <div style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
                No testimonials available right now.
              </div>
            ) : (
              <Slider ref={sliderRef} key={carouselKey} {...settings} className="quotes">
                {testimonials.map((testimonial, index) => {
                  const hasMedia = testimonial.media && (testimonial.media.type === 'video' || testimonial.media.type === 'image');
                  
                  return (
                    <div key={`testimonial-${testimonial.id || index}`} className="p-2">
                      <div
                        className={`quote-wrapper card d-flex ${hasMedia ? 'flex-row has-media' : 'flex-column'}`}
                        style={{
                          backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                          color: THEME_COLOR.COLOR,
                          padding: '20px',
                          borderRadius: '12px',
                          height: '250px',
                          minHeight: '250px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '4px',
                          height: '100%',
                          backgroundColor: '#226089',
                          zIndex: 1
                        }}></div>

                        {hasMedia && renderMediaSection(testimonial)}

                        <div className="text-section" style={{ flex: hasMedia ? '1 1 50%' : '1 1 100%' }}>
                          <img src={quote} alt="quote" className="mb-3" style={{ width: '30px' }} />
                          <div className="quote mb-3" style={{ lineHeight: '1.6', textAlign: 'left' }}>
                            {testimonial.quote}
                          </div>
                          <div className="author d-flex align-items-center mt-2" style={{ gap: '10px' }}>
                            <img
                              src={testimonial.pfp}
                              height={50}
                              width={50}
                              className="rounded-circle"
                              alt={`${testimonial.author} profile image`}
                              
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <span className="author-name fw-bold" style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {testimonial.author}
                              </span>
                              <span className="author-role" style={{
                                fontSize: '0.85rem',
                                color: '#ccc'
                              }}>
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
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .testimonial-arrow-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: transparent;
          border: none;
          outline: none;
          transition: box-shadow 0.2s, background 0.2s, filter 0.2s, transform 0.2s;
          box-shadow: none;
        }
        .testimonial-arrow-btn:hover {
          background: transparent;
          box-shadow: 0 4px 16px 0 #212121;
          filter: brightness(1.1) contrast(1.1);
          transform: scale(1.13);
        }
        .slick-dots {
          bottom: -50px;
        }
        .slick-dots li button:before {
          color: #f39c12;
          font-size: 12px;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          color: #f39c12;
          opacity: 1;
        }
        @media screen and (max-width: 620px) {
          .has-media {
            flex-direction: column !important;
          }
          .has-media .media-section {
            padding-right: 0 !important;
            margin-bottom: 15px;
            height: 200px;
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