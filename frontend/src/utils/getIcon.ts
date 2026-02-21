function getIconUrl(lang: string) {
  const slugMap: { [key: string]: string } = {
    'C++': 'cplusplus',
    'C#': 'csharp',
    'Jupyter Notebook': 'jupyter',
    'HTML': 'html5',
    'Processing': 'processingfoundation',
    'Dockerfile': 'docker',
  };

  const slug = slugMap[lang] || lang.toLowerCase().replace(' ', '');

  return `https://cdn.simpleicons.org/${slug}`;
}

export default getIconUrl;
