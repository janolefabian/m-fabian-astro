export default function prefixBaseUrls({ base = '/' } = {}) {
  const basePath = base === '/' ? '' : base.replace(/\/$/, '');

  return function transform(tree) {
    if (!basePath) return;

    const visit = (node) => {
      if (node?.type === 'element' && node.properties) {
        for (const property of ['href', 'src']) {
          const value = node.properties[property];

          if (
            typeof value === 'string'
            && value.startsWith('/')
            && !value.startsWith('//')
            && value !== basePath
            && !value.startsWith(`${basePath}/`)
          ) {
            node.properties[property] = `${basePath}${value}`;
          }
        }
      }

      node?.children?.forEach(visit);
    };

    visit(tree);
  };
}
