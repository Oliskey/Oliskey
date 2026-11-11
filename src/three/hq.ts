import manifest from './hqManifest.json';
const M = manifest as Record<string, string>;
/** A /hq/ asset URL with its content hash, so a changed file is always fetched fresh (the folder is cached for a week). */
export const hq = (path: string) => (M[path] ? `${path}?v=${M[path]}` : path);
