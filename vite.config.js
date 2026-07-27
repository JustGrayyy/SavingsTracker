import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        signin: 'signin.html',
        login: 'login.html',
        tasks: 'tasks.html',
        schedule: 'schedule.html',
        notes: 'notes.html',
        savings: 'savings.html',
        profile: 'profile.html'
      }
    }
  }
})
