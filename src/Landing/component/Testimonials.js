import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CSS/Testimonail.css';
import quote from '../../Images/quote-testimonial.png';
import { THEME_COLOR } from "../../constants";
import { Typography, Modal, Box } from "@mui/material";
import TRight from "../../Images/TRight.png";
import TLeft from "../../Images/TLeft.png";
import API_URL from "../../ServiceModule/Service";

export default function Testimonials() {
  const [slidesToShow, setSlidesToShow] = useState(window.innerWidth <= 620 ? 1 : 2);
  const [carouselKey, setCarouselKey] = useState(Date.now());
  const [testimonials, setTestimonials] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const sliderRef = useRef();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}testimonials`);
        const json = await res.json();
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

  const openModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTestimonial(null);
  };

  const settings = {
    infinite: testimonials.length > 1,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
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

    const mediaStyle = {
      width: '100%',
      height: '100%',
      maxHeight: '200px',
      objectFit: 'cover',
      borderRadius: '10px'
    };

    if (hasVideo) {
      return (
        <div className="media-section" style={{ flex: '1 1 50%', paddingRight: '20px' }}>
          <video controls style={mediaStyle}>
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
            style={mediaStyle}
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
      </div>

      <div className="testimonials-container px-3">
        <section className="testimonials">
          <div className="container">
            {testimonials.length === 0 ? (
              <div style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
                No testimonials available right now.
              </div>
            ) : (
              <div className="slider-arrow-container">
                <button className="testimonial-arrow-btn left-arrow" onClick={() => sliderRef.current?.slickPrev()}>
                  <img src={TLeft} alt="Left" />
                </button>
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

                          <div className="text-section" style={{ flex: hasMedia ? '1 1 50%' : '1 1 100%' }}>
                            <img src={quote} alt="quote" className="mb-3" style={{ width: '30px' }} />
                            <div
                              className="quote mb-2"
                              style={{
                                lineHeight: '1.6',
                                textAlign: 'left',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3
                              }}
                            >
                              {testimonial.quote}
                            </div>
                            {
                              testimonial.quote.length > 180 && (
                                <span
                                  onClick={() => openModal(testimonial)}
                                  style={{
                                    color: "#7BC043",
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    paddingLeft: "70%",
                                    fontFamily: 'DM Sans, sans-serif',
                                  }}
                                >
                                  Read More →
                                </span>
                              )
                            }
                            <div className="author d-flex align-items-center mt-3" style={{ gap: '10px' }}>
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
                          {hasMedia && renderMediaSection(testimonial)}
                        </div>
                      </div>
                    );
                  })}
                </Slider>
                <button className="testimonial-arrow-btn right-arrow" onClick={() => sliderRef.current?.slickNext()}>
                  <img src={TRight} alt="Right" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 💬 Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="testimonial-modal-title"
        aria-describedby="testimonial-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            bgcolor: '#121212',
            color: '#fff',
            border: '2px solid #7BC043',
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            position: 'relative'
          }}
        >
          {/* ❌ Close Button */}
          <span
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#ccc',
              fontWeight: 'bold',
              zIndex: 10
            }}
            onMouseEnter={(e) => (e.target.style.color = '#7BC043')}
            onMouseLeave={(e) => (e.target.style.color = '#ccc')}
          >
            &times;
          </span>

          <Typography
            id="testimonial-modal-title"
            sx={{ mb: 2, color: '#7BC043', fontWeight: 700, fontSize: '1.5rem', paddingBottom: '30px' }}
          >
            {selectedTestimonial?.author}
          </Typography>
          <Typography
            id="testimonial-modal-description"
            sx={{ lineHeight: '1.6', fontSize: '1.6rem', color: '#ccc' }}
          >
            {selectedTestimonial?.quote}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontStyle: 'italic',
              color: '#ccc',
              fontSize: '1.2rem',
              fontWeight: 700
            }}
          >
            {selectedTestimonial?.role}
          </Typography>
        </Box>
      </Modal>


      <style jsx>{`
        .testimonial-arrow-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          outline: none;
          transition: box-shadow 0.2s, background 0.2s, filter 0.2s, transform 0.2s;
        }
        .testimonial-arrow-btn:hover {
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
        }
      `}</style>
    </>
  );
}
