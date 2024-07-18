import React from 'react'
import {Drawer,Box} from '@mui/material'

const About = ({about,onAboutclose}) => {
  return (
    <Drawer anchor="right" open={about} onClose={onAboutclose}>
            <Box sx={{ width: 750, padding: 0 }} role="presentation">
                About
            </Box>
        </Drawer>
  )
}

export default About
