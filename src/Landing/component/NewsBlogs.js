import { useEffect, useState, useRef } from 'react';
import {
  Card,
  Box,
  Grid,
  Chip,
  Typography,
  Skeleton,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import bgImage from '../../Images/bg.png';

const BlogSection = () => {
  const [latestPosts, setLatestPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const videoRefs = useRef([]);
  videoRefs.current = [];

  const registerVideo = (el) => {
    if (el && !videoRefs.current.includes(el)) {
      videoRefs.current.push(el);
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://52.52.154.65:5242/news/getAll?isActive=true');
        const sorted = (res.data?.data || [])
          .filter(item => item.status === 'active')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const latestByType = {
          videos: sorted.filter(p => p.type === 'video').slice(0, 2),
        };
        ['short', 'news', 'blog'].forEach(type => {
          latestByType[type] = sorted.find(p => p.type === type);
        });

        setLatestPosts(latestByType);
      } catch (err) {
        console.error('Failed fetching:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const pauseAll = () => {
      videoRefs.current.forEach((video) => !video.paused && video.pause());
    };
    window.addEventListener('scroll', pauseAll);
    return () => window.removeEventListener('scroll', pauseAll);
  }, []);

  const getUrl = (p) =>
    p.videoUrl
      ? p.videoUrl.startsWith('http') ? p.videoUrl : `http://52.52.154.65:5242/${p.videoUrl}`
      : p.newsImg.startsWith('http') ? p.newsImg : `http://52.52.154.65:5242/${p.newsImg}`;

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

  const renderCard = (post, type, isLarge = false) => {
    if (loading) return <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: '20px' }} />;
    if (!post) return (
      <Card sx={{ bgcolor: '#212121', borderRadius: '20px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        <Typography>No {type} available.</Typography>
      </Card>
    );

    const url = getUrl(post);
    const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(url);
    const mediaStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '20px',
    };

    return (
      <Card
        onClick={() => navigate(`/feed/${post.type}/${post._id}`)}
        sx={{
          position: 'relative',
          height: '100%',
          borderRadius: '20px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <Box sx={{ position: 'relative', height: '100%' }}>
          <Chip
            icon={<TravelExploreIcon />}
            label={post.type.toUpperCase()}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 2,
              bgcolor: '#8AC642',
              color: '#000',
              fontWeight: 600
            }}
          />
          {isVideo ? (
            <video
              ref={registerVideo}
              controls
              preload="metadata"
              style={{ ...mediaStyle, objectFit: 'contain', backgroundColor: '#000' }}
              onPlay={(e) => {
                videoRefs.current.forEach((v) => {
                  if (v !== e.target && !v.paused) v.pause();
                });
              }}
            >
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={url} alt={post.subtitle} style={mediaStyle} />
          )}

          {(type === 'blog' || type === 'news') && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#fff',
              }}
            >
              <Typography variant={isLarge ? 'h5' : 'h6'} fontWeight={600}>
                {post.subtitle}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                {moment(post.createdAt).format('MMM DD, YYYY')}
              </Typography>
              <Button
                size="small"
                variant="text"
                sx={{
                  color: '#8AC642',
                  textTransform: 'none',
                  fontWeight: 500,
                  padding: 0,
                  fontSize: '1.4rem',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/feed/${post.type}/${post._id}`);
                }}
              >
                Read More →
              </Button>
            </Box>
          )}
        </Box>
      </Card>
    );
  };

  return (
    <Box
      id="blog"
      sx={{
        backgroundColor: '#111',
        color: '#fff',
        px: 4,
        py: 6,
        pl: 12,
        pr: 12,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        scrollMarginTop: '100px'
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: '#FF9906',
          fontWeight: 700,
          mb: 4,
          textAlign: 'center'
        }}
      >
        Blogs And News
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Box sx={{ height: '500px' }}>
            {renderCard(latestPosts.short, 'short', true)}
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ height: '500px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ height: '240px' }}>
              {renderCard(latestPosts.news, 'news')}
            </Box>
            <Box sx={{ height: '240px' }}>
              {renderCard(latestPosts.blog, 'blog')}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: '500px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ height: '240px' }}>
              {renderCard(latestPosts.videos?.[0], 'video')}
            </Box>
            <Box sx={{ height: '240px' }}>
              {renderCard(latestPosts.videos?.[1], 'video')}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <StyledButton onClick={() => navigate('/feed/blog')}>
          VIEW ALL
        </StyledButton>
      </Box>
    </Box>
  );
};

export default BlogSection;
