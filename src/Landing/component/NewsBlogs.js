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
import { headingStyle } from '../../theme/themeStyles';
import SessionExpiredModal from '../../utils/sessionExpireModal';
import API_URL from '../../ServiceModule/Service';

const typeLabels = {
  blog: 'Blogs',
  news: 'News',
  video: 'Videos',
  short: 'Shorts',
};

const BlogSection = () => {
  const [latestPosts, setLatestPosts] = useState({});
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate(); // navigation hook
  const videoRefs = useRef({});

  const registerVideo = (el, id) => {
    if (el && id) {
      videoRefs.current[id] = el;
    }
  };

  const getVideoType = (url) => {
    if (url.endsWith('.mp4')) return 'video/mp4';
    if (url.endsWith('.webm')) return 'video/webm';
    if (url.endsWith('.ogg')) return 'video/ogg';
    return 'video/mp4';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, featuredRes] = await Promise.all([
          axios.get(`${API_URL}news/getAll?isActive=true`),
          fetch(`${API_URL}featureVideo/getAll`),
        ]);

        const sortedNews = (newsRes.data?.data || [])
          .filter(item => item.status === 'active')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const latestByType = {
          videos: sortedNews.filter(p => p.type === 'video').slice(0, 1),
          shorts: sortedNews.filter(p => p.type === 'short').slice(0, 1)[0],
          news: sortedNews.find(p => p.type === 'news'),
          blog: sortedNews.find(p => p.type === 'blog'),
        };

        const featuredData = await featuredRes.json();
        const activeFeatured = Array.isArray(featuredData.data)
          ? featuredData.data.filter(item => item.status === 'active')
          : [];
        setFeaturedVideo(activeFeatured[0] || null);

        setLatestPosts(latestByType);
      }catch (error) {
          console.error('Error fetching options:', error);
          if (error.response?.status === 401) {
            setShowSessionExpired(true);
          } else {
            setError('Failed to load options');
          }
        }  finally {
        setLoading(false);
      }
    };

    fetchData();

    const pauseAllVideos = () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video && !video.paused) video.pause();
      });
    };

    window.addEventListener('scroll', pauseAllVideos);
    return () => window.removeEventListener('scroll', pauseAllVideos);
  }, []);

      const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate('/login');
    localStorage.clear();
  sessionStorage.clear(); 
  };

  const getUrl = (post) =>
    post.videoUrl
      ? post.videoUrl.startsWith('http')
        ? post.videoUrl
        : `${API_URL}${post.videoUrl}`
      : post.newsImg?.startsWith('http')
        ? post.newsImg
        : `${API_URL}${post.newsImg}`;

  const StyledButton = styled('button')(() => ({
    backgroundColor: 'transparent',
    color: '#8AC642',
    border: '2px solid #8AC642',
    borderRadius: '40px',
    padding: '12px 32px',
    fontSize: '1.3rem',
    fontWeight: '800',
    minWidth: '120px',
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
    if (loading) {
      return <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: '20px' }} />;
    }
    if (!post) {
      return (
        <Card
          sx={{
            bgcolor: '#212121',
            borderRadius: '20px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
          }}
        >
          <Typography>No {type} available.</Typography>
        </Card>
      );
    }

    const url = getUrl(post);
    const isVideo =
      /\.(mp4|mov|avi|mkv|webm)$/i.test(url) ||
      post.video ||
      post.videoUrl ||
      post.type === 'video' ||
      post.type === 'featured';

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
            label={
              (() => {
                const type = post.type?.toLowerCase();
                const exceptions = {
                  news: 'News',
                  blog: 'Blogs',
                  video: 'Videos',
                  featured: 'Featureds',
                  short: 'Shorts',
                };
                return type
                  ? exceptions[type] || (type.charAt(0).toUpperCase() + type.slice(1) + 's')
                  : 'Featureds';
              })()
            }
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 2,
              bgcolor: '#8AC642',
              color: '#000',
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          />

          {isVideo ? (
            <video
              ref={(el) => registerVideo(el, post._id)}
              controls
              controlsList="nodownload"
              preload="metadata"
              style={{ ...mediaStyle, objectFit: 'contain', backgroundColor: '#000' }}
              onClick={(e) => e.stopPropagation()}
              onPlay={(e) => {
                Object.entries(videoRefs.current).forEach(([id, video]) => {
                  if (id !== post._id && video && !video.paused) {
                    video.pause();
                  }
                });
              }}
            >
              <source src={url} type={getVideoType(url)} />
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
              <Typography sx={{ fontSize: '1.4rem' }} fontWeight={300}>
                {post.subtitle}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mb: 1, fontSize: '1.3rem' }}>
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
                  fontSize: '1.2rem',
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
        scrollMarginTop: '100px',
      }}
    >
       <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
      <Typography
        variant="h3"
        sx={headingStyle}
      >
        Blogs And News
      </Typography>

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} md={5}>
          <Box sx={{ height: '500px' }}>
            {renderCard(latestPosts.shorts, 'short', true)}
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ height: '500px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ height: '240px' }}>{renderCard(latestPosts.news, 'news')}</Box>
            <Box sx={{ height: '240px' }}>{renderCard(latestPosts.blog, 'blog')}</Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: '500px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ height: '240px' }}>{renderCard(latestPosts.videos?.[0], 'video')}</Box>
            <Box sx={{
              height: '240px', position: 'relative', position: 'relative',
              height: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.02)' }
            }} >
              <Chip
                icon={<TravelExploreIcon />}
                label="Featured"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  zIndex: 2,
                  bgcolor: '#8AC642',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: '#8AC642',
                    color: '#000',
                  },
                }}
                onClick={() => navigate("/feed/featured")}
              />
              {featuredVideo?.video ? (
                <video
                  controls
                  controlsList="nodownload"
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '20px',
                    backgroundColor: '#000',
                  }}
                >
                  <source src={featuredVideo.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Card
                  sx={{
                    bgcolor: '#212121',
                    borderRadius: '20px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                  }}
                >
                  <Typography>No video available</Typography>
                </Card>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <StyledButton onClick={() => navigate('/feed/blog')}>VIEW ALL</StyledButton>
      </Box>
    </Box>
  );
};

export default BlogSection;
