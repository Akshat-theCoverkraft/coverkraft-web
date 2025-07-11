// src/components/Loader.jsx
const Loader = ({ size = 150, message = "Content Loading..." }) => {
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
            <img
                src="/Cute-Boy-Running.gif"
                alt="Loading animation"
                style={{
                    width: size,
                    height: "auto",
                    objectFit: "contain",
                }}
            />
            {message && (
                <p style={{ marginTop: "1rem", fontSize: "1.1rem", color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Loader;
