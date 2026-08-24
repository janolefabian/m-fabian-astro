const configuredBase = import.meta.env.BASE_URL;
const basePath = configuredBase === '/' ? '' : configuredBase.replace(/\/$/, '');

function withTrailingSlash(path: string): string {
  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : path.slice(suffixIndex);
  const lastSegment = pathname.split('/').at(-1) ?? '';

  if (pathname === '/' || pathname.endsWith('/') || lastSegment.includes('.')) return path;

  return `${pathname}/${suffix}`;
}

export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const normalizedPath = withTrailingSlash(path);
  if (basePath && (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`))) return normalizedPath;

  return `${basePath}${normalizedPath}` || '/';
}

export function withoutBase(path: string): string {
  const pathWithoutBase = !basePath
    ? path
    : path === basePath
      ? '/'
      : path.startsWith(`${basePath}/`)
        ? path.slice(basePath.length)
        : path;

  return pathWithoutBase.length > 1 && pathWithoutBase.endsWith('/')
    ? pathWithoutBase.slice(0, -1)
    : pathWithoutBase;
}
