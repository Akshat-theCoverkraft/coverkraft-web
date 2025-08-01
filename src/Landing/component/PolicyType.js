import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  CardActionArea
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPolicyType } from '../../store/action/action';
import API_URL from '../../ServiceModule/Service';
import { useNavigate } from 'react-router-dom';
import "../component/CSS/policyType.css"
import { headingStyle } from '../../theme/themeStyles';
const ITEMS_PER_PAGE = 5;

const PolicyType = () => {
  const [policyType, setPolicyType] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const policyTypes = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPolicyType(API_URL));
  }, [dispatch]);

  useEffect(() => {
    if (
      policyTypes &&
      policyTypes.getPolicyType &&
      Array.isArray(policyTypes.getPolicyType.data)
    ) {
      setPolicyType(policyTypes.getPolicyType.data);
    }
  }, [policyTypes]);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleSeeLess = () => {
    setVisibleCount(ITEMS_PER_PAGE);
  };



  return (
    <>
      <Box className="" sx={{ mx: '6%', my: 4, mt: 0, mb: 10 }}>
        <Typography
          variant="h3"
          sx={headingStyle }
        >
          Pick a Policy & Get Covered
        </Typography>

        <Box
          sx={{
            background: 'linear-gradient(105deg, #3E3E3E 0%, #121212 100%)',
            borderRadius: '25px',
            padding: 5,
            marginTop: 5,
            color: '#fff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >


          {/* Heading and Buttons in one row */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>

            <Typography variant="h4" fontWeight="bold">
              Let's get you & your family insured
            </Typography>

            {policyType.length > ITEMS_PER_PAGE && (
              <Box display="flex" gap={2}>
                {visibleCount < policyType.length && (
                  <Typography
                    onClick={handleSeeMore}
                    sx={{
                      color: '#5A9E1E',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      textTransform: 'uppercase',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    See More
                  </Typography>
                )}
                {visibleCount > ITEMS_PER_PAGE && (
                  <Typography
                    onClick={handleSeeLess}
                    sx={{
                      color: '#5A9E1E',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      textTransform: 'uppercase',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    See Less
                  </Typography>
                )}
              </Box>
            )}

          </Box>

          <Grid container spacing={3}>
            {policyType.slice(0, visibleCount).map((policy, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Card
                  className="hover-effect"
                  sx={{
                    backgroundColor: '#121212 !important',
                    borderRadius: '25px !important',
                    border: '1px solid #FF9906',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/policy-details/${policy._id}`)}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box mb={2}>
                        <img
                          src={policy.icon}
                          alt={policy.policyType}
                          style={{ width: 70, height: 70, objectFit: 'contain' }}
                        />
                      </Box>
                      <Typography variant="h5" fontWeight={600} color="#fff">
                        {policy.policyType}
                      </Typography>
                      <Typography fontSize="1.5rem" color="#ccc" >
                        Insurance
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default PolicyType;