import './CSS/afterglow.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Scan from '../../Images/Scan.png';
import Search from '../../Images/Serach.png';
import Download from '../../Images/DownloadSection.png';
import { THEME_COLOR } from '../../constants';

const steps = [
  {
    img: Scan,
    title: 'Scan your document',
    desc: 'Turn your paper policy into a digital file\nwith just a quick scan.',
  },
  {
    img: Search,
    title: 'Extract key info',
    desc: 'We’ll automatically pull out what matters most\nfrom your scanned policy.',
  },
  {
    img: Download,
    title: 'Save to your vault',
    desc: 'Securely store and access your document anytime\n— anywhere.',
  },
];

const About = () => {
  return (
    <Box
      px={{ xs: 2, sm: 4, md: 6 }}
      py={{ xs: 4, sm: 6 }}
      mt={4}
      width="100%"
      mx="auto"
      sx={{
        backgroundColor: "#121212",
        borderRadius: 4,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#FF9906',
          fontWeight: 700,
          mb: 4,
          fontSize: { xs: '26px', sm: '30px', md: '32px' },
          letterSpacing: '0.5px',
        }}
      >
        How It Works
      </Typography>

      <Grid container spacing={{ xs: 4, sm: 5, md: 6 }} justifyContent="center">
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
              alignItems: 'center',
              textAlign: 'center',
              padding: 4,
            }}
          >
            <Box
              component="img"
              src={step.img}
              alt={step.title}
              sx={{
                width: '160px',
                height: '130px',
                mb: 3,
                
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1.7rem',
                color: 'white',
                mb: 1.5,
              }}
            >
              {step.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.5rem',
                color: '#e0e0e0',
                px: { xs: 2, sm: 3 },
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
              }}
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
