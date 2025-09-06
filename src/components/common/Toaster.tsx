'use client'

import { Toaster as SonnerToaster } from 'sonner'
import { useTheme } from '@/contexts/ThemeContext'

function Toaster() {
  const { theme } = useTheme()

  return (
    <SonnerToaster
      position="top-right"
      richColors
      theme={theme}
      className="bricolage-grotesque font-medium"
      toastOptions={{
        className: 'border border-white/10 dark:border-white/10 border-black/10',
        duration: 4000,
      }}
    />
  )
}

export default Toaster 