import { Font } from '@react-pdf/renderer'

// Register Inter font with regular and bold weights
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: '/fonts/Inter-Regular.otf',
      fontWeight: 400,
    },
    {
      src: '/fonts/Inter-Bold.otf',
      fontWeight: 700,
    },
  ],
})

export const FONT_FAMILY = 'Inter'
