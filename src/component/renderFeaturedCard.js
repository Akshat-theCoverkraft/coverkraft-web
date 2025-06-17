export const renderFeaturedCard = (post, index) => (
  <div
    style={{
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: "#2c2c3e",
      padding: "1.5em",
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
        position: "absolute",
        marginTop: "-10px",
        marginLeft: "-10px",
      }}
    >
      <div style={{ fontSize: "14px" }}>21</div>
      <div style={{ fontSize: "12px" }}>FEB</div>
    </div>

    {/* Media */}
    <MediaContainer style={{ height: 250 }}>
      {post?.newsVideo ? (
        <video
          controls
          muted
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={post.newsVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={post?.newsImg || Eye}
          alt={post?.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </MediaContainer>

    {/* Content */}
    <div style={{ paddingTop: "1em", color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
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
      <Typography variant="h6" fontWeight="bold" fontSize="1.3rem" gutterBottom>
        {truncateString(post?.subtitle, 70)}
      </Typography>
      <Typography variant="body2" color="#bbb" fontSize="1rem">
        {truncateString(post?.description, 150)}
      </Typography>
      <Link
        to={`/coverkraft/feed/${post?.type}`}
        style={{ color: "#1BD47B", fontWeight: "bold", display: "inline-block", marginTop: "10px" }}
      >
        Read More →
      </Link>
    </div>
  </div>
);
