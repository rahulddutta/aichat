
import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1.5 }}>
        <Avatar
          sx={{
            mr: 1.5,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <SmartToyIcon sx={{ color: 'white', fontSize: '1.25rem' }} />
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: 'white',
              fontSize: '1.25rem',
            }}
          >
            AI Assistant
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              mt: 0.25,
            }}
          >
            Always here to help
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pl: 2,
            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#4ade80',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}
          >
            Online
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
