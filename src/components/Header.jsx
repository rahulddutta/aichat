import React from 'react'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'

export default function Header() {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 1 }}>
      <Toolbar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="div">
            AI Chat
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
