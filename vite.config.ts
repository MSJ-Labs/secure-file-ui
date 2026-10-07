import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The browser talks to the dev server only: /api is forwarded to the backend, so the HttpOnly SameSite=Strict
// cookies of the API are same-site and travel with every call, without any CORS setup.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
