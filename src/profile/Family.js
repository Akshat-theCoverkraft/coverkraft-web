import React from 'react'
import {Drawer,Box} from '@mui/material'
const Family = ({family,onfamilyclose}) => {
    return (
        <Drawer anchor="right" open={family} onClose={onfamilyclose}>
            <Box sx={{ width: 750, padding: 0 }} role="presentation">
                family
            </Box>
        </Drawer>
    )
}

export default Family
