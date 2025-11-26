import React, { useEffect, useRef, useState } from "react";
 
const caseStudies = [
  {
    title: "Medical Insurance for Alextina",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    heading: "Complete Health Coverage",
    desc: "Comprehensive medical insurance solution tailored for individual and family needs.",
    points: [
      "100% hospitalization coverage",
      "Annual health checkups included",
      "Zero waiting period for accidents",
      "Cashless treatment at 10,000+ hospitals",
    ],
  },
  {
    title: "Auto Insurance Coverage",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop",
    heading: "Complete Vehicle Protection",
    desc: "Full coverage auto insurance with instant claim settlement and roadside assistance.",
    points: [
      "24/7 roadside assistance",
      "Zero depreciation coverage",
      "Quick claim processing",
      "Personal accident cover included",
    ],
  },
  {
    title: "Family Life Insurance",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
    heading: "Secure Your Family's Future",
    desc: "Comprehensive life insurance plan ensuring financial security for your loved ones.",
    points: [
      "High sum assured coverage",
      "Tax benefits under 80C",
      "Flexible premium payment options",
      "Critical illness rider available",
    ],
  },
  {
    title: "Home Insurance Plan",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    heading: "Protect Your Home Sweet Home",
    desc: "Complete home protection against natural disasters, theft, and damages.",
    points: [
      "Structure and contents coverage",
      "Natural disaster protection",
      "Burglary and theft coverage",
      "Alternative accommodation included",
    ],
  },
  {
    title: "Business Insurance",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    heading: "Comprehensive Business Protection",
    desc: "Safeguard your business assets and operations with tailored insurance solutions.",
    points: [
      "Property and equipment coverage",
      "Liability protection",
      "Business interruption coverage",
      "Employee benefits included",
    ],
  },
  {
    title: "Travel Insurance",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop",
    heading: "Safe & Secure Travel",
    desc: "Complete travel insurance for domestic and international trips with 24/7 support.",
    points: [
      "Medical emergency coverage abroad",
      "Trip cancellation protection",
      "Lost baggage compensation",
      "Emergency evacuation included",
    ],
  },
];
 
export default function CaseStudiesCarouselExample() {
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6);
 
  const totalSlides = caseStudies.length;
  const totalPages = Math.ceil(totalSlides / cardsPerView);
  const showNavButtons = totalSlides > cardsPerView;
 
  const updateCardsPerView = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setCardsPerView(1);
    } else if (width < 768) {
      setCardsPerView(2);
    } else if (width < 1024) {
      setCardsPerView(3);
    } else if (width < 1280) {
      setCardsPerView(4);
    } else if (width < 1536) {
      setCardsPerView(5);
    } else {
      setCardsPerView(6);
    }
  };
 
  const updateCarousel = () => {
    if (!trackRef.current || !wrapperRef.current) return;
    const containerWidth = wrapperRef.current.offsetWidth;
    const cardWidth = containerWidth / cardsPerView;
 
    trackRef.current.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  };
 
  const moveCarousel = (dir) => {
    const maxIndex = totalSlides - cardsPerView;
    let newIndex = currentIndex + dir;
 
    if (newIndex < 0) newIndex = maxIndex;
    if (newIndex > maxIndex) newIndex = 0;
 
    setCurrentIndex(newIndex);
  };
 
  const goToPage = (page) => {
    let idx = page * cardsPerView;
    if (idx > totalSlides - cardsPerView) {
      idx = totalSlides - cardsPerView;
    }
    setCurrentIndex(idx);
  };
 
  useEffect(() => {
    updateCarousel();
  }, [currentIndex, cardsPerView]);
 
  useEffect(() => {
    const interval = setInterval(() => {
      moveCarousel(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, cardsPerView]);
 
  useEffect(() => {
    updateCardsPerView();
    const handleResize = () => {
      updateCardsPerView();
      updateCarousel();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  useEffect(() => {
    setCurrentIndex(0);
  }, [cardsPerView]);
 
  const cardWidthPercent = 100 / cardsPerView;
 
  return (
    <div className="py-20 px-4 bg-black">
      <div className="max-w-[1600px] mx-auto text-center mb-24">
        <h1 className="text-center font-bold leading-tight">
          <span className="text-[#FF9906] text-3xl sm:text-4xl md:text-5xl">
            Pick a Policy & Get Covered
          </span>
        </h1>
      </div>
 
      <div className="relative px-4 sm:px-8 md:px-12 lg:px-16">
        {showNavButtons && (
          <button
            onClick={() => moveCarousel(-1)}
            className="absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-[#8bc34a]/90 hover:bg-[#7cb342] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition scale-100 hover:scale-110 z-30"
          >
            <svg
              fill="none"
              stroke="currentColor"
              className="w-6 h-6 sm:w-7 sm:h-7"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
 
        <div className="pt-28 pb-12 -mt-20 -mb-12">
          <div ref={wrapperRef} className="overflow-visible">
            <div
              ref={trackRef}
              className="flex gap-4 sm:gap-5 md:gap-6 transition-all duration-500 ease-in-out"
              style={{ width: `${(totalSlides * 100) / cardsPerView}%` }}
            >
              {caseStudies.map((card, i) => (
                <div
                  key={i}
                  style={{
                    width: `calc(${cardWidthPercent}% - ${(cardsPerView - 1) * (cardsPerView >= 4 ? 24 : 20) / cardsPerView}px)`
                  }}
                  className={`h-[380px] relative rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-500 group ${
                    i % 2 === 0 ? "mt-12 sm:mt-16 md:mt-20" : "mt-0"
                  } hover:scale-105 hover:z-40 hover:shadow-2xl hover:shadow-[#8bc34a]/30`}
                >
                  {/* Image/GIF - Now fully visible by default */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 brightness-100"
                    style={{ filter: 'none' }}
                  />
 
                  {/* Minimal bottom overlay - only for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
 
                  {/* Text content - positioned at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 transform transition-all duration-500">
                    <div className="relative inline-block">
                      <h2 className="text-xl sm:text-2xl font-bold text-white relative z-10 drop-shadow-lg group-hover:text-[#8bc34a] transition-colors duration-300">
                        {card.title}
                      </h2>
                      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#8bc34a]/60 to-[#558b2f]/60 rounded-sm transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
 
                    {/* Additional info on hover */}
                    <p className="text-base text-white/90 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {showNavButtons && (
          <button
            onClick={() => moveCarousel(1)}
            className="absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-[#8bc34a]/90 hover:bg-[#7cb342] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition scale-100 hover:scale-110 z-30"
          >
            <svg
              fill="none"
              stroke="currentColor"
              className="w-6 h-6 sm:w-7 sm:h-7"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
 
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 sm:gap-3 mt-14">
          {[...Array(totalPages)].map((_, i) => {
            const active = Math.floor(currentIndex / cardsPerView) === i;
            return (
              <div
                key={i}
                onClick={() => goToPage(i)}
                className={`transition-all cursor-pointer ${
                  active
                    ? "w-8 sm:w-10 h-3 sm:h-3.5 bg-[#3b9eff] rounded-md"
                    : "w-3 sm:w-3.5 h-3 sm:h-3.5 bg-white/30 rounded-full hover:bg-white/50"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}