import './CSS/afterglow.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import step1 from '../../Images/step1.png';
import step2 from '../../Images/step2.png';
import step3 from '../../Images/step3.png';
import { THEME_COLOR } from '../../constants';

const steps = [
  {
    img: step1,
    title: 'Scan your document',
    desc: 'Scan the policy document and access a physical policy document in a digital version.',
  },
  {
    img: step2,
    title: 'Extract your document',
    desc: 'Extract key information from the scanned document automatically and securely.',
  },
  {
    img: step3,
    title: 'Save your document',
    desc: 'Store and access your document anytime from your secure digital policy vault.',
  },
];

const About = () => {
  return (
    <Box
      px={{ xs: 1, sm: 2, md: 3 }}
      py={{ xs: 3, sm: 4 }}
      mt={2}
      width="100%"
      mx="auto"
      sx={{ backgroundColor: THEME_COLOR.FADE_BACKGROUND, borderRadius: 3 }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{
          color: '#FF9906', fontWeight: 600, mb: 1,
          fontSize: { xs: '22px', sm: '26px', md: '30px' },
        }}
      >
        HOW IT WORKS ?
      </Typography>

      <Grid container spacing={3} justifyContent="center" mt={2}>
        {steps.map((step, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Center align all content
              textAlign: 'center',  // Center text
            }}
          >
            <Box
              component="img"
              src={step.img}
              alt={step.title}
              sx={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                mb: 2,
                filter: 'contrast(1.3) brightness(1.08) saturate(1.15) drop-shadow(0 0 3px #000)',
                borderRadius: 2,
                display: 'block',
                alignSelf: 'center',
              }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: 'bold', fontSize: '1.2rem', mb: 1 }}
            >
              {step.title}
            </Typography>
            <Typography
              variant="body1"
              color="white"
              sx={{ fontSize: '1rem', px: { xs: 1, sm: 2 } }}
            >
              {step.desc}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default About;
