import React from 'react'
import {Drawer,Box} from '@mui/material'

const Communication = ({communication,onCommunicationClose}) => {
  return (
    <Drawer anchor="right" open={communication} onClose={onCommunicationClose}>
            <Box sx={{ width: 750, padding: 0 }} role="presentation">
                communication
            </Box>
        </Drawer>
  )
}

export default Communication
