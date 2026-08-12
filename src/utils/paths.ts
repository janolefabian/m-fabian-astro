const configuredBase = import.meta.env.BASE_URL;
const basePath = configuredBase === '/' ? '' : configuredBase.replace(/\/$/, '');

export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) return path;

  return `${basePath}${path}` || '/';
}

export function withoutBase(path: string): string {
  if (!basePath) return path;
  if (path === basePath) return '/';
  if (path.startsWith(`${basePath}/`)) return path.slice(basePath.length);

  return path;
}
