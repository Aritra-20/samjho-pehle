// @lovable.dev/vite-tanstack-config already includes the TanStack Start, React, Tailwind,
// tsconfig-paths and nitro plugins. Do not add them again.
// For Vercel the build sets NITRO_PRESET=vercel (see vercel.json); otherwise the default target is used.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
});
