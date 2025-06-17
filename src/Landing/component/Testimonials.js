import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import API_URL from "../../ServiceModule/Service";
import { FaQuoteLeft } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const THEME_COLOR = {
  ORANGE: "#FFA500",
  BACKGROUND: "#121212",
  FADE_BACKGROUND: "#232323",
  COLOR: "#fff"
};

function Arrow({ className, style, onClick, icon }) {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#232323",
        borderRadius: "50%",
        width: 56,
        height: 56,
        zIndex: 2,
        top: 0,
        right: icon === "next" ? 0 : 70,
        left: icon === "prev" ? 0 : "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      {icon === "prev" ? (
        <IoIosArrowBack size={32} color="#6ee7b7" />
      ) : (
        <IoIosArrowForward size={32} color="#6ee7b7" />
      )}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 4;

    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}testimonials`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1000));
        const raw = result.data || [];
        const filtered = raw.filter(t => !t.media || t.media.status === 'active');
        setTestimonials(filtered);
        setLoading(false);
        setError(null);
      } catch (err) {
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(fetchTestimonials, 1000);
        } else {
          setError('Failed to load testimonials after multiple attempts');
          setTestimonials([]);
          setLoading(false);
        }
      }
    };
    fetchTestimonials();
  }, []);

  // Responsive grid: 3 columns desktop, 2 tablet, 1 mobile
  const getGridColumns = () => {
    if (window.innerWidth <= 620) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const [columns, setColumns] = useState(getGridColumns());
  useEffect(() => {
    const handleResize = () => setColumns(getGridColumns());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ background: THEME_COLOR.BACKGROUND, padding: 0, minHeight: "100vh" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "2rem 2rem 0 2rem"
      }}>
        <div style={{ textAlign: "left" }}>
          <div style={{
            color: "#6ee7b7",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: 2,
            marginBottom: 8
          }}>
            TESTIMONIALS
          </div>
          <div style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "2.7rem",
            lineHeight: 1.1
          }}>
            Hear from Our Clients
          </div>
        </div>
      </div>
      <div style={{
        marginTop: "2rem",
        padding: "0 2rem 2rem 2rem"
      }}>
        <section>
          <div style={{ minHeight: '340px' }}>
            {loading && (
              <div style={{
                textAlign: 'center',
                color: THEME_COLOR.COLOR,
                padding: '50px',
                fontSize: '18px'
              }}>
                Loading testimonials...
              </div>
            )}
            {error && (
              <div style={{
                textAlign: 'center',
                color: '#ff6b6b',
                padding: '50px',
                fontSize: '18px'
              }}>
                Error: {error}
              </div>
            )}
            {!loading && !error && testimonials.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: THEME_COLOR.COLOR,
                padding: '50px',
                fontSize: '18px'
              }}>
                No testimonials available
              </div>
            )}
            {!loading && !error && testimonials.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: "2rem",
                  minHeight: "320px"
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} style={{ padding: '0 0', height: "100%" }}>
                    <div
                      style={{
                        background: THEME_COLOR.FADE_BACKGROUND,
                        color: THEME_COLOR.COLOR,
                        borderRadius: "40px",
                        minHeight: "320px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                        padding: "2.5rem 2rem 2rem 2rem",
                        position: "relative"
                      }}
                    >
                      <FaQuoteLeft size={38} color="#6ee7b7" style={{ marginBottom: 18 }} />
                      <div style={{
                        fontSize: "1.25rem",
                        lineHeight: 1.7,
                        marginBottom: "2.5rem",
                        color: "#e5e5e5"
                      }}>
                        {testimonial.quote}
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginTop: "auto"
                      }}>
                        {testimonial.media?.type === "image" ? (
                          <img
                            src={testimonial.media?.url}
                            height={120}
                            width={120}
                            style={{
                              borderRadius: '20px',
                              objectFit: 'cover',
                              border: "3px solid #6ee7b7",
                              maxWidth: "120px",
                              maxHeight: "120px"
                            }}
                            alt={`${testimonial.author} testimonial`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/120x120/666/fff?text=?";
                            }}
                          />
                        ) : testimonial.media?.type === "video" ? (
                          <video
                            src={testimonial.media?.url}
                            height={120}
                            width={120}
                            style={{
                              borderRadius: '20px',
                              objectFit: 'cover',
                              border: "3px solid #6ee7b7",
                              maxWidth: "120px",
                              maxHeight: "120px"
                            }}
                            controls
                            preload="metadata"
                          >
                            Sorry, your browser doesn't support embedded videos.
                          </video>
                        ) : (
                          <div style={{
                            height: '120px',
                            width: '120px',
                            borderRadius: '20px',
                            backgroundColor: '#666',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '32px'
                          }}>
                            ?
                          </div>
                        )}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            color: "#fff"
                          }}>
                            {testimonial.author}
                          </span>
                          <span style={{
                            fontSize: "1rem",
                            color: "#bdbdbd"
                          }}>
                            {testimonial.role || "Client"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
