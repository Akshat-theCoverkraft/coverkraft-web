import { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  Typography,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

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
        const newsData = res.data?.data || [];

        const activeNews = newsData.filter(item => item.status === 'active');
        const sorted = activeNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const typesToShow = ['short', 'video', 'news', 'blog'];
        const latestByType = {};

        for (const post of sorted) {
          const type = post.type;
          if (typesToShow.includes(type) && !latestByType[type]) {
            latestByType[type] = post;
          }
        }

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
    const handleScroll = () => {
      videoRefs.current.forEach((video) => {
        if (!video.paused) {
          video.pause();
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const renderMedia = (p) => {
    const url = getUrl(p);
    const isVideo = url.match(/\.(mp4|mov|avi|mkv|webm)$/i);

    if (isVideo) {
      return (
        <video
          ref={registerVideo}
          controls
          preload="metadata"
          style={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            borderRadius: '20px 20px 0 0',
          }}
          onPlay={(e) => {
            videoRefs.current.forEach((v) => {
              if (v !== e.target && !v.paused) v.pause();
            });
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
          height: 200,
          objectFit: 'cover',
          borderRadius: '20px 20px 0 0',
        }}
      />
    );
  };

  const renderPostCard = (type) => {
    const post = latestPosts[type];
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

    const pluralMap = {
      blog: 'Blogs',
      news: 'News',
      video: 'Videos',
      short: 'Short',
    };
    const viewMoreLabel = `View more ${pluralMap[type] || typeLabel + 's'}`;

    if (loading) {
      return (
        <Card sx={{ bgcolor: '#212121', borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '10px' }} />
          <CardContent sx={{ flex: 1 }}>
            <Skeleton height={30} width="60%" sx={{ mt: 2 }} />
            <Skeleton height={20} width="90%" />
            <Skeleton height={20} width="40%" />
          </CardContent>
        </Card>
      );
    }

    if (!post) {
      return (
        <Card sx={{ bgcolor: '#212121', borderRadius: '20px', p: 2, height: '80%', textAlign: 'center', color: '#888' }}>
          <Typography>No {typeLabel} available.</Typography>
        </Card>
      );
    }

    return (
      <Card
        onClick={() => navigate(`/feed/${post.type}/${post._id}`)}
        sx={{
          bgcolor: '#212121',
          borderRadius: '20px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.01)' },
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          {renderMedia(post)}
        </Box>

        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            {renderCardHeader(post.type)}
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
              {post.subtitle}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#ccc',
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {post.description}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: '#888' }}>
              {moment(post.createdAt).format('MMM DD, YYYY')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                fontWeight: 'bold',
                color: '#8AC642',
                textAlign: 'right',
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/feed/${type}`);
              }}
            >
              {viewMoreLabel} →
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
  <Box id="blog" sx={{ backgroundColor: '#111', color: '#fff', px: 4, py: 6, pl: 12, pr: 12 }}>
    <Typography
      variant="h3"
      sx={{ color: '#FF9906', fontWeight: 700, mb: 4, textAlign: 'center' }}
    >
      Blogs and News
    </Typography>

    <Grid container spacing={4}>
      {/* LEFT COLUMN */}
      <Grid item xs={12} md={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#FF9906', mb: 1, fontWeight: 600 }}>
            Shorts
          </Typography>
          <Box sx={{ height: 500 }}>{renderPostCard('short')}</Box>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: '#FF9906', mb: 1, fontWeight: 600 }}>
            Videos
          </Typography>
          <Box sx={{ height: 500 }}>{renderPostCard('video')}</Box>
        </Box>
      </Grid>

      {/* RIGHT COLUMN */}
      <Grid item xs={12} md={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#FF9906', mb: 1, fontWeight: 600 }}>
            News
          </Typography>
          <Box sx={{ height: 500 }}>{renderPostCard('news')}</Box>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: '#FF9906', mb: 1, fontWeight: 600 }}>
            Blogs
          </Typography>
          <Box sx={{ height: 500 }}>{renderPostCard('blog')}</Box>
        </Box>
      </Grid>
    </Grid>

    <Box textAlign="center" mt={6}>
      <StyledButton onClick={() => navigate('/feed/blog')}>
        VIEW ALL
      </StyledButton>
    </Box>
  </Box>
);

};

export default BlogSection;
