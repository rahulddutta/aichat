
import { Box } from '@mui/material'

export default function TypingIndicator() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        animation: 'fadeIn 300ms ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#0ea5e9',
            animation: `bounce 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
            '@keyframes bounce': {
              '0%, 60%, 100%': {
                transform: 'translateY(0)',
                opacity: 1,
              },
              '30%': {
                transform: 'translateY(-10px)',
                opacity: 0.8,
              },
            },
          }}
        />
      ))}
    </Box>
  )
}
