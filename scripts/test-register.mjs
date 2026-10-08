// Test-only resolver: lets `node --test` run the TypeScript sources directly.
// Node strips types natively but does not add file extensions, while the app
// (bundler resolution) imports without them. This retries failed relative
// specifiers with ".ts" and "/index.ts". Not used by Next.js.
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!specifier.startsWith(".")) throw error;
      for (const candidate of [`${specifier}.ts`, `${specifier}/index.ts`]) {
        try {
          return nextResolve(candidate, context);
        } catch {
          // try the next candidate
        }
      }
      throw error;
    }
  },
});
