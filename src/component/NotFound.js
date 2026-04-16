import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.text}>
        Sorry, the page you are looking for does not exist.
      </p>

      <Link to="/" style={styles.button}>
        Go Back Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8f9fa",
    textAlign: "center",
  },
  code: {
    fontSize: "100px",
    margin: "0",
    color: "#dc3545",
  },
  title: {
    fontSize: "28px",
    margin: "10px 0",
  },
  text: {
    fontSize: "16px",
    color: "#6c757d",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
  },
};

export default NotFound;