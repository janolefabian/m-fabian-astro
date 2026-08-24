export default function prefixBaseUrls({ base = '/' } = {}) {
  const basePath = base === '/' ? '' : base.replace(/\/$/, '');

  const withTrailingSlash = (value) => {
    const suffixIndex = value.search(/[?#]/);
    const pathname = suffixIndex === -1 ? value : value.slice(0, suffixIndex);
    const suffix = suffixIndex === -1 ? '' : value.slice(suffixIndex);
    const lastSegment = pathname.split('/').at(-1) ?? '';

    if (pathname === '/' || pathname.endsWith('/') || lastSegment.includes('.')) return value;

    return `${pathname}/${suffix}`;
  };

  return function transform(tree) {
    const visit = (node) => {
      if (node?.type === 'element' && node.properties) {
        for (const property of ['href', 'src']) {
          const value = node.properties[property];
          const normalizedValue = property === 'href' && typeof value === 'string'
            ? withTrailingSlash(value)
            : value;

          if (
            typeof normalizedValue === 'string'
            && normalizedValue.startsWith('/')
            && !normalizedValue.startsWith('//')
            && normalizedValue !== basePath
            && !normalizedValue.startsWith(`${basePath}/`)
          ) {
            node.properties[property] = `${basePath}${normalizedValue}`;
          } else if (normalizedValue !== value) {
            node.properties[property] = normalizedValue;
          }
        }
      }

      node?.children?.forEach(visit);
    };

    visit(tree);
  };
}
