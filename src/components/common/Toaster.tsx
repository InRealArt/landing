'use client'

import { Toaster as SonnerToaster } from 'sonner'

function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      theme="dark" // Le thème est fixé à dark, on pourrait le rendre dynamique plus tard
      className="bricolage-grotesque font-medium"
      toastOptions={{
        className: 'border border-white/10',
        duration: 4000,
      }}
    />
  )
}

export default Toaster 