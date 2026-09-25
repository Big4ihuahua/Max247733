import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Lives outside the project root on purpose: with an `open-next.config.ts` in the root, `wrangler deploy`
// hands off to `opennextjs-cloudflare deploy`, which requires a finished build. Here `wrangler.jsonc`
// runs the build itself, so both `wrangler deploy` and `wrangler versions upload` (Cloudflare preview
// builds) work from a clean checkout. No incremental cache: the site has no ISR or revalidation.
export default defineCloudflareConfig({});
