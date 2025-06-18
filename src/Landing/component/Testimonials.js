// import React, { useEffect, useState } from "react";
// import { FaQuoteLeft, FaPlay, FaImage, FaUser } from "react-icons/fa";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import API_URL from "../../ServiceModule/Service";

// const THEME_COLOR = {
//   ORANGE: "#FFA500",
//   BACKGROUND: "#1a1a1a",
//   CARD_BACKGROUND: "#2a2a2a",
//   COLOR: "#fff",
//   ACCENT: "#6ee7b7"
// };

// const Arrow = ({ direction, onClick, disabled }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     style={{
//       position: "absolute",
//       top: "50%",
//       transform: "translateY(-50%)",
//       [direction === "left" ? "left" : "right"]: "20px",
//       width: "50px",
//       height: "50px",
//       borderRadius: "50%",
//       backgroundColor: "rgba(42, 42, 42, 0.9)",
//       border: "none",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       cursor: disabled ? "not-allowed" : "pointer",
//       opacity: disabled ? 0.5 : 1,
//       zIndex: 10,
//       transition: "all 0.3s ease"
//     }}
//   >
//     {direction === "left" ? (
//       <IoIosArrowBack color="#fff" size={24} />
//     ) : (
//       <IoIosArrowForward color="#fff" size={24} />
//     )}
//   </button>
// );

// // Helper function to get media URL with multiple fallbacks
// const getMediaUrl = (media) => {
//   if (!media) return null;

//   // Try different possible properties
//   return media.url || 
//          media.src || 
//          media.image || 
//          media.video || 
//          media.file || 
//          media.path ||
//          (typeof media === 'string' ? media : null);
// };

// // Helper function to get profile picture URL
// const getProfilePictureUrl = (testimonial) => {
//   // Try different possible properties for profile picture
//   return testimonial.pfp || 
//          testimonial.profilePicture || 
//          testimonial.avatar || 
//          testimonial.image || 
//          testimonial.photo || 
//          testimonial.picture ||
//          (testimonial.media && testimonial.media.type === 'image' ? getMediaUrl(testimonial.media) : null);
// };

// // Helper function to determine media type
// const getMediaType = (media, url) => {
//   if (!media && !url) return null;

//   // If media object has type specified
//   if (media && media.type) {
//     return media.type.toLowerCase();
//   }

//   // Try to determine from URL extension
//   if (url) {
//     const urlLower = url.toLowerCase();
//     if (urlLower.includes('.mp4') || urlLower.includes('.webm') || urlLower.includes('.mov') || urlLower.includes('video')) {
//       return 'video';
//     }
//     if (urlLower.includes('.jpg') || urlLower.includes('.jpeg') || urlLower.includes('.png') || urlLower.includes('.gif') || urlLower.includes('image')) {
//       return 'image';
//     }
//   }

//   // Default to image if we can't determine
//   return 'image';
// };

// // Enhanced Image Component with error handling
// const SafeImage = ({ src, alt, style, onClick, onError, onLoad }) => {
//   const [imageError, setImageError] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   const handleError = () => {
//     console.log('Image failed to load:', src);
//     setImageError(true);
//     if (onError) onError();
//   };

//   const handleLoad = () => {
//     setImageLoaded(true);
//     if (onLoad) onLoad();
//   };

//   if (!src || imageError) {
//     return (
//       <div style={{
//         ...style,
//         backgroundColor: "#666",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         color: "#fff"
//       }}>
//         <FaUser size={style?.width === "80px" ? 24 : 32} />
//       </div>
//     );
//   }

//   return (
//     <>
//       {!imageLoaded && (
//         <div style={{
//           ...style,
//           backgroundColor: "#666",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "#fff"
//         }}>
//           Loading...
//         </div>
//       )}
//       <img
//         src={src}
//         alt={alt}
//         style={{
//           ...style,
//           display: imageLoaded ? 'block' : 'none'
//         }}
//         onClick={onClick}
//         onError={handleError}
//         onLoad={handleLoad}
//       />
//     </>
//   );
// };

// // Enhanced Video Component
// const SafeVideo = ({ src, style, onClick, showControls = false }) => {
//   const [videoError, setVideoError] = useState(false);

//   if (!src || videoError) {
//     return (
//       <div style={{
//         ...style,
//         backgroundColor: "#666",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         color: "#fff"
//       }}>
//         <FaImage size={32} />
//       </div>
//     );
//   }

//   return (
//     <div style={{ position: "relative" }}>
//       <video
//         src={src}
//         style={style}
//         preload="metadata"
//         controls={showControls}
//         onError={() => {
//           console.log('Video failed to load:', src);
//           setVideoError(true);
//         }}
//       />
//       {!showControls && (
//         <div 
//           onClick={onClick}
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: "60px",
//             height: "60px",
//             backgroundColor: "rgba(0,0,0,0.7)",
//             borderRadius: "50%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             transition: "all 0.3s ease"
//           }}
//         >
//           <FaPlay color="#fff" size={20} />
//         </div>
//       )}
//     </div>
//   );
// };

// const TestimonialMedia = ({ testimonial }) => {
//   const [showFullMedia, setShowFullMedia] = useState(false);

//   const mediaUrl = getMediaUrl(testimonial.media);
//   const mediaType = getMediaType(testimonial.media, mediaUrl);

//   // Debug logging
//   console.log('Testimonial media data:', {
//     testimonial: testimonial.author,
//     media: testimonial.media,
//     mediaUrl,
//     mediaType
//   });

//   if (!mediaUrl) {
//     console.log('No media URL found for testimonial:', testimonial.author);
//     return null;
//   }

//   const handleMediaClick = () => {
//     setShowFullMedia(true);
//   };

//   return (
//     <>
//       {/* Media Content in Testimonial */}
//       <div style={{
//         marginTop: "20px",
//         marginBottom: "20px",
//         borderRadius: "12px",
//         overflow: "hidden",
//         position: "relative"
//       }}>
//         {mediaType === "video" ? (
//           <SafeVideo
//             src={mediaUrl}
//             onClick={handleMediaClick}
//             style={{
//               width: "100%",
//               maxHeight: "200px",
//               objectFit: "cover",
//               borderRadius: "12px",
//               backgroundColor: "#333"
//             }}
//           />
//         ) : (
//           <SafeImage
//             src={mediaUrl}
//             alt={`${testimonial.author} testimonial media`}
//             onClick={handleMediaClick}
//             style={{
//               width: "100%",
//               maxHeight: "200px",
//               objectFit: "cover",
//               borderRadius: "12px",
//               cursor: "pointer",
//               transition: "transform 0.3s ease"
//             }}
//           />
//         )}
//       </div>

//       {/* Full Screen Media Modal */}
//       {showFullMedia && (
//         <div 
//           onClick={() => setShowFullMedia(false)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.9)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//             cursor: "pointer"
//           }}
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               maxWidth: "90vw",
//               maxHeight: "90vh",
//               position: "relative"
//             }}
//           >
//             {mediaType === "video" ? (
//               <SafeVideo
//                 src={mediaUrl}
//                 showControls={true}
//                 style={{
//                   maxWidth: "100%",
//                   maxHeight: "100%",
//                   borderRadius: "12px"
//                 }}
//               />
//             ) : (
//               <SafeImage
//                 src={mediaUrl}
//                 alt={`${testimonial.author} testimonial`}
//                 style={{
//                   maxWidth: "100%",
//                   maxHeight: "100%",
//                   borderRadius: "12px"
//                 }}
//               />
//             )}
//             <button
//               onClick={() => setShowFullMedia(false)}
//               style={{
//                 position: "absolute",
//                 top: "-40px",
//                 right: "0px",
//                 background: "none",
//                 border: "none",
//                 color: "#fff",
//                 fontSize: "30px",
//                 cursor: "pointer"
//               }}
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const ProfilePicture = ({ testimonial }) => {
//   const pfpUrl = getProfilePictureUrl(testimonial);

//   // Debug logging
//   console.log('Profile picture data:', {
//     author: testimonial.author,
//     pfpUrl,
//     rawData: {
//       pfp: testimonial.pfp,
//       profilePicture: testimonial.profilePicture,
//       avatar: testimonial.avatar,
//       image: testimonial.image
//     }
//   });

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
//       {/* Profile Picture */}
//       <div style={{ position: "relative", flexShrink: 0 }}>
//         <SafeImage
//           src={pfpUrl}
//           alt={`${testimonial.author} profile`}
//           style={{
//             width: "80px",
//             height: "80px",
//             borderRadius: "50%",
//             objectFit: "cover",
//             border: `3px solid ${THEME_COLOR.ACCENT}`
//           }}
//         />
//       </div>

//       {/* Author Info */}
//       <div style={{ flex: 1 }}>
//         <div style={{
//           fontWeight: 700,
//           fontSize: "18px",
//           color: THEME_COLOR.COLOR,
//           marginBottom: "4px"
//         }}>
//           {testimonial.author}
//         </div>
//         <div style={{
//           fontSize: "14px",
//           color: "#bdbdbd"
//         }}>
//           {testimonial.role || testimonial.title || "Client"}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function Testimonials() {
//   const [testimonials, setTestimonials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     let retryCount = 0;
//     const maxRetries = 4;

//     const fetchTestimonials = async () => {
//       try {
//         const response = await fetch(`${API_URL}testimonials`);
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//         const result = await response.json();
//         const raw = result.data || [];

//         // Enhanced logging to see the actual data structure
//         console.log("Full API Response:", result);
//         console.log("Testimonials Array:", raw);
//         console.log("First testimonial structure:", raw[0]);

//         setTestimonials(raw);
//         setLoading(false);
//         setError(null);
//       } catch (err) {
//         console.error("API Error:", err);
//         retryCount++;
//         if (retryCount < maxRetries) {
//           setTimeout(fetchTestimonials, 1000);
//         } else {
//           setError("Failed to load testimonials after multiple attempts");
//           setLoading(false);
//         }
//       }
//     };

//     fetchTestimonials();
//   }, []);

//   const nextSlide = () => {
//     if (testimonials.length > 0) {
//       setCurrentIndex((prev) => (prev + 1) % testimonials.length);
//     }
//   };

//   const prevSlide = () => {
//     if (testimonials.length > 0) {
//       setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
//     }
//   };

//   const getVisibleTestimonials = () => {
//     if (testimonials.length === 0) return [];

//     const visible = [];
//     for (let i = 0; i < Math.min(3, testimonials.length); i++) {
//       const index = (currentIndex + i) % testimonials.length;
//       visible.push({ ...testimonials[index], displayIndex: i });
//     }
//     return visible;
//   };

//   return (
//     <div style={{
//       background: "#121212",
//       minHeight: "100vh",
//       position: "relative",
//       padding: "80px 0"
//     }}>
//       {/* Header */}
//       <div style={{
//         textAlign: "center",
//         marginBottom: "80px",
//         padding: "0 20px"
//       }}>
//         <div style={{
//           color: "#FF9907",
//           fontWeight: 600,
//           fontSize: "24px",
//           letterSpacing: "3px",
//           marginBottom: "16px",
//           textTransform: "uppercase"
//         }}>
//           TESTIMONIALS
//         </div>
//         <div style={{
//           color: THEME_COLOR.COLOR,
//           fontWeight: 700,
//           fontSize: "16px",
//           lineHeight: 1.1
//         }}>
//           Hear from Our Clients
//         </div>
//       </div>

//       {/* Content */}
//       <div style={{
//         position: "relative",
//         maxWidth: "1400px",
//         margin: "0 auto",
//         padding: "0 80px"
//       }}>
//         {loading && (
//           <div style={{
//             textAlign: "center",
//             color: THEME_COLOR.COLOR,
//             padding: "100px 20px",
//             fontSize: "18px"
//           }}>
//             Loading testimonials...
//           </div>
//         )}

//         {error && (
//           <div style={{
//             textAlign: "center",
//             color: "#ff6b6b",
//             padding: "100px 20px",
//             fontSize: "18px"
//           }}>
//             Error: {error}
//           </div>
//         )}

//         {!loading && !error && testimonials.length > 0 && (
//           <>
//             {/* Navigation Arrows */}
//             <Arrow
//               direction="left"
//               onClick={prevSlide}
//               disabled={testimonials.length <= 1}
//             />
//             <Arrow
//               direction="right"
//               onClick={nextSlide}
//               disabled={testimonials.length <= 1}
//             />
//             {/* Testimonials Grid */}
//             <div style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
//               gap: "10px",
//               alignItems: "stretch"
//             }}>
//               {getVisibleTestimonials().map((testimonial, index) => (
//                 <div
//                   key={`${testimonial.author}-${currentIndex}-${index}`}
//                   style={{
//                     background: THEME_COLOR.CARD_BACKGROUND,
//                     borderRadius: "20px",
//                     padding: "40px 30px",
//                     position: "relative",
//                     minHeight: "400px",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                     boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
//                     transition: "all 0.3s ease"
//                   }}
//                 >
//                   {/* Quote Icon */}
//                   <FaQuoteLeft
//                     size={48}
//                     color={THEME_COLOR.ACCENT}
//                     style={{ marginBottom: "24px" }}
//                   />

//                   {/* Quote Text */}
//                   <div style={{
//                     fontSize: "18px",
//                     lineHeight: 1.6,
//                     color: "#e5e5e5",
//                     marginBottom: "20px",
//                     flex: 1
//                   }}>
//                     {testimonial.quote || testimonial.text || testimonial.content}
//                   </div>

//                   {/* Media Content */}
//                   <TestimonialMedia testimonial={testimonial} />

//                   {/* Author Section with Profile Picture */}
//                   <ProfilePicture testimonial={testimonial} />
//                 </div>
//               ))}
//             </div>

//             {/* Dots Indicator */}
//             <div style={{
//               display: "flex",
//               justifyContent: "center",
//               gap: "12px",
//               marginTop: "50px"
//             }}>
//               {testimonials.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentIndex(index)}
//                   aria-label={`Go to testimonial ${index + 1}`}
//                   style={{
//                     width: "12px",
//                     height: "12px",
//                     borderRadius: "50%",
//                     border: "none",
//                     backgroundColor: index === currentIndex ? THEME_COLOR.ACCENT : "#666",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease"
//                   }}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

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

//   // Always use placeholder data
  const testimonialsToDisplay = placeholderTestimonials;

  return (
    <>
      <div id="testimonials" className="text-center">
        <h3 className="fw-bold fs-1" style={{ color: "#FF9906" }}>Testimonials</h3>
        <h1 className="mt-3 fs-3 fw-bold">Hear From our Clients</h1>
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