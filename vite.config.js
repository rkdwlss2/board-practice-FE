import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        board: resolve(import.meta.dirname, "board.html"),
        post: resolve(import.meta.dirname, "post.html"),
        signup: resolve(import.meta.dirname, "signup.html"),
        write: resolve(import.meta.dirname, "write.html"),
        edit: resolve(import.meta.dirname, "edit.html"),
        profileEdit: resolve(import.meta.dirname, "profile_edit.html"),
        passwordEdit: resolve(import.meta.dirname, "password_edit.html"),
      },
    },
  },
});
