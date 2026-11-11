import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The browser talks to the dev server only. Everything it sends to the BFF (API, identity, sign-in and sign-out) is
// forwarded to it, so the session cookie is same-site and no CORS setup is needed. `changeOrigin` rewrites Host so the
// redirect_uri Spring builds matches the one registered in Keycloak.
const bff = { target: 'http://localhost:8083', changeOrigin: true }

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': bff,
      '/bff': bff,
      '/oauth2': bff,
      '/logout': bff,
    },
  },
})
