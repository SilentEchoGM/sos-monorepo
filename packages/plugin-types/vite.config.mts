/// <reference types="vitest" />
/// <reference types="@sveltejs/kit" />

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  test: {
    clearMocks: true,
  },
});
