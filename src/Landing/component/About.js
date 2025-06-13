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
      px={{ xs: 2, sm: 4, md: 6 }}
      py={{ xs: 6, sm: 8 }}
      mt={5}
      sx={{ backgroundColor: THEME_COLOR.FADE_BACKGROUND }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{ color: '#FF9906', fontWeight: 600, mb: 1 }}
      >
        HOW IT WORKS
      </Typography>

      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 'bold',
          fontSize: { xs: '30px', sm: '36px', md: '42px' },
          my: 2,
        }}
      >
        How Coverkraft Works?
      </Typography>

      <Grid  container spacing={5} justifyContent="center" mt={5}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} textAlign="center">
            <Box
              component="img"
              src={step.img}
              alt={step.title}
              sx={{ width: '100%', maxWidth: '280px', height: 'auto', mx: 'auto' }}
            />
            <Typography
              variant="h5"
              sx={{ mt: 3, fontWeight: 'bold', fontSize: '1.8rem' }}
            >
              {step.title}
            </Typography>
            <Typography
              variant="body1"
              color="white"
              sx={{ mt: 1, fontSize: '1.7rem', px: { xs: 1, sm: 2 } }}
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
