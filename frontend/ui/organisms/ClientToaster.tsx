'use client'
import { Toaster } from 'react-hot-toast'

export function ClientToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#fff',
          color: '#18181b',
        },
      }}
    />
  )
}