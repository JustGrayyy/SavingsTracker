import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        signin: 'signin.html',
        login: 'login.html',
        cards: 'cards.html',
        dashboard: 'dashboard.html',
        profile: 'profile.html'
      }
    }
  }
})
