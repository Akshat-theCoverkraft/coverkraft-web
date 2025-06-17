export const renderSmallCard = (post, index) => (
  <div
    style={{
      display: "flex",
      backgroundColor: "#2c2c3e",
      borderRadius: 15,
      overflow: "hidden",
      cursor: "pointer",
    }}
    onClick={() => navigate(`/coverkraft/feed/${post?.type}`)}
  >
    {/* Date Badge */}
    <div
      style={{
        backgroundColor: "#1BD47B",
        padding: "10px",
        borderRadius: "12px",
        color: "white",
        fontWeight: "bold",
        width: "60px",
        textAlign: "center",
        margin: "10px",
      }}
    >
      <div style={{ fontSize: "14px" }}>21</div>
      <div style={{ fontSize: "12px" }}>FEB</div>
    </div>

    {/* Thumbnail */}
    <img
      src={post?.newsImg || Eye}
      alt={post?.title}
      style={{
        width: "100px",
        height: "100px",
        objectFit: "cover",
        borderRadius: "10px",
        margin: "10px",
      }}
    />

    {/* Content */}
    <div style={{ padding: "10px", flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Chip
          label={capitalizeFirstLetter(post?.type)}
          size="small"
          sx={{
            backgroundColor: "#1BD47B",
            color: "white",
            fontWeight: "bold",
          }}
        />
        <Typography variant="body2" color="#ccc">
          {post?.date || "May 23, 2024"}
        </Typography>
      </div>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color="#fff"
        style={{ fontSize: "1rem", marginTop: "5px" }}
      >
        {truncateString(post?.subtitle, 60)}
      </Typography>
      <Typography
        variant="body2"
        color="#bbb"
        style={{ fontSize: "0.9rem", marginTop: "4px" }}
      >
        {truncateString(post?.description, 90)}
      </Typography>
      <div style={{ marginTop: "6px" }}>
        <Link
          to={`/coverkraft/feed/${post?.type}`}
          style={{ color: "#1BD47B", fontWeight: "bold", fontSize: "0.9rem" }}
        >
          Read More →
        </Link>
      </div>
    </div>
  </div>
);
