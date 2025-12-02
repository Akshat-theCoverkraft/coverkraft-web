import React, { useState, useEffect } from "react";
import {
  Car,
  Bike,
  Shield,
  Users,
  Truck,
  Wrench,
  Plane,
  Home,
  Heart,
  Briefcase,
  Package,
  Building,
  Globe,
  Umbrella,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPolicyType } from "../../store/action/action";
import API_URL from "../../ServiceModule/Service";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { headingStyle } from "../../theme/themeStyles";

const ITEMS_PER_PAGE = 7;

export default function HealthInsurance() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [policyType, setPolicyType] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  
  const policyTypes = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Icon mapping for dynamic data - maps policy type names to Lucide icons
  const iconMap = {
    car: Car,
    bike: Bike,
    health: Shield,
    term: Users,
    gcv: Truck,
    pcv: Wrench,
    travel: Plane,
    home: Home,
    life: Heart,
    business: Briefcase,
    commercial: Package,
    property: Building,
    international: Globe,
    general: Umbrella,
  };

  const slides = [
    "https://policy.thecoverkraft.com/assets/images/frontend-images/home-image1.png",
    "https://policy.thecoverkraft.com/assets/images/frontend-images/home-image2.png",
    "https://policy.thecoverkraft.com/assets/images/frontend-images/home-image3.png",
  ];

  // Fetch policy types from API
  useEffect(() => {
    dispatch(getAllPolicyType(API_URL));
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (
      policyTypes &&
      policyTypes.getPolicyType &&
      Array.isArray(policyTypes.getPolicyType.data)
    ) {
      setPolicyType(policyTypes.getPolicyType.data);
    }
  }, [policyTypes]);

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Handle policy click navigation
  const handlePolicyClick = (policy) => {
    console.log("Clicked Policy:", policy);
    navigate(`/policy-details/${policy._id}`);
  };

  // Handle see more functionality
  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  // Handle see less functionality
  const handleSeeLess = () => {
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Get icon component based on policy type name
  const getIconComponent = (policyTypeName) => {
    if (!policyTypeName) return Shield;
    
    // Convert policy type to lowercase and remove spaces for matching
    const normalizedName = policyTypeName.toLowerCase().replace(/\s+/g, '');
    
    // Try to find exact match
    if (iconMap[normalizedName]) {
      return iconMap[normalizedName];
    }
    
    // Try to find partial match
    for (const [key, icon] of Object.entries(iconMap)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return icon;
      }
    }
    
    // Default fallback
    return Shield;
  };

  // Calculate how many items to show
  const visiblePolicies = policyType.slice(0, visibleCount);
  const firstRowCount = Math.min(4, visiblePolicies.length);
  const firstRow = visiblePolicies.slice(0, firstRowCount);
  const secondRow = visiblePolicies.slice(firstRowCount);

 return (
  <div className="relative z-10 flex flex-col items-center px-6">

    {/* Background Slideshow with Dark Overlay */}
    <div className="absolute inset-0">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img 
            src={slide} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
      ))}
    </div>

    {/* Main Content */}
    <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 my-10">
      {/* Header */}
      <div className="text-center mb-20 animate-fade-in-down">
        <Typography variant="h3" sx={{ ...headingStyle, textAlign: "center" }}>
          Pick a Policy & Get Covered
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#FFF",
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
            fontSize: { xs: "26px", sm: "30px", md: "32px" },
          }}
        >
          Let's get you & your family insured
        </Typography>
      </div>

      {/* Insurance Cards - Dynamic from API */}
      <div className="flex flex-col gap-y-20 items-center">
        
        {/* Row 1 */}
        {firstRow.length > 0 && (
          <div className="flex gap-16 flex-wrap justify-center">
            {firstRow.map((policy, index) => {
              const IconComponent = getIconComponent(policy.policyType);
              return (
                <div
                  key={policy._id}
                  className="group relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 140}ms` }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    onClick={() => handlePolicyClick(policy)}
                    className="backdrop-blur-md bg-black/90 border border-gray-800/50 rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-4 hover:shadow-[0_20px_60px_rgba(111,168,42,0.5)] hover:border-[#6fa82a]/50 w-80 h-80"
                  >
                    <div className="p-8 flex flex-col items-center justify-center h-full gap-8">
                      {/* Icon */}
                      <div
                        className={`flex items-center justify-center text-[#6fa82a] transition-all duration-500 ${
                          hoveredCard === index
                            ? "scale-110 rotate-6 drop-shadow-[0_0_15px_rgba(111,168,42,0.8)]"
                            : "scale-100"
                        }`}
                      >
                        {policy.icon ? (
                          <img
                            src={policy.icon}
                            alt={policy.policyType}
                            className="w-36 h-36 object-contain drop-shadow-2xl brightness-110"
                          />
                        ) : (
                          <IconComponent
                            size={140}
                            strokeWidth={1.5}
                            className="drop-shadow-2xl"
                          />
                        )}
                      </div>

                      {/* Title */}
                      <div className="text-white font-bold text-2xl text-center w-full drop-shadow-lg">
                        {policy.policyType}
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-[#6fa82a]/20 via-[#6fa82a]/10 to-[#6fa82a]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Row 2 */}
        {secondRow.length > 0 && (
          <div className="flex gap-16 flex-wrap justify-center">
            {secondRow.map((policy, index) => {
              const IconComponent = getIconComponent(policy.policyType);
              const actualIndex = index + firstRowCount;

              return (
                <div
                  key={policy._id}
                  className="group relative animate-fade-in-up"
                  style={{ animationDelay: `${actualIndex * 140}ms` }}
                  onMouseEnter={() => setHoveredCard(actualIndex)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    onClick={() => handlePolicyClick(policy)}
                    className="backdrop-blur-md bg-black/90 border border-gray-800/50 rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-4 hover:shadow-[0_20px_60px_rgba(111,168,42,0.5)] hover:border-[#6fa82a]/50 w-80 h-80"
                  >
                    <div className="p-8 flex flex-col items-center justify-center h-full gap-8">
                      
                      {/* Icon */}
                      <div
                        className={`flex items-center justify-center text-[#6fa82a] transition-all duration-500 ${
                          hoveredCard === actualIndex
                            ? "scale-110 rotate-6 drop-shadow-[0_0_15px_rgba(111,168,42,0.8)]"
                            : "scale-100"
                        }`}
                      >
                        {policy.icon ? (
                          <img
                            src={policy.icon}
                            alt={policy.policyType}
                            className="w-36 h-36 object-contain drop-shadow-2xl brightness-110"
                          />
                        ) : (
                          <IconComponent
                            size={140}
                            strokeWidth={1.5}
                            className="drop-shadow-2xl"
                          />
                        )}
                      </div>

                      {/* Title */}
                      <div className="text-white font-bold text-2xl text-center w-full drop-shadow-lg">
                        {policy.policyType}
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-[#6fa82a]/20 via-[#6fa82a]/10 to-[#6fa82a]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>

    {/* Animations */}
    <style jsx>{`
      @keyframes fade-in-down {
        from { opacity: 0; transform: translateY(-20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
      .animate-fade-in-up { animation: fade-in-up 0.7s ease-out; animation-fill-mode: both; }
    `}</style>
  </div>
);

}