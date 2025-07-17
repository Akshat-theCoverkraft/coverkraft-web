import { useState } from "react";

const Loader = ({ size = 150, message = "Content Loading..." }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: "2rem",
            }}
        >
            {/* Show this while GIF is loading */}
            {!isImageLoaded && (
                <p style={{ color: "#fff", fontWeight: "bold", marginBottom: "1rem" }}>
                    Animation is loading...
                </p>
            )}

            <img
                src="/src/Images/CKanimation.gif"
                alt="Loading animation"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)} // fallback if it fails to load
                style={{
                    width: size,
                    height: "auto",
                    objectFit: "contain",
                    display: isImageLoaded ? "block" : "none",
                }}
            />

            {/* Show final message after image is loaded */}
            {isImageLoaded && message && (
                <p style={{ marginTop: "1rem", fontSize: "1.1rem", color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Loader;
