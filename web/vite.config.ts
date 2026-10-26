import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Em `npm run dev`, /api é encaminhado à API local.
// É o mesmo papel do nginx no Docker e do CloudFront na AWS.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
});
