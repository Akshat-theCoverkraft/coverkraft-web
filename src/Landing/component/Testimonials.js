import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CSS/Testimonail.css';
import quote from '../../Images/quote-testimonial.png';
import { THEME_COLOR } from "../../constants";
// import API_URL from "../../ServiceModule/Service"; // Commented out

export default function Testimonials() {
  // const [testimonialsData, setTestimonialsData] = useState([]);
  const [slidesToShow, setSlidesToShow] = useState(window.innerWidth <= 620 ? 1 : 2);
  const [carouselKey, setCarouselKey] = useState(Date.now());

  const placeholderTestimonials = [
    {
      quote: "This is a fantastic service! Totally changed my life.",
      author: "Jane Doe",
      role: "UI/UX Designer",
      // profile: "https://via.placeholder.com/50"
    },
    {
      quote: "Reliable, professional, and fast. Highly recommended!",
      author: "John Smith",
      role: "Software Engineer",
      // profile: "https://via.placeholder.com/50"
    }
  ];

  // Commented out API fetching logic
  /*
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 4;

    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}testimonials`);
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        const data = result.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setTestimonialsData(data);
        } else {
          setTestimonialsData([]);
        }
      } catch (err) {
        console.error(`Attempt ${retryCount + 1} failed:`, err);
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(fetchTestimonials, 1000); // retry after delay
        } else {
          console.warn("Max retry attempts reached. Falling back to placeholder data.");
          setTestimonialsData([]);
        }
      }
    };

    fetchTestimonials();
  }, []);
  */

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

  // Always use placeholder data
  const testimonialsToDisplay = placeholderTestimonials;

  return (
    <>
      <div id="testimonials" className="text-center">
        <h3 className="fw-bold" style={{ color: "#FF9906", fontWeight: "4rem" }}>Testimonials</h3>
        <h1 className="mt-3 fw-bold">Hear From our Clients</h1>
      </div>

      <div className="testimonials-container">
        <section className="testimonials">
          <div className="container">
            <Slider key={carouselKey} {...settings} className="quotes">
              {testimonialsToDisplay.map((testimonial, index) => (
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
                      alt={`${testimonial.author} profile image`}
                      loading="lazy"
                      onError={(e) => {
                        // e.target.src = "https://via.placeholder.com/50";
                      }}
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
              ))}
            </Slider>
          </div>
        </section>
      </div>
    </>
  );
}
