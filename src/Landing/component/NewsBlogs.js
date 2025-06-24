import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
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
        setPosts(sorted.slice(0, 6));
      } catch (err) {
        console.error('Failed fetching:', err);
      }
    };
    fetchNews();
  }, []);

  if (posts.length === 0) return null;

  const short = posts.find(p => p.type === 'short') || posts[0];
  const newsItems = posts.filter(p => p.type === 'news').slice(0, 3);
  const blogs = posts.filter(p => p.type === 'blog').slice(0, 3);

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

  return (
    <Box sx={{ backgroundColor: '#111', color: '#fff', px: 4, py: 6, mt: 1, pl: 12, pr: 12 }}>
      <Typography variant="h4" sx={{ color: '#FF9906', fontWeight: 700, mb: 4, textAlign: 'center', fontSize: { xs: '26px', sm: '30px', md: '32px' } }}>
        News And Blogs
      </Typography>
      <Typography variant="h4" sx={{ color: '#FFf', fontWeight: 500, mb: 4, textAlign: 'center', fontSize: { xs: '26px', sm: '30px', md: '32px' } }}>
        Latest From The Blogs      </Typography>

      <Grid container spacing={4} alignItems="stretch">
        {/* LEFT SIDE: Vertical Short Video */}
        {/* LEFT SIDE: Vertical Short Video */}
        <Grid item xs={12} md={4}>
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
            onClick={() => navigate(`/coverkraft/feed/${short.type}/${short._id}`)}
          >
            {/* VIDEO SECTION */}
            <Box sx={{ width: '100%', height: '450px', overflow: 'hidden' }}>
              <video
                src={getUrl(short)}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '40px 40px 0 0',
                }}
              />
            </Box>

            {/* DETAILS BELOW VIDEO */}
            <CardContent sx={{ p: 3 }}>
              {renderCardHeader(short.type)}
              <Typography
                variant="h6"
                color="#fff"
                gutterBottom
                sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}
              >
                {short.subtitle}
              </Typography>
              <Typography
                variant="body2"
                color="#DCDCDC"
                sx={{
                  fontSize: '1.05rem',
                  mb: 1.5,
                  lineHeight: 1.5,
                }}
              >
                {short.description}
              </Typography>
              <Typography variant="body2" color="#888">
                {moment(short.createdAt).format('MMM DD, YYYY')}
              </Typography>
              <Typography
                variant="body1"
                color="#7BC043"
                sx={{mt: '-15px',  fontWeight: 'bold', cursor: 'pointer', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' }, paddingLeft: "78%" }}
                onClick={() => navigate(`/coverkraft/feed/${p.type}/${p._id}`)}
              >
                Read More →
              </Typography>
            </CardContent>
          </Card>
        </Grid>



        { /* RIGHT SIDE: News and Blogs */}
        <Grid item xs={12} md={8} mt={3}>
          {[...newsItems, ...blogs].map(p => (
            <Card
              key={p._id}
              sx={{ mb: 3, display: 'flex', height: 200, borderRadius: 3, bgcolor: '#212121', color: '#fff', cursor: 'pointer' }}
              onClick={() => navigate(`/coverkraft/feed/${p.type}/${p._id}`)}
            >
              <CardMedia
                component="img"
                image={getUrl(p)}
                alt={p.subtitle}
                sx={{ width: 180, objectFit: 'cover', borderRadius: '12px 0 0 12px' }}
              />
              <CardContent sx={{ flex: 1 }}>
                {renderCardHeader(p.type)}
                <Typography variant="h6" color="#fff" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' } }}>
                  {p.subtitle}
                </Typography>
                <Typography variant="body1" color="#DCDCDC" sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.15rem' } }}>
                  {p.description}
                </Typography>
                <Typography variant="body2" color="#888" mt={1} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {moment(p.createdAt).format('MMM DD, YYYY')}
                </Typography>
                <Typography
                  variant="body1"
                  color="#7BC043"
                  sx={{mt: '-15px', fontWeight: 'bold', cursor: 'pointer', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' }, paddingLeft: "90%" }}
                  onClick={() => navigate(`/coverkraft/feed/${p.type}/${p._id}`)}
                >
                  Read More →
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>

      {/* VIEW ALL BUTTON */}
      <Box textAlign="center" mt={6}>
        <StyledButton onClick={() => navigate('/coverkraft/feed/:type')}>
          VIEW ALL
        </StyledButton>
      </Box>
    </Box>
  );
};

export default BlogSection;