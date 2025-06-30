import { defineConfig } from 'vite'
import tsconfigPaths from "vite-tsconfig-paths"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss(), flowbiteReact()],
})