import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Grid,
  Chip,
  Typography,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const blogPosts = [
  {
    id: 1,
    title: 'Health insurance: Family floater policies can include new-borns and children, till they turn 25',
    date: 'May 23, 2024',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Health insurance: Family floater policies can include new-borns and children, till they turn 25',
    date: 'May 23, 2024',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1576765607924-adef6d6b8f3f?fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Health insurance: Family floater policies can include new-borns and children, till they turn 25',
    date: 'May 23, 2024',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Health insurance: Family floater policies can include new-borns and children, till they turn 25',
    date: 'May 23, 2024',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?fit=crop&w=800&q=80',
  },
];

const BlogSection = () => {
  return (
    <Box sx={{ backgroundColor: '#111', color: '#fff', px: 4, py: 6, mt: 1 }}>
      <Typography
        variant="h4"
        sx={{
          color: '#FF9906',
          fontWeight: 700,
          mb: 4,
          fontSize: { xs: '26px', sm: '30px', md: '32px' },
          letterSpacing: '0.5px',
          textAlign: 'center',
        }}
      >
        News And Blogs
      </Typography>

      <Grid container spacing={4}>
        {/* Left Card */}
        <Grid item xs={12} md={5.5}>
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: 450,
              borderRadius: 3,
              bgcolor: '#1c1c1c',
              color: '#fff',
            }}
          >
            <CardMedia
              component="img"
              height="260"
              image={blogPosts[0].image}
              alt="blog"
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={<TravelExploreIcon />}
                  label={blogPosts[0].category}
                  size="medium"
                  sx={{ mr: 2, bgcolor: '#2f2f2f', color: '#fff', pl: 1 }}
                />
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}
                >
                  <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {blogPosts[0].date}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: '1.7rem', color: 'white', mb: 1.5 }}
              >
                {blogPosts[0].title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.5rem',
                  color: '#DCDCDC',
                  lineHeight: 1.6,
                }}
              >
                {blogPosts[0].title}
              </Typography>
              <Button
                size="medium"
                sx={{
                  mt: 2,
                  color: '#8AC642',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize:'1.5rem'
                }}
              >
                Read More →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Cards */}
        <Grid item xs={12} md={6.5}>
          <Grid container spacing={2}>
            {blogPosts.slice(1).map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card
                  sx={{
                    display: 'flex',
                    height: 160,
                    borderRadius: 3,
                    bgcolor: '#1c1c1c',
                    color: '#fff',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={post.image}
                    alt="blog"
                    sx={{
                      width: 180,
                      height: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: '12px',
                      borderBottomLeftRadius: '12px',
                    }}
                  />
                  <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={<TravelExploreIcon />}
                        label={post.category}
                        size="small"
                        sx={{ mr: 2, bgcolor: '#2f2f2f', color: '#fff', pl: 1 }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}
                      >
                        <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {post.date}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, fontSize: '1.5rem', color: 'white', mb: 0.5 }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: '1.2rem', color: '#DCDCDC' }}
                      noWrap
                    >
                      {post.title}
                    </Typography>
                    <Button
                      size="small"
                      sx={{ mt: 1, color: '#8AC642', textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}
                    >
                      Read More →
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* View All Button */}
      <Box textAlign="center" mt={5}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#8AC642',
            color: '#fff',
            px: 4,
            py: 1,
            borderRadius: 3,
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#43a047' },
          }}
        >
          View all
        </Button>
      </Box>
    </Box>
  );
};

export default BlogSection;
