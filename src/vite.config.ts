import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'vaul@1.1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'react-hook-form@7.55.0': 'react-hook-form',
      'react-day-picker@8.10.1': 'react-day-picker',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'input-otp@1.4.2': 'input-otp',
      // Menambahkan alias baru untuk aset gambar dari Figma
      'figma:asset/847780f818afd72c32829454920762a5430501f4.png': path.resolve(__dirname, './src/assets/847780f818afd72c32829454920762a5430501f4.png'),
      'figma:asset/885fbf941299017d7a3af4b009f465b0425e769c.png': path.resolve(__dirname, './src/assets/885fbf941299017d7a3af4b009f465b0425e769c.png'),
      'figma:asset/99a0f1706e3b5fa04643c6836c8f3d7d7bae38f0.png': path.resolve(__dirname, './src/assets/99a0f1706e3b5fa04643c6836c8f3d7d7bae38f0.png'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});