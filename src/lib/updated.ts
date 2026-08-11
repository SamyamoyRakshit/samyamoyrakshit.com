import { execSync } from 'node:child_process';

/**
 * When the site last changed, for the colophon.
 *
 * Two sources, in order of truthfulness:
 *
 *   1. The last commit date — moves when the site changes and not otherwise.
 *   2. Build time, when git is unavailable: no repository, no history yet, or
 *      a build environment that fetched a tarball rather than a clone. A fair
 *      proxy on a site that only rebuilds when something is pushed, and an
 *      overstatement otherwise, hence the fallback rather than the primary.
 *
 * Node-only, evaluated once at build. Do not import this from anything with a
 * `client:` directive — `node:child_process` does not exist in a browser.
 */
function fromGit(): Date | null {
  try {
    const iso = execSync('git log -1 --format=%cI', {
      // Never let a git prompt or an error message reach the build log; a
      // missing repository is an expected state here, not a failure.
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
      timeout: 3000,
    }).trim();

    const date = new Date(iso);
    return Number.isNaN(date.valueOf()) ? null : date;
  } catch {
    return null;
  }
}

/* Resolved once. `fromGit()` shells out, so calling it per export would run
   git twice per build for one date. */
const committed = fromGit();

export const lastUpdated: Date = committed ?? new Date();

/** True when the date above is a commit date rather than merely build time. */
export const lastUpdatedIsCommit: boolean = committed !== null;
