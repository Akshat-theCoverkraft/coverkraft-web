import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://52.52.154.65:5242/news/getAll?isActive=true');
        const sorted = (res.data?.data || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sorted);
      } catch (err) {
        console.error('Failed fetching:', err);
      }
    };
    fetchNews();
  }, []);

  if (posts.length === 0) return null;

  const leftPost = posts[0];
  const rightSideCards = posts.slice(1, 4);

  const getUrl = (p) =>
    p.videoUrl
      ? p.videoUrl.startsWith('http')
        ? p.videoUrl
        : `http://52.52.154.65:5242/${p.videoUrl}`
      : p.newsImg.startsWith('http')
        ? p.newsImg
        : `http://52.52.154.65:5242/${p.newsImg}`;

  const renderCardHeader = (type) => (
    <Chip
      icon={<TravelExploreIcon />}
      label={type.charAt(0).toUpperCase() + type.slice(1)}
      size="small"
      sx={{ bgcolor: '#2f2f2f', color: '#fff', mb: 1 }}
    />
  );

  const StyledButton = styled('button')(() => ({
    backgroundColor: 'transparent',
    color: '#8AC642',
    border: '1px solid #8AC642',
    borderRadius: '40px',
    padding: '12px 32px',
    fontSize: '1.8rem',
    fontWeight: '600',
    minWidth: '180px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: '#8AC642',
      color: '#000',
    },
  }));

  const renderMedia = (p, style = {}) => {
    const url = getUrl(p);
    const isVideo = url.match(/\.(mp4|mov|avi|mkv|webm)$/i);

    if (isVideo) {
      return (
        <video
          muted
          loop
          playsInline
          preload="auto"
          controls
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: style.borderRadius || 0,
            ...style,
          }}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <img
        src={url}
        alt={p.subtitle}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: style.borderRadius || 0,
          ...style,
        }}
      />
    );
  };

  return (
    <Box  id='blog' sx={{ backgroundColor: '#111', color: '#fff', px: 4, py: 6, mt: 1, pl: 12, pr: 12 }}>
      <Typography variant="h3" sx={{ color: '#FF9906', fontWeight: 700, mb: 1, textAlign: 'center', fontSize: { xs: '24px', sm: '28px', md: '30px' } }}>
        News And Blogs
      </Typography>
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 500, mb: 4, textAlign: 'center', fontSize: { xs: '26px', sm: '30px', md: '32px' } }}>
        Latest From The Blogs
      </Typography>

      <Grid container spacing={4} alignItems="stretch">
        {/* LEFT SIDE */}
        <Grid item xs={12} md={6} mt={3}>
          <Card
            sx={{
              borderRadius: '40px',
              bgcolor: '#212121',
              overflow: 'hidden',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={() => navigate(`/feed/${leftPost.type}/${leftPost._id}`)}
          >
            <Box sx={{ width: '100%', height: '360%', overflow: 'hidden' }}>
              {renderMedia(leftPost, { borderRadius: '40px 40px 0 0' })}
            </Box>

            <CardContent sx={{ p: 3, height: '100%' }}>
              {renderCardHeader(leftPost.type)}
              <Typography variant="h6" color="#fff" gutterBottom sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                {leftPost.subtitle}
              </Typography>
              <Typography variant="body2" color="#DCDCDC" sx={{ fontSize: '1.05rem', mb: 1.5, lineHeight: 1.5 }}>
                {leftPost.description}
              </Typography>
              <Typography variant="body2" color="#888">
                {moment(leftPost.createdAt).format('MMM DD, YYYY')}
              </Typography>
              <Typography
                variant="body1"
                color="#7BC043"
                sx={{ mt: '-15px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'right' }}
                onClick={() => navigate(`/feed/${leftPost.type}/${leftPost._id}`)}
              >
                Read More →
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT SIDE */}

        <Grid item xs={12} md={6} mt={3}>
          <Grid container spacing={3} direction="column">
            {rightSideCards.map((p) => (
              <Grid item key={p._id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    borderRadius: 6,
                    bgcolor: '#212121',
                    color: '#fff',
                    cursor: 'pointer',
                    height: '200px',
                    overflow: 'hidden',
                  }}
                  onClick={() => navigate(`/feed/${p.type}/${p._id}`)}
                >
                  <Box sx={{ width: 180, height: '100%', overflow: 'hidden' }}>
                    {renderMedia(p, { width: '180px', height: '100%', borderRadius: '12px 0 0 12px' })}
                  </Box>
                  <CardContent sx={{ flex: 1 }}>
                    {renderCardHeader(p.type)}
                    <Typography variant="h6" color="#fff" gutterBottom sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {p.subtitle}
                    </Typography>
                    <Typography variant="body2" color="#DCDCDC" sx={{ fontSize: '1rem' }}>
                      {p.description}
                    </Typography>
                    <Typography variant="body2" color="#888" mt={1}>
                      {moment(p.createdAt).format('MMM DD, YYYY')}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="#7BC043"
                      sx={{ mt: '-10px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'right' }}
                      onClick={() => navigate(`/feed/${p.type}/${p._id}`)}
                    >
                      Read More →
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      {/* VIEW ALL */}
      <Box textAlign="center" mt={6}>
        <StyledButton onClick={() => navigate('/feed/blog')}>
          VIEW ALL
        </StyledButton>
      </Box>
    </Box>
  );
};

export default BlogSection;
